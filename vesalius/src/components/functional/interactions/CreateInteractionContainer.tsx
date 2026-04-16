import React, { useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";

import CreateInteractionScreen from "@design/screens/CreateInteractionScreen";

import { usePatientSearch } from "@functional/patients/usePatientSearch";
import { useStartRecording } from "@functional/recording/useStartRecording";

import type { Patient } from "@core/modules/patients/patients.types";

export default function CreateInteractionContainer() {
  const { patients, isLoading, error, searchPatients, clearResults } =
    usePatientSearch();

  const { startRecording } = useStartRecording();

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
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = query.trim();

      if (!trimmed) {
        clearResults();
        return;
      }

      debounceRef.current = setTimeout(() => {
        searchPatients(trimmed);
      }, 350);
    },
    [clearResults, searchPatients],
  );

  const handleStartRecording = useCallback(
    async (patient: Patient | null, isAnonymous: boolean) => {
      await startRecording(patient, isAnonymous);
    },
    [startRecording],
  );

  return (
    <CreateInteractionScreen
      initialSelectedPatient={initialSelectedPatient}
      patients={patients}
      isLoading={isLoading}
      error={error}
      onSearchPatients={handleSearchPatients}
      onStartRecording={handleStartRecording}
      onBack={() => router.replace("/(app)/(tabs)/home")}
      onCreatePatient={() =>
        router.push("/(app)/interactions/new/create-patient")
      }
    />
  );
}
