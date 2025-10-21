import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { SupportedLocale } from "@/types/locale.types";
import { formatReadableDate } from "@/lib/utils";
import { Blog } from "@/types/blogs.types";
import HeadComponent from "@/components/head-component";
import type { GetServerSideProps } from "next";
import { normalizeLocale } from "@/lib/i18n";
import { loadMdxWithRawContent } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote";
import CodeBlock from "@/components/CodeBlock";
import { ScrollArea } from "@/components/ui/scroll-area";

type LocaleText = { english?: string; bangla?: string; };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BLOG_ENDPOINT = `${API_URL}/blogs`;

type Props = {
  locale: SupportedLocale;
  slug: string;
  blog: Blog;
  relatedPosts: Array<
    Pick<Blog, "_id" | "slug" | "title" | "createdAt" | "category">
  >;
  canonicalUrl: string;
  source: any;
  headings: Array<{ id: string; text: string; depth: number }>;
  sourceVersion: string;
};

function pickByLocale(obj: LocaleText | undefined, locale: SupportedLocale) {
  if (!obj) return "";
  if (locale === "bn") return obj.bangla ?? obj.english ?? "";
  return obj.english ?? "";
}

function SocialShare({ url, title }: { url: string; title: string }) {
  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const items = [
    {
      name: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    },
    {
      name: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      name: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
      ),
      href: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Social Share</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {items.map((i, key) => (
            <Button asChild key={key} size="sm" variant="outline">
              <a href={i.href} target="_blank" rel="noreferrer noopener">
                {i.name}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedPosts({
  relatedPosts,
  locale,
}: {
  relatedPosts: Array<
    Pick<Blog, "_id" | "slug" | "title" | "createdAt" | "category">
  >;
  locale: SupportedLocale;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No related posts.</p>
        ) : (
          relatedPosts.map((r) => {
            const title = pickByLocale(r.title, locale);
            const href = `/${locale}/blogs/${r.slug}`;
            return (
              <div key={String(r._id)} className="space-y-1">
                <Link
                  href={href}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {title}
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatReadableDate(r.createdAt)}</span>
                  <span>•</span>
                  <span className="capitalize">{r.category}</span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default function BlogDetailsSSR({
  locale,
  slug,
  blog,
  relatedPosts,
  canonicalUrl,
  source,
  headings,
}: Props) {
  const title = pickByLocale(blog?.title, locale);
  const summary = pickByLocale(blog?.summary, locale);

  const onTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      <HeadComponent
        title={
          locale === "bn"
            ? blog?.title?.bangla
            : blog?.title?.english || "Bnlang Blog"
        }
        description={
          locale === "bn"
            ? blog?.summary?.bangla
            : blog?.summary?.english || "Bnlang Blog"
        }
        locale={locale}
        pathname={`/${locale}/blogs/${slug}`}
        ogImage={`${
          process.env.NEXT_PUBLIC_STATIC_CDN_URL || ""
        }/uploads/blogs/${blog?.thumbnail || ""}`}
        type="article"
      />

      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{summary}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Updated {formatReadableDate(blog.updatedAt || new Date())}
                </span>
                <span>•</span>
                <span className="capitalize">Category: {blog.category}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <article className="prose prose-zinc dark:prose-invert max-w-none [&_*:where(h2,h3,h4)]:scroll-mt-24">
              <MDXRemote
                {...source}
                components={{
                  pre: CodeBlock,
                }}
              />
            </article>
          </article>

          <aside className="lg:col-span-4 space-y-6 sticky top-16 h-[calc(100vh-4rem)]">
            <div className="hidden xl:block">
              <ScrollArea className="h-full px-3 pb-4">
                <div className="mb-3 text-lg">On this page</div>
                {headings.length > 0 ? (
                  <nav aria-label="Table of contents" className="space-y-3">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => onTocClick(e, h.id)}
                        className={[
                          "block text-base leading-5 hover:underline",
                          h.depth === 2
                            ? "ml-0"
                            : h.depth === 3
                            ? "ml-3"
                            : "ml-6",
                          "text-foreground/80 hover:text-foreground",
                        ].join(" ")}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <div className="text-xs text-muted-foreground">—</div>
                )}
              </ScrollArea>
            </div>
            <SocialShare url={canonicalUrl} title={title || ""} />
            <RelatedPosts relatedPosts={relatedPosts} locale={locale} />
          </aside>
        </div>
        <Footer locale={locale} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { params, query } = ctx;
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale = normalized as SupportedLocale;

  const slug = (query?.slug as string | undefined)?.trim();
  if (!slug) return { notFound: true };

  const detailRes = await fetch(
    `${BLOG_ENDPOINT}/${encodeURIComponent(slug)}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!detailRes.ok) return { notFound: true };
  const data = await detailRes.json();

  if (!data?.result?.status) return { notFound: true };

  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL
  }/${locale}/blogs/${encodeURIComponent(slug)}`;

  const loaded = await loadMdxWithRawContent(
    locale === "bn"
      ? data.result.description.bangla
      : data.result.description.english
  );

  if (!loaded.found) return { notFound: true };

  return {
    props: {
      locale,
      slug,
      blog: data.result as Blog,
      relatedPosts: (data.relatedPosts || []) as Array<
        Pick<Blog, "_id" | "slug" | "title" | "createdAt" | "category">
      >,
      canonicalUrl,
      source: loaded.mdx,
      headings: loaded.headings,
      sourceVersion: loaded.sourceVersion,
    },
  };
};
