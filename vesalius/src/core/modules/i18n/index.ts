import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

const deviceLanguage = Localization.getLocales()?.[0]?.languageCode ?? "nl";

const resources = {
  nl: {
    translation: {
      settings: {
        title: "Instellingen",
        language: "Taal",
        organization: "Organisatie",
        logout: "Uitloggen",
        selectLanguage: "Selecteer taal",
        selectOrganization: "Selecteer organisatie",
      },

      home: {
        title: "Home",
        quickActions: "SNELLE ACTIES",
        newInteraction: "Nieuwe interactie",
        searchInteraction: "Zoek interactie",
        upcoming: "AANKOMENDE AFSPRAAK",
        recent: "RECENT BEKEKEN",
      },

      patient: {
        leave: "Verlaat",
        createTitle: "Voeg een nieuwe patiënt toe",

        nrn: "Nationaal registratienummer",
        nrnPlaceholder: "00.00.00-000.00",

        firstName: "Voornaam",
        firstNamePlaceholder: "Voer voornaam in",

        lastName: "Familienaam",
        lastNamePlaceholder: "Voer familienaam in",

        birthDate: "Geboortedatum",
        birthDatePlaceholder: "dd/mm/yyyy",

        gender: "Geslacht",
        selectGender: "Selecteer geslacht",

        language: "Taal",
        selectLanguage: "Selecteer taal",

        phone: "Telefoonnummer",
        phonePlaceholder: "000 00 00 00",

        email: "E-mailadres",
        emailPlaceholder: "naam@voorbeeld.be",

        username: "Gebruikersnaam",
        usernamePlaceholder: "Voer gebruikersnaam in",

        confirm: "Bevestigen",
        select: "Kies",

        phoneOrEmailRequired: "** Telefoon of email is verplicht",
      },

      interaction: {
        newTitle: "Nieuwe interactie",
        searchOrCreate: "Zoek een patiënt of voeg een nieuwe toe",
        unknownPatient: "Onbekende patiënt",

        searchPlaceholder: "Patiënt zoeken...",
        loadingPatients: "Patiënten laden...",
        noPatients: "Geen patiënten gevonden",

        addPatient: "Voeg nieuwe patiënt toe",
        anonymous: "Anonieme interactie",

        startRecording: "Start opname",
        cancel: "Annuleren",

        back: "Terug",
        summary: "Samenvatting",
        transcript: "Transcript",
        addNotes: "Notities aanvullen",
      },

      tabs: {
        home: "Home",
        record: "Opname",
        interactions: "Interacties",
        settings: "Instellingen",
      },

      interactions: {
        title: "Interacties",
        searchPlaceholder: "Zoek op naam",
        newInteraction: "Nieuwe interactie",
        loading: "Interacties laden...",
        errorTitle: "Er ging iets mis",
        emptyTitle: "Geen interacties gevonden",
        emptyDescription: "Interacties verschijnen hier zodra ze bestaan.",
      },
    },
  },

  en: {
    translation: {
      settings: {
        title: "Settings",
        language: "Language",
        organization: "Organization",
        logout: "Logout",
        selectLanguage: "Select language",
        selectOrganization: "Select organization",
      },

      home: {
        title: "Home",
        quickActions: "QUICK ACTIONS",
        newInteraction: "New interaction",
        searchInteraction: "Search interaction",
        upcoming: "UPCOMING APPOINTMENT",
        recent: "RECENTLY VIEWED",
      },
      tabs: {
        home: "Home",
        record: "Record",
        interactions: "Interactions",
        settings: "Settings",
      },

      patient: {
        leave: "Leave",
        createTitle: "Add a new patient",

        nrn: "National registration number",
        nrnPlaceholder: "00.00.00-000.00",

        firstName: "First name",
        firstNamePlaceholder: "Enter first name",

        lastName: "Last name",
        lastNamePlaceholder: "Enter last name",

        birthDate: "Birth date",
        birthDatePlaceholder: "dd/mm/yyyy",

        gender: "Gender",
        selectGender: "Select gender",

        language: "Language",
        selectLanguage: "Select language",

        phone: "Phone number",
        phonePlaceholder: "000 00 00 00",

        email: "Email",
        emailPlaceholder: "name@example.com",

        username: "Username",
        usernamePlaceholder: "Enter username",

        confirm: "Confirm",
        select: "Select",

        phoneOrEmailRequired: "** Phone or email is required",
      },

      interaction: {
        newTitle: "New interaction",
        searchOrCreate: "Search or create a patient",
        unknownPatient: "Unknown patient",

        searchPlaceholder: "Search patient...",
        loadingPatients: "Loading patients...",
        noPatients: "No patients found",

        addPatient: "Add new patient",
        anonymous: "Anonymous interaction",

        startRecording: "Start recording",
        cancel: "Cancel",

        back: "Back",
        summary: "Summary",
        transcript: "Transcript",
        addNotes: "Add notes",
      },

      interactions: {
        title: "Interactions",
        searchPlaceholder: "Search by name",
        newInteraction: "New interaction",
        loading: "Loading interactions...",
        errorTitle: "Something went wrong",
        emptyTitle: "No interactions found",
        emptyDescription: "Interactions will appear here once they exist.",
      },
    },
  },

  fr: {
    translation: {
      settings: {
        title: "Paramètres",
        language: "Langue",
        organization: "Organisation",
        logout: "Se déconnecter",
        selectLanguage: "Choisir la langue",
        selectOrganization: "Choisir l'organisation",
      },

      home: {
        title: "Accueil",
        quickActions: "ACTIONS RAPIDES",
        newInteraction: "Nouvelle interaction",
        searchInteraction: "Rechercher interaction",
        upcoming: "RENDEZ-VOUS À VENIR",
        recent: "RÉCEMMENT CONSULTÉ",
      },

      tabs: {
        home: "Accueil",
        record: "Enregistrement",
        interactions: "Interactions",
        settings: "Paramètres",
      },

      patient: {
        leave: "Quitter",
        createTitle: "Ajouter un patient",

        nrn: "Numéro national",
        nrnPlaceholder: "00.00.00-000.00",

        firstName: "Prénom",
        firstNamePlaceholder: "Entrez le prénom",

        lastName: "Nom de famille",
        lastNamePlaceholder: "Entrez le nom",

        birthDate: "Date de naissance",
        birthDatePlaceholder: "jj/mm/aaaa",

        gender: "Sexe",
        selectGender: "Sélectionner le sexe",

        language: "Langue",
        selectLanguage: "Choisir la langue",

        phone: "Numéro de téléphone",
        phonePlaceholder: "000 00 00 00",

        email: "Email",
        emailPlaceholder: "nom@exemple.com",

        username: "Nom d'utilisateur",
        usernamePlaceholder: "Entrez le nom d'utilisateur",

        confirm: "Confirmer",
        select: "Choisir",

        phoneOrEmailRequired: "** Téléphone ou email requis",
      },

      interaction: {
        newTitle: "Nouvelle interaction",
        searchOrCreate: "Rechercher of créer un patient",
        unknownPatient: "Patient inconnu",

        searchPlaceholder: "Rechercher patient...",
        loadingPatients: "Chargement...",
        noPatients: "Aucun patient trouvé",

        addPatient: "Ajouter un patient",
        anonymous: "Interaction anonyme",

        startRecording: "Démarrer enregistrement",
        cancel: "Annuler",

        back: "Retour",
        summary: "Résumé",
        transcript: "Transcription",
        addNotes: "Ajouter des notes",
      },

      interactions: {
        title: "Interactions",
        searchPlaceholder: "Rechercher par nom",
        newInteraction: "Nouvelle interaction",
        loading: "Chargement...",
        errorTitle: "Une erreur s'est produite",
        emptyTitle: "Aucune interaction trouvée",
        emptyDescription: "Les interactions apparaîtront ici.",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: "nl",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
