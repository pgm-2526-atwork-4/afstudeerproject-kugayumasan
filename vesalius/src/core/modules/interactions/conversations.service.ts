import { http } from "@core/network/http";

export type CreateConversationInput = {
  patient_id?: string;
  institution_id: string;
  doctor_id: string;
  is_anonymous?: boolean;
};

export type Conversation = {
  id: string;
  status: string;

  consultation_notes?: string | null;
  transcripts?: any[];

  created_at?: string;
  updated_at?: string;
};

export type ConversationListItem = {
  id: string;
  status: string;
  created_at?: string;
};

export const conversationService = {
  /**
   * POST /conversations
   */
  async create(input: CreateConversationInput): Promise<Conversation> {
    return http.post<Conversation>("/conversations", input);
  },

  /**
   * GET /conversations/{id}
   */
  async get(conversationId: string): Promise<Conversation> {
    return http.get<Conversation>(`/conversations/${conversationId}`);
  },

  /**
   * GET /conversations
   */
  async list(): Promise<ConversationListItem[]> {
    const response = await http.get<any>("/conversations");

    if (Array.isArray(response)) return response;
    if (response?.data) return response.data;

    return [];
  },
};