import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://reviewtap.app";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/google-reviews", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/trustpilot-reviews", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/facebook-reviews", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/tripadvisor-reviews", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/shop", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/signup", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
