export const SERVICE_CATEGORIES = ["Aarti", "Home & Family", "Pujas & Path", "Marriage Rituals"] as const;
export type Service = { id: number; slug: string; name: string; description: string; category: string; active: boolean; position: number };
export type GalleryVideo = { id: string; title: string; description: string; ceremony: string; location: string; src: string; poster?: string; active: boolean; position: number; assetId: string | null; coverId: string | null };
export type Review = { id: string; name: string; ceremony: string; rating: number; message: string; status: string; createdAt: string; attachments: { id: string; kind: string; url: string }[] };
export const UPLOAD_LIMITS = {
  image: { bytes: 3 * 1024 * 1024, duration: 0 },
  reviewVideo: { bytes: 20 * 1024 * 1024, duration: 30 },
  galleryVideo: { bytes: 50 * 1024 * 1024, duration: 120 },
};
