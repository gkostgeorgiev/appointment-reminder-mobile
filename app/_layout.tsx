import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { AuthProvider } from "../src/auth/AuthProvider";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProtectedRoute } from "@/src/auth/useProtectedRoute";
import { QueryProvider } from "@/src/providers/QueryProvider";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootNavigator() {
  useProtectedRoute();

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <QueryProvider>
          <RootNavigator />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
