import { router, useLocalSearchParams } from "expo-router";
import RecordingScreen from "@design/screens/RecordingScreen";

export default function InteractionRecording() {
  const { interactionId } = useLocalSearchParams<{
    interactionId: string;
  }>();

  return (
    <RecordingScreen
      patientName={
        interactionId === "anonymous"
          ? "Anonieme patiënt"
          : "Geselecteerde patiënt"
      }
      onBack={() => {
        router.back();
      }}
      onStopRecording={() => {
        // later: audio stoppen + upload starten
        // temp: simulate success -> go to feedback
        router.replace({
          pathname: `/(app)/interactions/feedback/${interactionId}`,
          params: { status: "success" }, // change to "error" to test
        });
      }}
    />
  );
}
