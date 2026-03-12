import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

import { COLORS } from "@style/colors";

import type { Option } from "@core/modules/patients/patientForm.types";
import { getLabel } from "@core/modules/patients/constants/patientForm.constants";

type Props = {
  headerTitle: string;
  placeholder: string;
  value: string;
  options: Option[];
  open: boolean;
  onToggle: () => void;
  onPick: (v: string) => void;
  onClose: () => void;
  error?: boolean;
  compact?: boolean;
};

export default function InlineSelect({
  headerTitle,
  placeholder,
  value,
  options,
  open,
  onToggle,
  onPick,
  onClose,
  error,
  compact,
}: Props) {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        style={[
          compact ? styles.controlCompact : styles.control,
          error ? styles.controlError : null,
          open ? styles.controlOpen : null,
        ]}
      >
        <Text style={[styles.text, !value ? styles.placeholder : null]}>
          {value ? getLabel(value, options) : placeholder}
        </Text>

        <View style={[styles.chevronWrap, open && styles.chevronWrapOpen]}>
          <ChevronDown size={18} strokeWidth={1.5} color={COLORS.text} />
        </View>
      </Pressable>

      {open && (
        <Pressable onPress={onClose} style={styles.overlay}>
          <Pressable style={compact ? styles.dropdownCompact : styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{headerTitle}</Text>
            </View>

            {options.map((opt, idx) => {
              const active = opt.value === value;
              const last = idx === options.length - 1;

              return (
                <Pressable
                  key={opt.value}
                  onPress={() => onPick(opt.value)}
                  style={[
                    styles.item,
                    active && styles.itemActive,
                    last && styles.itemLast,
                  ]}
                >
                  <View style={styles.itemRow}>
                    <Text
                      style={[styles.itemText, active && styles.itemTextActive]}
                    >
                      {opt.label}
                    </Text>

                    {active && (
                      <Check size={16} strokeWidth={2} color={COLORS.primary} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "relative" },

  control: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  controlCompact: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  controlOpen: { borderColor: COLORS.primary },
  controlError: { borderColor: COLORS.danger },

  text: { fontSize: 12, color: COLORS.text },

  placeholder: { color: "#9AA4B2" },

  chevronWrap: { opacity: 0.6 },
  chevronWrapOpen: {
    transform: [{ rotate: "180deg" }],
    opacity: 0.8,
  },

  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.background.white,
    overflow: "hidden",
  },

  dropdownCompact: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.background.white,
    overflow: "hidden",
  },

  dropdownHeader: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  dropdownTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  itemLast: { borderBottomWidth: 0 },

  itemActive: { backgroundColor: COLORS.background.tint },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemText: {
    fontSize: 12,
    color: COLORS.text,
  },

  itemTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
