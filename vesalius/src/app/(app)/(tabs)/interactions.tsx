import React from "react";
import { router } from "expo-router";
import InteractionsScreen from "@design/screens/InteractionsScreen";

export default function InteractionsTab() {
  return (
    <InteractionsScreen
      onNewInteraction={() => {
        router.push("/(app)/interactions/new");
      }}
      onViewInteraction={(id) => {
        router.push(`/(app)/interactions/${id}`);
      }}
    />
  );
}
