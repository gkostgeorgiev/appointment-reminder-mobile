import { AuthProvider } from "@/src/auth/AuthProvider";
import { useProtectedRoute } from "@/src/auth/useProtectedRoute";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { QueryProvider } from "@/src/providers/QueryProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { theme } from "../constants/theme";
import "../global.css";

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
          <PaperProvider theme={theme}>
            <RootNavigator />
          </PaperProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
