import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { Search, Plus, User, X } from "lucide-react-native";
import type { Patient } from "@core/modules/patients/patients.types";

import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";
import { useTranslation } from "react-i18next";
import LoadingCard from "@design/ui/LoadingCard";
import EmptyState from "@design/ui/EmptyState";
import ScreenHeader from "@design/ui/ScreenHeader";
import SectionHeader from "@design/ui/SectionHeader";
import PatientRow from "@design/patients/PatientRow";

import {
  getPatientName,
  getPatientSubtitle,
} from "@functional/patients/patient.helpers";

type Props = {
  initialSelectedPatient?: Patient | null;
  patients?: Patient[];
  isLoading?: boolean;
  error?: string | null;
  onSearchPatients?: (query: string) => void;
  onStartRecording: (patient: Patient | null, isAnonymous: boolean) => void;
  onBack: () => void;
  onCreatePatient: () => void;
};

export default function CreateInteractionScreen({
  initialSelectedPatient = null,
  patients = [],
  isLoading = false,
  error = null,
  onSearchPatients = () => {},
  onStartRecording,
  onBack,
  onCreatePatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialSelectedPatient,
  );

  const showResults = useMemo(() => {
    return !selectedPatient && searchQuery.trim().length > 0;
  }, [selectedPatient, searchQuery]);
  const { t } = useTranslation();

  return (
    <Screen>
      <ScreenHeader title={t("interaction.newTitle")} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <SectionHeader title={t("interaction.searchOrCreate")} />

          {selectedPatient ? (
            <View style={styles.selectedPatient}>
              <User size={18} color={COLORS.primary} strokeWidth={1.5} />

              <View style={{ flex: 1 }}>
                <Text style={styles.patientName}>
                  {getPatientName(selectedPatient) ||
                    t("interaction.unknownPatient")}
                </Text>

                <Text style={styles.patientNrn}>
                  {getPatientSubtitle(selectedPatient)}
                </Text>
              </View>

              <Pressable
                onPress={() => setSelectedPatient(null)}
                style={styles.clearBtn}
              >
                <X size={16} color={COLORS.primary} strokeWidth={1.5} />
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.searchBox}>
                <Search
                  size={18}
                  color={COLORS.text}
                  strokeWidth={1.5}
                  style={{ opacity: 0.7 }}
                />

                <TextInput
                  value={searchQuery}
                  onChangeText={(value) => {
                    setSearchQuery(value);
                    onSearchPatients(value);
                  }}
                  placeholder={t("interaction.searchPlaceholder")}
                  placeholderTextColor={COLORS.placeholder}
                  style={styles.searchInput}
                />
              </View>

              {showResults ? (
                <View style={styles.list}>
                  {isLoading ? (
                    <LoadingCard text={t("interaction.loadingPatients")} />
                  ) : error ? (
                    <EmptyState title={error} />
                  ) : patients.length > 0 ? (
                    patients.map((p, idx) => (
                      <PatientRow
                        key={p.id}
                        patient={p}
                        isLast={idx === patients.length - 1}
                        onPress={(patient) => {
                          setSelectedPatient(patient);
                          setSearchQuery("");
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState title={t("interaction.noPatients")} />
                  )}
                </View>
              ) : null}
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            variant="outline"
            onPress={onCreatePatient}
            disabled={!!selectedPatient}
            style={{ width: "100%" }}
          >
            <View style={styles.btnRow}>
              <Plus size={18} strokeWidth={1.5} style={styles.iconFix} />
              <Text style={styles.btnRowText}>
                {t("interaction.addPatient")}
              </Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={() => {
              setSelectedPatient(null);
              onStartRecording(null, true);
            }}
            style={{ width: "100%" }}
          >
            <Text style={styles.btnRowText}>{t("interaction.anonymous")}</Text>
          </Button>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          onPress={() => {
            if (!selectedPatient) return;
            onStartRecording(selectedPatient, false);
          }}
          disabled={!selectedPatient}
          style={styles.startBtn}
          textStyle={styles.startBtnText}
          title={t("interaction.startRecording")}
        />

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.cancelBtnPressed,
          ]}
        >
          <Text style={styles.cancelText}>{t("interaction.cancel")}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: SPACING.xl,
  },

  section: {
    gap: SPACING.md,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: COLORS.background.white,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },

  list: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.background.white,
  },

  selectedPatient: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tint,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },

  patientName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  patientNrn: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },

  actions: {
    gap: SPACING.md,
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },

  startBtn: {
    width: "100%",
    height: 42,
    backgroundColor: COLORS.primary,
  },

  startBtnText: {
    color: COLORS.background.white,
    fontWeight: "600",
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  btnRowText: {
    marginLeft: SPACING.sm,
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },

  iconFix: {
    marginTop: 1,
  },

  cancelBtn: {
    width: "100%",
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dangerBg,
  },

  cancelBtnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.danger,
  },
});
