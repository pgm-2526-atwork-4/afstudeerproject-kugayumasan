import { http } from "@core/network/http";
import type { Patient, SearchPatientsParams } from "./patients.types";

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

export const patientsService = {
  async search(params: SearchPatientsParams): Promise<Patient[]> {
    const { institutionId, ...query } = params;

    return http.get<Patient[]>(
      `/institutions/${institutionId}/users${buildQuery(query)}`,
    );
  },
};
