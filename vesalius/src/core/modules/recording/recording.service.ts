import { http } from "@core/network/http";

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

export interface Consultation {
  id: string;
  consultation_notes: string | null;
  transcripts: Transcript[];
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

/* -------------------- CONSULTATION -------------------- */

export async function getConsultation(
  conversationId: string,
): Promise<Consultation | null> {
  try {
    return await http.get(`/conversations/${conversationId}/consultation`);
  } catch (e: any) {
    if (e?.status === 404) return null;
    throw e;
  }
}

export async function createConsultation(
  conversationId: string,
): Promise<Consultation> {
  return http.post(`/consultations`, {
    conversation_id: conversationId,
  });
}

/* -------------------- GETTERS -------------------- */

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {
  return http.get(`/conversations/${conversationId}`);
}

export async function getTranscripts(
  consultationId: string,
): Promise<Transcript[]> {
  return http.get(`/consultations/${consultationId}/transcripts`);
}

/* -------------------- REALTIME FLOW -------------------- */

export async function createTranscript(
  consultationId: string,
): Promise<TranscriptSession> {
  return http.post(`/consultations/${consultationId}/transcripts/realtime`);
}

export async function sendTranscriptChunk(
  consultationId: string,
  transcriptId: string,
  text: string,
) {
  return http.patch(
    `/consultations/${consultationId}/transcripts/${transcriptId}/realtime`,
    { text },
  );
}

export async function finalizeTranscript(
  consultationId: string,
  transcriptId: string,
) {
  return http.post(
    `/consultations/${consultationId}/transcripts/${transcriptId}/realtime/finalize`,
  );
}

export async function getSpeechToken(): Promise<SpeechTokenResponse> {
  return http.get<SpeechTokenResponse>("/azure/speech-token");
}