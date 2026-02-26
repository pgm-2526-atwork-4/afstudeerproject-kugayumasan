import React from "react";
import { router } from "expo-router";
import LoginScreen from "@design/screens/LoginScreen";

export default function Index() {
  return (
    <LoginScreen
      onLogin={() => {
        // temp: go to tabs after login
        router.replace("/(app)/(tabs)/home");
      }}
    />
  );
}
