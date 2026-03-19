import React, { useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";

import CreateInteractionScreen from "@design/screens/CreateInteractionScreen";

import { useSession } from "@core/modules/session/session.context";
import { usePatientSearch } from "@functional/patients/usePatientSearch";

import { conversationService } from "@core/modules/interactions/conversations.service";

import type { Patient } from "@core/modules/patients/patients.types";

export default function CreateInteractionContainer() {
  const { selectedInstitutionId, doctorId } = useSession();

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
      if (debounceRef.current) clearTimeout(debounceRef.current);

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
    async (patient: Patient | null) => {
      try {
        if (!selectedInstitutionId || !doctorId) {
          console.log("Missing institutionId or doctorId");
          return;
        }

        if (!patient?.id) {
          console.log("Patient must be selected");
          return;
        }

        const conversation = await conversationService.create({
          patient_id: patient.id,
          institution_id: selectedInstitutionId,
          doctor_id: doctorId,
        });

        router.push(`/(app)/interactions/record/${conversation.id}`);
      } catch (error) {
        console.error("Failed creating conversation", error);
      }
    },
    [selectedInstitutionId, doctorId],
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
