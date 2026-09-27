import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", getSiteUrl()).href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/book", getSiteUrl()).href, changeFrequency: "monthly", priority: 0.8 },
  ];
}
