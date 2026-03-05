import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export type InteractionStatus =
  | "Voltooid"
  | "In afwachting"
  | "Verwerking"
  | "Fout";

export type InteractionCardModel = {
  id: string;
  patientName: string;
  providerName: string;
  summary: string;
  status: InteractionStatus;
  date: string;
};

type Props = {
  interaction: InteractionCardModel;
  onPress: (id: string) => void;
};

const COLORS = {
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
  successBg: "#D1FAE5",
  success: "#37C18D",
  warnBg: "#FFF6EA",
  warn: "#F59E0C",
  infoBg: "#CCF0FF",
  info: "#0B759F",
  errorBg: "#FFEAEA",
  error: "#F50C0C",
};

function getStatusColors(status: InteractionStatus) {
  switch (status) {
    case "Voltooid":
      return { bg: COLORS.successBg, text: COLORS.success };
    case "In afwachting":
      return { bg: COLORS.warnBg, text: COLORS.warn };
    case "Verwerking":
      return { bg: COLORS.infoBg, text: COLORS.info };
    case "Fout":
      return { bg: COLORS.errorBg, text: COLORS.error };
    default:
      return { bg: COLORS.bgTint, text: COLORS.text };
  }
}

export default function InteractionCard({ interaction, onPress }: Props) {
  const c = getStatusColors(interaction.status);

  return (
    <Pressable
      onPress={() => onPress(interaction.id)}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.card__pressed : null,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.meta}>
          <Text style={styles.name}>{interaction.patientName}</Text>
          <Text style={styles.provider}>{interaction.providerName}</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: c.bg }]}>
          <Text style={[styles.pillText, { color: c.text }]}>
            {interaction.status}
          </Text>
        </View>
      </View>

      <Text style={styles.summary}>{interaction.summary}</Text>
      <Text style={styles.date}>{interaction.date}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  card__pressed: {
    backgroundColor: COLORS.bgTint,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  meta: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  provider: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  pillText: {
    fontSize: 10,
    fontWeight: "500",
  },

  summary: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.85,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },
});
