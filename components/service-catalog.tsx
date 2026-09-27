"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Flame, House, BookOpen, Heart } from "lucide-react";
import { SERVICE_CATEGORIES, type Service } from "@/lib/content-types";

const icons = { Aarti: Flame, "Home & Family": House, "Pujas & Path": BookOpen, "Marriage Rituals": Heart };
export function ServiceCatalog({ services }: { services: Service[] }) {
  const [category, setCategory] = useState("All ceremonies");
  const visible = services.filter(s => category === "All ceremonies" || s.category === category);
  return <div className="service-catalog">
    <div className="service-filters" aria-label="Filter ceremonies">{["All ceremonies", ...SERVICE_CATEGORIES.filter(c => services.some(s => s.category === c))].map(c => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <p className="catalog-count" aria-live="polite">{visible.length} {visible.length === 1 ? "ceremony" : "ceremonies"} available to enquire about</p>
    <div className="service-cards">{visible.map(service => { const Icon = icons[service.category as keyof typeof icons] || Flame; return <article key={service.id}>
      <div className="service-card-top"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span>{service.category}</span></div>
      <h3>{service.name}</h3><p>{service.description}</p><Link href={`/book?occasion=${encodeURIComponent(service.slug)}`}>Enquire about this ceremony <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </article>; })}</div>
    {!visible.length && <p className="content-empty">The ceremony list is temporarily unavailable. Please contact us to discuss your puja.</p>}
  </div>;
}
