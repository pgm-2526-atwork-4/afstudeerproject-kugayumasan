import React, { useState } from "react";
import { router } from "expo-router";
import SettingsScreen from "@design/screens/SettingsScreen";
import { useSession } from "@core/modules/session/session.context";
import i18n from "@core/modules/i18n";

type SelectKey = "language" | "org" | null;

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

  const [language, setLanguage] = useState(i18n.language || "nl");
  const [organization, setOrganization] = useState("metro-hospital");
  const [openSelect, setOpenSelect] = useState<SelectKey>(null);

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  function handleChangeLanguage(lang: string) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  const profileName = displayDoctorName(me);
  const profileEmail = me?.email ?? "—";

  return (
    <SettingsScreen
      onLogout={handleLogout}
      profileName={profileName}
      profileEmail={profileEmail}
      language={language}
      organization={organization}
      openSelect={openSelect}
      setOpenSelect={setOpenSelect}
      onChangeLanguage={handleChangeLanguage}
      onChangeOrganization={setOrganization}
    />
  );
}
