import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

type Props = {
  text: string;
  icon?: string;
};

export default function LoadingCard({ text, icon = "⟳" }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.tint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  icon: {
    fontSize: 22,
    color: COLORS.primary,
    opacity: 0.9,
  },
  text: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: "center",
  },
});
