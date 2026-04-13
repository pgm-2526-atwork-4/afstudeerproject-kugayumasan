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

  // ✅ FIX: split final + interim text
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");

  const [patientName, setPatientName] = useState("Anoniem");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<TranscriptSession | null>(null);

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
  /* SPEECH EVENTS (FIXED) */
  /* -------------------------- */

  useEffect(() => {
    const onResult = async (event: any) => {
      const result = event?.results?.[0];

      if (!result || !transcriptRef.current) return;

      const text = result?.transcript || event?.value?.[0] || event?.transcript;

      const isFinal = result?.isFinal || event?.isFinal || false;

      if (!text || text.trim().length === 0) return;

      if (isFinal) {
        // ✅ FINAL TEXT → append once
        setFinalText((prev) => (prev ? prev + " " + text : text));
        setInterimText("");

        try {
          await sendTranscriptChunk(
            conversationId,
            transcriptRef.current.id,
            text,
          );
        } catch {}
      } else {
        // 🟡 INTERIM TEXT → live preview
        setInterimText(text);
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
      // ✅ RESET TEXT
      setFinalText("");
      setInterimText("");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);

      const transcript = await createTranscript(conversationId);
      transcriptRef.current = transcript;

      ExpoSpeechRecognitionModule.start({
        lang: "nl-NL", // ✅ better accuracy
        continuous: true,
        interimResults: true,
      });
    } catch {}
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

      await finalizeTranscript(conversationId, transcriptRef.current.id);

      router.replace({
        pathname: `/(app)/interactions/feedback/${conversationId}`,
        params: { status: "success" },
      });
    } catch {}
  }

  /* -------------------------- */
  /* CANCEL */
  /* -------------------------- */

  async function handleCancel() {
    try {
      if (!isRecording) {
        await deleteInteraction(conversationId);
      }
    } catch {}

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
      // ✅ combine final + interim text
      liveText={`${finalText} ${interimText}`}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={handleCancel}
    />
  );
}
