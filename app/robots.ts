import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api", "/onboarding"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://reviewtap.app"}/sitemap.xml`,
  };
}
