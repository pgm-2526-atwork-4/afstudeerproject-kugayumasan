import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

import RecordingScreen from "@design/screens/RecordingScreen";

import {
  createTranscript,
  finalizeTranscript,
  sendTranscriptChunk,
  TranscriptSession,
  getConversation,
} from "@core/modules/recording/recording.service";

import { deleteInteraction } from "@core/modules/interactions/interactions.service";
import { getPatientName } from "@functional/patients/patient.helpers";

type Props = {
  conversationId: string;
  patient?: any;
};

export default function RecordingContainer({ conversationId, patient }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");

  const [patientName, setPatientName] = useState("Anoniem");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<TranscriptSession | null>(null);

  const lastSentTextRef = useRef("");

  /* -------------------------- */
  /* 🔥 PERMISSION */
  /* -------------------------- */

  async function requestSpeechPermission() {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

    console.log("🎤 PERMISSION:", result);

    return result.granted;
  }

  /* -------------------------- */
  /* LOAD PATIENT */
  /* -------------------------- */

  useEffect(() => {
    async function loadPatient() {
      try {
        if (patient) {
          setPatientName(getPatientName(patient));
          return;
        }

        const convo = await getConversation(conversationId);

        if (convo.patient) {
          setPatientName(getPatientName(convo.patient as any));
        }
      } catch {
        setPatientName("Anoniem");
      }
    }

    loadPatient();
  }, [conversationId, patient]);

  /* -------------------------- */
  /* SPEECH EVENTS */
  /* -------------------------- */

  useEffect(() => {
    const onResult = async (event: any) => {
      let text = "";

      if (event?.value && Array.isArray(event.value)) {
        text = event.value[0];
      } else if (event?.results?.[0]) {
        text = event.results[0]?.transcript || "";
      } else if (event?.transcript) {
        text = event.transcript;
      }

      if (!text || !transcriptRef.current) return;

      console.log("📝 TEXT:", text);

      setInterimText(text);

      const previous = lastSentTextRef.current;

      if (!text.startsWith(previous)) {
        lastSentTextRef.current = text;
        return;
      }

      const diff = text.slice(previous.length).trim();

      if (!diff) return;

      lastSentTextRef.current = text;

      try {
        await sendTranscriptChunk(
          conversationId,
          transcriptRef.current.id,
          diff,
        );
      } catch (e) {
        console.log("❌ send diff error:", e);
      }
    };

    (ExpoSpeechRecognitionModule as any).addListener("result", onResult);

    return () => {
      (ExpoSpeechRecognitionModule as any).removeAllListeners("result");
    };
  }, []);

  /* -------------------------- */
  /* START */
  /* -------------------------- */

  async function handleStartRecording() {
    try {
      const granted = await requestSpeechPermission();

      if (!granted) {
        console.log("❌ Microphone permission denied");
        return;
      }

      setFinalText("");
      setInterimText("");
      setElapsed(0);
      lastSentTextRef.current = "";

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);

      const transcript = await createTranscript(conversationId);
      transcriptRef.current = transcript;

      console.log("🎤 STARTING SPEECH...");

      ExpoSpeechRecognitionModule.start({
        lang: "nl-NL",
        continuous: true,
        interimResults: true,
      });
    } catch (e) {
      console.log("❌ start error:", e);
    }
  }

  /* -------------------------- */
  /* STOP */
  /* -------------------------- */

  async function handleStopRecording() {
    try {
      if (!transcriptRef.current) return;

      if (timerRef.current) clearInterval(timerRef.current);

      setIsRecording(false);

      ExpoSpeechRecognitionModule.stop();

      // 🔥 BELANGRIJK → wacht op laatste speech event
      await new Promise((r) => setTimeout(r, 500));

      await finalizeTranscript(conversationId, transcriptRef.current.id);

      router.replace({
        pathname: `/(app)/interactions/feedback/${conversationId}`,
        params: { status: "success" },
      });
    } catch (e) {
      console.log("❌ stop error:", e);
    }
  }

  /* -------------------------- */
  /* CANCEL */
  /* -------------------------- */

  async function handleCancel() {
    try {
      if (!isRecording) {
        await deleteInteraction(conversationId);
      }
    } catch (e) {
      console.log("❌ cancel error:", e);
    }

    router.back();
  }

  /* -------------------------- */
  /* RENDER */
  /* -------------------------- */

  return (
    <RecordingScreen
      patientName={patientName}
      isRecording={isRecording}
      elapsed={elapsed}
      liveText={interimText}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={handleCancel}
    />
  );
}
