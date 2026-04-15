import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";

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

import {
  startAudioStream,
  stopAudioStream,
} from "@core/modules/recording/audio.service";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { http } from "@core/network/http";

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

  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const pushStreamRef = useRef<any>(null);

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
  /* FORMAT */
  /* -------------------------- */

  function formatSentence(text: string) {
    let t = text.trim();
    if (!t) return "";

    t = t.charAt(0).toUpperCase() + t.slice(1);

    // skip halve zinnen zoals "en"
    if (t.endsWith(" en")) {
      return "";
    }

    if (!/[.!?]$/.test(t)) {
      t += ".";
    }

    return t;
  }

  /* -------------------------- */
  /* START RECORDING */
  /* -------------------------- */

  async function handleStartRecording() {
    try {
      console.log("START RECORDING");

      setFinalText("");
      setInterimText("");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);

      const transcript = await createTranscript(conversationId);
      transcriptRef.current = transcript;

      console.log("TRANSCRIPT CREATED:", transcript.id);

      const { token, region } = await http.get<any>("/azure/speech-token");

      console.log("TOKEN OK:", region);

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        token,
        region,
      );

      speechConfig.speechRecognitionLanguage = "nl-BE";

      const format = SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);

      const pushStream = SpeechSDK.AudioInputStream.createPushStream(format);
      pushStreamRef.current = pushStream;

      const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

      const recognizer = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig,
      );

      recognizerRef.current = recognizer;

      /* INTERIM */
      recognizer.recognizing = (_, event) => {
        const text = event.result.text;
        if (text) {
          setInterimText(text);
        }
      };

      /* FINAL */
      recognizer.recognized = async (_, event) => {
        if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const raw = event.result.text;
          if (!raw) return;

          const text = formatSentence(raw);
          if (!text) return; // skip invalid zinnen

          console.log("🟢 FINAL:", text);

          setFinalText((prev) => {
            if (!prev) return text;
            if (prev.includes(text)) return prev;
            return prev.trim() + " " + text;
          });

          setInterimText("");

          try {
            await sendTranscriptChunk(
              conversationId,
              transcriptRef.current!.id,
              text,
            );
          } catch (e) {
            console.log(" send error:", e);
          }
        }
      };

      recognizer.startContinuousRecognitionAsync();

      console.log("🚀 SESSION STARTED");

      /* 🎧 AUDIO STREAM */
      startAudioStream((chunk: Uint8Array) => {
        const safeBuffer = new Uint8Array(chunk).buffer;
        pushStream.write(safeBuffer);
      });
    } catch (e) {
      console.log(" START ERROR:", e);
    }
  }

  /* -------------------------- */
  /* STOP */
  /* -------------------------- */

  async function handleStopRecording() {
    try {
      console.log(" STOP RECORDING");

      if (!transcriptRef.current) return;

      if (timerRef.current) clearInterval(timerRef.current);

      setIsRecording(false);

      //  FIX: eerst Azure stoppen
      recognizerRef.current?.stopContinuousRecognitionAsync(() => {
        recognizerRef.current?.close();
      });

      //  daarna audio stream stoppen
      stopAudioStream();

      pushStreamRef.current?.close();

      await new Promise((r) => setTimeout(r, 500));

      await finalizeTranscript(conversationId, transcriptRef.current.id);

      console.log("✅ FINALIZED");

      router.replace({
        pathname: `/(app)/interactions/feedback/${conversationId}`,
        params: { status: "success" },
      });
    } catch (e) {
      console.log(" STOP ERROR:", e);
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
      console.log("cancel error:", e);
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
      liveText={`${finalText}${interimText ? " " + interimText : ""}`}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={handleCancel}
    />
  );
}
