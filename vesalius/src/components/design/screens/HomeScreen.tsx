import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { Plus, Search, ChevronRight } from "lucide-react-native";

type Props = {
  onNewInteraction: () => void;
  onViewAllInteractions: () => void;
  onViewInteraction: (id: string) => void;
};

export default function HomeScreen({
  onNewInteraction,
  onViewAllInteractions,
  onViewInteraction,
}: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.sectionLabel}>SNELLE ACTIES</Text>

          <View style={styles.stack}>
            <Pressable
              onPress={onNewInteraction}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.actionIconBox}>
                <Plus size={20} color="#2A3A51" strokeWidth={1.5} />
              </View>
              <Text style={styles.actionText}>Nieuwe interactie</Text>
            </Pressable>

            <Pressable
              onPress={onViewAllInteractions}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.actionIconBox}>
                <Search size={20} color="#2A3A51" strokeWidth={1.5} />
              </View>
              <Text style={styles.actionText}>Zoek interactie</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>AANKOMENDE AFSPRAAK</Text>

          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Maria Rodriguez</Text>
                <Text style={styles.cardMuted}>Morgen om 10:30</Text>
              </View>
            </View>

            <Text style={styles.cardBody}>
              Follow-up consultatie hypertensie
            </Text>

            <Button
              title="Open"
              variant="outline"
              onPress={() => onViewInteraction("1")}
              style={{ width: "100%" }}
              textStyle={{ fontSize: 12, fontWeight: "600" }}
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>RECENT BEKEKEN</Text>

          <View style={styles.list}>
            {[
              { id: "2", name: "John Smith", time: "Gisteren om 14:20" },
              { id: "3", name: "Sarah Williams", time: "2 dagen geleden" },
              { id: "4", name: "Anoniem", time: "3 dagen geleden" },
            ].map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onViewInteraction(item.id)}
                style={({ pressed }) => [
                  styles.recentItem,
                  pressed && styles.pressed,
                ]}
              >
                <View>
                  <Text style={styles.recentName}>{item.name}</Text>
                  <Text style={styles.recentTime}>{item.time}</Text>
                </View>
                <ChevronRight
                  size={20}
                  color="#2A3A51"
                  strokeWidth={1.5}
                  style={{ opacity: 0.4 }}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },

  sectionLabel: {
    color: COLORS.text,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: 12,
  },

  stack: { gap: 12 },

  actionBtn: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 15,
    backgroundColor: COLORS.bgTint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
  cardBody: {
    color: COLORS.text,
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 12,
  },

  list: { gap: 8 },
  recentItem: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
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
    backgroundColor: COLORS.bgTint,
  },
});
