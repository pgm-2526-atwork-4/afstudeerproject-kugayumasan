import { useCallback, useState } from "react";
import { patientsService } from "@core/modules/patients/patients.service";
import type { Patient } from "@core/modules/patients/patients.types";

type UsePatientSearchResult = {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  searchPatients: (institutionId: string, query: string) => Promise<void>;
  clearResults: () => void;
};

export function usePatientSearch(): UsePatientSearchResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatients = useCallback(
    async (institutionId: string, query: string) => {
      if (!institutionId) {
        setError("Geen instelling geselecteerd.");
        setPatients([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const trimmedQuery = query.trim();

        const response = await patientsService.search({
          institutionId,
          search: trimmedQuery || undefined,
          limit: 10,
        });

        setPatients(response);
      } catch (err) {
        console.error("Patient search failed", err);
        setError("Patiënten laden mislukt.");
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearResults = useCallback(() => {
    setPatients([]);
    setError(null);
  }, []);

  return {
    patients,
    isLoading,
    error,
    searchPatients,
    clearResults,
  };
}
