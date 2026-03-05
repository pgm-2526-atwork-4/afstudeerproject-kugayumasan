import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import InteractionDetailScreen from "@design/screens/InteractionDetailScreen";
import type { InteractionCardModel } from "@design/interactions/InteractionCard";

const LONG_SUMMARY = `**Anamnese**
- Sinds 2 weken drukkend gevoel op de borst bij inspanning zoals traplopen.
- Straalt soms uit naar linkerarm, verdwijnt in rust.
- Geen klachten in rust, wel kortademigheid en zweten bij inspanning.
- Ongeveer 1 tot 2 keer per dag.
- Geen invloed van voeding of medicatie, rust helpt.
- Geen hartkloppingen, duizeligheid of flauwvallen.
- Geen oedeem, geen eerdere hartinfarcten, geen angina voorgeschiedenis.

**Klinisch onderzoek**
- Pols 78 per min regelmatig, bloeddruk 145 over 90.
- Harttonen normaal, geen souffle
- Longen helder, geen crepitaties.
- Geen enkeloedeem.

**Medische beeldvorming**
- ECG in rust normaal.
- Inspanningstest: drukkend gevoel en ST depressies.
- Coronarografie gepland.

**Diagnose**
- Stabiele angina pectoris, waarschijnlijk door vernauwde kransslagaders.
- Risicofactoren: hypertensie, verhoogd cholesterol, positieve familieanamnese.

**Beleid**
- Start bètablokker, aspirine en statine.
- Nitraatspray bij acute klachten.
- Leefstijladvies: gewichtsverlies, gezonde voeding, meer beweging.
- Coronarografie voor verdere evaluatie.
- Opvolging binnen 6 weken of sneller bij klachtenverergering.`;

const MOCK_TRANSCRIPT = `Dr. Chen: Goedemorgen, Maria. Hoe gaat het met u sinds ons laatste bezoek?

Patiënt: Goedemorgen, dokter. Het gaat over het algemeen goed. Mijn bloeddruk lijkt stabieler.

Dr. Chen: Dat is goed om te horen. Neemt u uw medicatie regelmatig in?

Patiënt: Ja, ik ben heel voorzichtig om het elke dag op hetzelfde moment in te nemen, zoals u voorstelde.

Dr. Chen: Uitstekend. Laat me nu uw bloeddruk controleren...`;

function buildMockInteraction(id: string): InteractionCardModel & {
  dateLabel: string; // “13 februari 2026 om 10:30”
  summary?: string | null;
  transcript?: string | null;
} {
  if (id === "2") {
    return {
      id,
      patientName: "John Smith",
      providerName: "Dr. James Chen",
      summary: "",
      status: "In afwachting",
      date: "13 februari 2026",
      dateLabel: "13 februari 2026 om 14:20",
      transcript: null,
    };
  }

  if (id === "new") {
    return {
      id,
      patientName: "Maria Rodriguez",
      providerName: "Dr. James Chen",
      summary: "",
      status: "Verwerking",
      date: "Vandaag",
      dateLabel: "Vandaag om Nu",
      transcript: null,
    };
  }

  return {
    id,
    patientName: "Maria Rodriguez",
    providerName: "Dr. James Chen",
    summary: LONG_SUMMARY,
    status: "Voltooid",
    date: "13 februari 2026",
    dateLabel: "13 februari 2026 om 10:30",
    transcript: MOCK_TRANSCRIPT,
  };
}

export default function InteractionDetailRoute() {
  const params = useLocalSearchParams<{ interactionId?: string | string[] }>();
  const interactionId =
    typeof params.interactionId === "string" ? params.interactionId : "1";

  return (
    <InteractionDetailScreen
      interaction={buildMockInteraction(interactionId)}
      onBack={() => router.back()}
      onAddNotes={(id) => router.push(`/(app)/interactions/record/${id}`)}
    />
  );
}
