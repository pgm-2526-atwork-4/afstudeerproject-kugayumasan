import "@core/modules/i18n";
import "react-native-get-random-values";

import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";
import { SessionProvider } from "@core/modules/session/session.context";
import { LanguageProvider } from "@core/modules/session/language.context";

// ✅ keep splash visible until we hide it manually
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // ⏳ simulate loading OR wait for real stuff (auth, i18n, etc.)
        await new Promise((resolve) => setTimeout(resolve, 800));

        // ✅ hide splash when ready
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log("Splash error:", e);
      }
    }

    prepare();
  }, []);

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
