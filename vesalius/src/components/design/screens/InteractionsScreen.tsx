import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { Search, SlidersHorizontal, Plus } from "lucide-react-native";

import InteractionCard, {
  InteractionCardModel,
} from "@design/interactions/InteractionCard";

type Props = {
  onNewInteraction: () => void;
  onViewInteraction: (id: string) => void;
};

const mockInteractions: InteractionCardModel[] = [
  {
    id: "1",
    patientName: "Maria Rodriguez",
    providerName: "Dr. James Chen",
    summary: "Follow-up consultatie hypertensie",
    status: "Voltooid",
    date: "Vandaag om 10:30",
  },
  {
    id: "2",
    patientName: "John Smith",
    providerName: "Dr. James Chen",
    summary: "Initiële consultatie chronische rugpijn",
    status: "In afwachting",
    date: "Vandaag om 14:20",
  },
  {
    id: "3",
    patientName: "Sarah Williams",
    providerName: "Dr. James Chen",
    summary: "Diabetes type 2 controle",
    status: "Voltooid",
    date: "Gisteren om 11:00",
  },
  {
    id: "4",
    patientName: "Anoniem",
    providerName: "Dr. James Chen",
    summary: "Psychiatrische consultatie",
    status: "Verwerking",
    date: "2 dagen geleden",
  },
];

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
  placeholder: "#9AA4B2",
};

function RNButtonRow({
  title,
  onPress,
  icon,
}: {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btnRow,
        pressed ? styles.btnRow__pressed : null,
      ]}
    >
      {icon ? <View style={styles.btnRow__icon}>{icon}</View> : null}
      <Text style={styles.btnRow__text}>{title}</Text>
    </Pressable>
  );
}

export default function InteractionsScreen({
  onNewInteraction,
  onViewInteraction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mockInteractions;
    return mockInteractions.filter(
      (i) =>
        i.patientName.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Screen>
      {/* header (tap outside input dismisses keyboard) */}
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Interacties</Text>

          <View style={styles.searchBox}>
            <Search
              size={18}
              strokeWidth={1.5}
              color={COLORS.text}
              style={{ opacity: 0.4 }}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Zoek op naam of samenvatting"
              placeholderTextColor={COLORS.placeholder}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.controls}>
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                styles.filterBtn,
                pressed ? styles.filterBtn__pressed : null,
              ]}
            >
              <SlidersHorizontal
                size={16}
                strokeWidth={1.5}
                color={COLORS.text}
                style={{ opacity: 0.9 }}
              />
              <Text style={styles.filterBtnText}>Filter</Text>
            </Pressable>
          </View>

          <RNButtonRow
            title="Nieuwe interactie"
            onPress={onNewInteraction}
            icon={<Plus size={18} strokeWidth={1.5} color={COLORS.white} />}
          />
        </View>
      </Pressable>

      {/* list */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Geen interacties gevonden</Text>
          </View>
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

      <View style={styles.footer}>
        <Button
          variant="ghost"
          onPress={() => {}}
          style={{ width: "100%" }}
          title=" "
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
  },

  searchBox: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterBtn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterBtn__pressed: {
    opacity: 0.85,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
  },

  btnRow: {
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnRow__pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  btnRow__icon: {
    marginTop: 1,
  },
  btnRow__text: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },

  list: {
    paddingVertical: 12,
  },
  lastItem: {
    // kleine hack: laatste divider weg
    // InteractionCard tekent borderBottom; we verbergen die op container niveau door padding
    marginBottom: 0,
  },

  emptyWrap: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
