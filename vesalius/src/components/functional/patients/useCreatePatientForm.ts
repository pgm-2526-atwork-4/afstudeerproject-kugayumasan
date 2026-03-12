import { useState } from "react";

export type CreatePatientForm = {
  nrn: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  language: string;
  countryCode: string;
  phone: string;
  email: string;
  username: string;
};

export function useCreatePatientForm() {
  const [form, setForm] = useState<CreatePatientForm>({
    nrn: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    language: "",
    countryCode: "+32",
    phone: "",
    email: "",
    username: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(field: keyof CreatePatientForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate() {
    const next: Record<string, string> = {};

    if (!form.firstName) next.firstName = "Voornaam is verplicht";
    if (!form.lastName) next.lastName = "Familienaam is verplicht";
    if (!form.gender) next.gender = "Geslacht is verplicht";
    if (!form.language) next.language = "Taal is verplicht";

    if (!form.phone && !form.email) {
      next.phone = "Telefoon of email verplicht";
      next.email = "Telefoon of email verplicht";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  return {
    form,
    errors,
    update,
    validate,
  };
}
