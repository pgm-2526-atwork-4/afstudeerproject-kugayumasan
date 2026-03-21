import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export interface SpeechHandlers {
  onRecognized: (text: string) => void;
}

export function createSpeechRecognizer(
  token: string,
  region: string,
  language: string,
  handlers: SpeechHandlers,
): SpeechSDK.SpeechRecognizer {
  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
    token,
    region,
  );

  speechConfig.speechRecognitionLanguage = language;

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognized = (_, event) => {
    if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
      const text = event.result.text;

      if (text && text.trim().length > 0) {
        handlers.onRecognized(text);
      }
    }
  };

  recognizer.canceled = (_, event) => {
    console.error("Speech canceled", event);
  };

  recognizer.sessionStopped = () => {
    console.log("Speech session stopped");
  };

  return recognizer;
}
