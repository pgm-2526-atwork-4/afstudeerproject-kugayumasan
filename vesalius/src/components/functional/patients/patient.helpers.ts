import type { Patient } from "@core/modules/patients/patients.types";

export function getPatientName(patient: Patient) {
  return [patient.first_name, patient.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function getPatientSubtitle(patient: Patient) {
  return (
    patient.social_security_number ||
    patient.birthdate ||
    patient.email ||
    patient.phone ||
    "Geen extra gegevens"
  );
}