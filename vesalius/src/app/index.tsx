import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import {
  bootstrapSession,
  clearAllSession,
} from "@core/modules/session/session.bootstrap";
import { useSession } from "@core/modules/session/session.context";

export default function BootstrapRoute() {
  const { setSession, setHydrated } = useSession();

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const { me, selectedInstitutionId, doctorId } =
          await bootstrapSession();
        if (!mounted) return;

        setSession({ me, selectedInstitutionId, doctorId });
        setHydrated(true);

        if (me) {
          router.replace("/(app)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch {
        await clearAllSession();
        if (!mounted) return;

        setSession({ me: null, selectedInstitutionId: null, doctorId: null });
        setHydrated(true);
        router.replace("/(auth)/login");
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, [setSession, setHydrated]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
