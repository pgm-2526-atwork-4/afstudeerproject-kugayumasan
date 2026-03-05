// src/core/modules/session/session.bootstrap.ts
import { authService } from "@core/modules/auth/auth.service";
import { userService } from "@core/modules/user/user.service";
import { clearTokens } from "@core/modules/auth/auth.storage";
import {
  saveSelectedInstitutionId,
  saveDoctorId,
  clearSession,
  getSelectedInstitutionId,
} from "./session.storage";
import type { SessionState } from "./session.types";

export async function bootstrapSession(): Promise<
  Omit<SessionState, "isHydrated">
> {
  const tokens = await authService.getTokens();

  // No tokens => no session
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    return { me: null, selectedInstitutionId: null, doctorId: null };
  }

  // Proactive refresh if expiring (access token is 60s)
  if (Date.now() >= tokens.accessTokenExpiresAt - 5_000) {
    await authService.refresh();
  }

  // Fetch /users/me (http wrapper handles Bearer + refresh on 401)
  const me = await userService.getMe();

  const doctorId = me.doctor?.id ?? null;
  await saveDoctorId(doctorId);

  // Institution selection:
  const storedInstitutionId = await getSelectedInstitutionId();
  const availableIds = new Set((me.institutions ?? []).map((i) => i.id));

  const selectedInstitutionId =
    storedInstitutionId && availableIds.has(storedInstitutionId)
      ? storedInstitutionId
      : (me.institutions?.[0]?.id ?? null);

  await saveSelectedInstitutionId(selectedInstitutionId);

  return { me, selectedInstitutionId, doctorId };
}

export async function clearAllSession(): Promise<void> {
  await clearTokens();
  await clearSession();
}
