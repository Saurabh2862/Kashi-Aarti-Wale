import { UPLOAD_LIMITS } from "@/lib/content-types";

export async function postJson<T = { ok: boolean }>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) throw new Error(result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Unable to complete the request. Please try again.");
  return result as T;
}
export async function checkFile(file: File, purpose: "gallery" | "cover" | "review") {
  const image = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const video = ["video/mp4", "video/webm"].includes(file.type);
  if ((!image && !video) || (purpose === "gallery" && !video) || (purpose === "cover" && !image)) throw new Error("Choose a JPG, PNG, WebP photo or MP4/WebM video of the correct type.");
  const limit = image ? UPLOAD_LIMITS.image : purpose === "review" ? UPLOAD_LIMITS.reviewVideo : UPLOAD_LIMITS.galleryVideo;
  if (!file.size || file.size > limit.bytes) throw new Error(`File must be smaller than ${limit.bytes / 1024 / 1024} MB.`);
  if (video) {
    const duration = await new Promise<number>((resolve, reject) => {
      const element = document.createElement("video"), url = URL.createObjectURL(file);
      const cleanup = () => { clearTimeout(timer); element.removeAttribute("src"); element.load(); URL.revokeObjectURL(url); };
      const timer = setTimeout(() => { cleanup(); reject(new Error("Could not read the video. Try an MP4 file.")); }, 10000);
      element.preload = "metadata";
      element.onloadedmetadata = () => { const value = element.duration; cleanup(); resolve(value); };
      element.onerror = () => { cleanup(); reject(new Error("This video cannot be read. Try an MP4 file.")); };
      element.src = url;
    });
    if (!Number.isFinite(duration) || duration > limit.duration + .5) throw new Error(`Video must be ${limit.duration} seconds or shorter.`);
  }
  return image ? "image" as const : "video" as const;
}
export async function uploadFile(file: File, purpose: "gallery" | "cover" | "review", progress: (percent: number) => void, session?: { reviewId: string; token: string; slot: number }) {
  const kind = await checkFile(file, purpose);
  const grant = await postJson<{ id: string; params: Record<string, string | number | boolean>; signature: string; apiKey: string; uploadUrl: string }>("/api/uploads", { action: "prepare", purpose, kind, ...session });
  const data = new FormData();
  for (const [key, value] of Object.entries(grant.params)) data.append(key, String(value));
  data.append("signature", grant.signature); data.append("api_key", grant.apiKey); data.append("file", file);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", grant.uploadUrl); xhr.timeout = 180000;
    xhr.upload.onprogress = e => { if (e.lengthComputable) progress(Math.round(e.loaded / e.total * 90)); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Media upload was rejected. Check the size and format, then try again."));
    xhr.onerror = () => reject(new Error("Upload connection failed. Check your internet connection."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Try a smaller file."));
    xhr.send(data);
  });
  await postJson("/api/uploads", { action: "complete", id: grant.id, token: session?.token });
  progress(100);
  return grant.id as string;
}

