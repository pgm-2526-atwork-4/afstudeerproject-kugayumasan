import { http } from "@core/network/http";

export type CreateConversationInput = {
  patient_id: string;
  institution_id: string;
  doctor_id: string;
};

export type Conversation = {
  id: string;
  status: string;
};

export const conversationsService = {
  async create(input: CreateConversationInput): Promise<Conversation> {
    return http.post<Conversation>("/conversations", input);
  },
};
