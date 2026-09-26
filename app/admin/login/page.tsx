import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Flame, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Owner Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <Link className="admin-login-brand" href="/"><Flame size={21} /> Kashi Aarti Wale</Link>
        <div className="admin-login-copy">
          <p>Private owner access</p>
          <h1>Welcome back.</h1>
          <span>Sign in to review booking requests and manage ceremony status.</span>
        </div>
        <AdminLoginForm />
        <div className="admin-login-security"><ShieldCheck size={17} /><span>Protected by an encrypted, HTTP-only session.</span></div>
      </section>
      <aside className="admin-login-visual" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/media/aarti-ceremony-04.mp4" type="video/mp4" />
        </video>
        <div />
        <p>Owner desk<br /><span>काशी आरती वाले</span></p>
      </aside>
    </main>
  );
}
