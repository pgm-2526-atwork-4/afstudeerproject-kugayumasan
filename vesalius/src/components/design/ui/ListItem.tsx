import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
};

export default function ListItem({
  title,
  subtitle,
  icon,
  onPress,
  isLast = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, isLast ? styles.item__last : null]}
    >
      {icon ? icon : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  item__last: {
    borderBottomWidth: 0,
  },
  content: {
    flex: 1,
  },
  title: {
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
