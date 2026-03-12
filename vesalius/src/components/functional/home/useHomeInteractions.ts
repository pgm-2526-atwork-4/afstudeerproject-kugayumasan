import { useEffect, useState } from "react";

import { interactionsService } from "@core/modules/interactions/interactions.service";
import type { Conversation } from "@core/modules/interactions/interactions.types";

export function useHomeInteractions(
  institutionId?: string | null,
  doctorId?: string | null,
) {
  const [upcoming, setUpcoming] = useState<Conversation | null>(null);
  const [recent, setRecent] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!institutionId) return;

    try {
      setLoading(true);

      const [upcomingRes, recentRes] = await Promise.all([
        interactionsService.getUpcomingInteraction(
          institutionId,
          doctorId ?? undefined,
        ),
        interactionsService.getRecentInteractions(
          institutionId,
          doctorId ?? undefined,
        ),
      ]);

      setUpcoming(upcomingRes);
      setRecent(recentRes);
    } catch (err) {
      console.error("useHomeInteractions error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!institutionId) return;
    load();
  }, [institutionId, doctorId]);

  return {
    upcoming,
    recent,
    loading,
    reload: load,
  };
}
