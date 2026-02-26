import { router, useLocalSearchParams } from "expo-router";
import CreateInteractionScreen from "@design/screens/CreateInteractionScreen";

export default function Record() {
  const { selectedPatientId, selectedPatientName } = useLocalSearchParams<{
    selectedPatientId?: string;
    selectedPatientName?: string;
  }>();

  return (
    <CreateInteractionScreen
      initialSelectedPatient={
        selectedPatientId && selectedPatientName
          ? { id: String(selectedPatientId), name: String(selectedPatientName) }
          : null
      }
      onStartRecording={(patientName, isAnonymous) => {
        // later: POST /interactions -> echte interactionId
        const interactionId = isAnonymous ? "anonymous" : "selected";
        router.push(`/(app)/interactions/record/${interactionId}`);
      }}
      onCreatePatient={() => {
        router.push("/(app)/interactions/new/create-patient");
      }}
      onBack={() => {
        router.replace("/(app)/(tabs)/home");
      }}
    />
  );
}