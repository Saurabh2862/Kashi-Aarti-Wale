/* eslint-disable @next/next/no-img-element -- Authenticated media uses a permission-checking redirect, not the public image optimizer. */
import { Star } from "lucide-react";
import type { Review } from "@/lib/content-types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <div className="content-empty"><h3>Your experience can help another family.</h3><p>No published reviews yet. Share an honest account of your ceremony. Reviews appear after moderation.</p></div>;
  return <div className="review-grid">{reviews.map(review => <article className="review-card" key={review.id}>
    <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={17} fill={i < review.rating ? "currentColor" : "none"} aria-hidden="true" />)}</div>
    <p className="review-message">{review.message}</p><div className="review-author"><strong>{review.name}</strong><span>{review.ceremony}</span></div>
    {review.attachments.length > 0 && <div className="review-attachments">{review.attachments.map(asset => asset.kind === "image" ? <a key={asset.id} href={asset.url} target="_blank" rel="noopener noreferrer" aria-label={`Open photo shared by ${review.name}`}><img src={asset.url} alt={`Ceremony photo shared by ${review.name}`} loading="lazy" width="400" height="300" /></a> : <video key={asset.id} controls playsInline preload="none" src={asset.url} aria-label={`Video review by ${review.name}`} />)}</div>}
  </article>)}</div>;
}
