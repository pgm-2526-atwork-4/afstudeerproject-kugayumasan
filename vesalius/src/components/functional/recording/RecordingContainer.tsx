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
  getConversation,
} from "@core/modules/recording/recording.service";

import { deleteInteraction } from "@core/modules/interactions/interactions.service"; // ✅ ADD

import { getPatientName } from "@functional/patients/patient.helpers";

type Props = {
  conversationId: string;
  patient?: any;
};

export default function RecordingContainer({ conversationId, patient }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveText, setLiveText] = useState("");
  const [patientName, setPatientName] = useState("Anoniem");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<TranscriptSession | null>(null);
  const lastChunkRef = useRef<string>("");

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
      const text =
        event?.results?.[0]?.transcript ||
        event?.value?.[0] ||
        event?.transcript;

      if (!text || !transcriptRef.current) return;

      if (text === lastChunkRef.current) return;
      lastChunkRef.current = text;

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

  /* -------------------------- */
  /* STOP */
  /* -------------------------- */

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

  /* -------------------------- */
  /* CANCEL (NEW) */
  /* -------------------------- */

  async function handleCancel() {
    try {
      if (!isRecording) {
        await deleteInteraction(conversationId); // dELETE EMPTY CONVo
      }
    } catch {}

    router.back();
  }

  return (
    <RecordingScreen
      patientName={patientName}
      isRecording={isRecording}
      elapsed={elapsed}
      liveText={liveText}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={handleCancel} // ✅ USE CANCEL
    />
  );
}
