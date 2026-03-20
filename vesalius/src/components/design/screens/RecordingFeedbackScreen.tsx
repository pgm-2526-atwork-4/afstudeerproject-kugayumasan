import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";

import { CheckCircle2, XCircle } from "lucide-react-native";

import { COLORS } from "@style/colors";

type Props = {
  status: "success" | "error";
  onGoBack: () => void;
  onRetry?: () => void;
  onGoToInteraction?: () => void;
};

export default function RecordingFeedbackScreen({
  status,
  onGoBack,
  onRetry,
  onGoToInteraction,
}: Props) {
  useEffect(() => {
    if (status === "success" && onGoToInteraction) {
      const timer = setTimeout(() => onGoToInteraction(), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onGoToInteraction]);

  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (status !== "success") return;

    const pulse = (v: Animated.Value, delayMs: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delayMs),
          Animated.timing(v, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0.3,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = pulse(d1, 0);
    const a2 = pulse(d2, 150);
    const a3 = pulse(d3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();

      d1.setValue(0.3);
      d2.setValue(0.3);
      d3.setValue(0.3);
    };
  }, [status]);

  const isSuccess = status === "success";

  return (
    <Screen>
      <View style={styles.recordFeedback__content}>
        <View style={styles.recordFeedback__icon}>
          {isSuccess ? (
            <View
              style={[
                styles.recordFeedback__iconBox,
                styles["recordFeedback__iconBox--success"],
              ]}
            >
              <CheckCircle2
                size={64}
                strokeWidth={1.5}
                color={COLORS.success}
              />
            </View>
          ) : (
            <View
              style={[
                styles.recordFeedback__iconBox,
                styles["recordFeedback__iconBox--error"],
              ]}
            >
              <XCircle size={64} strokeWidth={1.5} color={COLORS.error} />
            </View>
          )}
        </View>

        <View style={styles.recordFeedback__message}>
          <Text style={styles.recordFeedback__title}>
            {isSuccess ? "Opname verzonden" : "Upload mislukt"}
          </Text>

          <Text style={styles.recordFeedback__subtitle}>
            {isSuccess
              ? "Verwerking gestart."
              : "Controleer je verbinding en probeer opnieuw."}
          </Text>
        </View>

        {isSuccess && (
          <View style={styles.recordFeedback__redirect}>
            <View style={styles.recordFeedback__dots}>
              <Animated.View
                style={[styles.recordFeedback__dot, { opacity: d1 }]}
              />
              <Animated.View
                style={[styles.recordFeedback__dot, { opacity: d2 }]}
              />
              <Animated.View
                style={[styles.recordFeedback__dot, { opacity: d3 }]}
              />
            </View>
          </View>
        )}
      </View>

      {!isSuccess && (
        <View style={styles.recordFeedback__footer}>
          <Button
            onPress={onRetry}
            style={styles.recordFeedback__primaryBtn}
            textStyle={styles.recordFeedback__primaryText}
            title="Opnieuw proberen"
          />

          <Button
            variant="outline"
            onPress={onGoBack}
            style={styles.recordFeedback__secondaryBtn}
            textStyle={styles.recordFeedback__secondaryText}
            title="Terug naar overzicht"
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  recordFeedback__content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  recordFeedback__icon: {
    marginBottom: 32,
  },

  recordFeedback__iconBox: {
    width: 96,
    height: 96,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  "recordFeedback__iconBox--success": {
    backgroundColor: COLORS.successBg,
  },

  "recordFeedback__iconBox--error": {
    backgroundColor: COLORS.errorBg,
  },

  recordFeedback__message: {
    alignItems: "center",
    maxWidth: 320,
  },

  recordFeedback__title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },

  recordFeedback__subtitle: {
    color: COLORS.text,
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  recordFeedback__redirect: {
    marginTop: 24,
  },

  recordFeedback__dots: {
    flexDirection: "row",
    gap: 8,
  },

  recordFeedback__dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  recordFeedback__footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },

  recordFeedback__primaryBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
  },

  recordFeedback__primaryText: {
    color: COLORS.background.white,
    fontSize: 14,
    fontWeight: "600",
  },

  recordFeedback__secondaryBtn: {
    width: "100%",
    height: 44,
    borderRadius: 15,
  },

  recordFeedback__secondaryText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "500",
  },
});
