import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";

type Props = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: "flex-start",
  },

  title: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },

  description: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.5,
  },
});
