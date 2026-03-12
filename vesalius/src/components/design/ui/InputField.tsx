import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (v: string) => void;
};

export default function InputField({
  label,
  value,
  placeholder,
  required,
  error,
  onChange,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        style={[styles.input, error && styles.errorInput]}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },

  label: {
    fontSize: 12,
    color: COLORS.text,
  },

  required: {
    color: COLORS.danger,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background.white,
    fontSize: 12,
  },

  errorInput: {
    borderColor: COLORS.danger,
  },

  errorText: {
    fontSize: 12,
    color: COLORS.danger,
  },
});
