# Vesalius Mobile App — Backend Integration Guide

> Scope: consultation TTS recording feature (MVP)
> Last updated: 2026-03-02
> API base: `https://api.assistant.vesalius.ai/api/v1/`

---

## Table of Contents

1. [Environments](#1-environments)
2. [Data Model](#2-data-model)
3. [Authentication](#3-authentication)
4. [Endpoints](#4-endpoints)
5. [Recording Flow](#5-recording-flow)
6. [WebSocket — Status Updates](#6-websocket--status-updates)
7. [Error Format](#7-error-format)
8. [Open TODOs](#8-open-todos)

---

## 1. Environments

| | URL |
|---|---|
| **Platform (acceptance)** | https://assistant-acc.vesalius.ai/ |
| **API base (acceptance)** | https://api.assistant.vesalius.ai/api/v1/ |
| **Keycloak (acceptance)** | https://iam-acc.vesalius.ai/auth/realms/MEDPLaNNER |
| **Keycloak token endpoint** | https://iam-acc.vesalius.ai/auth/realms/MEDPLaNNER/protocol/openid-connect/token |
| **Keycloak realm** | `MEDPLaNNER` |
| **Keycloak client ID** | `vesalius-scribe-app` |

> Test accounts and test data: use your own sandboxed doctor account on the acceptance environment. Create test patients and interactions via the app itself.

---

## 2. Terminology

### App ↔ Backend mapping

| App term            | Backend term | Explanation |
|---------------------|---|---|
| **Appointment**     | **Upcoming interaction** | A conversation that has a `due_date` set — shown on the home screen. Not the same as a Visit (see below). |
| **Interaction**     | **Conversation** | The leading model in the current backend. Will become `Interaction` after the refactor. |
| **Consultation**    | **Consultation** | Sub-model of a Conversation. Holds the AI-generated notes, transcripts, and letter. |
| **Recording**       | **Transcript** | A single recording session within a consultation. One consultation can have multiple transcripts. |
| **Summary / Notes** | **Consultation notes** | The AI-generated output after a recording is finalized. |

> ⚠️ **"Appointment" vs "Visit"**: In the Vesalius platform, a **Visit** is a separate domain entirely — it refers to the appointment booking and scheduling system. An upcoming interaction on the home screen is **not** a Visit. Do not confuse the two. When in doubt, use "upcoming interaction" to refer to a conversation with a due date.

### Backend model refactor status

The codebase is mid-refactor. Here is how the models map:

| Term                     | Current backend model | Notes |
|--------------------------|---|---|
| **Interaction**          | `Conversation` | Leading model, contains everything |
| **Consultation**         | `Consultation` | Sub-model of Conversation; holds AI notes, transcripts, letter |
| **Interaction (future)** | `Interaction` | Umbrella model — not yet implemented |

**For this integration, treat Conversation as Interaction.** The consultation data is embedded inside the conversation response.

---

## 3. Authentication

### Login

Direct grant flow against Keycloak — no redirect, no browser:

```
POST https://iam-acc.vesalius.ai/auth/realms/MEDPLaNNER/protocol/openid-connect/token

Content-Type: application/x-www-form-urlencoded

grant_type=password
client_id=vesalius-scribe-app
username=<username>
password=<password>
scope=openid profile email
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_in": 60,
  "refresh_expires_in": 1800,
  "token_type": "Bearer"
}
```

> `expires_in` and `refresh_expires_in` are always present in the response — read them directly rather than hardcoding lifetimes.

### Token usage

Attach to every API request:
```
Authorization: Bearer <access_token>
```

No extra headers required.

### Token lifetimes

| Token | Lifetime | Notes |
|---|---|---|
| Access token | **1 minute** | Very short — refresh proactively |
| Refresh token | See TODO | Rotation is **disabled** (same token stays valid) |

### Refresh

```
POST https://iam-acc.vesalius.ai/auth/realms/MEDPLaNNER/protocol/openid-connect/token

grant_type=refresh_token
client_id=vesalius-scribe-app
refresh_token=<refresh_token>
```

**Strategy for mobile:** implement an automatic token refresh mechanism — the equivalent of an HTTP interceptor in the web frontend. With axios this is `axios.interceptors.response.use(...)`, with a plain `fetch` wrapper it's a custom function around every request.

The pattern:
1. On every request, attach the current `access_token` as Bearer header
2. If the response is `401` → call the Keycloak refresh endpoint with the stored `refresh_token`
3. Store the new `access_token` → retry the original request
4. If the refresh itself fails (refresh token expired) → clear stored tokens and redirect to login

### Logout

```
POST /logout
Authorization: Bearer <access_token>
```

Then discard both tokens locally.

### Roles

The logged-in user must have at minimum `institution_editor` role to start a recording. `institution_viewer` can only read.

---

## 4. Endpoints

### Auth / Profile

#### `GET /users/me`
Returns the logged-in user's profile including all institution memberships and, if the user is a doctor, their doctor UUID.

**Key response fields:**
```json
{
  "id": "<keycloak_id>",
  "doctor_id": "<uuid or null>",
  "social_security_number": "...",
  "institutions": [
    {
      "id": "<uuid>",
      "name": "...",
      "role": "institution_editor"
    }
  ]
}
```

> **Institution selection:** After login, fetch `/users/me` and check `institutions`. If exactly one → auto-select. If multiple → show a picker. The selected `institution.id` is required when creating conversations.

---

### Patients

#### `GET /institutions/{institutionId}/users`
Search for patients within the logged-in user's institution. All params are optional strings.

| Param | Description |
|---|---|
| `first_name` | Partial match |
| `last_name` | Partial match |
| `social_security_number` | Rijksregisternummer |
| `email` | Email address |
| `search` | Generic search across fields |
| `limit` | Max results to return |

Combinations work (e.g. `first_name` + `last_name`, `last_name` + `first_name`).

**Example:**
```
GET /institutions/9b2f1c3e-…/users?first_name=Jan&last_name=Janssen&limit=10
```

> Note: `GET /users/find` also exists but requires at minimum `social_security_number` or `email` — it is intended for exact global lookups, not search-as-you-type.

---

### Conversations (= Interactions)

#### `GET /conversations`
List conversations. Used for both the home screen widget and the full list.

**Home screen ("upcoming interactions") params:**
| Param | Value |
|---|---|
| `institution` | `<institution_uuid>` |
| `from_date` | today at midnight (ISO datetime) |
| `required_fields` | `due_date` |
| `sort` | `+due_date` |
| `page` | `1` |
| `page_size` | `10` |
| `doctor` | current user's ID *(only if role is `CARE_GIVER`)* |

#### `GET /conversations/{conversationId}`
Full detail of one conversation, including embedded `consultation` with AI notes and transcripts.

#### `POST /conversations`
Create a new conversation/interaction.

**With patient (minimal body):**
```json
{
  "patient_id": "<keycloak_id of patient>",
  "institution_id": "<institution_uuid>"
}
```

**Anonymous interaction** (no specific patient — minimal body):
```json
{
  "patient_id": "<keycloak_id of patient>",
  "institution_id": "<institution_uuid>"
}
```
> "Anonymous" in this context means a minimal interaction without a pre-scheduled appointment — a patient still needs to be selected or created first. `is_conversation` should **not** be passed.

> **`doctor_id`:** always pass the logged-in doctor's UUID (from `GET /users/me`). It is technically optional but omitting it can cause issues in downstream AI summary generation.

---

### Consultations

#### `GET /consultations/{consultationId}`
Returns consultation detail: AI notes, transcripts, letter content.

```json
{
  "id": "<uuid>",
  "consultation_notes": "<AI generated text or null>",
  "transcripts": [ ... ],
  "letter_content": "<string or null>"
}
```

#### `POST /consultations/{consultationId}/consultation-notes/regenerate`
Re-run AI summary generation (e.g. after adding a second recording).

---

### Recording

See [Section 5 — Recording Flow](#5-recording-flow) for the full sequence.

#### `GET /azure/speech-token`
Returns a short-lived Azure Cognitive Services token for the Speech SDK.

```json
{
  "token": "<Azure STS token>",
  "region": "<azure region>"
}
```

Valid for **9 minutes**. Refresh it before it expires if a recording session is longer.

> **Important:** This is a direct client-side integration. The mobile app calls our API once to get this token, then the Azure Speech SDK communicates **directly with Azure** — no audio passes through our backend. No separate Azure account or credentials are needed.

#### `POST /consultations/{consultationId}/transcripts/realtime`
Start a new recording session. Returns a `transcriptId`.

#### `PATCH /consultations/{consultationId}/transcripts/{transcriptId}/realtime`
Send a batch of transcribed text from Azure Speech.

```json
{ "text": "De patiënt heeft last van hoofdpijn." }
```

Call this every ~10 seconds with buffered Azure results.

#### `POST /consultations/{consultationId}/transcripts/{transcriptId}/realtime/finalize`
Close the recording session. Triggers AI summary generation on the backend.

#### `POST /consultations/{consultationId}/transcripts/{transcriptId}/annotate`
Add a manual annotation to a transcript.

---

## 5. Recording Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. GET /azure/speech-token                              │
│    → token + region                                     │
│                                                         │
│ 2. POST /consultations/{id}/transcripts/realtime        │
│    → transcriptId                                       │
│                                                         │
│ 3. Init Azure Speech SDK                                │
│    language: nl-BE | fr-BE | en-US                      │
│    audio:    device microphone                          │
│    mode:     continuous recognition                     │
│                                                         │
│ 4. [Doctor speaks...]                                   │
│    Azure SDK emits interim + final transcription text   │
│                                                         │
│ 5. Every ~10s:                                          │
│    PATCH /consultations/{id}/transcripts/{tid}/realtime │
│    body: { text: "<buffered Azure text>" }              │
│                                                         │
│ 6. Doctor stops recording                               │
│    → flush remaining buffer with one final PATCH        │
│                                                         │
│ 7. POST /consultations/{id}/transcripts/{tid}/realtime/finalize │
│    → backend starts AI summary generation               │
│                                                         │
│ 8. Listen on WebSocket for result                       │
│    → .consultation_notes.generated.success              │
│    → then GET /consultations/{id} to fetch the notes    │
└─────────────────────────────────────────────────────────┘
```

### Adding a second recording ("notities aanvullen")

Repeat steps 1–8 on the **same `consultationId`**. The backend concatenates all transcript texts in chronological order before regenerating notes. Only the first recording on a consultation incurs a billing charge.

### Azure Speech SDK config

| Setting | Value |
|---|---|
| Language | `nl-BE`, `fr-BE`, `en-US` — pass the language of the conversation |
| Audio input | Device microphone |
| Sample rate | 16 kHz (Azure SDK default) |
| Channel | Mono (Azure SDK default) |
| Token refresh | Every 9 minutes |

---

## 6. WebSocket — Status Updates

The backend does **not** expose a polling endpoint for processing status. You must use WebSocket.

### Connection config (acceptance)

```json
{
  "broadcaster": "reverb",
  "key": "e4k90jsoqcia4eiibzcd",
  "wsHost": "api.assistant-acc.vesalius.ai",
  "wsPort": 80,
  "wssPort": 443,
  "wsPath": "/reverb",
  "forceTLS": true,
  "authEndpoint": "https://api.assistant.vesalius.ai/api/v1/broadcasting/auth"
}
```

The server is **Laravel Reverb** — useful to know when searching for React Native compatible libraries or debugging connection issues. It uses the **Pusher protocol**, so any pusher-js compatible library works.

### Authentication

The WebSocket connection itself requires no auth. Subscribing to a **private** channel automatically triggers a POST to the `authEndpoint` with your Bearer token — this is handled transparently by the pusher-js compatible library.

```
POST /broadcasting/auth
Authorization: Bearer <access_token>
```

### Subscribe to a channel

Private channel per conversation:
```
private-conversations.<conversationId>
```

### Events

| Event | When | Payload |
|---|---|---|
| `.consultation_notes.generated.success` | AI notes ready | — (re-fetch `/consultations/{id}`) |
| `.consultation_notes.generated.fail` | Generation failed | `{ "error_type": "technical\|too_short\|no_relevant_info\|unknown" }` |
| `.consultation_notes.error.too_short` | Audio too short after silence trim | — |
| `.letter.generated.success` | Letter ready | — |
| `.letter.generated.fail` | Letter generation failed | — |

### Minimum audio duration

After silence trimming, audio must be at least **5 seconds**. Shorter recordings result in a `too_short` error event.

### Fallback (no WebSocket)

If WebSocket is not connected: poll `GET /consultations/{id}`. If `consultation_notes` is non-null, processing is complete.

---

## 7. Error Format

All errors use **RFC 7807 `application/problem+json`**:

```json
{
  "status": 422,
  "title": "The given data was invalid.",
  "detail": "<optional extra context>",
  "data": { ... }
}
```

### Validation errors (422)

Field errors are in `data`:
```json
{
  "status": 422,
  "title": "The given data was invalid.",
  "data": {
    "email": [
      { "code": null, "message": "The email field is required." }
    ],
    "patient_id": [
      { "code": null, "message": "The selected patient id is invalid." }
    ]
  }
}
```

### Common HTTP status codes

| Status | Meaning |
|---|---|
| `401` | Not authenticated — refresh token or re-login |
| `403` | Authenticated but no permission (wrong role or module disabled) |
| `404` | Resource not found |
| `422` | Validation error — check `data` for field-level messages |
| `429` | Rate limited |
| `500` | Server error |

---

## 9. Endpoint Reference

---

### GET /users/me

**Request**

No params.

**Response**
```json
{
  "id": "uuid (keycloak_id)",
  "first_name": "string|null",
  "last_name": "string|null",
  "email": "string|null",
  "username": "string",
  "phone": "string|null",
  "language": "string",
  "birthdate": "YYYY-MM-DD|null",
  "social_security_number": "string|null",
  "gender": "string",
  "timezone": "string",
  "roles": ["string"],
  "institutions": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "logo": "url|null",
      "modules": [
        { "id": "uuid", "key": "string", "name": "string", "access_until": "datetime|null", "is_default": "boolean" }
      ],
      "conversation_channels": [
        { "id": "uuid", "name": "string", "type": "string", "settings": "object|null", "supported_languages": "array|null" }
      ]
    }
  ],
  "doctor": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "title": "string|null",
    "riziv": "string",
    "specialty": { "id": "uuid", "name": "string" },
    "show_not_asked_in_summary": "boolean"
  }
}
```

> `doctor` is `null` if the user is not a doctor. `institutions` includes full settings and module list — use `modules[].key` to check if `consultation` module is enabled for the selected institution.

---

### GET /institutions/{institutionId}/users

**Request**

| Param | Type | Required | Description |
|---|---|---|---|
| `first_name` | string | no | Partial match |
| `last_name` | string | no | Partial match |
| `social_security_number` | string | no | Belgian RRN |
| `email` | string | no | Email address |
| `search` | string | no | Generic search across fields |
| `limit` | integer | no | Max results to return |

**Response**

Array of user objects (same shape as `GET /users/me`, without the `doctor` and `institutions` detail):
```json
[
  {
    "id": "uuid",
    "first_name": "string|null",
    "last_name": "string|null",
    "email": "string|null",
    "phone": "string|null",
    "birthdate": "YYYY-MM-DD|null",
    "social_security_number": "string|null",
    "gender": "string",
    "roles": ["string"]
  }
]
```

---

### GET /conversations

**Request**

| Param | Type | Required | Description |
|---|---|---|---|
| `institution` | uuid | yes | Institution UUID |
| `from_date` | date | no | Start of date range |
| `to_date` | date | no | End of date range |
| `patient` | string | no | Patient search string |
| `doctor` | uuid | no | Filter by doctor UUID |
| `status` | string | no | Filter by `ConversationStatus` enum value |
| `required_fields` | string | no | Only return records where this field is not null (e.g. `due_date`) |
| `sort` | string | no | Sort field with direction prefix (`+due_date`, `-created_at`) |
| `page` | integer | no | Page number (default: 1) |
| `page_size` | integer | no | Items per page |

**Response** (paginated)
```json
{
  "data": [
    {
      "id": "uuid",
      "status": "string (pending|ongoing|finished|planned|expired|error|removed)",
      "due_date": "datetime|null",
      "language": "string|null",
      "has_consultation_notes": "boolean",
      "is_anamnese_copied": "boolean",
      "doctor": {
        "id": "uuid",
        "first_name": "string",
        "last_name": "string",
        "title": "string|null",
        "riziv": "string",
        "specialty": "object|null"
      },
      "patient": {
        "id": "uuid",
        "first_name": "string|null",
        "last_name": "string|null",
        "email": "string|null",
        "phone": "string|null",
        "birthdate": "YYYY-MM-DD|null"
      },
      "channel": {
        "id": "uuid",
        "name": "string",
        "type": "string"
      },
      "created_at": "datetime|null",
      "finished_at": "datetime|null"
    }
  ],
  "links": { "first": "url", "last": "url", "prev": "url|null", "next": "url|null" },
  "meta": { "current_page": 1, "per_page": 10, "total": 42 }
}
```

---

### GET /conversations/{conversationId}

**Request**

No params.

**Response** (full mode — all list fields plus):
```json
{
  "id": "uuid",
  "status": "string",
  "due_date": "datetime|null",
  "language": "string|null",
  "has_consultation_notes": "boolean",
  "is_anamnese_copied": "boolean",
  "doctor": { "...same as list..." },
  "patient": { "...same as list..." },
  "channel": { "...same as list..." },
  "created_at": "datetime|null",
  "finished_at": "datetime|null",
  "institution": {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "logo": "url|null"
  },
  "chat_url": "string",
  "summary": "array|null",
  "summary_json": "string|null",
  "summary_updated_at": "datetime|null",
  "events": [
    { "created_at": "datetime", "type": "string", "user_type": "string" }
  ],
  "completion_duration": "float|null",
  "conversation_questions": {
    "id": "uuid",
    "title": "string",
    "pathology": "string|null",
    "description": "string|null"
  }
}
```

> Note: the `consultation` sub-model is not embedded in this response. Fetch it separately via `GET /consultations/{id}` when you need AI notes and transcripts.

---

### POST /conversations

**Request**

| Param | Type | Required | Description |
|---|---|---|---|
| `patient_id` | string (keycloak_id) | yes | Keycloak UUID of the patient |
| `institution_id` | uuid | yes | Institution UUID |
| `doctor_id` | uuid | yes (recommended) | Doctor UUID — always pass the logged-in doctor's UUID from `GET /users/me` |
| `is_conversation` | boolean | no | Do **not** pass from mobile |
| `due_date` | date | no | Due date |
| `should_notify_patient` | boolean | no | Default: `true` |

**Response**

Conversation object in minimal mode (same shape as items in `GET /conversations`).

---

### GET /consultations/{consultationId}

**Request**

No params.

**Response**
```json
{
  "id": "uuid",
  "consultation_notes": "string|null",
  "consultation_output_template": {
    "id": "uuid",
    "key": "string",
    "label": { "nl": "string", "fr": "string" },
    "is_default": "boolean"
  },
  "letter_content": "string|null",
  "transcripts": [
    {
      "id": "uuid",
      "transcript_type": "string",
      "transcript_text": "string",
      "corrected_transcript_text": "string|null",
      "annotations": [
        {
          "id": "uuid",
          "selected_text": "string",
          "annotation_text": "string",
          "start_index": "integer",
          "end_index": "integer"
        }
      ],
      "created_at": "datetime|null"
    }
  ]
}
```

> `consultation_notes` is `null` while AI generation is in progress. Listen on WebSocket for completion.

---

### GET /azure/speech-token

**Request**

No params.

**Response**
```json
{
  "token": "string",
  "region": "string"
}
```

> Valid for 9 minutes. The Azure Speech SDK uses this directly — audio streams from the device to Azure, not through the Vesalius API.

---

### POST /consultations/{consultationId}/transcripts/realtime

**Request**

No body params.

**Response**
```json
{
  "id": "uuid",
  "transcript_type": "string",
  "transcript_text": "",
  "corrected_transcript_text": null,
  "annotations": [],
  "created_at": "datetime"
}
```

> Save the returned `id` as `transcriptId` — required for all subsequent recording calls.

---

### PATCH /consultations/{consultationId}/transcripts/{transcriptId}/realtime

**Request**

| Param | Type | Required | Description |
|---|---|---|---|
| `text` | string | yes | Text fragment from Azure Speech to append |

**Response**
```json
{ "success": true }
```

---

### POST /consultations/{consultationId}/transcripts/{transcriptId}/realtime/finalize

**Request**

No body params.

**Response**
```json
{ "success": true }
```

> Triggers AI summary generation. Listen on WebSocket channel `private-conversations.{conversationId}` for the result.

---

### POST /broadcasting/auth

Used internally by the Pusher-compatible WebSocket library — you do not call this manually.

**Request**

| Param | Type | Required | Description |
|---|---|---|---|
| `socket_id` | string | yes | Socket ID assigned by Reverb |
| `channel_name` | string | yes | Channel to authorize (e.g. `private-conversations.{uuid}`) |

**Response**
```json
{ "auth": "string (HMAC signature)" }
```
