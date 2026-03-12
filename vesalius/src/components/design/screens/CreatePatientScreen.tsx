import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";

import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";

import { X, Calendar, ChevronRight } from "lucide-react-native";

import { COLORS } from "@style/colors";

import { useSession } from "@core/modules/session/session.context";
import { patientsService } from "@core/modules/patients/patients.service";

import InlineSelect from "@design/ui/InlineSelect";

import {
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  COUNTRY_CODE_OPTIONS,
} from "@core/modules/patients/constants/patientForm.constants";

import type { FormData } from "@core/modules/patients/patientForm.types";
import { formatBirthdate } from "@core/utils/patients.utils";

type PatientResult = {
  id: string;
  name: string;
};

type Props = {
  onCancel: () => void;
  onSavePatient: (patient: PatientResult) => void;
};

export default function CreatePatientScreen({
  onCancel,
  onSavePatient,
}: Props) {
  const { selectedInstitutionId } = useSession();

  const [formData, setFormData] = useState<FormData>({
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

  const [openSelect, setOpenSelect] = useState<
    null | "gender" | "language" | "countryCode"
  >(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as string]) {
      setErrors((prevErrors: Record<string, string>) => {
        const next = { ...prevErrors };
        delete next[field as string];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!formData.firstName) next.firstName = "Verplicht veld";
    if (!formData.lastName) next.lastName = "Verplicht veld";
    if (!formData.gender) next.gender = "Verplicht veld";
    if (!formData.language) next.language = "Verplicht veld";

    if (!formData.phone && !formData.email) {
      next.phone = "Telefoon of email is verplicht";
      next.email = "Telefoon of email is verplicht";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!selectedInstitutionId) {
      console.error("No institution selected");
      return;
    }

    try {
      const patient = await patientsService.create(selectedInstitutionId, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birthdate: formData.birthDate
          ? formatBirthdate(formData.birthDate)
          : undefined,
        gender: formData.gender || undefined,
        language: formData.language || undefined,
        email: formData.email || undefined,
        phone: formData.phone
          ? `${formData.countryCode}${formData.phone}`
          : undefined,
        social_security_number: formData.nrn || undefined,
        username: formData.username || undefined,
      });

      onSavePatient({
        id: patient.id,
        name: `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim(),
      });
    } catch (err) {
      console.error("Create patient failed", err);
    }
  };

  const closeDropdowns = () => setOpenSelect(null);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.leaveBtn}>
          <X size={18} strokeWidth={1.5} color={COLORS.text} />
          <Text style={styles.leaveText}>Verlaat</Text>
        </Pressable>

        <Text style={styles.title}>Voeg een nieuwe patiënt toe</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* FIRST NAME */}

        <View style={styles.field}>
          <Text style={styles.label}>Nationaal registratienummer</Text>

          <TextInput
            value={formData.nrn}
            onChangeText={(v) => updateField("nrn", v)}
            placeholder="00.00.00-000.00"
            placeholderTextColor={COLORS.placeholder}
            style={styles.input}
            onFocus={closeDropdowns}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Voornaam <Text style={styles.required}>*</Text>
          </Text>

          <TextInput
            value={formData.firstName}
            onChangeText={(v) => updateField("firstName", v)}
            placeholder="Voer voornaam in"
            placeholderTextColor={COLORS.placeholder}
            style={styles.input}
            onFocus={closeDropdowns}
          />
        </View>

        {/* LAST NAME */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Familienaam <Text style={styles.required}>*</Text>
          </Text>

          <TextInput
            value={formData.lastName}
            onChangeText={(v) => updateField("lastName", v)}
            placeholder="Voer familienaam in"
            placeholderTextColor={COLORS.placeholder}
            style={styles.input}
            onFocus={closeDropdowns}
          />
        </View>

        {/* BIRTHDATE */}

        <View style={styles.field}>
          <Text style={styles.label}>Geboortedatum</Text>

          <View style={styles.inputIconRow}>
            <TextInput
              value={formData.birthDate}
              onChangeText={(v) => updateField("birthDate", v)}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={COLORS.placeholder}
              style={styles.inputIconInput}
              onFocus={closeDropdowns}
            />

            <Calendar
              size={18}
              strokeWidth={1.5}
              color={COLORS.text}
              style={{ opacity: 0.4 }}
            />
          </View>
        </View>

        {/* GENDER */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Geslacht <Text style={styles.required}>*</Text>
          </Text>

          <InlineSelect
            headerTitle="Selecteer geslacht"
            placeholder="Selecteer geslacht"
            value={formData.gender}
            options={GENDER_OPTIONS}
            open={openSelect === "gender"}
            error={!!errors.gender}
            onToggle={() =>
              setOpenSelect((p) => (p === "gender" ? null : "gender"))
            }
            onPick={(v) => {
              updateField("gender", v);
              setOpenSelect(null);
            }}
            onClose={() => setOpenSelect(null)}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>
            Taal <Text style={styles.required}>*</Text>
          </Text>

          <InlineSelect
            headerTitle="Selecteer taal"
            placeholder="Selecteer taal"
            value={formData.language}
            options={LANGUAGE_OPTIONS}
            open={openSelect === "language"}
            error={!!errors.language}
            onToggle={() =>
              setOpenSelect((p) => (p === "language" ? null : "language"))
            }
            onPick={(v) => {
              updateField("language", v);
              setOpenSelect(null);
            }}
            onClose={() => setOpenSelect(null)}
          />

          {errors.language && (
            <Text style={styles.errorText}>{errors.language}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Telefoonnummer</Text>

          <View style={styles.phoneRow}>
            <View style={{ width: 96 }}>
              <InlineSelect
                headerTitle="Kies"
                placeholder="+32"
                value={formData.countryCode}
                options={COUNTRY_CODE_OPTIONS}
                compact
                open={openSelect === "countryCode"}
                onToggle={() =>
                  setOpenSelect((p) =>
                    p === "countryCode" ? null : "countryCode",
                  )
                }
                onPick={(v) => {
                  updateField("countryCode", v);
                  setOpenSelect(null);
                }}
                onClose={() => setOpenSelect(null)}
              />
            </View>

            <TextInput
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              placeholder="000 00 00 00"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="phone-pad"
              style={[styles.input, styles.phoneInput]}
              onFocus={closeDropdowns}
            />
          </View>

          <Text style={styles.helper}>** Telefoon of email is verplicht</Text>

          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>E-mailadres</Text>

          <TextInput
            value={formData.email}
            onChangeText={(v) => updateField("email", v)}
            placeholder="naam@voorbeeld.be"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            onFocus={closeDropdowns}
          />

          <Text style={styles.helper}>** Telefoon of email is verplicht</Text>

          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Gebruikersnaam</Text>

          <TextInput
            value={formData.username}
            onChangeText={(v) => updateField("username", v)}
            placeholder="Voer gebruikersnaam in"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="none"
            style={styles.input}
            onFocus={closeDropdowns}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleSubmit} style={styles.confirmBtn}>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>Bevestigen</Text>

            <ChevronRight
              size={18}
              strokeWidth={1.5}
              color={COLORS.background.white}
            />
          </View>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  leaveText: {
    fontSize: 12,
    color: COLORS.text,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },

  field: { gap: 8 },

  label: { fontSize: 12, color: COLORS.text },

  required: { color: COLORS.error },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.white,
    color: COLORS.text,
    fontSize: 12,
  },

  inputIconRow: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.background.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  inputIconInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },
  helper: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  errorText: {
    fontSize: 12,
    color: COLORS.error,
  },

  phoneRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  phoneInput: {
    flex: 1,
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  confirmBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
  },

  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  confirmText: {
    color: COLORS.background.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
