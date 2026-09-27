import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", getSiteUrl()).href, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/book", getSiteUrl()).href, changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/privacy", getSiteUrl()).href, changeFrequency: "yearly", priority: 0.2 },
    { url: new URL("/terms", getSiteUrl()).href, changeFrequency: "yearly", priority: 0.2 },
  ];
}
