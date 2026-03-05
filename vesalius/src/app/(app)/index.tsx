import React, { useEffect } from "react";
import { router } from "expo-router";

export default function AppIndexRoute() {
  useEffect(() => {
    router.replace("/(app)/(tabs)/home");
  }, []);

  return null;
}
