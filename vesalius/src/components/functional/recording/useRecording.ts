import { useState } from "react";

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    setIsRecording(true);
    console.log("Recording started (local only)");
  }

  function stopRecording() {
    setIsRecording(false);
    console.log("Recording stopped");
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
