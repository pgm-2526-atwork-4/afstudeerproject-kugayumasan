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


export function createAnonymousPatientPayload(institutionId: string) {
  const randomNumber = Math.floor(Math.random() * 100000).toString();

  return {
    first_name: "Patient",
    last_name: randomNumber,
    username: `Patient${randomNumber}`,
    institution_id: institutionId,

    birthdate: "1800-01-01",
    email: "unknown@example.com",
    phone: "+0000000000",
  };
}

export const patientsService = {
  async search(params: SearchPatientsParams): Promise<Patient[]> {
    const { institutionId, ...query } = params;

    return http.get<Patient[]>(
      `/institutions/${institutionId}/users${buildQuery(query)}`,
    );
  },

  async create(
    institutionId: string,
    data: {
      first_name: string;
      last_name: string;
      birthdate?: string;
      gender?: string;
      language?: string;
      email?: string;
      phone?: string;
      social_security_number?: string;
      username?: string;
    },
  ): Promise<Patient> {
    return http.post<Patient>("/users", {
      ...data,
      institution_id: institutionId,
      roles: ["patient"],
    });
  },
};
