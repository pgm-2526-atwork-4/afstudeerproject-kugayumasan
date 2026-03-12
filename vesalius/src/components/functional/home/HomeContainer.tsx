import { router } from "expo-router";

import HomeScreen from "@design/screens/HomeScreen";

import { useSession } from "@core/modules/session/session.context";
import { useHomeInteractions } from "@functional/home/useHomeInteractions";

export default function HomeContainer() {
  const { selectedInstitutionId, doctorId } = useSession();

  const { upcoming, recent, loading } = useHomeInteractions(
    selectedInstitutionId,
    doctorId,
  );

  return (
    <HomeScreen
      upcoming={upcoming}
      recent={recent}
      isLoading={loading}
      onNewInteraction={() => router.push("/(app)/(tabs)/record")}
      onViewAllInteractions={() => router.push("/(app)/(tabs)/interactions")}
      onViewInteraction={(id) => router.push(`/(app)/interactions/${id}`)}
    />
  );
}
