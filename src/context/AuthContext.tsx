"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../services/auth";

interface AuthContextType {
  user: any;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = async() => {
    //refresh the user
    console.log("came herelogin")
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
