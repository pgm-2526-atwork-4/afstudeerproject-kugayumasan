import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: COLORS.text,
  },
});
