export function getSiteUrl() {
  return new URL(
    process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://kashi-aarti-wale.vercel.app"),
  );
}
