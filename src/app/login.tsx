import { useAuth } from "@/src/auth/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authApi } from "../api/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { establishSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await authApi.login({ email, password });

      const token = res?.data?.token ?? res?.token;
      if (!token) {
        throw new Error("Login response did not include token");
      }

      await establishSession(token);
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity
        style={{ marginVertical: 20 }}
        onPress={() => router.replace("/register")}
      >
        <Text>
          Don't have an account?{" "}
          <Text style={{ fontWeight: "bold" }}>Register here</Text>
        </Text>
      </TouchableOpacity>

      <Button title="Login" onPress={handleLogin} disabled={!email || !password} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
});
