import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";
import LoadingCard from "@design/ui/LoadingCard";
import EmptyState from "@design/ui/EmptyState";
import Card from "@design/ui/Card";

type Props = {
  title?: string;
  transcript?: string | null;
  defaultCollapsed?: boolean;
  isLoading?: boolean;
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
        <View style={styles.contentWrap}>
          {isLoading || transcript == null ? (
            <LoadingCard text="Transcript wordt gegenereerd..." />
          ) : transcript.trim().length > 0 ? (
            <Card style={styles.card}>
              <Text style={styles.body}>{transcript}</Text>
            </Card>
          ) : (
            <EmptyState text="Geen transcript beschikbaar." />
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

  contentWrap: {
    marginTop: SPACING.md,
  },

  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  body: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 20,
  },
});
