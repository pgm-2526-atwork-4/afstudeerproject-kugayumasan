import React, { useCallback, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ✅ FIX

import InteractionsScreen from "@design/screens/InteractionsScreen";
import { useSession } from "@core/modules/session/session.context";
import { useInteractions } from "@functional/interactions/useInteractions";
import type { InteractionCardModel } from "@design/interactions/InteractionCard";
import { Alert } from "react-native";
import { deleteInteraction } from "@core/modules/interactions/interactions.service";

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

  // ✅ FIX: reload lijst wanneer je terugkomt op screen
  useFocusEffect(
    React.useCallback(() => {
      if (!selectedInstitutionId) return;

      loadInteractions(selectedInstitutionId);
    }, [selectedInstitutionId]),
  );

  const handleDeleteInteraction = useCallback(
    (id: string) => {
      Alert.alert(
        "Interactie verwijderen",
        "Ben je zeker dat je deze interactie wil verwijderen?",
        [
          { text: "Annuleren", style: "cancel" },
          {
            text: "Verwijderen",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteInteraction(id);
                if (selectedInstitutionId) {
                  loadInteractions(selectedInstitutionId);
                }
              } catch {
                Alert.alert("Fout", "Verwijderen mislukt");
              }
            },
          },
        ],
      );
    },
    [loadInteractions, selectedInstitutionId],
  );

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
      onDeleteInteraction={handleDeleteInteraction}
    />
  );
}
