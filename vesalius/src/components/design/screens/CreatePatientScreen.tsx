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
import {
  X,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react-native";

type PatientResult = { id: string; name: string };

type Props = {
  onSavePatient: (patient: PatientResult) => void;
  onCancel: () => void;
};

type FormData = {
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

type Option = { label: string; value: string };

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
  destructive: "#F50C0C",
};

const GENDER_OPTIONS: Option[] = [
  { label: "Man", value: "male" },
  { label: "Vrouw", value: "female" },
  { label: "Andere", value: "other" },
];

const LANGUAGE_OPTIONS: Option[] = [
  { label: "Nederlands", value: "nl" },
  { label: "Frans", value: "fr" },
  { label: "Engels", value: "en" },
];

const COUNTRY_CODE_OPTIONS: Option[] = [
  { label: "+32", value: "+32" },
  { label: "+31", value: "+31" },
  { label: "+33", value: "+33" },
  { label: "+44", value: "+44" },
];

function getLabel(value: string, options: Option[]) {
  return options.find((o) => o.value === value)?.label ?? "";
}

/* ---------- Inline Select ---------- */

type InlineSelectProps = {
  headerTitle: string;
  placeholder: string;
  value: string;
  options: Option[];
  open: boolean;
  onToggle: () => void;
  onPick: (v: string) => void;
  onClose: () => void;
  error?: boolean;
  compact?: boolean;
};

function InlineSelect({
  headerTitle,
  placeholder,
  value,
  options,
  open,
  onToggle,
  onPick,
  onClose,
  error,
  compact,
}: InlineSelectProps) {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        style={[
          compact ? styles.select__controlCompact : styles.select__control,
          error ? styles["select__control--error"] : null,
          open ? styles["select__control--open"] : null,
        ]}
      >
        <Text
          style={[
            styles.select__text,
            !value ? styles.select__placeholder : null,
          ]}
        >
          {value ? getLabel(value, options) : placeholder}
        </Text>

        {/* ✅ FIX: rotate on wrapper, not on icon */}
        <View
          style={[
            styles.select__chevronWrap,
            open ? styles.select__chevronWrapOpen : null,
          ]}
        >
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            color={COLORS.text}
            style={styles.select__chevronIcon}
          />
        </View>
      </Pressable>

      {open ? (
        // overlay: click outside closes
        <Pressable onPress={onClose} style={styles.select__overlay}>
          {/* stop propagation inside dropdown */}
          <Pressable
            onPress={() => {}}
            style={
              compact ? styles.select__dropdownCompact : styles.select__dropdown
            }
          >
            <View style={styles.select__dropdownHeader}>
              <Text style={styles.select__dropdownTitle}>{headerTitle}</Text>
            </View>

            {options.map((opt, idx) => {
              const active = opt.value === value;
              const last = idx === options.length - 1;

              return (
                <Pressable
                  key={opt.value}
                  onPress={() => onPick(opt.value)}
                  style={[
                    styles.select__item,
                    active ? styles.select__itemActive : null,
                    last ? styles.select__itemLast : null,
                  ]}
                >
                  <View style={styles.select__itemRow}>
                    <Text
                      style={[
                        styles.select__itemText,
                        active ? styles.select__itemTextActive : null,
                      ]}
                    >
                      {opt.label}
                    </Text>

                    {active ? (
                      <Check
                        size={16}
                        strokeWidth={2}
                        color={COLORS.primary}
                        style={styles.select__checkIcon}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- Screen ---------- */

export default function CreatePatientScreen({
  onSavePatient,
  onCancel,
}: Props) {
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
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
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

  const handleSubmit = () => {
    if (!validate()) return;

    const patient: PatientResult = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`,
    };

    onSavePatient(patient);
  };

  const closeDropdowns = () => setOpenSelect(null);

  return (
    <Screen>
      {/* Header */}
      <View style={styles.patientCreate__header}>
        <Pressable onPress={onCancel} style={styles.patientCreate__leaveBtn}>
          <X size={18} strokeWidth={1.5} color={COLORS.text} />
          <Text style={styles.patientCreate__leaveText}>Verlaat</Text>
        </Pressable>

        <Text style={styles.patientCreate__title}>
          Voeg een nieuwe patiënt toe
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.patientCreate__content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* NRN */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>
            Nationaal registratienummer
          </Text>
          <TextInput
            value={formData.nrn}
            onChangeText={(v) => updateField("nrn", v)}
            placeholder="00.00.00-000.00"
            placeholderTextColor="#9AA4B2"
            style={styles.patientCreate__input}
            onFocus={closeDropdowns}
          />
        </View>

        {/* First Name */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>
            Voornaam <Text style={styles.patientCreate__required}>*</Text>
          </Text>
          <TextInput
            value={formData.firstName}
            onChangeText={(v) => updateField("firstName", v)}
            placeholder="Voer voornaam in"
            placeholderTextColor="#9AA4B2"
            style={[
              styles.patientCreate__input,
              errors.firstName ? styles["patientCreate__input--error"] : null,
            ]}
            onFocus={closeDropdowns}
          />
          {errors.firstName ? (
            <Text style={styles.patientCreate__errorText}>
              {errors.firstName}
            </Text>
          ) : null}
        </View>

        {/* Last Name */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>
            Familienaam <Text style={styles.patientCreate__required}>*</Text>
          </Text>
          <TextInput
            value={formData.lastName}
            onChangeText={(v) => updateField("lastName", v)}
            placeholder="Voer familienaam in"
            placeholderTextColor="#9AA4B2"
            style={[
              styles.patientCreate__input,
              errors.lastName ? styles["patientCreate__input--error"] : null,
            ]}
            onFocus={closeDropdowns}
          />
          {errors.lastName ? (
            <Text style={styles.patientCreate__errorText}>
              {errors.lastName}
            </Text>
          ) : null}
        </View>

        {/* Birth Date */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>Geboortedatum</Text>
          <View style={styles.patientCreate__inputIconRow}>
            <TextInput
              value={formData.birthDate}
              onChangeText={(v) => updateField("birthDate", v)}
              placeholder="dd/mm/yyyy"
              placeholderTextColor="#9AA4B2"
              style={styles.patientCreate__inputIconRowInput}
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

        {/* Gender */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>
            Geslacht <Text style={styles.patientCreate__required}>*</Text>
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

          {errors.gender ? (
            <Text style={styles.patientCreate__errorText}>{errors.gender}</Text>
          ) : null}
        </View>

        {/* Language */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>
            Taal <Text style={styles.patientCreate__required}>*</Text>
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

          {errors.language ? (
            <Text style={styles.patientCreate__errorText}>
              {errors.language}
            </Text>
          ) : null}
        </View>

        {/* Phone */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>Telefoonnummer</Text>

          <View style={styles.patientCreate__phoneRow}>
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
              placeholderTextColor="#9AA4B2"
              keyboardType="phone-pad"
              style={[
                styles.patientCreate__input,
                styles.patientCreate__phoneInput,
                errors.phone ? styles["patientCreate__input--error"] : null,
              ]}
              onFocus={closeDropdowns}
            />
          </View>

          <Text style={styles.patientCreate__helper}>
            ** Telefoon of email is verplicht
          </Text>
          {errors.phone ? (
            <Text style={styles.patientCreate__errorText}>{errors.phone}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>E-mailadres</Text>
          <TextInput
            value={formData.email}
            onChangeText={(v) => updateField("email", v)}
            placeholder="naam@voorbeeld.be"
            placeholderTextColor="#9AA4B2"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.patientCreate__input,
              errors.email ? styles["patientCreate__input--error"] : null,
            ]}
            onFocus={closeDropdowns}
          />
          <Text style={styles.patientCreate__helper}>
            ** Telefoon of email is verplicht
          </Text>
          {errors.email ? (
            <Text style={styles.patientCreate__errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Username */}
        <View style={styles.patientCreate__field}>
          <Text style={styles.patientCreate__label}>Gebruikersnaam</Text>
          <TextInput
            value={formData.username}
            onChangeText={(v) => updateField("username", v)}
            placeholder="Voer gebruikersnaam in"
            placeholderTextColor="#9AA4B2"
            autoCapitalize="none"
            style={styles.patientCreate__input}
            onFocus={closeDropdowns}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.patientCreate__footer}>
        <Button onPress={handleSubmit} style={styles.patientCreate__confirmBtn}>
          <View style={styles.patientCreate__confirmRow}>
            <Text style={styles.patientCreate__confirmText}>Bevestigen</Text>
            <ChevronRight size={18} strokeWidth={1.5} color={COLORS.white} />
          </View>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  patientCreate__header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  patientCreate__leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  patientCreate__leaveText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.9,
  },
  patientCreate__title: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
  },

  patientCreate__content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },

  patientCreate__field: { gap: 8 },
  patientCreate__label: { fontSize: 12, color: COLORS.text },
  patientCreate__required: { color: COLORS.destructive },

  patientCreate__input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    fontSize: 12,
  },
  "patientCreate__input--error": {
    borderColor: COLORS.destructive,
  },

  patientCreate__inputIconRow: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  patientCreate__inputIconRowInput: {
    flex: 1,
    height: 44,
    fontSize: 12,
    color: COLORS.text,
  },

  patientCreate__phoneRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  patientCreate__phoneInput: {
    flex: 1,
  },

  patientCreate__helper: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
  patientCreate__errorText: {
    fontSize: 12,
    color: COLORS.destructive,
  },

  patientCreate__footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  patientCreate__confirmBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
  },
  patientCreate__confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  patientCreate__confirmText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },

  /* Inline select */
  select__overlay: {
    position: "relative",
  },
  select__control: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select__controlCompact: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "select__control--open": {
    borderColor: COLORS.primary,
  },
  "select__control--error": {
    borderColor: COLORS.destructive,
  },
  select__text: {
    fontSize: 12,
    color: COLORS.text,
  },
  select__placeholder: {
    color: "#9AA4B2",
  },

  /* ✅ FIX: rotate wrapper */
  select__chevronWrap: {
    opacity: 0.6,
  },
  select__chevronWrapOpen: {
    transform: [{ rotate: "180deg" }],
    opacity: 0.8,
  },
  select__chevronIcon: {},

  select__dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  select__dropdownCompact: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  select__dropdownHeader: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  select__dropdownTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  select__item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  select__itemLast: {
    borderBottomWidth: 0,
  },
  select__itemActive: {
    backgroundColor: COLORS.bgTint,
  },

  select__itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select__itemText: {
    fontSize: 12,
    color: COLORS.text,
  },
  select__itemTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  select__checkIcon: {
    marginLeft: 12,
  },
});
