import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";

type Props = {
  text: string;
};

export default function EmptyState({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
    textAlign: "center",
  },
});
