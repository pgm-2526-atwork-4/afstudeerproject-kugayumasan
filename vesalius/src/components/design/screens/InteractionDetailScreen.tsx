import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { ArrowLeft, Mic } from "lucide-react-native";

import SummaryBlock from "@design/interactions/SummaryBlock";
import TranscriptCollapse from "@design/interactions/TranscriptCollapse";
import type {
  InteractionCardModel,
  InteractionStatus,
} from "@design/interactions/InteractionCard";

type DetailInteraction = InteractionCardModel & {
  dateLabel: string; // “13 februari 2026 om 10:30”
  summary?: string | null;
  transcript?: string | null;
};

type Props = {
  interaction: DetailInteraction;
  onBack: () => void;
  onAddNotes: (interactionId: string) => void;
};

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",

  successBg: "#D1FAE5",
  success: "#37C18D",
  warnBg: "#FFF6EA",
  warn: "#F59E0C",
  infoBg: "#CCF0FF",
  info: "#0B759F",
  errorBg: "#FFEAEA",
  error: "#F50C0C",

  placeholder: "#9AA4B2",
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
      return { bg: COLORS.bgTint, text: COLORS.text };
  }
}

export default function InteractionDetailScreen({
  interaction,
  onBack,
  onAddNotes,
}: Props) {
  const statusColors = getStatusColors(interaction.status);

  return (
    <Screen>
      {/* Header (Figma-like) */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed ? styles.backBtn__pressed : null,
          ]}
        >
          <ArrowLeft size={20} strokeWidth={1.5} color={COLORS.text} />
          <Text style={styles.backText}>Terug</Text>
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

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          {/* Summary (always visible) */}
          <View>
            <Text style={styles.sectionTitle}>Samenvatting</Text>

            <SummaryBlock
              summary={interaction.summary}
              // when summary is null -> show “generating”
              isLoading={interaction.summary == null}
              variant={interaction.summary ? "summary" : "loading"}
            />

            <Button
              onPress={() => onAddNotes(interaction.id)}
              style={styles.addBtn}
              textStyle={styles.addBtnText}
              title="Notities aanvullen"
              leftIcon={
                <Mic size={20} strokeWidth={1.5} color={COLORS.white} />
              }
            />
          </View>

          {/* Transcript (collapsible) */}
          <TranscriptCollapse
            title="Transcript"
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    gap: 12,
  },
  headerMainLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  stack: {
    gap: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 12,
  },

  addBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
