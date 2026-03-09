import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./AuthProvider";

export function useProtectedRoute() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "login";

    if (!token && !inAuthGroup) {
      router.replace("/login");
    }

    if (token && inAuthGroup) {
      router.replace("/(tabs)/schedule");
    }
  }, [token, loading]);
}
