import type { Metadata } from "next";
import { InnerHeader, SiteFooter } from "@/components/site-shell";
import { ReviewList } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { getReviews, getServices, reviewSummary } from "@/lib/content";

export const metadata: Metadata = { title: "Ceremony Reviews", description: "Read experiences shared by families and leave an honest review of your ceremony with Kashi Aarti Wale.", alternates: { canonical: "/reviews" } };
export const revalidate = 60;
export default async function ReviewsPage() {
  let content;
  try {
    const reviews = await getReviews(), services = await getServices(), summary = await reviewSummary();
    content = <><section className="reviews-public"><div className="reviews-heading"><h2>Shared by our visitors</h2>{summary.count > 0 && <p><strong>{summary.average} / 5</strong> from {summary.count} approved {summary.count === 1 ? "review" : "reviews"}</p>}</div><ReviewList reviews={reviews} />{summary.count > reviews.length && <p>Showing the latest {reviews.length} approved reviews.</p>}</section><section className="review-form-section" id="write-review"><ReviewForm services={services} /></section></>;
  } catch { content = <div className="content-empty">Reviews are temporarily unavailable. Please try again shortly.</div>; }
  return <main className="inner-page"><InnerHeader /><section className="page-heading"><p className="eyebrow dark">Honest experiences</p><h1>Every ceremony has a story.</h1><p>Share what your experience was like. Reviews are moderated before publication. Approval is not independent verification of a booking.</p></section>{content}<SiteFooter /></main>;
}
