import * as SecureStore from "expo-secure-store";
import type { MeResponse } from "@core/modules/user/user.types";

const KEY_ME = "vesalius.session.me.v1";
const KEY_SELECTED_INSTITUTION = "vesalius.session.selectedInstitutionId.v1";
const KEY_DOCTOR_ID = "vesalius.session.doctorId.v1";

export async function saveMe(me: MeResponse): Promise<void> {
  await SecureStore.setItemAsync(KEY_ME, JSON.stringify(me));
}

export async function getMe(): Promise<MeResponse | null> {
  const raw = await SecureStore.getItemAsync(KEY_ME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MeResponse;
  } catch {
    return null;
  }
}

export async function saveSelectedInstitutionId(id: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_SELECTED_INSTITUTION, id);
}

export async function getSelectedInstitutionId(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEY_SELECTED_INSTITUTION);
}

export async function saveDoctorId(id: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_DOCTOR_ID, id);
}

export async function getDoctorId(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEY_DOCTOR_ID);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_ME);
  await SecureStore.deleteItemAsync(KEY_SELECTED_INSTITUTION);
  await SecureStore.deleteItemAsync(KEY_DOCTOR_ID);
}
