import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";
import DangerZone from "@/components/account/DangerZone";

export default function MyAccountContent() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
    if (user) setEmail(user.email || "");
  }, [profile, user]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!user) return;
    setLoading(true);

    const updates: any = { id: user.id, full_name: fullName };

    const { error: profileError } = await supabase.from("profiles").upsert(updates);
    if (profileError) {
      setMessage({ type: "error", text: profileError.message });
      setLoading(false);
      return;
    }

    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        setMessage({ type: "error", text: emailError.message });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setMessage({ type: "success", text: t("account.saved_success") });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (password.length < 1) {
      setMessage({ type: "error", text: "Please enter a new password." });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    
    setLoading(true);
    const { error } = await supabase.rpc("delete_user");
    
    if (error) {
      setMessage({ type: "error", text: "Failed to delete account: " + error.message });
      setLoading(false);
    } else {
      await signOut();
      window.location.href = "/";
    }
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">My Account</h1>
          <p className="mt-2 text-muted-foreground">Manage your personal settings</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
          }`}>
            {message.text}
          </div>
        )}

        <ProfileForm
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          user={user}
          loading={loading}
          onSubmit={handleUpdateProfile}
          t={t}
        />

        <PasswordForm
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          onSubmit={handleUpdatePassword}
          t={t}
        />

        <DangerZone onDelete={handleDeleteAccount} loading={loading} t={t} />
      </div>
    </div>
  );
}
