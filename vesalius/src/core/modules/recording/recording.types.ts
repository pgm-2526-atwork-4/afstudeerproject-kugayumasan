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
export interface TranscriptResponse {
  id: string;
}

export interface SpeechTokenResponse {
  token: string;
  region: string;
}
