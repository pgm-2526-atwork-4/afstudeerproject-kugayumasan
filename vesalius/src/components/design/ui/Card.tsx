import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { COLORS } from "@style/colors";
import { RADIUS } from "@style/radius";
import { SPACING } from "@style/spacing";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "tint";
};

export default function Card({ children, style, variant = "default" }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === "tint" ? styles.tint : styles.default,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  default: {
    backgroundColor: COLORS.background.white,
    borderColor: COLORS.border,
  },
  tint: {
    backgroundColor: COLORS.background.tint,
    borderColor: COLORS.border,
  },
});
