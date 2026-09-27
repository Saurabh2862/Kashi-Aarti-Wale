import Link from "next/link";
import { Flame } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social-links";

export function InnerHeader() {
  return (
    <header className="inner-header">
      <Link className="brand" href="/" aria-label="Kashi Aarti Wale home">
        <span className="brand-mark" aria-hidden="true"><Flame size={19} /></span>
        <span><strong>Kashi Aarti Wale</strong><small>काशी आरती वाले</small></span>
      </Link>
      <nav aria-label="Secondary navigation">
        <Link href="/#occasions">Occasions</Link>
        <Link href="/track">Track booking</Link>
        <Link className="inner-cta" href="/book">Book now</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">Kashi Aarti Wale</Link>
        <p>Authentic Kashi-style ceremonies, thoughtfully organized for families across India.</p>
      </div>
      <div>
        <strong>Quick links</strong>
        <Link href="/book">Book a ceremony</Link>
        <Link href="/#about">About Priyanshu</Link>
        <Link href="/reviews">Reviews & feedback</Link>
        <Link href="/track">Track booking</Link>
        <Link href="/admin">Owner dashboard</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms & Conditions</Link>
      </div>
      <div>
        <strong>Booking support</strong>
        <a href="tel:+917007667996">+91 70076 67996</a>
        <a href="https://wa.me/917007667996">WhatsApp support</a>
        <a className="footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><InstagramIcon /> {INSTAGRAM_HANDLE}<span className="sr-only"> on Instagram (opens in a new tab)</span></a>
        <span>8:00 AM – 10:00 PM</span>
      </div>
    </footer>
  );
}
