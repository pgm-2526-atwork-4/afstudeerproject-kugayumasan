import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Mic, FileText, Settings } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";

export type TabId = "home" | "record" | "interactions" | "settings";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "record", label: "Opname", icon: Mic },
  { id: "interactions", label: "Interacties", icon: FileText },
  { id: "settings", label: "Instellingen", icon: Settings },
] as const;

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.bottomNav}>
      <View style={styles.bottomNav__inner}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id as TabId)}
              style={styles.bottomNav__tab}
            >
              <Icon
                size={24}
                strokeWidth={1.5}
                color={active ? COLORS.primary : COLORS.text}
                style={{ opacity: active ? 1 : 0.7 }}
              />

              <Text
                style={[
                  styles.bottomNav__label,
                  active
                    ? styles.bottomNav__labelActive
                    : styles.bottomNav__labelInactive,
                ]}
              >
                {t(`tabs.${tab.id}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: COLORS.background.white,
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
    gap: SPACING.xs,
  },

  bottomNav__label: {
    fontSize: 10,
  },

  bottomNav__labelActive: {
    color: COLORS.primary,
    fontWeight: "500",
    opacity: 1,
  },

  bottomNav__labelInactive: {
    color: COLORS.text,
    fontWeight: "400",
    opacity: 0.7,
  },
});
