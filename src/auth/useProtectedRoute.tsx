import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function useProtectedRoute() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const authRoutes = new Set(["login", "register"]);
    const inAuthGroup = authRoutes.has(segments[0] ?? "");

    if (!token && !inAuthGroup) {
      router.replace("/login");
    }

    if (token && inAuthGroup) {
      router.replace("/(tabs)/schedule");
    }
  }, [token, loading, segments, router]);
}
