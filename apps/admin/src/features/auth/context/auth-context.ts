import { createContext } from "react";
import type { AuthMeResponse } from "../types";

export type AuthState = {
  user: AuthMeResponse | null;
  isLoading: boolean;
  setUser: (next: AuthMeResponse | null) => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);
