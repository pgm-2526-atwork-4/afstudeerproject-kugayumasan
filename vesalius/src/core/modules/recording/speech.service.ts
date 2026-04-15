import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export interface AzureHandlers {
  onRecognizing?: (text: string) => void;
  onRecognized?: (text: string) => void;
}

export function createAzureRecognizer(
  token: string,
  region: string,
  language: string,
  handlers: AzureHandlers,
) {
  console.log("INIT AZURE PUSH STREAM");

  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
    token,
    region,
  );

  speechConfig.speechRecognitionLanguage = language;

  // PUSH STREAM (BELANGRIJKSTE FIX)
  const pushStream = SpeechSDK.AudioInputStream.createPushStream(
    SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1),
  );

  const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  //  LIVE TEXT
  recognizer.recognizing = (_, e) => {
    if (e.result.text) {
      console.log("PARTIAL:", e.result.text);
      handlers.onRecognizing?.(e.result.text);
    }
  };

  // FINAL TEXT
  recognizer.recognized = (_, e) => {
    if (
      e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech &&
      e.result.text
    ) {
      console.log("FINAL:", e.result.text);
      handlers.onRecognized?.(e.result.text);
    }
  };

  recognizer.canceled = (_, e) => {
    console.error("AZURE ERROR:", e);
  };

  recognizer.sessionStarted = () => {
    console.log("SESSION STARTED");
  };

  recognizer.sessionStopped = () => {
    console.log("SESSION STOPPED");
  };

  return { recognizer, pushStream };
}
