import { v2 as cloudinary } from "cloudinary";
import { HttpError } from "@/lib/api-guard";
import { UPLOAD_LIMITS } from "@/lib/content-types";

export function cloudinaryReady() {
  return process.env.MEDIA_UPLOADS_ENABLED === "true" && Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
export function cloud() {
  if (!cloudinaryReady()) throw new HttpError(503, "Media uploads are not configured yet. Please contact the team.");
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
  return cloudinary;
}
export function uploadPolicy(purpose: string, kind: string) {
  if (kind === "image") return { ...UPLOAD_LIMITS.image, preset: "kaw_image_v1" };
  return purpose === "review" ? { ...UPLOAD_LIMITS.reviewVideo, preset: "kaw_review_video_v1" } : { ...UPLOAD_LIMITS.galleryVideo, preset: "kaw_gallery_video_v1" };
}
export function uploadSignature(asset: { publicId: string; purpose: string; kind: string }) {
  const sdk = cloud();
  const params = { timestamp: Math.floor(Date.now() / 1000), public_id: asset.publicId, upload_preset: uploadPolicy(asset.purpose, asset.kind).preset, type: "authenticated", overwrite: false };
  return { params, signature: sdk.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!), apiKey: process.env.CLOUDINARY_API_KEY, uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${asset.kind}/upload` };
}
export function signedMediaUrl(asset: { publicId: string; kind: string; format: string | null; version: number | null }) {
  return cloud().url(asset.publicId, { type: "authenticated", resource_type: asset.kind, format: asset.format || undefined, version: asset.version || undefined, sign_url: true, secure: true });
}
