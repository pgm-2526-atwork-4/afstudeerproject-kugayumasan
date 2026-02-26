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

type Patient = {
  id: string;
  name: string;
  nrn: string;
};

type Props = {
  initialSelectedPatient?: { id: string; name: string } | null;
  onStartRecording: (patientName: string, isAnonymous: boolean) => void;
  onBack: () => void;
  onCreatePatient: () => void;
};

const mockPatients: Patient[] = [
  { id: "1", name: "Maria Rodriguez", nrn: "85.03.15-123.45" },
  { id: "2", name: "John Smith", nrn: "90.07.22-234.56" },
  { id: "3", name: "Sarah Williams", nrn: "88.11.30-345.67" },
  { id: "4", name: "Michael Johnson", nrn: "92.05.18-456.78" },
  { id: "5", name: "Emma Davis", nrn: "95.09.25-567.89" },
];

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
  danger: "#E5484D",
  dangerBg: "#FDECEC",
};

export default function CreateInteractionScreen({
  initialSelectedPatient = null,
  onStartRecording,
  onBack,
  onCreatePatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    initialSelectedPatient
      ? {
          id: initialSelectedPatient.id,
          name: initialSelectedPatient.name,
          nrn: "",
        }
      : null,
  );

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mockPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.nrn.includes(searchQuery.trim()),
    );
  }, [searchQuery]);

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nieuwe interactie</Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>
            Zoek een patiënt of voeg een nieuwe toe
          </Text>

          {selectedPatient ? (
            <View style={styles.selectedPatient}>
              <User size={18} color={COLORS.primary} strokeWidth={1.5} />
              <View style={{ flex: 1 }}>
                <Text style={styles.patientName}>{selectedPatient.name}</Text>
                {selectedPatient.nrn ? (
                  <Text style={styles.patientNrn}>{selectedPatient.nrn}</Text>
                ) : null}
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
                  onChangeText={setSearchQuery}
                  placeholder="Patiënt zoeken..."
                  placeholderTextColor="#9AA4B2"
                  style={styles.searchInput}
                />
              </View>

              {searchQuery.length > 0 ? (
                <View style={styles.list}>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p, idx) => (
                      <Pressable
                        key={p.id}
                        onPress={() => {
                          setSelectedPatient(p);
                          setSearchQuery("");
                        }}
                        style={[
                          styles.listItem,
                          idx === filteredPatients.length - 1
                            ? styles.listItem__last
                            : null,
                        ]}
                      >
                        <User
                          size={18}
                          color={COLORS.text}
                          strokeWidth={1.5}
                          style={{ opacity: 0.4 }}
                        />
                        <View>
                          <Text style={styles.patientName}>{p.name}</Text>
                          <Text style={styles.patientNrn}>{p.nrn}</Text>
                        </View>
                      </Pressable>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      Geen patiënten gevonden
                    </Text>
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
              <Text style={styles.btnRowText}>Voeg nieuwe patiënt toe</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={() => onStartRecording("Anoniem", true)}
            style={{ width: "100%" }}
          >
            <Text style={styles.btnRowText}>Anonieme interactie</Text>
          </Button>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          onPress={() => {
            if (!selectedPatient) return;
            onStartRecording(selectedPatient.name, false);
          }}
          disabled={!selectedPatient}
          style={styles.startBtn}
          textStyle={styles.startBtnText}
          title="Start opname"
        />

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.cancelBtnPressed,
          ]}
        >
          <Text style={styles.cancelText}>Annuleren</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },

  section: { gap: 12 },
  label: { fontSize: 12, color: COLORS.text },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },

  list: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItem__last: {
    borderBottomWidth: 0,
  },

  selectedPatient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 15,
    backgroundColor: COLORS.bgTint,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 15,
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
  emptyText: {
    padding: 12,
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },

  actions: { gap: 12 },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  startBtn: {
    width: "100%",
    height: 42,
    backgroundColor: COLORS.primary,
  },
  startBtnText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnRowText: {
    marginLeft: 8,
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
    borderRadius: 14,
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
