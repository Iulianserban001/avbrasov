"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

const ADMIN_UID = "CZdb17bREbhYZF9g6mRzjqx6a7C2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      const isLoginRoute = pathname === "/admin/login";
      const isAdminRoute = pathname?.startsWith("/admin");
      const isAdminUser = currentUser?.uid === ADMIN_UID;

      if (!loading) {
        if (isAdminRoute && !isLoginRoute && !isAdminUser) {
          // Redirect to login if trying to access admin without correct UID
          router.push("/admin/login");
        } else if (isLoginRoute && isAdminUser) {
          // Redirect to admin dashboard if already logged in as admin
          router.push("/admin");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router, loading]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.uid === ADMIN_UID,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
