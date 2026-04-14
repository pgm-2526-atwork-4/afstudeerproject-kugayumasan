import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@design/ui/button";
import EmptyState from "@design/ui/EmptyState";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

import type { Conversation } from "@core/modules/interactions/interactions.types";
import { useTranslation } from "react-i18next";

type Props = {
  upcoming?: Conversation | null;
  onOpen: (id: string) => void;
};

export default function UpcomingInteractionCard({ upcoming, onOpen }: Props) {
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

  if (!upcoming) {
    return (
      <EmptyState
        title={t("home.noUpcoming")}
        description={t("home.noUpcomingDescription")}
      />
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{getPatientName(upcoming)}</Text>
          <Text style={styles.cardMuted}>{formatDate(upcoming.due_date)}</Text>
        </View>
      </View>

      <Button
        title={t("common.open")}
        variant="outline"
        onPress={() => onOpen(upcoming.id)}
        style={{ width: "100%" }}
        textStyle={{ fontSize: 12, fontWeight: "600" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardMuted: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 12,
  },
});
