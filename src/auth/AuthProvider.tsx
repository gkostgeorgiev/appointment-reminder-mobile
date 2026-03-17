import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { setLogoutHandler } from "./authEvents";
import { deleteToken, getToken, saveToken } from "./tokenStorage";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  establishSession: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await getToken();
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to initialize auth session", error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadToken();
  }, []);

  async function establishSession(newToken: string) {
    await saveToken(newToken);
    setToken(newToken);
  }

  async function logout() {
    await deleteToken();
    setToken(null);
    router.replace("/login");
  }

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        establishSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
