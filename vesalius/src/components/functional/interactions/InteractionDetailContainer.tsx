import React, { useEffect, useState } from "react";
import { router } from "expo-router";

import InteractionDetailScreen from "@design/screens/InteractionDetailScreen";

import { getConversation } from "@core/modules/recording/recording.service";

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

  async function loadInteraction() {
    try {
      const conversation = await getConversation(interactionId);

      const transcript = conversation.transcripts?.[0]?.transcript_text ?? "";

      const summary = conversation.consultation_notes ?? "";

      setInteraction({
        id: interactionId,
        patientName: "Patiënt",
        providerName: "Arts",
        status: summary ? "Voltooid" : "Verwerking",
        date: "Vandaag",
        dateLabel: "Vandaag",
        summary,
        transcript,
      });
    } catch (error) {
      console.error("Failed loading interaction", error);

      setInteraction({
        id: interactionId,
        patientName: "Patiënt",
        providerName: "Arts",
        status: "Fout",
        date: "Vandaag",
        dateLabel: "Vandaag",
        summary: "",
        transcript: "",
      });
    }
  }

  useEffect(() => {
    loadInteraction();
  }, [interactionId]);

  if (!interaction) {
    return (
      <InteractionDetailScreen
        interaction={{
          id: interactionId,
          patientName: "Patiënt",
          providerName: "Arts",
          status: "Verwerking",
          date: "Vandaag",
          dateLabel: "Vandaag",
          summary: "",
          transcript: "",
        }}
        onBack={() => router.back()}
        onAddNotes={(id) => router.push(`/(app)/interactions/record/${id}`)}
      />
    );
  }

  return (
    <InteractionDetailScreen
      interaction={interaction}
      onBack={() => router.back()}
      onAddNotes={(id) => router.push(`/(app)/interactions/record/${id}`)}
    />
  );
}
