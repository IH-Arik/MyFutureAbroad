import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthStateChange } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isProvider: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
  }

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) {
        fetchProfile(u.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const subscription = onAuthStateChange((u) => {
      setUser(u);
      if (u) {
        fetchProfile(u.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isProvider: profile?.role === "provider",
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
