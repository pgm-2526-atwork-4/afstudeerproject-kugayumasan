import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  summary?: string | null;
  isLoading?: boolean;
  variant?: "summary" | "loading";
};

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
};

type Token =
  | { type: "h3"; text: string }
  | { type: "bullet"; text: string }
  | { type: "p"; text: string }
  | { type: "spacer" };

function tokenize(text: string): Token[] {
  const lines = text.split("\n");
  const out: Token[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim().length === 0) {
      out.push({ type: "spacer" });
      continue;
    }

    // **Header**
    if (line.startsWith("**") && line.includes("**", 2)) {
      const match = line.match(/\*\*(.*?)\*\*/);
      const headerText = match?.[1]?.trim();
      if (headerText) out.push({ type: "h3", text: headerText });
      continue;
    }

    // - bullet
    if (line.trimStart().startsWith("- ")) {
      out.push({ type: "bullet", text: line.trimStart().slice(2) });
      continue;
    }

    out.push({ type: "p", text: line });
  }

  return out;
}

export default function SummaryBlock({
  summary,
  isLoading = false,
  variant = "summary",
}: Props) {
  const tokens = useMemo(() => {
    const s = summary ?? "";
    return tokenize(s);
  }, [summary]);

  // Loading card like Figma (tint bg + border)
  if (isLoading || variant === "loading") {
    return (
      <View style={styles.loadingCard}>
        <Text style={styles.loadingIcon}>⟳</Text>
        <Text style={styles.loadingText}>
          Samenvatting wordt gegenereerd...
        </Text>
      </View>
    );
  }

  // Summary card (bgTint + teal border/30)
  return (
    <View style={styles.summaryCard}>
      {tokens.length === 0 ? (
        <Text style={styles.muted}>Nog geen samenvatting.</Text>
      ) : (
        tokens.map((t, idx) => {
          if (t.type === "spacer")
            return <View key={idx} style={{ height: 8 }} />;

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
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: COLORS.bgTint,
    borderWidth: 1,
    borderColor: "rgba(32, 187, 192, 0.3)", // #20BBC0 / 30%
    borderRadius: 15,
    padding: 16,
    gap: 6,
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

  h3: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: 10,
  },
  p: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 24, // ~1.7
  },
  muted: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bulletDot: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.text,
    opacity: 0.9,
  },
});
