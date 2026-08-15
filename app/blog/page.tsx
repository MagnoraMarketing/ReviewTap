import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/current-user";
import { LandingHeader } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { Container } from "@/components/ui/Container";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-posts";
import { formatDate } from "@/lib/utils";

const title = "Blog — Get More Reviews with ReviewTap";
const description =
  "Guides on collecting more customer reviews: dashboard tips, review analytics, multi-platform strategy, and getting the most out of your ReviewTap NFC/QR card.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog", type: "website" },
};

const CATEGORIES: BlogPost["category"][] = [
  "Dashboard",
  "Analytics",
  "Multi-platform",
  "Getting started",
  "Strategy",
];

export default async function BlogIndexPage() {
  const currentUser = await getCurrentUser();
  const posts = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div>
      <LandingHeader isLoggedIn={Boolean(currentUser)} />

      <section className="bg-gradient-to-b from-brand-50/60 to-white py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <span className="badge bg-brand-50 text-brand-700">ReviewTap Blog</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Get more reviews, with less guesswork
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Practical guides on collecting reviews across Google, Trustpilot, Facebook and
            Tripadvisor — dashboard tips, analytics, and what actually moves the number of reviews
            you collect.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {currentUser ? (
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Go to dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Create your free account
              </Link>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <span key={category} className="badge bg-gray-100 text-gray-600">
                {category}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card flex flex-col hover:border-gray-300">
                <span className="badge w-fit bg-brand-50 text-brand-700">{post.category}</span>
                <h2 className="mt-3 text-base font-semibold text-ink-900">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-gray-500">{post.excerpt}</p>
                <p className="mt-4 text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container className="max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Ready to see it running on your own business?
          </h2>
          <p className="mt-3 text-gray-500">
            Create a free account, configure your destinations, and preview the whole dashboard —
            no payment required until you activate a live device.
          </p>
          <div className="mt-6">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Create your free account
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}
