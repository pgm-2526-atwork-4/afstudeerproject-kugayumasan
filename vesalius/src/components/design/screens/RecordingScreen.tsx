import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";

import { Square, Mic } from "lucide-react-native";

import { COLORS } from "@style/colors";

type Props = {
  patientName: string;
  isRecording: boolean;
  elapsed: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onBack: () => void;
  liveText?: string;
};

export default function RecordingScreen({
  patientName,
  isRecording,
  elapsed,
  onStartRecording,
  onStopRecording,
  onBack,
  liveText,
}: Props) {
  const [waveformBars, setWaveformBars] = useState<number[]>(
    Array.from({ length: 30 }, () => Math.random()),
  );

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setWaveformBars((prev) => {
        const next = [...prev];

        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = Math.random();
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return;

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

    const a1 = pulse(dot1, 0);
    const a2 = pulse(dot2, 150);
    const a3 = pulse(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();

      dot1.setValue(0.3);
      dot2.setValue(0.3);
      dot3.setValue(0.3);
    };
  }, [isRecording]);

  const bars = useMemo(() => waveformBars, [waveformBars]);

  return (
    <Screen>
      <View style={styles.record__header}>
        <Text style={styles.record__title}>Opname</Text>
        <Text style={styles.record__subtitle}>{patientName}</Text>
      </View>

      <View style={styles.record__content}>
        <View style={styles.record__iconWrap}>
          <View
            style={[
              styles.record__iconBox,
              isRecording
                ? styles["record__iconBox--active"]
                : styles["record__iconBox--idle"],
            ]}
          >
            <Mic
              size={48}
              strokeWidth={1.5}
              color={isRecording ? COLORS.background.white : COLORS.text}
              style={{ opacity: isRecording ? 1 : 0.4 }}
            />
          </View>
        </View>

        <Text style={styles.record__timer}>{formatTime(elapsed)}</Text>

        {isRecording && (
          <View style={styles.record__waveform}>
            {bars.map((h, i) => (
              <View
                key={i}
                style={[styles.record__waveBar, { height: 12 + h * 48 }]}
              />
            ))}
          </View>
        )}

        {isRecording && (
          <View style={styles.record__status}>
            <View style={styles.record__dots}>
              <Animated.View style={[styles.record__dot, { opacity: dot1 }]} />
              <Animated.View style={[styles.record__dot, { opacity: dot2 }]} />
              <Animated.View style={[styles.record__dot, { opacity: dot3 }]} />
            </View>

            <Text style={styles.record__statusText}>
              Streaming naar Vesalius.ai...
            </Text>
          </View>
        )}
      </View>

      {isRecording && liveText ? (
        <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
          <Text style={{ color: COLORS.text, fontSize: 14 }}>{liveText}</Text>
        </View>
      ) : null}

      <View style={styles.record__footer}>
        {!isRecording ? (
          <>
            <Button
              onPress={onStartRecording}
              style={[styles.record__btn, styles["record__btn--start"]]}
            >
              <View style={styles.btnRow}>
                <Mic
                  size={20}
                  strokeWidth={1.5}
                  color={COLORS.background.white}
                  style={styles.iconFix}
                />
                <Text style={[styles.btnLabel, styles.btnLabelLight]}>
                  Start opname
                </Text>
              </View>
            </Button>

            <Button
              variant="outline"
              onPress={onBack}
              style={[styles.record__btn, styles["record__btn--secondary"]]}
              title="Annuleren"
              textStyle={styles.record__btnSecondaryText}
            />
          </>
        ) : (
          <Button
            variant="outline"
            onPress={onStopRecording}
            style={[styles.record__btn, styles["record__btn--stop"]]}
          >
            <View style={styles.btnRow}>
              <Square
                size={20}
                strokeWidth={1.5}
                color={COLORS.error}
                style={styles.iconFix}
              />
              <Text style={[styles.btnLabel, styles.btnLabelDanger]}>
                Stop opname
              </Text>
            </View>
          </Button>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  record__header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  record__title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 4,
  },
  record__subtitle: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 12,
  },

  record__content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  record__iconWrap: { marginBottom: 32 },
  record__iconBox: {
    width: 96,
    height: 96,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  "record__iconBox--active": { backgroundColor: COLORS.primary },
  "record__iconBox--idle": { backgroundColor: COLORS.border },

  record__timer: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: "400",
    letterSpacing: -0.5,
    marginBottom: 16,
    fontVariant: ["tabular-nums"],
  },

  record__waveform: {
    width: "100%",
    maxWidth: 320,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
    marginBottom: 24,
  },
  record__waveBar: {
    width: 4,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
  },

  record__status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: COLORS.background.tint,
  },
  record__dots: { flexDirection: "row", gap: 6 },
  record__dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  record__statusText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  record__footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },

  record__btn: { width: "100%", borderRadius: 15 },
  "record__btn--start": {
    height: 56,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  "record__btn--secondary": {
    height: 44,
    backgroundColor: COLORS.background.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  "record__btn--stop": {
    height: 56,
    backgroundColor: COLORS.background.white,
    borderWidth: 2,
    borderColor: COLORS.error,
  },

  record__btnSecondaryText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "500",
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconFix: {
    marginTop: 1,
  },

  btnLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },

  btnLabelLight: { color: COLORS.background.white },
  btnLabelDanger: { color: COLORS.error },
});
