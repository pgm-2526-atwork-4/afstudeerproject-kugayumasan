import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export default function ScreenHeader({ title, children }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
  },
  content: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
});
