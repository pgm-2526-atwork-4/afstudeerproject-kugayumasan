import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { User } from "lucide-react-native";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import type { Patient } from "@core/modules/patients/patients.types";

import {
  getPatientName,
  getPatientSubtitle,
} from "@functional/patients/patient.helpers";

type Props = {
  patient: Patient;
  onPress: (patient: Patient) => void;
  isLast?: boolean;
};

export default function PatientRow({
  patient,
  onPress,
  isLast = false,
}: Props) {
  return (
    <Pressable
      onPress={() => onPress(patient)}
      style={[styles.row, !isLast && styles.row__border]}
    >
      <User
        size={18}
        strokeWidth={1.5}
        color={COLORS.text}
        style={{ opacity: 0.4 }}
      />

      <View style={styles.meta}>
        <Text style={styles.name}>
          {getPatientName(patient) || "Onbekende patiënt"}
        </Text>

        <Text style={styles.subtitle}>{getPatientSubtitle(patient)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background.white,
  },

  row__border: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  meta: {
    flex: 1,
  },

  name: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
});
