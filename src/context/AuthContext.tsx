"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "../types";
import { authService } from "../services/auth";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User|null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError,setAuthError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const me = await authService.getMe();
        const tempuser = {
          "id": me.sub,
          "email": me.email
        }
        setUser(tempuser);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      await authService.login({ email, password });
      const me = await authService.getMe();
      const tempuser = {
        "id": me.sub,
        "email": me.email
      }
      setUser(tempuser);
      // router.push("/dashboard");
    } catch (error: any) {
      const message =
      error || "Invalid email or password";
      setAuthError(message)

    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
