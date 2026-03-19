import { http } from "@core/network/http";

export type Transcript = {
  id: string;
  transcript_text?: string;
};

export type Conversation = {
  id: string;
  consultation_notes?: string | null;
  transcripts?: Transcript[];
  chat_url?: string;
};

export async function getConversation(
  conversationId: string,
): Promise<Conversation> {
  return http.get(`/conversations/${conversationId}`);
}
