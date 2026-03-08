import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
  async setToken(token: string) {
    if (Platform.OS === "web") return;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken() {
    if (Platform.OS === "web") return null;
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken() {
    if (Platform.OS === "web") return;
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};