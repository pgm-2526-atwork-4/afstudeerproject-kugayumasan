export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export const KEYCLOAK = {
  tokenUrl: process.env.EXPO_PUBLIC_KEYCLOAK_URL ?? "",
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? "",
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
};