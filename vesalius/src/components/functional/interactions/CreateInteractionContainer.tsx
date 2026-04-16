import React, { useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";

import CreateInteractionScreen from "@design/screens/CreateInteractionScreen";

import { useSession } from "@core/modules/session/session.context";
import { usePatientSearch } from "@functional/patients/usePatientSearch";

import { conversationService } from "@core/modules/interactions/conversations.service";

// 🔥 FIX: import toevoegen
import { createConsultation } from "@core/modules/recording/recording.service";

import type { Patient } from "@core/modules/patients/patients.types";

// DUMMY PATIENT
const ANONYMOUS_PATIENT_ID = "5e0fdaf0-4b58-4bb5-9e69-f934090856d4";

export default function CreateInteractionContainer() {
  const { selectedInstitutionId, doctorId } = useSession();

  const { patients, isLoading, error, searchPatients, clearResults } =
    usePatientSearch();

  const params = useLocalSearchParams<{
    selectedPatientId?: string;
    selectedPatientName?: string;
    conversationId?: string;
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
        if (!selectedInstitutionId) return;
        searchPatients(selectedInstitutionId, trimmed);
      }, 350);
    },
    [clearResults, searchPatients, selectedInstitutionId],
  );

  const handleStartRecording = useCallback(
    async (patient: Patient | null, isAnonymous: boolean) => {
      try {
        if (!selectedInstitutionId || !doctorId) return;

        let conversationId = params.conversationId;

        if (!conversationId) {
          const patientId = isAnonymous ? ANONYMOUS_PATIENT_ID : patient?.id;

          if (!patientId) return;

          const conversation = await conversationService.create({
            patient_id: patientId,
            institution_id: selectedInstitutionId,
            doctor_id: doctorId,
            is_anonymous: isAnonymous,
          });

          conversationId = conversation.id;

          // 🔥🔥🔥 HIER IS DE FIX (ZEER BELANGRIJK)
          await createConsultation(conversationId);
        }

        router.push(`/(app)/interactions/record/${conversationId}`);
      } catch (error) {
        console.error("Failed starting recording", error);
      }
    },
    [selectedInstitutionId, doctorId, params.conversationId],
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
