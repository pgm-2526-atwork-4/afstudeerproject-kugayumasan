import React, { useState, useRef } from "react";
import { router } from "expo-router";

import RecordingScreen from "@design/screens/RecordingScreen";

import { createSpeechRecognizer } from "@core/modules/recording/speech.service";
import {
  createChatSocket,
  sendTranscriptChunk,
} from "@core/modules/recording/websocket.service";
import { getConversation } from "@core/modules/recording/recording.service";
import { getTokens } from "@core/modules/auth/auth.storage";

import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const speechToken = "AZURE_TOKEN"; // later from backend
  const region = "westeurope";
  const language = "nl-BE";

  async function handleStartRecording() {
    try {
      const conversation = await getConversation(conversationId);

      if (!conversation.chat_url) {
        console.error("No chat_url available");
        return;
      }

      const tokens = await getTokens();

      if (!tokens?.accessToken) {
        console.error("No auth token available");
        return;
      }

      const authToken = tokens.accessToken;

      const socket = createChatSocket(conversation.chat_url, authToken, {
        onOpen: () => {
          console.log("CHAT SOCKET READY");
        },
        onMessage: (data) => {
          console.log("CHAT MESSAGE", data);
        },
      });

      socketRef.current = socket;

      const recognizer = createSpeechRecognizer(speechToken, region, language, {
        onRecognized: (text) => {
          console.log("TRANSCRIPT CHUNK:", text);

          if (socketRef.current) {
            sendTranscriptChunk(socketRef.current, text);
          }
        },
      });

      recognizer.startContinuousRecognitionAsync();

      recognizerRef.current = recognizer;

      timerRef.current = setInterval(() => {
        setElapsed((t) => t + 1);
      }, 1000);

      setIsRecording(true);
    } catch (err) {
      console.error("Failed starting recording", err);
    }
  }

  function handleStopRecording() {
    try {
      if (timerRef.current) clearInterval(timerRef.current);

      recognizerRef.current?.stopContinuousRecognitionAsync(() => {
        recognizerRef.current?.close();
        recognizerRef.current = null;
      });

      socketRef.current?.close();
      socketRef.current = null;

      setIsRecording(false);

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
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBack={() => router.back()}
    />
  );
}
