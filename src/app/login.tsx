import { useAuth } from "@/src/auth/AuthProvider"
import { useRouter } from "expo-router"
import { useState } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, Text, TextInput } from "react-native-paper"
import { authApi } from "../api/auth"

export default function LoginScreen() {
  const router = useRouter()
  const { establishSession } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)

      const res = await authApi.login({ email, password })

      const token = res?.data?.token ?? res?.token
      if (!token) throw new Error("Login response did not include token")

      await establishSession(token)
      router.replace("/(tabs)")
    } catch (error) {
      console.log("Login failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-10">

        <Text variant="headlineMedium" className="text-center mb-10">
          Sign in
        </Text>

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
            disabled={!email || !password}
            onPress={handleLogin}
            className="mt-2"
          >
            Login
          </Button>

        </View>

        <Text className="text-center mt-6">
          Don't have an account?{" "}
          <Text
            className="font-semibold"
            onPress={() => router.replace("/register")}
          >
            Register here
          </Text>
        </Text>

      </View>
    </SafeAreaView>
  )
}