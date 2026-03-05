import { http } from "@core/network/http";
import type { MeResponse } from "./user.types";

export const userService = {
  async getMe(): Promise<MeResponse> {
    return await http.get<MeResponse>("/users/me");
  },
};