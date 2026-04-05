import { useMemo, useState, type ReactNode } from "react";
import { fetchMe } from "../services/auth.service";
import type { AuthMeResponse } from "../types";
import { AuthContext } from "../context/auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      setUser,
      refreshUser: async () => {
        setIsLoading(true);
        try {
          const nextUser = await fetchMe();
          setUser(nextUser);
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

