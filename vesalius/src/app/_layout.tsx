import { Stack } from "expo-router";
import { SessionProvider } from "@core/modules/session/session.context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </SessionProvider>
  );
}
