import { useCallback, useState } from "react";
import { patientsService } from "@core/modules/patients/patients.service";
import { useSession } from "@core/modules/session/session.context";
import type { Patient } from "@core/modules/patients/patients.types";

type UsePatientSearchResult = {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  searchPatients: (query: string) => Promise<void>;
  clearResults: () => void;
};

export function usePatientSearch(): UsePatientSearchResult {
  const { selectedInstitutionId } = useSession();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatients = useCallback(
    async (query: string) => {
      if (!selectedInstitutionId) {
        setError("Geen instelling geselecteerd.");
        setPatients([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const trimmedQuery = query.trim();

        const response = await patientsService.search({
          institutionId: selectedInstitutionId,
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
    [selectedInstitutionId],
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
