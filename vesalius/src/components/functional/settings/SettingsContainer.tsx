import React, { useState, useMemo } from "react";
import { router } from "expo-router";
import SettingsScreen from "@design/screens/SettingsScreen";
import { useSession } from "@core/modules/session/session.context";
import i18n from "@core/modules/i18n";
import { displayDoctorName } from "@core/utils/doctor.utils";

type SelectKey = "language" | "org" | null;

export default function SettingsContainer() {
  const { logout, me, selectedInstitutionId, setSession } = useSession();

  const [language, setLanguage] = useState(i18n.language || "nl");
  const [openSelect, setOpenSelect] = useState<SelectKey>(null);

  // 🔥 HAAL ORGANISATIES UIT /users/me
  const organizationOptions = useMemo(() => {
    return (
      me?.institutions?.map((inst: any) => ({
        label: inst.name,
        value: inst.id,
      })) ?? []
    );
  }, [me]);

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  function handleChangeLanguage(lang: string) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  function handleChangeOrganization(orgId: string) {
    setSession({
      selectedInstitutionId: orgId,
    });
  }

  const profileName = displayDoctorName(me);
  const profileEmail = me?.email ?? "—";

  return (
    <SettingsScreen
      onLogout={handleLogout}
      profileName={profileName}
      profileEmail={profileEmail}
      language={language}
      organization={selectedInstitutionId ?? ""}
      openSelect={openSelect}
      setOpenSelect={setOpenSelect}
      onChangeLanguage={handleChangeLanguage}
      onChangeOrganization={handleChangeOrganization}
      // 🔥 NIEUW
      organizationOptions={organizationOptions}
    />
  );
}
