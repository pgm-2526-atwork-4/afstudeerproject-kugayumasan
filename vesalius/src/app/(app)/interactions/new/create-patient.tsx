import { router } from "expo-router";
import CreatePatientScreen from "@design/screens/CreatePatientScreen";

export default function CreatePatientRoute() {
  return (
    <CreatePatientScreen
      onCancel={() => router.back()}
      onSavePatient={(patient) => {
        router.replace({
          pathname: "/(app)/(tabs)/record",
          params: {
            selectedPatientId: patient.id,
            selectedPatientName: patient.name,
          },
        });
      }}
    />
  );
}