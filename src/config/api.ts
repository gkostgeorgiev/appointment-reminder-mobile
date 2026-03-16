import { Platform } from "react-native";

function getDefaultApiOrigin() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000";
  }

  return "http://localhost:5000";
}

const configuredApiOrigin = process.env.EXPO_PUBLIC_API_URL?.trim();

export const apiOrigin = configuredApiOrigin || getDefaultApiOrigin();
export const apiV1Origin = `${apiOrigin}/api/v1`;
