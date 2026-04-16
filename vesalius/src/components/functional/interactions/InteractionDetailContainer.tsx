import React, { useEffect, useState } from "react";
import { router } from "expo-router";

import InteractionDetailScreen from "@design/screens/InteractionDetailScreen";

import {
  getConversation,
  getConsultation,
} from "@core/modules/recording/recording.service";

import { getPatientName } from "@functional/patients/patient.helpers";

import { subscribeToConversation } from "@core/modules/recording/realtime.service";
import { authService } from "@core/modules/auth/auth.service";

import type { InteractionCardModel } from "@design/interactions/InteractionCard";

type DetailInteraction = InteractionCardModel & {
  dateLabel: string;
  transcript?: string;
};

type Props = {
  interactionId: string;
};

export default function InteractionDetailContainer({ interactionId }: Props) {
  const [interaction, setInteraction] = useState<DetailInteraction | null>(
    null,
  );

  /* -------------------------- */
  /* LOAD INTERACTION */
  /* -------------------------- */

  async function loadInteraction() {
    try {
      const conversation = await getConversation(interactionId);

      const consultation = await getConsultation(interactionId);

      /* ---------- TRANSCRIPTS ---------- */

      const transcript =
        consultation && consultation.transcripts.length > 0
          ? consultation.transcripts
              .map((t, i) => `Opname ${i + 1}\n${t.transcript_text ?? ""}`)
              .join("\n\n---\n\n")
          : "";

      /* ---------- SUMMARY  ---------- */

      const summary =
        consultation?.consultation_notes ??
        conversation.consultation_notes ??
        (conversation.summary ? JSON.stringify(conversation.summary) : "");

      /* ---------- STATUS  ---------- */

      const status = consultation?.consultation_notes
        ? "Voltooid"
        : "Verwerking";

      setInteraction({
        id: interactionId,
        patientName: conversation.patient
          ? getPatientName(conversation.patient as any)
          : "Anoniem",
        providerName: "Arts",
        status,
        date: "Vandaag",
        dateLabel: "Vandaag",
        summary,
        transcript,
      });
    } catch {
      setInteraction({
        id: interactionId,
        patientName: "Anoniem",
        providerName: "Arts",
        status: "Fout",
        date: "Vandaag",
        dateLabel: "Vandaag",
        summary: "",
        transcript: "",
      });
    }
  }

  /* -------------------------- */
  /* INITIAL LOAD */
  /* -------------------------- */

  useEffect(() => {
    loadInteraction();
  }, [interactionId]);

  /* -------------------------- */
  /* PUSHER SUBSCRIPTION */
  /* -------------------------- */

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupPusher() {
      try {
        const tokens = await authService.getTokens();
        const token = tokens?.accessToken;

        if (!token) return;

        unsubscribe = subscribeToConversation(interactionId, token, () => {
          console.log("UPDATE → refreshing");
          loadInteraction();
        });
      } catch (e) {
        console.log("Pusher setup failed", e);
      }
    }

    setupPusher();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [interactionId]);

  /* -------------------------- */
  /* ACTIONS */
  /* -------------------------- */

  const handleAddNotes = (id: string) => {
    router.push(`/(app)/interactions/record/${id}`);
  };

  /* -------------------------- */
  /* RENDER */
  /* -------------------------- */

  if (!interaction) {
    return (
      <InteractionDetailScreen
        interaction={{
          id: interactionId,
          patientName: "Anoniem",
          providerName: "Arts",
          status: "Verwerking",
          date: "Vandaag",
          dateLabel: "Vandaag",
          summary: "",
          transcript: "",
        }}
        onBack={() => router.back()}
        onAddNotes={handleAddNotes}
      />
    );
  }

  return (
    <InteractionDetailScreen
      interaction={interaction}
      onBack={() => router.replace("/(app)/(tabs)/interactions")}
      onAddNotes={handleAddNotes}
    />
  );
}
