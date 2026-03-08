import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Keyboard } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import FormField from "@design/ui/FormField";
import { Activity } from "lucide-react-native";
import { COLORS } from "@style/colors";
import { SPACING } from "@style/spacing";
import { RADIUS } from "@style/radius";

type Props = {
  onLogin: (username: string, password: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export default function LoginScreen({ onLogin, loading, error }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) return;
    Keyboard.dismiss();
    onLogin(username, password);
  };

  return (
    <Screen>
      <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
        <View style={styles.login}>
          <View style={styles.login__content}>
            <View style={styles.login__brandRow}>
              <View style={styles.login__logo}>
                <Activity
                  size={28}
                  strokeWidth={2}
                  color={COLORS.background.white}
                />
              </View>
              <Text style={styles.login__brandText}>Vesalius.ai</Text>
            </View>

            <Text style={styles.login__welcome}>Welkom terug</Text>

            <View style={styles.login__form}>
              <FormField
                label="Gebruikersnaam"
                inputProps={{
                  value: username,
                  onChangeText: setUsername,
                  placeholder: "Voer uw gebruikersnaam in",
                  autoCapitalize: "none",
                  editable: !loading,
                  returnKeyType: "next",
                  onSubmitEditing: () => Keyboard.dismiss(),
                }}
              />

              <FormField
                label="Wachtwoord"
                inputProps={{
                  value: password,
                  onChangeText: setPassword,
                  placeholder: "Voer uw wachtwoord in",
                  secureTextEntry: true,
                  editable: !loading,
                  returnKeyType: "done",
                  onSubmitEditing: handleLogin,
                }}
              />

              <View style={styles.login__links}>
                <Pressable onPress={() => {}}>
                  <Text style={styles.login__link}>
                    Gebruikersnaam vergeten?
                  </Text>
                </Pressable>
                <Pressable onPress={() => {}}>
                  <Text style={styles.login__link}>Wachtwoord vergeten?</Text>
                </Pressable>
              </View>

              {error ? <Text style={styles.login__error}>{error}</Text> : null}

              <View style={styles.login__buttons}>
                <Button
                  onPress={handleLogin}
                  disabled={loading}
                  style={styles.login__primaryBtn}
                  textStyle={styles.login__primaryText}
                  title={loading ? "Bezig..." : "Aanmelden"}
                />
              </View>
            </View>
          </View>

          <View style={styles.login__footer}>
            <Text style={styles.login__footerText}>© 2026 Vesalius.ai</Text>
          </View>
        </View>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },

  login: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  login__content: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 360,
  },

  login__brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  login__logo: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  login__brandText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "400",
  },

  login__welcome: {
    textAlign: "center",
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: SPACING.xl,
  },

  login__form: {
    gap: SPACING.lg,
  },

  login__links: {
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },

  login__link: {
    fontSize: 12,
    color: COLORS.primary,
  },

  login__buttons: {
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  login__primaryBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },

  login__primaryText: {
    color: COLORS.background.white,
    fontSize: 14,
    fontWeight: "600",
  },

  login__error: {
    color: COLORS.error,
    fontSize: 12,
  },

  login__footer: {
    alignItems: "center",
    paddingTop: SPACING.sm,
  },

  login__footerText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },
});
