import { http } from "@core/network/http";
import { authService } from "@core/modules/auth/auth.service";

/* -------------------- TYPES -------------------- */

export interface SpeechTokenResponse {
  token: string;
  region: string;
}

export interface TranscriptSession {
  id: string;
  transcript_type: string;
  transcript_text: string;
  corrected_transcript_text: string | null;
  annotations: any[];
  created_at: string;
}

export interface Transcript {
  id: string;
  transcript_text: string;
  corrected_transcript_text?: string | null;
  created_at?: string | null;
}

export interface Conversation {
  id: string;
  consultation_notes: string | null;
  transcripts: Transcript[];
  summary?: any;
  patient?: {
    first_name?: string | null;
    last_name?: string | null;
  };
  status?: string;
}

/* -------------------- GETTERS -------------------- */

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {
  return http.get(`/conversations/${conversationId}`);
}

export async function getTranscripts(
  conversationId: string,
): Promise<Transcript[]> {
  return http.get(`/conversations/${conversationId}/transcripts`);
}

/* -------------------- REALTIME FLOW -------------------- */

export async function createTranscript(
  conversationId: string,
): Promise<TranscriptSession> {
  return http.post(
    `/conversations/${conversationId}/transcripts/realtime/create`,
  );
}

export async function sendTranscriptChunk(
  conversationId: string,
  transcriptId: string,
  text: string,
) {
  return http.patch(
    `/conversations/${conversationId}/transcripts/${transcriptId}/realtime/update`,
    {
      text,
    },
  );
}

export async function finalizeTranscript(
  conversationId: string,
  transcriptId: string,
) {
  return http.post(
    `/conversations/${conversationId}/transcripts/${transcriptId}/realtime/finalize`,
  );
}

export async function getSpeechToken(): Promise<SpeechTokenResponse> {
  return http.get<SpeechTokenResponse>("/azure/speech-token");
}
