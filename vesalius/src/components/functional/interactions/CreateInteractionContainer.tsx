import React, { useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import CreateInteractionScreen from "@design/screens/CreateInteractionScreen";
import { useSession } from "@core/modules/session/session.context";
import { usePatientSearch } from "@functional/patients/usePatientSearch";
import type { Patient } from "@core/modules/patients/patients.types";

export default function CreateInteractionContainer() {
  const { selectedInstitutionId } = useSession();
  const { patients, isLoading, error, searchPatients, clearResults } =
    usePatientSearch();

  const params = useLocalSearchParams<{
    selectedPatientId?: string;
    selectedPatientName?: string;
  }>();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialSelectedPatient: Patient | null =
    params.selectedPatientId && params.selectedPatientName
      ? {
          id: String(params.selectedPatientId),
          first_name: String(params.selectedPatientName),
          last_name: null,
          email: null,
          phone: null,
          birthdate: null,
          social_security_number: null,
          gender: null,
          roles: [],
        }
      : null;

  const handleSearchPatients = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const trimmed = query.trim();

      if (!trimmed) {
        clearResults();
        return;
      }

      debounceRef.current = setTimeout(() => {
        if (!selectedInstitutionId) {
          console.log("No selectedInstitutionId");
          return;
        }

        searchPatients(selectedInstitutionId, trimmed);
      }, 350);
    },
    [clearResults, searchPatients, selectedInstitutionId],
  );

  const handleStartRecording = useCallback(
    (patient: Patient | null, isAnonymous: boolean) => {
      if (isAnonymous) {
        router.push("/(app)/interactions/record/anonymous");
        return;
      }

      if (!patient) return;

      router.push({
        pathname: "/(app)/interactions/record/selected",
        params: {
          patientId: patient.id,
          patientName: [patient.first_name, patient.last_name]
            .filter(Boolean)
            .join(" ")
            .trim(),
        },
      });
    },
    [],
  );

  return (
    <CreateInteractionScreen
      initialSelectedPatient={initialSelectedPatient}
      patients={patients}
      isLoading={isLoading}
      error={error}
      onSearchPatients={handleSearchPatients}
      onStartRecording={handleStartRecording}
      onBack={() => {
        router.replace("/(app)/(tabs)/home");
      }}
      onCreatePatient={() => {
        router.push("/(app)/interactions/new/create-patient");
      }}
    />
  );
}
