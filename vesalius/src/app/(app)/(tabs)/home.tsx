import { router } from "expo-router";
import HomeScreen from "@design/screens/HomeScreen";

export default function Home() {
  return (
    <HomeScreen
      onNewInteraction={() => {
        router.push("/(app)/(tabs)/record");
      }}
      onViewAllInteractions={() => {
        router.push("/(app)/(tabs)/interactions");
      }}
      onViewInteraction={(id) => {
        router.push(`/(app)/interactions/${id}`);
      }}
    />
  );
}