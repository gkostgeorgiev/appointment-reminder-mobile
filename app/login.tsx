import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { authApi } from "../src/api/auth";
import { tokenStorage } from "../src/auth/tokenStorage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log('hello world from handle Login');
    try {
      const res = await authApi.login({ email, password });
      console.log("LOGIN RESPONSE:", res);

      await tokenStorage.setToken(res.data.token);

      console.log("Login successful");
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  console.log('hello world from LoginScreen');

  useEffect(() => {
    console.log('email: ', email);
    console.log('password: ', password);
  }, [email, password]);

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

      <Button title="Login" onPress={handleLogin} />
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
