import { router } from "expo-router";
import { useSession } from "@core/modules/session/session.context";

import { conversationService } from "@core/modules/interactions/conversations.service";
import { createConsultation } from "@core/modules/recording/recording.service";

import {
  patientsService,
  createAnonymousPatientPayload,
} from "@core/modules/patients/patients.service";

import type { Patient } from "@core/modules/patients/patients.types";

export function useStartRecording() {
  const { selectedInstitutionId, doctorId } = useSession();

  async function startRecording(patient: Patient | null, isAnonymous: boolean) {
    try {
      if (!selectedInstitutionId || !doctorId) return;

      let patientId: string | undefined;

      if (isAnonymous) {
        const payload = createAnonymousPatientPayload(selectedInstitutionId);

        const anonPatient = await patientsService.create(
          selectedInstitutionId,
          payload,
        );

        patientId = anonPatient.id;
      } else {
        patientId = patient?.id;
      }

      if (!patientId) return;

      const conversation = await conversationService.create({
        patient_id: patientId,
        institution_id: selectedInstitutionId,
        doctor_id: doctorId,
        is_anonymous: isAnonymous,
      });

      await createConsultation(conversation.id);

      router.push(`/(app)/interactions/record/${conversation.id}`);
    } catch (e) {
      console.log("START RECORDING ERROR:", e);
    }
  }

  return { startRecording };
}
