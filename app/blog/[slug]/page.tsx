import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/current-user";
import { LandingHeader } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { Container } from "@/components/ui/Container";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const currentUser = await getCurrentUser();
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug,
  ).slice(0, 3);

  return (
    <div>
      <LandingHeader isLoggedIn={Boolean(currentUser)} />

      <article className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-ink-900">
            ← All articles
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <span className="badge bg-brand-50 text-brand-700">{post.category}</span>
            <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{post.excerpt}</p>

          <div className="mt-10 space-y-8">
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="text-xl font-semibold text-ink-900">{section.heading}</h2>
                )}
                <div className={`space-y-4 text-base leading-relaxed text-gray-600 ${section.heading ? "mt-3" : ""}`}>
                  {section.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-ink-900">Try it on your own business</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a free account and configure your destinations — activation is the only thing
              that needs a subscription.
            </p>
            <div className="mt-4">
              {currentUser ? (
                <Link href="/dashboard" className="btn-primary px-6 py-2.5">
                  Go to dashboard
                </Link>
              ) : (
                <Link href="/signup" className="btn-primary px-6 py-2.5">
                  Create your free account
                </Link>
              )}
            </div>
          </div>
        </Container>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <Container className="max-w-2xl">
            <h2 className="text-lg font-semibold text-ink-900">More on {post.category.toLowerCase()}</h2>
            <div className="mt-4 space-y-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="card block hover:border-gray-300"
                >
                  <h3 className="text-sm font-semibold text-ink-900">{related.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Footer />
      <CookieBanner />
    </div>
  );
}
