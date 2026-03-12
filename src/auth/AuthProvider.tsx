import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, deleteToken } from "./tokenStorage";
import { setLogoutHandler } from "./authEvents";
import { router } from "expo-router";

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
      const storedToken = await getToken();
      setToken(storedToken);
      setLoading(false);
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
