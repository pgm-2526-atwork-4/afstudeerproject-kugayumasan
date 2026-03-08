import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { RADIUS } from "@style/radius";

type Props = {
  label: string;
  backgroundColor: string;
  textColor: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Pill({
  label,
  backgroundColor,
  textColor,
  style,
  textStyle,
}: Props) {
  return (
    <View style={[styles.pill, { backgroundColor }, style]}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "500",
  },
});
