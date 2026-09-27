import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const privateDeployment = process.env.VERCEL_ENV === "preview" || getSiteUrl().hostname === "localhost";
  return {
    rules: { userAgent: "*", allow: privateDeployment ? undefined : "/", disallow: privateDeployment ? "/" : ["/api/", "/admin", "/track"] },
    sitemap: privateDeployment ? undefined : new URL("/sitemap.xml", getSiteUrl()).href,
  };
}
