import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social-links";
import portrait from "@/public/images/about/priyanshu-pandey-portrait.jpg";
import bell from "@/public/images/about/aarti-bell.jpg";
import prayer from "@/public/images/about/ceremony-prayer.jpg";

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-layout">
        <figure className="about-portrait">
          <Image src={portrait} alt="Priyanshu Pandey (Sachin) greeting with folded hands in ceremonial attire" placeholder="blur" sizes="(max-width: 760px) 90vw, 40vw" />
          <figcaption><span>Kashi Aarti Wale</span><strong>Devotion, with a personal touch.</strong></figcaption>
        </figure>
        <div className="about-copy">
          <p className="eyebrow dark">Meet your ceremony guide</p>
          <h2 id="about-title">Priyanshu Pandey <em>(Sachin)</em></h2>
          <p className="about-introduction">Ganga Aarti, Rudrabhishek, and Puja Path.</p>
          <p>Meet Priyanshu, the person behind the ceremonies you see here. Through Kashi Aarti Wale, he performs aarti and pujas for weddings, homes, and family occasions.</p>
          <p>Whether you are planning a wedding, welcoming a new beginning, or arranging a puja at home, share your traditions and requirements. We will discuss the rituals, samagri, and arrangements with you before you book.</p>
          <ul className="about-services" aria-label="Ceremonies offered">
            <li>Ganga Aarti</li><li>Rudrabhishek</li><li>Puja Path</li>
          </ul>
          <dl className="about-education">
            <div><dt>Shastri (B.A. Honours equivalent)</dt><dd>First-year student, Banaras Hindu University (BHU), Varanasi</dd></div>
            <div><dt>Madhyama (10+2 equivalent)</dt><dd>Shri Bhagwan Vishnu Swami Satua Baba Sanskrit Higher Secondary School, Varanasi</dd></div>
          </dl>
          <div className="about-actions">
            <Link href="/book">Plan a puja with us <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><InstagramIcon /> {INSTAGRAM_HANDLE}<span className="sr-only"> on Instagram (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
      <div className="about-moments">
        <div className="about-moments-heading">
          <p className="eyebrow dark">From our ceremonies</p>
          <h3>The people.<br />The prayer.<br /><em>The presence.</em></h3>
          <p>A closer look at the moments behind the aarti.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">More on Instagram <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <figure><div className="about-moment-image"><Image src={bell} alt="Priyanshu holding a brass bell during an aarti ceremony" placeholder="blur" sizes="(max-width: 760px) 44vw, 30vw" /></div><figcaption>The rhythm of aarti</figcaption></figure>
        <figure><div className="about-moment-image"><Image src={prayer} alt="Priyanshu offering prayers with people gathered for a ceremony" placeholder="blur" sizes="(max-width: 760px) 44vw, 30vw" /></div><figcaption>Moments of shared prayer</figcaption></figure>
      </div>
    </section>
  );
}
