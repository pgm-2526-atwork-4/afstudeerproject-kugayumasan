import React from "react";
import { useLocalSearchParams } from "expo-router";

import InteractionDetailContainer from "@functional/interactions/InteractionDetailContainer";

export default function InteractionDetailRoute() {
  const { interactionId } = useLocalSearchParams<{ interactionId: string }>();

  return <InteractionDetailContainer interactionId={interactionId} />;
}
