import { useLocalSearchParams } from "expo-router";
import RecordingContainer from "@functional/recording/RecordingContainer";

export default function InteractionRecording() {
  const { interactionId } = useLocalSearchParams<{
    interactionId: string;
  }>();

  if (!interactionId) return null;

  return (
    <RecordingContainer conversationId={interactionId}/>
  );
}
