import React, { useCallback, useEffect, useRef } from "react";
import { router } from "expo-router";
import InteractionsScreen from "@design/screens/InteractionsScreen";
import { useSession } from "@core/modules/session/session.context";
import { useInteractions } from "@functional/interactions/useInteractions";
import type { InteractionCardModel } from "@design/interactions/InteractionCard";

function formatPatientName(interaction: {
  patient: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}) {
  if (!interaction.patient) return "Anoniem";

  const fullName = [
    interaction.patient.first_name,
    interaction.patient.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Anoniem";
}

function formatProviderName(
  interaction: {
    doctor: {
      first_name: string;
      last_name: string;
    } | null;
  },
  me?: {
    first_name?: string | null;
    last_name?: string | null;
  } | null,
) {
  if (interaction.doctor) {
    return `Dr. ${interaction.doctor.first_name} ${interaction.doctor.last_name}`;
  }

  const fallbackName = [me?.first_name, me?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fallbackName) {
    return `Dr. ${fallbackName}`;
  }

  return "Onbekende arts";
}

function formatStatus(status: string): InteractionCardModel["status"] {
  switch (status) {
    case "finished":
      return "Voltooid";
    case "pending":
      return "In afwachting";
    case "ongoing":
      return "Verwerking";
    case "planned":
      return "In afwachting";
    case "error":
      return "Fout";
    case "expired":
      return "Fout";
    case "removed":
      return "Fout";
    default:
      return "In afwachting";
  }
}

function formatDateLabel(date: string | null) {
  if (!date) return "Geen datum";

  try {
    return new Intl.DateTimeFormat("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function InteractionsContainer() {
  const { selectedInstitutionId, me } = useSession();
  const {
    interactions,
    isLoading,
    error,
    loadInteractions,
    searchInteractions,
  } = useInteractions();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedInstitutionId) return;
    loadInteractions(selectedInstitutionId);
  }, [loadInteractions, selectedInstitutionId]);

  const handleSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const trimmed = query.trim();

      debounceRef.current = setTimeout(() => {
        if (!selectedInstitutionId) return;

        if (!trimmed) {
          loadInteractions(selectedInstitutionId);
          return;
        }

        searchInteractions(selectedInstitutionId, trimmed);
      }, 350);
    },
    [loadInteractions, searchInteractions, selectedInstitutionId],
  );

  const mappedInteractions: InteractionCardModel[] = interactions.map(
    (item) => ({
      id: item.id,
      patientName: formatPatientName(item),
      providerName: formatProviderName(item, me),
      summary: item.has_consultation_notes
        ? "Samenvatting beschikbaar"
        : "Nog geen samenvatting",
      status: formatStatus(item.status),
      date: formatDateLabel(item.due_date ?? item.created_at),
    }),
  );

  return (
    <InteractionsScreen
      interactions={mappedInteractions}
      isLoading={isLoading}
      error={error}
      onSearch={handleSearch}
      onNewInteraction={() => router.push("/(app)/(tabs)/record")}
      onViewInteraction={(id) => router.push(`/(app)/interactions/${id}`)}
    />
  );
}
