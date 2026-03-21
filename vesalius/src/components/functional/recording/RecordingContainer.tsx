import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import { Audio } from "expo-av";
import Voice from "@react-native-voice/voice";

import RecordingScreen from "@design/screens/RecordingScreen";

import {
  createTranscript,
  finalizeTranscript,
  sendTranscriptChunk,
  TranscriptSession,
} from "@core/modules/recording/recording.service";

type Props = {
  conversationId: string;
  patientName: string;
};

export default function RecordingContainer({
  conversationId,
  patientName,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveText, setLiveText] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<TranscriptSession | null>(null);

  /* --------------------------
     SPEECH EVENTS
  -------------------------- */

  useEffect(() => {
    Voice.onSpeechResults = async (event: any) => {
      const text = event.value?.[0];

      if (!text || !transcriptRef.current) return;

      console.log("LIVE TEXT:", text);

      setLiveText(text);

      try {
        await sendTranscriptChunk(
          conversationId,
          transcriptRef.current.id,
          text,
        );
      } catch (e) {
        console.error("Chunk send failed", e);
      }
    };

    Voice.onSpeechError = (e: any) => {
      console.error("Speech error", e);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  /* --------------------------
     START
  -------------------------- */

  async function handleStartRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      await recording.startAsync();

      recordingRef.current = recording;

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);

      const transcript = await createTranscript(conversationId);
      transcriptRef.current = transcript;

      /* 🔥 START SPEECH */
      await Voice.start("nl-BE");
    } catch (err) {
      console.error("Start recording failed", err);
    }
  }

  /* --------------------------
     STOP
  -------------------------- */

  async function handleStopRecording() {
    try {
      if (!recordingRef.current || !transcriptRef.current) return;

      if (timerRef.current) clearInterval(timerRef.current);

      await recordingRef.current.stopAndUnloadAsync();

      recordingRef.current = null;

      setIsRecording(false);

      /* 🔥 STOP SPEECH */
      await Voice.stop();

      /* FINALIZE */
      await finalizeTranscript(conversationId, transcriptRef.current.id);

      console.log("Recording complete");

      router.replace({
        pathname: `/(app)/interactions/feedback/${conversationId}`,
        params: { status: "success" },
      });
    } catch (err) {
      console.error("Stop recording failed", err);
    }
  }

  return (
    <RecordingScreen
      patientName={patientName}
      isRecording={isRecording}
      elapsed={elapsed}
      liveText={liveText}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={() => router.back()}
    />
  );
}
