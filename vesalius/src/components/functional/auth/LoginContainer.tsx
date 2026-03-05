import React, { useState } from "react";
import { router } from "expo-router";
import LoginScreen from "@design/screens/LoginScreen";

import { authService } from "@core/modules/auth/auth.service";
import {
  bootstrapSession,
  clearAllSession,
} from "@core/modules/session/session.bootstrap";
import { useSession } from "@core/modules/session/session.context";

export default function LoginContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setSession, setHydrated } = useSession();

  async function onLogin(username: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      await authService.login(username, password);

      const { me, selectedInstitutionId, doctorId } = await bootstrapSession();
      setSession({ me, selectedInstitutionId, doctorId });
      setHydrated(true);

      router.replace("/(app)");
    } catch (e: any) {
      await clearAllSession();
      setSession({ me: null, selectedInstitutionId: null, doctorId: null });
      setHydrated(true);
      setError(e?.message ?? "Login mislukt");
    } finally {
      setLoading(false);
    }
  }

  return <LoginScreen onLogin={onLogin} loading={loading} error={error} />;
}
