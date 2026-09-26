"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: String(form.get("password") || "") }),
      });
      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) as { error?: string } : {};
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
      setBusy(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-password">Owner password</label>
      <div className="admin-password-field">
        <LockKeyhole size={18} aria-hidden="true" />
        <input
          id="admin-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          autoFocus
          required
        />
        <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="admin-login-error" role="alert">{error}</p>}
      <button className="admin-login-submit" type="submit" disabled={busy}>
        {busy ? <><LoaderCircle className="spin" size={18} /> Signing in</> : <>Open dashboard <ArrowRight size={18} /></>}
      </button>
    </form>
  );
}
