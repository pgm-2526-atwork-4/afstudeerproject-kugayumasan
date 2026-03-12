import { Patient } from "@core/modules/patients/patients.types";

export function getPatientName(patient: Patient) {
  const first = patient.first_name ?? "";
  const last = patient.last_name ?? "";

  const name = `${first} ${last}`.trim();

  return name.length ? name : "Anoniem";
}

export function formatBirthdate(date: string): string {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) return date;

  return `${year}-${month}-${day}`;
}