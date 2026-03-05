import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

type Props = {
  title?: string;
  transcript?: string | null;
  defaultCollapsed?: boolean;
  isLoading?: boolean;
};

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
};

export default function TranscriptCollapse({
  title = "Transcript",
  transcript,
  defaultCollapsed = true,
  isLoading = false,
}: Props) {
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  return (
    <View>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={({ pressed }) => [
          styles.row,
          pressed ? styles.row__pressed : null,
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} strokeWidth={1.5} color={COLORS.text} />
        ) : (
          <ChevronDown size={20} strokeWidth={1.5} color={COLORS.text} />
        )}
      </Pressable>

      {expanded ? (
        <View style={{ marginTop: 12 }}>
          {isLoading || transcript == null ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingIcon}>⟳</Text>
              <Text style={styles.loadingText}>
                Transcript wordt gegenereerd...
              </Text>
            </View>
          ) : transcript.trim().length > 0 ? (
            <View style={styles.card}>
              <Text style={styles.body}>{transcript}</Text>
            </View>
          ) : (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>
                Geen transcript beschikbaar.
              </Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row__pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 16,
  },
  body: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 20,
  },

  loadingCard: {
    backgroundColor: COLORS.bgTint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingIcon: {
    fontSize: 22,
    color: COLORS.primary,
    opacity: 0.9,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: "center",
  },
});
