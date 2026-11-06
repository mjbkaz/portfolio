import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/thank-you" },
    sitemap: `${url}/sitemap.xml`,
  };
}
