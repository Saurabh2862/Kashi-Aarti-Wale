import Link from "next/link";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { VideoCarousel } from "@/components/video-carousel";
import { SiteFooter } from "@/components/site-shell";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const occasions = [
  {
    title: "Wedding Aarti",
    copy: "A ceremonial light offering for the couple, families, and a blessed beginning.",
    label: "Most requested",
  },
  {
    title: "Namkaran & Mundan",
    copy: "A gentle Vedic ceremony designed around your child and family traditions.",
    label: "Family ceremony",
  },
  {
    title: "Griha Pravesh",
    copy: "Invite auspicious energy into a new home with mantras, shankh, and deep daan.",
    label: "Home blessing",
  },
  {
    title: "Anniversary Aarti",
    copy: "Mark a shared milestone with a warm ceremony for the couple and their family.",
    label: "Milestone blessing",
  },
  {
    title: "Durga Puja Aarti",
    copy: "A powerful collective aarti arranged for homes, societies, and festive gatherings.",
    label: "Festival ceremony",
  },
  {
    title: "Community & Corporate",
    copy: "A coordinated spiritual opening for cultural programs, institutions, and large events.",
    label: "Large gatherings",
  },
];

const bookingSteps = [
  { icon: MessageCircle, title: "Share your plan", copy: "Tell us the occasion, date, city, and expected gathering size." },
  { icon: ClipboardCheck, title: "Receive a ceremony plan", copy: "We confirm availability and explain the format, team, and requirements." },
  { icon: CheckCircle2, title: "Confirm your booking", copy: "Approve the plan and secure your date after reviewing the complete quote." },
  { icon: Flame, title: "Welcome the aarti", copy: "Our team arrives with the agreed setup and conducts the ceremony at your venue." },
];

const faqs = [
  ["Can the aarti be performed outside Varanasi?", "Yes. The ceremony is designed for homes and venues across India, subject to team and travel availability for your date."],
  ["What information is needed to check availability?", "Your occasion, event date, city or pincode, venue type, and approximate guest count are enough to begin."],
  ["Are ritual materials included?", "The proposed ceremony plan lists the essential samagri and setup supplied by our team, so inclusions are clear before confirmation."],
  ["How early should we enquire?", "Earlier is better for wedding and festival dates. You can still enquire for a near-term event and the team will confirm what is possible."],
  ["Does submitting the form confirm my booking?", "No. The form creates a request. Your date is confirmed only after the team verifies availability and you approve the final plan."],
];

export default function Home() {
  const business = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kashi Aarti Wale",
    url: getSiteUrl().href,
    logo: new URL("/favicon.svg", getSiteUrl()).href,
    image: new URL("/social/kashi-aarti-wale.jpg", getSiteUrl()).href,
    description: "Ganga Aarti ceremonies for weddings, family rituals and special occasions across India.",
    telephone: "+917007667996",
    areaServed: "India",
    sameAs: process.env.INSTAGRAM_URL ? [process.env.INSTAGRAM_URL] : [],
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }} />
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Kashi Aarti Wale home">
          <span className="brand-mark" aria-hidden="true">
            <Flame size={20} strokeWidth={1.8} />
          </span>
          <span>
            <strong>Kashi Aarti Wale</strong>
            <small>काशी आरती वाले</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="#occasions">Occasions</Link>
          <Link href="#gallery">Videos</Link>
          <Link href="#process">How it works</Link>
          <Link href="/track">Track booking</Link>
        </nav>
        <Link className="header-cta" href="/book">
          Check availability
        </Link>
      </header>

      <section className="hero-shell">
        <div className="hero-story">
        <video className="hero-media" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/media/aarti-ceremony-04.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" aria-hidden="true" />

        <div className="hero-copy">
          <div className="hero-ornament" aria-hidden="true">ॐ</div>
          <p className="eyebrow">
            <Sparkles size={15} /> From the heart of Kashi
          </p>
          <h1>
            Bring the sacred
            <em> Ganga Aarti </em>
            to your celebration.
          </h1>
          <p className="hero-lede">
            Authentic Kashi-style ceremonies for weddings, family rituals, and
            auspicious occasions, performed at your venue across India.
          </p>
          <div className="hero-proof">
            <span><Check size={16} /> Trained Vedic pandits</span>
            <span><Check size={16} /> Complete samagri</span>
            <span><Check size={16} /> Pan-India service</span>
          </div>
        </div>

        </div>

        <aside className="availability-card" aria-labelledby="availability-title">
          <div className="card-heading">
            <span>Plan your ceremony</span>
            <strong id="availability-title">Check date availability</strong>
          </div>
          <form action="/book" method="get">
            <label>
              Occasion
              <select name="occasion" defaultValue="">
                <option value="" disabled>Select ceremony</option>
                <option value="wedding">Wedding Ganga Aarti</option>
                <option value="namkaran">Namkaran / Mundan</option>
                <option value="griha-pravesh">Griha Pravesh</option>
                <option value="anniversary">Anniversary</option>
                <option value="durga-puja">Durga Puja</option>
                <option value="other">Other occasion</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                <span><CalendarDays size={15} /> Event date</span>
                <input name="date" type="date" />
              </label>
              <label>
                <span><MapPin size={15} /> City / pincode</span>
                <input name="location" placeholder="e.g. Delhi 110001" />
              </label>
            </div>
            <button type="submit">Start booking <ArrowRight size={18} /></button>
          </form>
          <p className="card-note">No payment now. Our team confirms the plan and quote first.</p>
        </aside>
      </section>

      <section className="trust-strip" aria-label="Service highlights">
        <div><strong>2,000+</strong><span>locations served</span></div>
        <div><strong>4.8 / 5</strong><span>family rating</span></div>
        <div><strong>7 days</strong><span>booking support</span></div>
        <div><ShieldCheck size={27} /><span>clear pricing & confirmation</span></div>
      </section>

      <section className="occasion-section" id="occasions">
        <div className="section-intro">
          <div>
            <p className="eyebrow dark">Ceremonies we perform</p>
            <h2>One sacred tradition, shaped for your occasion.</h2>
          </div>
          <p>
            Every format includes trained pandits, ritual guidance, essential
            samagri, and an event-day coordinator.
          </p>
        </div>

        <div className="occasion-grid">
          {occasions.map((occasion, index) => (
            <article key={occasion.title}>
              <span className="occasion-number">0{index + 1}</span>
              <p className="occasion-label">{occasion.label}</p>
              <h3>{occasion.title}</h3>
              <p>{occasion.copy}</p>
              <Link href={`/book?occasion=${encodeURIComponent(occasion.title)}`}>
                Check this ceremony <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-heading">
          <p className="eyebrow dark">Simple from enquiry to aarti</p>
          <h2>Your ceremony,<br />carefully coordinated.</h2>
        </div>
        <div className="process-grid">
          {bookingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title}>
                <div className="process-icon"><Icon size={23} strokeWidth={1.7} /></div>
                <span>Step {String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ceremony-gallery" id="gallery">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow dark">Real ceremonies</p>
            <h2>See the devotion.<br />Feel the presence.</h2>
          </div>
          <p>
            Moments from ceremonies performed by our team. Every setup is
            thoughtfully adapted to the venue while preserving the spirit of Kashi.
          </p>
        </div>
        <VideoCarousel />
      </section>

      <section className="included-section" aria-labelledby="included-title">
        <div className="included-copy">
          <p className="eyebrow dark">Prepared with care</p>
          <h2 id="included-title">More than a performance. A complete ceremony experience.</h2>
          <p>Every proposal is built around your venue, family customs, and gathering size. You see the plan before you confirm.</p>
          <Link href="/book">Discuss your ceremony <ArrowRight size={17} /></Link>
        </div>
        <div className="included-list">
          <article><UsersRound /><div><strong>Experienced ceremony team</strong><p>Pandits and coordinators selected for your ceremony format.</p></div></article>
          <article><PackageCheck /><div><strong>Clearly listed samagri</strong><p>Required ritual items and setup are defined in your proposal.</p></div></article>
          <article><ShieldCheck /><div><strong>Transparent confirmation</strong><p>Date, scope, travel, and charges are agreed before booking.</p></div></article>
          <article><MessageCircle /><div><strong>Direct human support</strong><p>Speak with the team before and after placing your request.</p></div></article>
        </div>
      </section>

      <section className="experience-band" id="experience">
        <div>
          <p className="eyebrow">The Kashi experience</p>
          <h2>Shankh. Mantra. Deep. Blessings.</h2>
        </div>
        <p>
          A carefully coordinated sequence inspired by the ghats of Varanasi,
          adapted respectfully for your venue and family customs.
        </p>
        <Link href="/book">Plan your aarti <ArrowRight size={18} /></Link>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading">
          <p className="eyebrow dark">Before you book</p>
          <h2>Questions families often ask.</h2>
          <p>Need help with something specific? Call or message us and we will guide you personally.</p>
        </div>
        <div className="home-faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{question}</span><i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div>
          <p className="eyebrow">Begin with a conversation</p>
          <h2>Bring the light of Kashi to your special day.</h2>
        </div>
        <div className="closing-actions">
          <Link href="/book">Check your date <ArrowRight size={18} /></Link>
          <a href="https://wa.me/917007667996?text=Namaste%2C%20I%20want%20to%20plan%20a%20Ganga%20Aarti." target="_blank" rel="noreferrer">Talk on WhatsApp</a>
        </div>
      </section>

      <SiteFooter />

      <a className="whatsapp-float" href="https://wa.me/917007667996?text=Namaste%2C%20I%20want%20to%20plan%20a%20Ganga%20Aarti." target="_blank" rel="noreferrer" aria-label="Chat with Kashi Aarti Wale on WhatsApp">
        <MessageCircle size={24} aria-hidden="true" />
      </a>
    </main>
  );
}
