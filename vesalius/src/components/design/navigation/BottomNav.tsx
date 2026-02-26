import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Mic, FileText, Settings } from "lucide-react-native";

export type TabId = "home" | "record" | "interactions" | "settings";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.bottomNav}>
      <View style={styles.bottomNav__inner}>
        {/* Home */}
        <Pressable
          onPress={() => onTabChange("home")}
          style={styles.bottomNav__tab}
        >
          <Home
            size={24}
            strokeWidth={1.5}
            color={activeTab === "home" ? COLORS.primary : COLORS.text}
            style={{ opacity: activeTab === "home" ? 1 : 0.7 }}
          />
          <Text
            style={[
              styles.bottomNav__label,
              activeTab === "home"
                ? styles["bottomNav__label--active"]
                : styles["bottomNav__label--inactive"],
            ]}
          >
            Home
          </Text>
        </Pressable>

        {/* Record */}
        <Pressable
          onPress={() => onTabChange("record")}
          style={styles.bottomNav__tab}
        >
          <Mic
            size={24}
            strokeWidth={1.5}
            color={activeTab === "record" ? COLORS.primary : COLORS.text}
            style={{ opacity: activeTab === "record" ? 1 : 0.7 }}
          />
          <Text
            style={[
              styles.bottomNav__label,
              activeTab === "record"
                ? styles["bottomNav__label--active"]
                : styles["bottomNav__label--inactive"],
            ]}
          >
            Opname
          </Text>
        </Pressable>

        {/* Interactions */}
        <Pressable
          onPress={() => onTabChange("interactions")}
          style={styles.bottomNav__tab}
        >
          <FileText
            size={24}
            strokeWidth={1.5}
            color={activeTab === "interactions" ? COLORS.primary : COLORS.text}
            style={{ opacity: activeTab === "interactions" ? 1 : 0.7 }}
          />
          <Text
            style={[
              styles.bottomNav__label,
              activeTab === "interactions"
                ? styles["bottomNav__label--active"]
                : styles["bottomNav__label--inactive"],
            ]}
          >
            Interacties
          </Text>
        </Pressable>

        {/* Settings */}
        <Pressable
          onPress={() => onTabChange("settings")}
          style={styles.bottomNav__tab}
        >
          <Settings
            size={24}
            strokeWidth={1.5}
            color={activeTab === "settings" ? COLORS.primary : COLORS.text}
            style={{ opacity: activeTab === "settings" ? 1 : 0.7 }}
          />
          <Text
            style={[
              styles.bottomNav__label,
              activeTab === "settings"
                ? styles["bottomNav__label--active"]
                : styles["bottomNav__label--inactive"],
            ]}
          >
            Instellingen
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: "#20BBC0",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  bottomNav__inner: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  bottomNav__tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  bottomNav__label: {
    fontSize: 10,
  },

  "bottomNav__label--active": {
    color: COLORS.primary,
    fontWeight: "500",
    opacity: 1,
  },

  "bottomNav__label--inactive": {
    color: COLORS.text,
    fontWeight: "400",
    opacity: 0.7,
  },
});
