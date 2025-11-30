import { createContext, useContext } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isInitializing: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
