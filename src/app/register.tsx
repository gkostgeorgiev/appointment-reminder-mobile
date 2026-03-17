import { authApi } from "@/src/api/auth";
import { useAuth } from "@/src/auth/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text as RNText, View } from "react-native";
import { Button, Text as PaperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { establishSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await authApi.register({
        email,
        password,
      });

      const token = res?.data?.token ?? res?.token;
      if (!token) throw new Error("Register response did not include token");

      await establishSession(token);

      router.replace("/(tabs)/schedule");
    } catch (err) {
      console.log("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-10">
        <PaperText variant="headlineMedium" className="text-center mb-10">
          Create account
        </PaperText>

        <View className="gap-4">
          <TextInput
            label="Email"
            mode="outlined"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            mode="contained"
            loading={loading}
            disabled={!email || !password || loading}
            onPress={handleRegister}
            className="mt-2"
          >
            Register
          </Button>
        </View>

        <RNText className="text-center mt-6">
          Already have an account?{" "}
          <RNText
            className="font-extrabold"
            onPress={() => router.replace("/login")}
          >
            Sign in here
          </RNText>
        </RNText>
      </View>
    </SafeAreaView>
  );
}
