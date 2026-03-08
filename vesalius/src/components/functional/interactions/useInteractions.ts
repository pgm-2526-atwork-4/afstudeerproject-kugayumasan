import { useCallback, useState } from "react";
import { interactionsService } from "@core/modules/interactions/interactions.service";
import type { ConversationListItem } from "@core/modules/interactions/interactions.types";

type UseInteractionsResult = {
  interactions: ConversationListItem[];
  isLoading: boolean;
  error: string | null;
  loadInteractions: (institutionId: string) => Promise<void>;
  searchInteractions: (institutionId: string, query: string) => Promise<void>;
};

export function useInteractions(): UseInteractionsResult {
  const [interactions, setInteractions] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInteractions = useCallback(async (institutionId: string) => {
    if (!institutionId) {
      setError("Geen instelling geselecteerd.");
      setInteractions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await interactionsService.list({
        institution: institutionId,
        page: 1,
        page_size: 20,
        sort: "-created_at",
      });

      setInteractions(response.data);
    } catch (err) {
      console.error("Load interactions failed", err);
      setError("Interacties laden mislukt.");
      setInteractions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchInteractions = useCallback(
    async (institutionId: string, query: string) => {
      if (!institutionId) {
        setError("Geen instelling geselecteerd.");
        setInteractions([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const trimmed = query.trim();

        const response = await interactionsService.list({
          institution: institutionId,
          page: 1,
          page_size: 20,
          sort: "-created_at",
          patient: trimmed || undefined,
        });

        setInteractions(response.data);
      } catch (err) {
        console.error("Search interactions failed", err);
        setError("Interacties zoeken mislukt.");
        setInteractions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    interactions,
    isLoading,
    error,
    loadInteractions,
    searchInteractions,
  };
}
