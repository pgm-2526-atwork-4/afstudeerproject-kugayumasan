import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import EmptyState from "@design/ui/EmptyState";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

import type { Conversation } from "@core/modules/interactions/interactions.types";
import { useTranslation } from "react-i18next";

type Props = {
  interactions: Conversation[];
  onOpen: (id: string) => void;
};

export default function RecentInteractionsList({
  interactions,
  onOpen,
}: Props) {
  const { t } = useTranslation();

  function getPatientName(item: Conversation) {
    if (!item.patient) return t("common.anonymous");

    const first = item.patient.first_name ?? "";
    const last = item.patient.last_name ?? "";

    const name = `${first} ${last}`.trim();

    return name || t("common.anonymous");
  }

  function formatDate(date?: string | null) {
    if (!date) return "";
    return new Date(date).toLocaleString();
  }

  if (!interactions.length) {
    return (
      <EmptyState
        title={t("home.noRecent")}
        description={t("home.noRecentDescription")}
      />
    );
  }

  return (
    <View style={styles.list}>
      {interactions.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onOpen(item.id)}
          style={({ pressed }) => [
            styles.recentItem,
            pressed && styles.pressed,
          ]}
        >
          <View>
            <Text style={styles.recentName}>{getPatientName(item)}</Text>
            <Text style={styles.recentTime}>{formatDate(item.created_at)}</Text>
          </View>

          <ChevronRight
            size={20}
            color={COLORS.text}
            strokeWidth={1.5}
            style={{ opacity: 0.4 }}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: SPACING.sm },

  recentItem: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recentName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },

  recentTime: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 12,
  },

  pressed: {
    backgroundColor: COLORS.background.tint,
  },
});
