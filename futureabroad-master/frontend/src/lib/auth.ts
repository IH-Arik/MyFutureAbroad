import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export async function signUp(email: string, password: string, fullName: string, legalAccepted: boolean = false) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, legal_agreed: legalAccepted } },
  });
  return { data, error };
}

export async function signUpWithRole(email: string, password: string, role: "client" | "provider", fullName: string, legalAccepted: boolean = false) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, full_name: fullName, legal_agreed: legalAccepted } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return subscription;
}
