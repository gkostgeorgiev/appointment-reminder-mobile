import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, deleteToken } from "./tokenStorage";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
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

  async function login(newToken: string) {
    await saveToken(newToken);
    setToken(newToken);
  }

  async function logout() {
    await deleteToken();
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
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
