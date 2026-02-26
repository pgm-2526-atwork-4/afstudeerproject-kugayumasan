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
        // back to overview tab (record)
        router.replace("/(app)/(tabs)/record");
      }}
      onGoToInteraction={() => {
        // on success auto-redirect here after 2s
        router.replace(`/(app)/interactions/${interactionId}`);
      }}
    />
  );
}
