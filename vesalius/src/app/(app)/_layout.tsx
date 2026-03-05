import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="interactions/[interactionId]" />
      <Stack.Screen name="interactions/new/index" />
      <Stack.Screen name="interactions/new/create-patient" />
      <Stack.Screen name="interactions/record/[interactionId]" />
      <Stack.Screen name="interactions/feedback/[interactionId]" />
    </Stack>
  );
}
