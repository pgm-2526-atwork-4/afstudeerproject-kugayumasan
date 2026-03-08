import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import LoadingCard from "@design/ui/LoadingCard";
import Card from "@design/ui/Card";
import {
  tokenizeSummary,
  SummaryToken,
} from "@functional/interactions/summary.helpers";

type Props = {
  summary?: string | null;
  isLoading?: boolean;
  variant?: "summary" | "loading";
};

export default function SummaryBlock({
  summary,
  isLoading = false,
  variant = "summary",
}: Props) {
  const tokens = useMemo(() => {
    const s = summary ?? "";
    return tokenizeSummary(s);
  }, [summary]);

  if (isLoading || variant === "loading") {
    return <LoadingCard text="Samenvatting wordt gegenereerd..." />;
  }

  return (
    <Card variant="tint" style={styles.summaryCard}>
      {tokens.length === 0 ? (
        <Text style={styles.muted}>Nog geen samenvatting.</Text>
      ) : (
        tokens.map((t: SummaryToken, idx) => {
          if (t.type === "spacer") {
            return <View key={idx} style={{ height: SPACING.sm }} />;
          }

          if (t.type === "h3") {
            return (
              <Text key={idx} style={styles.h3}>
                {t.text}
              </Text>
            );
          }

          if (t.type === "bullet") {
            return (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.p}>{t.text}</Text>
              </View>
            );
          }

          return (
            <Text key={idx} style={styles.p}>
              {t.text}
            </Text>
          );
        })
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderColor: "rgba(32, 187, 192, 0.3)",
    gap: SPACING.xs,
  },

  h3: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },

  p: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 24,
  },

  muted: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  bulletRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "flex-start",
  },

  bulletDot: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.text,
    opacity: 0.9,
  },
});
