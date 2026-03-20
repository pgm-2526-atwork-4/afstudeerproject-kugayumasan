import React from "react";
import { router, useLocalSearchParams } from "expo-router";

import RecordingFeedbackScreen from "@design/screens/RecordingFeedbackScreen";

export default function InteractionFeedbackRoute() {
  const { interactionId, status } = useLocalSearchParams<{
    interactionId: string;
    status?: "success" | "error" | string;
  }>();

  const resolvedStatus: "success" | "error" =
    status === "success" ? "success" : "error";

  return (
    <RecordingFeedbackScreen
      status={resolvedStatus}
      onRetry={() => {
        router.replace(`/(app)/interactions/record/${interactionId}`);
      }}
      onGoBack={() => {
        router.replace("/(app)/(tabs)/record");
      }}
      onGoToInteraction={() => {
        router.replace(`/(app)/interactions/${interactionId}`);
      }}
    />
  );
}
