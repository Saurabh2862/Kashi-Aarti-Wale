import type { ReactNode } from "react";
import { InnerHeader, SiteFooter } from "@/components/site-shell";

export function PolicyLayout({ title, children }: { title: string; children: ReactNode }) {
  return <main className="inner-page"><InnerHeader /><article className="policy-page"><p className="eyebrow dark">Kashi Aarti Wale</p><h1>{title}</h1><p className="policy-updated">Last updated: 27 September 2026</p>{children}<section><h2>Contact us</h2><p>For questions about this policy or your booking, call <a href="tel:+917007667996">+91 70076 67996</a> or <a href="https://wa.me/917007667996">message us on WhatsApp</a>.</p></section></article><SiteFooter /></main>;
}
