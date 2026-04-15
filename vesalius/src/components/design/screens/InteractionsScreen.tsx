import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";

import Screen from "@design/ui/ScreenLayout";
import ScreenHeader from "@design/ui/ScreenHeader";

import { Search, Plus } from "lucide-react-native";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

import InteractionCard, {
  InteractionCardModel,
} from "@design/interactions/InteractionCard";

import InteractionsPrimaryAction from "@design/interactions/InteractionsPrimaryAction";
import LoadingCard from "@design/ui/LoadingCard";
import EmptyState from "@design/ui/EmptyState";

type Props = {
  interactions?: InteractionCardModel[];
  isLoading?: boolean;
  error?: string | null;

  onSearch?: (query: string) => void;
  onDeleteInteraction: (id: string) => void;

  onNewInteraction: () => void;
  onViewInteraction: (id: string) => void;
};

export default function InteractionsScreen({
  interactions = [],
  isLoading = false,
  error = null,
  onSearch = () => {},
  onNewInteraction,
  onDeleteInteraction,
  onViewInteraction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  /* -------------------------- */

  const filtered = useMemo(() => interactions, [interactions]);

  function renderItem({ item }: { item: InteractionCardModel }) {
    return (
      <InteractionCard
        interaction={item}
        onPress={onViewInteraction}
        onDelete={onDeleteInteraction}
      />
    );
  }

  function renderContent() {
    if (isLoading) {
      return (
        <View style={styles.stateWrap}>
          <LoadingCard text="Interacties laden..." />
        </View>
      );
    }

    if (error) {
      return <EmptyState title="Er ging iets mis" description={error} />;
    }

    if (filtered.length === 0) {
      return (
        <EmptyState
          title="Geen interacties gevonden"
          description="Interacties verschijnen hier zodra ze bestaan."
        />
      );
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <Screen>
      <Pressable onPress={Keyboard.dismiss}>
        <ScreenHeader title={t("interactions.title")} />

        <View style={styles.controls}>
          <View style={styles.searchBox}>
            <Search
              size={18}
              strokeWidth={1.5}
              color={COLORS.text}
              style={{ opacity: 0.4 }}
            />

            <TextInput
              value={searchQuery}
              onChangeText={(value) => {
                setSearchQuery(value);
                onSearch(value);
              }}
              placeholder={t("interactions.searchPlaceholder")}
              placeholderTextColor={COLORS.placeholder}
              style={styles.searchInput}
            />
          </View>

          <InteractionsPrimaryAction
            title={t("interactions.newInteraction")}
            onPress={onNewInteraction}
            icon={
              <Plus
                size={18}
                strokeWidth={1.5}
                color={COLORS.background.white}
              />
            }
          />
        </View>
      </Pressable>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <LoadingCard text={t("interactions.loading")} />
        </View>
      ) : error ? (
        <EmptyState title={t("interactions.errorTitle")} description={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("interactions.emptyTitle")}
          description={t("interactions.emptyDescription")}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },

  searchBox: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },

  list: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },

  stateWrap: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: 48,
  },
});
