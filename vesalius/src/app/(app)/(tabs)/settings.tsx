import { router } from "expo-router";
import SettingsScreen from "@design/screens/SettingsScreen";

export default function Settings() {
  return (
    <SettingsScreen
      onLogout={() => {
        // later: auth cleanup (tokens, state, etc.)
        router.replace("/(auth)/login");
      }}
    />
  );
}