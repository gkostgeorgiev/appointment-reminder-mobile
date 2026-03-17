import { Redirect } from "expo-router";

import { useAuth } from "@/src/auth/AuthProvider";

export default function IndexScreen() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Redirect href={token ? "/(tabs)/schedule" : "/login"} />;
}
