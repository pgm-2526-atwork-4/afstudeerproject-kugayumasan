import { useRef, useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

import { createSpeechRecognizer } from "@core/modules/recording/speech.service";
import {
  createChatSocket,
  sendTranscriptChunk,
} from "@core/modules/recording/websocket.service";

import { getConversation } from "@core/modules/recording/recording.service";

export function useRecording(
  conversationId: string,
  token: string,
  region: string,
  language: string,
) {
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    if (recognizerRef.current) return;

    try {
      const conversation = await getConversation(conversationId);

      if (!conversation.chat_url) {
        console.error("No chat_url available");
        return;
      }

      const socket = createChatSocket(conversation.chat_url, token, {
        onOpen: () => {
          console.log("CHAT SOCKET READY");
        },
      });

      socketRef.current = socket;

      const recognizer = createSpeechRecognizer(token, region, language, {
        onRecognized: (text) => {
          console.log("TRANSCRIPT CHUNK:", text);

          if (socketRef.current) {
            sendTranscriptChunk(socketRef.current, text);
          }
        },
      });

      recognizer.startContinuousRecognitionAsync();

      recognizerRef.current = recognizer;
      setIsRecording(true);
    } catch (err) {
      console.error("Start recording failed", err);
    }
  }

  function stopRecording() {
    if (!recognizerRef.current) return;

    recognizerRef.current.stopContinuousRecognitionAsync(() => {
      recognizerRef.current?.close();
      recognizerRef.current = null;

      socketRef.current?.close();
      socketRef.current = null;

      setIsRecording(false);
    });
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
