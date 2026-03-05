import * as SecureStore from "expo-secure-store";
import type { AuthTokens } from "./auth.types";

const KEY = "vesalius.auth.tokens.v1";

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
}

export async function getTokens(): Promise<AuthTokens | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
