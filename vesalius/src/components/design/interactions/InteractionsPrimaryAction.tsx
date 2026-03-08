import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";

type Props = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

export default function InteractionsPrimaryAction({
  title,
  onPress,
  icon,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btnRow,
        pressed ? styles.btnRow__pressed : null,
      ]}
    >
      {icon ? <View style={styles.btnRow__icon}>{icon}</View> : null}
      <Text style={styles.btnRow__text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnRow: {
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnRow__pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  btnRow__icon: {
    marginTop: 1,
  },
  btnRow__text: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.background.white,
  },
});
