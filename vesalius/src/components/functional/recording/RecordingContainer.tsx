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

  /* --------------------------
     SPEECH EVENTS
  -------------------------- */

  useEffect(() => {
    const onResult = async (event: any) => {
      const text = event?.results?.[0]?.transcript;

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

    const onError = (event: any) => {
      console.error("Speech error:", event);
    };

    // Register listeners
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
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start audio recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await recording.startAsync();
      recordingRef.current = recording;

      // Timer
      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);

      // Create transcript session
      const transcript = await createTranscript(conversationId);
      transcriptRef.current = transcript;

      // Start speech recognition
      ExpoSpeechRecognitionModule.start({
        lang: "nl-BE",
        continuous: true,
        interimResults: true,
      });
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

      // Stop audio recording
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;

      setIsRecording(false);

      // Stop speech recognition
      ExpoSpeechRecognitionModule.stop();

      // Finalize transcript
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
