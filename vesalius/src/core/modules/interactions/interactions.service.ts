import { http } from "@core/network/http";
import type {
  GetConversationsParams,
  PaginatedConversationsResponse,
  Conversation,
} from "./interactions.types";

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const interactionsService = {
  async list(
    params: GetConversationsParams,
  ): Promise<PaginatedConversationsResponse> {
    return http.get<PaginatedConversationsResponse>(
      `/conversations${buildQuery(params)}`,
    );
  },

  async getUpcomingInteraction(
    institutionId: string,
    doctorId?: string,
  ): Promise<Conversation | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const res = await this.list({
      institution: institutionId,
      from_date: today.toISOString(),
      required_fields: "due_date",
      sort: "+due_date",
      page: 1,
      page_size: 1,
      doctor: doctorId,
    });

    return res.data?.[0] ?? null;
  },

  async getRecentInteractions(
    institutionId: string,
    doctorId?: string,
  ): Promise<Conversation[]> {
    const res = await this.list({
      institution: institutionId,
      sort: "-created_at",
      page: 1,
      page_size: 5,
      doctor: doctorId,
    });

    return res.data ?? [];
  },
};

export async function deleteInteraction(interactionId: string) {
  return http.delete(`/conversations/${interactionId}`);
}