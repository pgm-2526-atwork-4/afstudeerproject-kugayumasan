import React, { createContext, useContext, useMemo, useState } from "react";
import type { SessionState } from "./session.types";
import { clearTokens } from "@core/modules/auth/auth.storage";
import { clearSession as clearSessionStorage } from "./session.storage";

type SessionContextValue = SessionState & {
  setSession: (next: Partial<Omit<SessionState, "isHydrated">>) => void;
  setHydrated: (v: boolean) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    me: null,
    selectedInstitutionId: null,
    doctorId: null,
    isHydrated: false,
  });

  const value = useMemo<SessionContextValue>(() => {
    return {
      ...state,

      setSession: (next) => {
        setState((prev) => ({
          ...prev,
          ...next, // ✅ comma fixed by proper object syntax
        }));
      },

      setHydrated: (v) => {
        setState((prev) => ({
          ...prev,
          isHydrated: v,
        }));
      },

      logout: async () => {
        await clearTokens();
        await clearSessionStorage();
        setState({
          me: null,
          selectedInstitutionId: null,
          doctorId: null,
          isHydrated: true,
        });
      },
    };
  }, [state]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside <SessionProvider />");
  }
  return ctx;
}
