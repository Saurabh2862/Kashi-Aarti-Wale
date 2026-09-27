"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Star, Send } from "lucide-react";
import { checkFile, postJson, uploadFile } from "@/lib/upload-client";
import type { Service } from "@/lib/content-types";

export function ReviewForm({ services }: { services: Service[] }) {
  const [challenge, setChallenge] = useState("");
  const [uploads, setUploads] = useState(false);
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [done, setDone] = useState(false), [progress, setProgress] = useState("");
  const draft = useRef<{ id: string; token: string; uploaded: number } | null>(null);
  useEffect(() => { let active = true; fetch("/api/reviews", { cache: "no-store" }).then(r => r.json()).then(result => { const data = result as { challenge?: string; uploadsEnabled?: boolean }; if (active) { setChallenge(data.challenge || ""); setUploads(Boolean(data.uploadsEnabled)); if (!data.challenge) setError("Review form is temporarily unavailable. Please refresh shortly."); } }).catch(() => { if (active) setError("Could not load the review form. Please refresh."); }); return () => { active = false; }; }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setError("");
    if (!rating) { setError("Choose a rating from 1 to 5 stars."); return; }
    setBusy(true);
    try {
      if (!draft.current) {
        const kinds = [];
        for (const file of files) kinds.push(await checkFile(file, "review"));
        if (files.length > 2 || (kinds.includes("video") && files.length > 1)) throw new Error("Choose up to two photos OR one video.");
        const session = await postJson<{ id: string; token: string }>("/api/reviews", { name: data.get("name"), ceremony: data.get("ceremony"), message: data.get("message"), rating, consent: data.get("consent") === "on", challenge, website: data.get("website"), attachments: kinds });
        draft.current = { ...session, uploaded: 0 };
      }
      const session = draft.current!;
      for (let slot = session.uploaded; slot < files.length; slot++) {
        await uploadFile(files[slot], "review", percent => setProgress(`Uploading attachment ${slot + 1} of ${files.length}: ${percent}%`), { reviewId: session.id, token: session.token, slot });
        session.uploaded = slot + 1;
      }
      await postJson("/api/reviews", { action: "finish", id: session.id, token: session.token });
      setDone(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to send review."); } finally { setBusy(false); setProgress(""); }
  }
  if (done) return <div className="review-thanks" role="status"><h3>Thank you for sharing your experience.</h3><p>Your review and attachments are private until the owner approves them. They will not appear immediately.</p></div>;
  return <form className="review-form" onSubmit={submit}>
    <h2>Share your experience</h2><p>Tell another family what your ceremony was like. All ratings are welcome.</p>
    <fieldset disabled={busy || Boolean(draft.current)}><legend className="sr-only">Your review</legend>
      <div className="review-fields"><label>Your display name<input name="name" minLength={2} maxLength={80} autoComplete="name" required /></label><label>Ceremony<select name="ceremony" required defaultValue=""><option value="" disabled>Select a ceremony</option>{services.map(s => <option key={s.id}>{s.name}</option>)}<option>Other / previous ceremony</option></select></label></div>
      <fieldset className="rating-input"><legend>Your rating</legend>{[1, 2, 3, 4, 5].map(value => <label key={value} className={value <= rating ? "selected" : ""}><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} required /><Star size={26} fill={value <= rating ? "currentColor" : "none"} aria-hidden="true" /><span className="sr-only">{value} {value === 1 ? "star" : "stars"}</span></label>)}<span>{rating ? `${rating} / 5` : "Choose a rating"}</span></fieldset>
      <label>Your message<textarea name="message" minLength={15} maxLength={1500} rows={5} required placeholder="What went well? What could we improve?" /></label>
      <div className="review-honeypot" aria-hidden="true"><label>Leave this empty<input name="website" autoComplete="off" tabIndex={-1} /></label></div>
      <label>Photos or video (optional)<input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple disabled={!uploads} onChange={event => { setError(""); const chosen = Array.from(event.target.files || []); if (chosen.length > 2 || (chosen.some(f => f.type.startsWith("video/")) && chosen.length !== 1)) { setError("Choose up to two photos OR one video, not both."); event.target.value = ""; setFiles([]); } else setFiles(chosen); }} /></label>
      <p className="form-help">Up to 2 photos (3 MB each) or 1 video (20 MB, 30 seconds). JPG, PNG, WebP, MP4, or WebM. {files.length > 0 && `${files.length} file(s) selected.`} {!uploads && "Attachments are currently unavailable; text reviews still work."}</p>
      <label className="consent-check"><input type="checkbox" name="consent" required /><span>I permit publication of my display name, review, rating, and attachments after approval. I have permission from people identifiable in my attachments.</span></label>
      <p className="form-help">Do not include phone numbers or other private information in your review. Read our <Link href="/privacy">Privacy Policy</Link>.</p>
    </fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}{progress && <p role="status">{progress}</p>}
    {draft.current && !busy && <p className="form-help">Your draft is saved for this session. Retry to finish the remaining uploads, or refresh to start over.</p>}
    <button type="submit" disabled={busy || !challenge}><Send size={17} aria-hidden="true" />{busy ? "Sending your review..." : draft.current ? "Retry submission" : "Submit for approval"}</button>
  </form>;
}

