import React from "react";
import { router } from "expo-router";
import SettingsScreen from "@design/screens/SettingsScreen";
import { useSession } from "@core/modules/session/session.context";

function displayDoctorName(me: any) {
  const d = me?.doctor;
  const first = d?.first_name ?? me?.first_name ?? "";
  const last = d?.last_name ?? me?.last_name ?? "";
  const title = d?.title ? `${d.title} ` : "Dr. ";
  const full = `${first} ${last}`.trim();
  return full ? `${title}${full}` : "—";
}

export default function SettingsContainer() {
  const { logout, me } = useSession();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  const profileName = displayDoctorName(me);
  const profileEmail = me?.email ?? "—";

  return (
    <SettingsScreen
      onLogout={handleLogout}
      profileName={profileName}
      profileEmail={profileEmail}
    />
  );
}
