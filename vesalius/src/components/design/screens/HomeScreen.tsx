import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Plus, Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import Screen from "@design/ui/ScreenLayout";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

import UpcomingInteractionCard from "../home/UpcomingInteractionCard";
import RecentInteractionsList from "../home/RecentInteractionsList";

import type { Conversation } from "@core/modules/interactions/interactions.types";

type Props = {
  upcoming?: Conversation | null;
  recent?: Conversation[];
  isLoading?: boolean;

  onNewInteraction: () => void;
  onViewAllInteractions: () => void;
  onViewInteraction: (id: string) => void;
};

export default function HomeScreen({
  upcoming,
  recent = [],
  onNewInteraction,
  onViewAllInteractions,
  onViewInteraction,
}: Props) {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("home.title")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* QUICK ACTIONS */}

        <View>
          <Text style={styles.sectionLabel}>{t("home.quickActions")}</Text>

          <View style={styles.stack}>
            <Pressable
              onPress={onNewInteraction}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.actionIconBox}>
                <Plus size={20} color={COLORS.text} strokeWidth={1.5} />
              </View>

              <Text style={styles.actionText}>{t("home.newInteraction")}</Text>
            </Pressable>

            <Pressable
              onPress={onViewAllInteractions}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.actionIconBox}>
                <Search size={20} color={COLORS.text} strokeWidth={1.5} />
              </View>

              <Text style={styles.actionText}>
                {t("home.searchInteraction")}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* UPCOMING */}

        <View>
          <Text style={styles.sectionLabel}>{t("home.upcoming")}</Text>

          <UpcomingInteractionCard
            upcoming={upcoming}
            onOpen={onViewInteraction}
          />
        </View>

        {/* RECENT */}

        <View>
          <Text style={styles.sectionLabel}>{t("home.recent")}</Text>

          <RecentInteractionsList
            interactions={recent}
            onOpen={onViewInteraction}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },

  sectionLabel: {
    color: COLORS.text,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: SPACING.md,
  },

  stack: { gap: SPACING.md },

  actionBtn: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg,
  },

  actionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  pressed: {
    backgroundColor: COLORS.background.tint,
  },
});
