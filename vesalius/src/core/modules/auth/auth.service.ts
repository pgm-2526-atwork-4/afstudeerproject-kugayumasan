import { KEYCLOAK } from "@core/network/config";
import type { AuthTokens, KeycloakTokenResponse } from "./auth.types";
import {
  saveTokens,
  getTokens as readTokens,
  clearTokens,
} from "./auth.storage";

function nowMs() {
  return Date.now();
}

function toAuthTokens(res: KeycloakTokenResponse): AuthTokens {
  const now = nowMs();
  return {
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    accessTokenExpiresAt: now + res.expires_in * 1000,
    refreshTokenExpiresAt: now + res.refresh_expires_in * 1000,
    tokenType: res.token_type ?? "Bearer",
  };
}

async function postForm<T>(
  url: string,
  form: Record<string, string>,
): Promise<T> {
  const body = new URLSearchParams(form).toString();

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Keycloak ${resp.status}: ${text}`);
  }

  return (await resp.json()) as T;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthTokens> {
    const res = await postForm<KeycloakTokenResponse>(KEYCLOAK.tokenUrl, {
      grant_type: "password",
      client_id: KEYCLOAK.clientId,
      username,
      password,
      scope: "openid profile email",
    });

    const tokens = toAuthTokens(res);
    await saveTokens(tokens);
    return tokens;
  },

  async refresh(): Promise<AuthTokens> {
    const current = await readTokens();
    if (!current?.refreshToken) throw new Error("No refresh token stored");

    const res = await postForm<KeycloakTokenResponse>(KEYCLOAK.tokenUrl, {
      grant_type: "refresh_token",
      client_id: KEYCLOAK.clientId,
      refresh_token: current.refreshToken,
    });

    const tokens = toAuthTokens(res);
    await saveTokens(tokens);
    return tokens;
  },

  async getTokens(): Promise<AuthTokens | null> {
    return await readTokens();
  },

  async logoutLocal(): Promise<void> {
    await clearTokens();
  },
};
