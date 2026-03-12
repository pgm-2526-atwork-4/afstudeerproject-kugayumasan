import type { Option } from "@core/modules/patients/patientForm.types";

export const GENDER_OPTIONS: Option[] = [
  { label: "Man", value: "MALE" },
  { label: "Vrouw", value: "FEMALE" },
  { label: "Andere", value: "OTHER" },
];

export const LANGUAGE_OPTIONS: Option[] = [
  { label: "Nederlands", value: "nl" },
  { label: "Frans", value: "fr" },
  { label: "Engels", value: "en" },
];

export const COUNTRY_CODE_OPTIONS: Option[] = [
  { label: "+32", value: "+32" },
  { label: "+31", value: "+31" },
  { label: "+33", value: "+33" },
  { label: "+44", value: "+44" },
];

export function getLabel(value: string, options: Option[]) {
  return options.find((o) => o.value === value)?.label ?? "";
}
