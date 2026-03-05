import * as SecureStore from "expo-secure-store";

const KEY_SELECTED_INSTITUTION = "vesalius.session.selectedInstitutionId.v1";
const KEY_DOCTOR_ID = "vesalius.session.doctorId.v1";

async function setItem(key: string, value: string | null): Promise<void> {
  if (!value) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

export async function saveSelectedInstitutionId(
  id: string | null,
): Promise<void> {
  await setItem(KEY_SELECTED_INSTITUTION, id);
}

export async function getSelectedInstitutionId(): Promise<string | null> {
  return await getItem(KEY_SELECTED_INSTITUTION);
}

export async function saveDoctorId(id: string | null): Promise<void> {
  await setItem(KEY_DOCTOR_ID, id);
}

export async function getDoctorId(): Promise<string | null> {
  return await getItem(KEY_DOCTOR_ID);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_SELECTED_INSTITUTION);
  await SecureStore.deleteItemAsync(KEY_DOCTOR_ID);
}
