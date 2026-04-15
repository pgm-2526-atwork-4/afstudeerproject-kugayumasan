import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Image,
} from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import FormField from "@design/ui/FormField";
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
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = () => {
    setFormError(null);

    if (!username.trim()) {
      setFormError("Gebruikersnaam is verplicht");
      return;
    }

    if (!password.trim()) {
      setFormError("Wachtwoord is verplicht");
      return;
    }

    if (password.length < 6) {
      setFormError("Wachtwoord moet minimaal 6 karakters bevatten");
      return;
    }

    Keyboard.dismiss();
    onLogin(username, password);
  };

  return (
    <Screen>
      <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
        <View style={styles.login}>
          <View style={styles.login__content}>
            <View style={styles.login__brandRow}>
              <Image
                source={require("@assets/images/logo.png")}
                style={styles.login__logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.login__welcome}>Welkom bij Vesalius</Text>

            <View style={styles.login__form}>
              <FormField
                label="Gebruikersnaam"
                inputProps={{
                  value: username,
                  onChangeText: (text) => {
                    setUsername(text);
                    setFormError(null);
                  },
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
                  onChangeText: (text) => {
                    setPassword(text);
                    setFormError(null);
                  },
                  placeholder: "Voer uw wachtwoord in",
                  secureTextEntry: true,
                  editable: !loading,
                  returnKeyType: "done",
                  onSubmitEditing: handleLogin,
                }}
              />

              {/* ✅ Form validation first, backend error only if no form error */}
              {formError && (
                <Text style={styles.login__error}>{formError}</Text>
              )}
              {error && !formError && (
                <Text style={styles.login__error}>{error}</Text>
              )}

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
  pressable: { flex: 1 },

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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },

  login__logoImage: {
    width: 200,
    height: 70,
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
