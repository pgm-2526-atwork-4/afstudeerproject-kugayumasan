import "@core/modules/i18n";
import "react-native-get-random-values";
import { Stack } from "expo-router";
import { SessionProvider } from "@core/modules/session/session.context";
import { LanguageProvider } from "@core/modules/session/language.context";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SessionProvider>
    </LanguageProvider>
  );
}
