import type { MeResponse } from "@core/modules/user/user.types";

export type SessionState = {
  me: MeResponse | null;
  selectedInstitutionId: string | null;
  doctorId: string | null;
  isHydrated: boolean; // bootstrap finished
};