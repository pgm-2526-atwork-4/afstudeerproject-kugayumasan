import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { getStatusColors } from "@functional/interactions/interaction.helpers";
import Pill from "@design/ui/Pill";

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
  onDelete?: (id: string) => void;
};

export default function InteractionCard({
  interaction,
  onPress,
  onDelete,
}: Props) {
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

        <View style={styles.rightSide}>
          <Pill
            label={interaction.status}
            backgroundColor={c.bg}
            textColor={c.text}
          />

          {onDelete && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onDelete(interaction.id);
              }}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Verwijder</Text>
            </Pressable>
          )}
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
    backgroundColor: COLORS.background.white,
  },

  card__pressed: {
    backgroundColor: COLORS.background.tint,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },

  meta: {
    flex: 1,
  },

  rightSide: {
    alignItems: "flex-end",
    gap: 6,
  },

  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  deleteText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.danger,
  },

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
