import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import ScreenHeader from "@design/ui/ScreenHeader";
import { Button } from "@design/ui/button";
import {
  User,
  Globe,
  Building2,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

type Props = {
  onLogout: () => void;
  profileName?: string;
  profileEmail?: string;
};

type Option = { label: string; value: string };

const LANGUAGE_OPTIONS: Option[] = [
  { label: "Nederlands", value: "nl" },
  { label: "Engels", value: "en" },
  { label: "Frans", value: "fr" },
];

const ORG_OPTIONS: Option[] = [
  { label: "Metropolitan Hospital", value: "metro-hospital" },
  { label: "City Clinic", value: "city-clinic" },
  { label: "Central Medical Center", value: "central-medical" },
];

function getLabel(value: string, options: Option[]) {
  return options.find((o) => o.value === value)?.label ?? "";
}

function InlineSelect({
  headerTitle,
  value,
  placeholder,
  options,
  open,
  onToggle,
  onPick,
  onClose,
}: {
  headerTitle: string;
  value: string;
  placeholder: string;
  options: Option[];
  open: boolean;
  onToggle: () => void;
  onPick: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        style={[
          styles.select__control,
          open ? styles.select__controlOpen : null,
        ]}
      >
        <Text
          style={[
            styles.select__text,
            !value ? styles.select__placeholder : null,
          ]}
        >
          {value ? getLabel(value, options) : placeholder}
        </Text>

        <View
          style={[
            styles.select__chevronWrap,
            open ? styles.select__chevronWrapOpen : null,
          ]}
        >
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            color={COLORS.text}
            style={styles.select__chevronIcon}
          />
        </View>
      </Pressable>

      {open ? (
        <Pressable onPress={onClose}>
          <View style={styles.select__dropdown}>
            <View style={styles.select__dropdownHeader}>
              <Text style={styles.select__dropdownTitle}>{headerTitle}</Text>
            </View>

            {options.map((opt, idx) => {
              const active = opt.value === value;
              const last = idx === options.length - 1;

              return (
                <Pressable
                  key={opt.value}
                  onPress={() => onPick(opt.value)}
                  style={[
                    styles.select__item,
                    active ? styles.select__itemActive : null,
                    last ? styles.select__itemLast : null,
                  ]}
                >
                  <View style={styles.select__itemRow}>
                    <Text
                      style={[
                        styles.select__itemText,
                        active ? styles.select__itemTextActive : null,
                      ]}
                    >
                      {opt.label}
                    </Text>

                    {active ? (
                      <Check size={16} strokeWidth={2} color={COLORS.primary} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function SettingsScreen({
  onLogout,
  profileName,
  profileEmail,
}: Props) {
  const [language, setLanguage] = useState("nl");
  const [organization, setOrganization] = useState("metro-hospital");
  const [openSelect, setOpenSelect] = useState<null | "language" | "org">(null);

  return (
    <Screen>
      <ScreenHeader title="Instellingen" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <User size={32} color={COLORS.background.white} strokeWidth={1.5} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profileName ?? "—"}</Text>
            <Text style={styles.email}>{profileEmail ?? "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.field}>
            <View style={styles.label}>
              <Globe
                size={16}
                strokeWidth={1.5}
                color={COLORS.text}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.labelText}>Taal</Text>
            </View>

            <InlineSelect
              headerTitle="Selecteer taal"
              placeholder="Selecteer taal"
              value={language}
              options={LANGUAGE_OPTIONS}
              open={openSelect === "language"}
              onToggle={() =>
                setOpenSelect((p) => (p === "language" ? null : "language"))
              }
              onPick={(v) => {
                setLanguage(v);
                setOpenSelect(null);
              }}
              onClose={() => setOpenSelect(null)}
            />
          </View>

          <View style={styles.field}>
            <View style={styles.label}>
              <Building2
                size={16}
                strokeWidth={1.5}
                color={COLORS.text}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.labelText}>Organisatie</Text>
            </View>

            <InlineSelect
              headerTitle="Selecteer organisatie"
              placeholder="Selecteer organisatie"
              value={organization}
              options={ORG_OPTIONS}
              open={openSelect === "org"}
              onToggle={() =>
                setOpenSelect((p) => (p === "org" ? null : "org"))
              }
              onPick={(v) => {
                setOrganization(v);
                setOpenSelect(null);
              }}
              onClose={() => setOpenSelect(null)}
            />
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.appName}>Vesalius.ai Mobile</Text>
          <Text style={styles.muted}>Versie 1.0.2</Text>
          <Text style={styles.muted}>© 2026 Vesalius.ai</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="outline"
          onPress={onLogout}
          style={{ borderColor: COLORS.error, width: "100%" }}
          textStyle={{ color: COLORS.error, fontWeight: "500" }}
        >
          <LogOut size={18} strokeWidth={1.5} color={COLORS.error} />
          <Text style={{ marginLeft: SPACING.sm }}>Uitloggen</Text>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  email: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  section: {
    gap: SPACING.xl,
  },
  field: {
    gap: SPACING.sm,
  },

  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  labelText: {
    fontSize: 12,
    color: COLORS.text,
  },

  info: {
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  appName: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
    opacity: 0.8,
  },
  muted: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },

  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  select__control: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select__controlOpen: {
    borderColor: COLORS.primary,
  },
  select__text: {
    fontSize: 12,
    color: COLORS.text,
  },
  select__placeholder: {
    color: COLORS.placeholder,
  },

  select__chevronWrap: {
    opacity: 0.6,
  },
  select__chevronWrapOpen: {
    transform: [{ rotate: "180deg" }],
    opacity: 0.85,
  },
  select__chevronIcon: {},

  select__dropdown: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.white,
    overflow: "hidden",
  },
  select__dropdownHeader: {
    height: 40,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  select__dropdownTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  select__item: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  select__itemLast: {
    borderBottomWidth: 0,
  },
  select__itemActive: {
    backgroundColor: COLORS.background.tint,
  },

  select__itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  select__itemText: {
    fontSize: 12,
    color: COLORS.text,
  },
  select__itemTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
