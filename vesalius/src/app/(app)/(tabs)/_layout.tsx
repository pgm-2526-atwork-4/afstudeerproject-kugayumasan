import { Tabs, useRouter, usePathname } from "expo-router";
import BottomNav, { TabId } from "@design/navigation/BottomNav";

function getActiveTab(pathname: string): TabId {
  if (pathname.includes("record")) return "record";
  if (pathname.includes("interactions")) return "interactions";
  if (pathname.includes("settings")) return "settings";
  return "home";
}

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = getActiveTab(pathname);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            switch (tab) {
              case "home":
                router.replace("/(app)/(tabs)/home");
                break;
              case "record":
                router.replace("/(app)/(tabs)/record");
                break;
              case "interactions":
                router.replace("/(app)/(tabs)/interactions");
                break;
              case "settings":
                router.replace("/(app)/(tabs)/settings");
                break;
            }
          }}
        />
      )}
    >
      
      <Tabs.Screen name="home" />
      <Tabs.Screen name="record" />
      <Tabs.Screen name="interactions" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}