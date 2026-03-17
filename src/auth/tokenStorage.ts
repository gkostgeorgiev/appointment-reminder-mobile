import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

export async function saveToken(token: string) {
  if (Platform.OS === "web") return;

  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to save auth token", error);
    throw error;
  }
}

export async function getToken() {
  if (Platform.OS === "web") return null;

  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read auth token", error);
    return null;
  }
}

export async function deleteToken() {
  if (Platform.OS === "web") return;

  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to delete auth token", error);
    throw error;
  }
}
