import LiveAudioStream from "react-native-live-audio-stream";
import { Buffer } from "buffer";

type AudioCallback = (data: Uint8Array) => void;

let isRecording = false;

export function startAudioStream(onData: AudioCallback) {
  console.log("🎤 START AUDIO STREAM");

  LiveAudioStream.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    bufferSize: 4096,
    wavFile: "",
  } as any);

  LiveAudioStream.on("data", (data: string) => {
    try {
      const audioBuffer = Buffer.from(data, "base64");

      // FIX: direct Uint8Array was eig niet nodig 
      onData(new Uint8Array(audioBuffer));
    } catch (e) {
      console.log("AUDIO PARSE ERROR:", e);
    }
  });

  LiveAudioStream.start();
  isRecording = true;
}

export function stopAudioStream() {
  console.log("STOP AUDIO STREAM");

  if (isRecording) {
    LiveAudioStream.stop();
    isRecording = false;
  }
}