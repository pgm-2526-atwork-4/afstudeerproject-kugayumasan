import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

export default function Screen({ children }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});