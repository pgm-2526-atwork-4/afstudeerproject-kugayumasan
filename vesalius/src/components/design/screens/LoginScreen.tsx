import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import Screen from "@design/ui/ScreenLayout";
import { Button } from "@design/ui/button";
import { Activity } from "lucide-react-native";

type Props = {
  onLogin: (username: string, password: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
};

export default function LoginScreen({ onLogin, loading, error }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) return;
    onLogin(username, password);
  };

  return (
    <Screen>
      <View style={styles.login}>
        {/* Center content */}
        <View style={styles.login__content}>
          {/* Logo */}
          <View style={styles.login__brandRow}>
            <View style={styles.login__logo}>
              <Activity size={28} strokeWidth={2} color={COLORS.white} />
            </View>
            <Text style={styles.login__brandText}>Vesalius.ai</Text>
          </View>

          <Text style={styles.login__welcome}>Welkom terug</Text>

          {/* Form */}
          <View style={styles.login__form}>
            <View style={styles.login__field}>
              <Text style={styles.login__label}>Gebruikersnaam</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Voer uw gebruikersnaam in"
                placeholderTextColor="#9AA4B2"
                style={styles.login__input}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.login__field}>
              <Text style={styles.login__label}>Wachtwoord</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Voer uw wachtwoord in"
                placeholderTextColor="#9AA4B2"
                style={styles.login__input}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Links */}
            <View style={styles.login__links}>
              <Pressable onPress={() => {}}>
                <Text style={styles.login__link}>Gebruikersnaam vergeten?</Text>
              </Pressable>
              <Pressable onPress={() => {}}>
                <Text style={styles.login__link}>Wachtwoord vergeten?</Text>
              </Pressable>
            </View>

            {/* Error */}
            {error ? <Text style={styles.login__error}>{error}</Text> : null}

            {/* Button */}
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

        {/* Footer */}
        <View style={styles.login__footer}>
          <Text style={styles.login__footerText}>© 2026 Vesalius.ai</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
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
    gap: 12,
    marginBottom: 12,
  },
  login__logo: {
    width: 48,
    height: 48,
    borderRadius: 15,
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
    marginBottom: 24,
  },

  login__form: {
    gap: 16,
  },
  login__field: {
    gap: 8,
  },
  login__label: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
  },
  login__input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    fontSize: 12,
  },

  login__links: {
    gap: 8,
    marginTop: 4,
  },
  login__link: {
    fontSize: 12,
    color: COLORS.primary,
  },

  login__buttons: {
    gap: 12,
    marginTop: 12,
  },

  login__primaryBtn: {
    width: "100%",
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
  },
  login__primaryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  login__error: {
    color: "#F50C0C",
    fontSize: 12,
  },

  login__footer: {
    alignItems: "center",
    paddingTop: 8,
  },
  login__footerText: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.4,
  },
});
