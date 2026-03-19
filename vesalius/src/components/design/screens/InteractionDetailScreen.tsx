import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { ArrowLeft, Mic } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import SummaryBlock from "@design/interactions/SummaryBlock";
import TranscriptCollapse from "@design/interactions/TranscriptCollapse";
import type {
  InteractionCardModel,
  InteractionStatus,
} from "@design/interactions/InteractionCard";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

type DetailInteraction = InteractionCardModel & {
  dateLabel: string;
  summary?: string | null;
  transcript?: string | null;
};

type Props = {
  interaction: DetailInteraction;
  onBack: () => void;
  onAddNotes: (interactionId: string) => void;
};

function getStatusColors(status: InteractionStatus) {
  switch (status) {
    case "Voltooid":
      return { bg: COLORS.successBg, text: COLORS.success };
    case "In afwachting":
      return { bg: COLORS.warnBg, text: COLORS.warn };
    case "Verwerking":
      return { bg: COLORS.infoBg, text: COLORS.info };
    case "Fout":
      return { bg: COLORS.errorBg, text: COLORS.error };
    default:
      return { bg: COLORS.background.tint, text: COLORS.text };
  }
}

export default function InteractionDetailScreen({
  interaction,
  onBack,
  onAddNotes,
}: Props) {
  const { t } = useTranslation();
  const statusColors = getStatusColors(interaction.status);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed ? styles.backBtn__pressed : null,
          ]}
        >
          <ArrowLeft size={20} strokeWidth={1.5} color={COLORS.text} />
          <Text style={styles.backText}>{t("interaction.back")}</Text>
        </Pressable>

        <View style={styles.headerMainRow}>
          <View style={styles.headerMainLeft}>
            <Text style={styles.headerTitle}>{interaction.patientName}</Text>
            <Text style={styles.headerSub}>{interaction.dateLabel}</Text>
          </View>

          <View
            style={[styles.statusPill, { backgroundColor: statusColors.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {interaction.status}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          <View>
            <Text style={styles.sectionTitle}>{t("interaction.summary")}</Text>

            <SummaryBlock
              summary={interaction.summary}
              isLoading={interaction.summary == null}
              variant={interaction.summary ? "summary" : "loading"}
            />

            <Button
              onPress={() => onAddNotes(interaction.id)}
              style={styles.addBtn}
              textStyle={styles.addBtnText}
              title={t("interaction.addNotes")}
              leftIcon={
                <Mic
                  size={20}
                  strokeWidth={1.5}
                  color={COLORS.background.white}
                />
              }
            />
          </View>

          <TranscriptCollapse
            title={t("interaction.transcript")}
            transcript={interaction.transcript ?? null}
            isLoading={interaction.transcript == null}
            defaultCollapsed
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background.white,
    gap: SPACING.md,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    alignSelf: "flex-start",
  },
  backBtn__pressed: {
    opacity: 0.6,
  },
  backText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },

  headerMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  headerMainLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  statusPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  stack: {
    gap: SPACING.xl,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  addBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  addBtnText: {
    color: COLORS.background.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
