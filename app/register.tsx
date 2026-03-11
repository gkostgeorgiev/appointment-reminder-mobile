import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { authApi } from "@/src/api/auth";
import { useAuth } from "@/src/auth/AuthProvider";

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

      if (res.ok) {
        const token = res.data.token;

        await establishSession(token);

        router.replace("/schedule");
      }
    } catch (err) {
      console.log("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Create Account</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <Button
        title={loading ? "Creating..." : "Register"}
        onPress={handleRegister}
        disabled={!email || !password || loading}
      />

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => router.push("/login")}
      >
        <Text>
          Already have an account?{" "}
          <Text style={{ fontWeight: "bold" }}>Sign in here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
