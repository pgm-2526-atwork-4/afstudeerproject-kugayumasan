import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

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
  const lastChunkRef = useRef<string>("");

  /* --------------------------
     SPEECH EVENTS
  -------------------------- */

  useEffect(() => {
    const onResult = async (event: any) => {
      // ROBUST pars
      const text =
        event?.results?.[0]?.transcript ||
        event?.value?.[0] ||
        event?.transcript;

      if (__DEV__) console.log("TEXT:", text);

      if (!text || !transcriptRef.current) return;

      // skip duplicates
      if (text === lastChunkRef.current) return;
      lastChunkRef.current = text;

      // append live text
      setLiveText((prev) =>
        prev.endsWith(text) ? prev : prev ? prev + " " + text : text,
      );

      try {
        await sendTranscriptChunk(
          conversationId,
          transcriptRef.current.id,
          text,
        );
      } catch {}
    };

    const onError = (event: any) => {
      if (__DEV__) console.log("Speech error:", event);
    };

    (ExpoSpeechRecognitionModule as any).addListener("result", onResult);
    (ExpoSpeechRecognitionModule as any).addListener("error", onError);

    return () => {
      (ExpoSpeechRecognitionModule as any).removeAllListeners("result");
      (ExpoSpeechRecognitionModule as any).removeAllListeners("error");
    };
  }, []);

  /* --------------------------
     START
  -------------------------- */

  async function handleStartRecording() {
    try {
      setLiveText("");
      setElapsed(0);
      lastChunkRef.current = "";

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

      ExpoSpeechRecognitionModule.start({
        lang: "nl-BE",
        continuous: true,
        interimResults: true,
      });
    } catch {}
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

      ExpoSpeechRecognitionModule.stop();

      await finalizeTranscript(conversationId, transcriptRef.current.id);

      router.replace({
        pathname: `/(app)/interactions/feedback/${conversationId}`,
        params: { status: "success" },
      });
    } catch {}
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
