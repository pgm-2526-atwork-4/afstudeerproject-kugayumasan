import React, { useState } from "react";
import { router } from "expo-router";
import SettingsScreen from "@design/screens/SettingsScreen";
import { useSession } from "@core/modules/session/session.context";
import i18n from "@core/modules/i18n";
import { displayDoctorName } from "@core/utils/doctor.utils";

type SelectKey = "language" | "org" | null;

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
