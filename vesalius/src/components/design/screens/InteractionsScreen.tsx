import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import Screen from "@design/ui/ScreenLayout";
import ScreenHeader from "@design/ui/ScreenHeader";
import { Search, SlidersHorizontal, Plus } from "lucide-react-native";
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
  onNewInteraction: () => void;
  onViewInteraction: (id: string) => void;
};

export default function InteractionsScreen({
  interactions = [],
  isLoading = false,
  error = null,
  onSearch = () => {},
  onNewInteraction,
  onViewInteraction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => interactions, [interactions]);

  return (
    <Screen>
      <Pressable onPress={Keyboard.dismiss}>
        <ScreenHeader title="Interacties">
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
              placeholder="Zoek op naam"
              placeholderTextColor={COLORS.placeholder}
              style={styles.searchInput}
            />
          </View>

          <InteractionsPrimaryAction
            title="Nieuwe interactie"
            onPress={onNewInteraction}
            icon={
              <Plus
                size={18}
                strokeWidth={1.5}
                color={COLORS.background.white}
              />
            }
          />
        </ScreenHeader>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {isLoading ? (
          <View style={styles.stateWrap}>
            <LoadingCard text="Interacties laden..." />
          </View>
        ) : error ? (
          <EmptyState text={error} />
        ) : filtered.length === 0 ? (
          <EmptyState text="Geen interacties gevonden" />
        ) : (
          filtered.map((item, idx) => {
            const isLast = idx === filtered.length - 1;
            return (
              <View key={item.id} style={isLast ? styles.lastItem : null}>
                <InteractionCard
                  interaction={item}
                  onPress={onViewInteraction}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  filterBtn: {
    height: 40,
    width: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtn__pressed: {
    opacity: 0.85,
  },

  list: {
    paddingVertical: 12,
  },

  lastItem: {
    marginBottom: 0,
  },

  stateWrap: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
});
