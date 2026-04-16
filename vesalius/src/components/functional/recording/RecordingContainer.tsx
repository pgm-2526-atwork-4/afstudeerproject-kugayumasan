import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";

import RecordingScreen from "@design/screens/RecordingScreen";

import {
  createTranscript,
  finalizeTranscript,
  sendTranscriptChunk,
  TranscriptSession,
  getConversation,
  getConsultation,
  createConsultation,
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
  const consultationIdRef = useRef<string | null>(null);

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

    if (t.endsWith(" en")) return "";

    if (!/[.!?]$/.test(t)) t += ".";

    return t;
  }

  /* -------------------------- */
  /* START RECORDING */
  /* -------------------------- */

  async function handleStartRecording() {
    if (isRecording) return;

    try {
      console.log("START RECORDING");

      setFinalText("");
      setInterimText("");
      setElapsed(0);

      // FIX: altijd geldige consultation
      let consultation = await getConsultation(conversationId);

      if (!consultation) {
        consultation = await createConsultation(conversationId);
      }

      consultationIdRef.current = consultation.id;

      const transcript = await createTranscript(consultation.id);
      transcriptRef.current = transcript;

      console.log("TRANSCRIPT CREATED:", transcript.id);

      const { token, region } = await http.get<any>("/azure/speech-token");

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

      recognizer.recognizing = (_, event) => {
        if (event.result.text) {
          setInterimText(event.result.text);
        }
      };

      recognizer.recognized = async (_, event) => {
        if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const raw = event.result.text;
          if (!raw) return;

          const text = formatSentence(raw);
          if (!text) return;

          setFinalText((prev) =>
            !prev ? text : prev.includes(text) ? prev : prev + " " + text,
          );

          setInterimText("");

          if (consultationIdRef.current && transcriptRef.current) {
            await sendTranscriptChunk(
              consultationIdRef.current,
              transcriptRef.current.id,
              text,
            );
          }
        }
      };

      recognizer.startContinuousRecognitionAsync();

      startAudioStream((chunk: Uint8Array) => {
        if (pushStreamRef.current) {
          try {
            pushStreamRef.current.write(chunk.buffer);
          } catch (e) {
            console.log("STREAM WRITE ERROR:", e);
          }
        }
      });

      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);
    } catch (e) {
      console.log(" START ERROR:", e);
    }
  }

  /* -------------------------- */
  /* STOP */
  /* -------------------------- */

  async function handleStopRecording() {
    if (!isRecording) return;

    try {
      console.log(" STOP RECORDING");

      if (!transcriptRef.current || !consultationIdRef.current) return;

      if (timerRef.current) clearInterval(timerRef.current);

      setIsRecording(false);

      recognizerRef.current?.stopContinuousRecognitionAsync(() => {
        recognizerRef.current?.close();
      });

      stopAudioStream();

      try {
        pushStreamRef.current?.close();
      } catch {}

      await new Promise((r) => setTimeout(r, 500));

      await finalizeTranscript(
        consultationIdRef.current,
        transcriptRef.current.id,
      );

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
