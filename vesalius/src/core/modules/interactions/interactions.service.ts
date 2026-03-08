import { http } from "@core/network/http";
import type {
  GetConversationsParams,
  PaginatedConversationsResponse,
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
};
