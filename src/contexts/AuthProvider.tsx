import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import apiClient from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/user";
import { AuthContext } from "./Auth";


async function fetchMyProfile(): Promise<User> {
  const { data } = await apiClient.get("/api/users/me");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); //
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const profile = await fetchMyProfile();
          if (isMounted) {
            setUser(profile);
            setIsInitializing(false); //
          }
        } catch (error) {
          console.error("認証の初期化に失敗しました:", error);
          if (isMounted) {
            localStorage.removeItem("authToken");
            delete apiClient.defaults.headers.common["Authorization"];
            setUser(null);
            setIsInitializing(false); //
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const profile = await fetchMyProfile();
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
    queryClient.clear();
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isInitializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}
