import * as SecureStore from "expo-secure-store";
import type { AuthTokens } from "./auth.types";

const ACCESS_TOKEN_KEY = "vesalius.auth.access";
const REFRESH_TOKEN_KEY = "vesalius.auth.refresh";
const META_KEY = "vesalius.auth.meta";

// 🔥 oude key (cleanup)
const LEGACY_KEY = "vesalius.auth.tokens.v1";

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);

  await SecureStore.setItemAsync(
    META_KEY,
    JSON.stringify({
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      tokenType: tokens.tokenType,
    }),
  );
}

export async function getTokens(): Promise<AuthTokens | null> {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const metaRaw = await SecureStore.getItemAsync(META_KEY);

    if (!accessToken || !refreshToken || !metaRaw) return null;

    const meta = JSON.parse(metaRaw);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: meta.accessTokenExpiresAt,
      refreshTokenExpiresAt: meta.refreshTokenExpiresAt,
      tokenType: meta.tokenType,
    };
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(META_KEY);

  // 🔥 cleanup oude storage (BELANGRIJK)
  await SecureStore.deleteItemAsync(LEGACY_KEY);
}
