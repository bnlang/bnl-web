import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { SupportedLocale } from "@/types/locale.types";
import { Tutorial } from "@/types/tutorials.types";
import { formatReadableDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import HeadComponent from "@/components/head-component";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TUTORIAL_ENDPOINT = `${API_URL}/tutorials`;

function pickByLocale<T extends Record<string, string>>(
  obj: T | undefined,
  locale: SupportedLocale
) {
  if (!obj) return "";
  if (locale === "bn") return obj.bangla ?? obj.english ?? "";
  if (locale === "banglish") return obj.banglish ?? obj.english ?? "";
  return obj.english ?? "";
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-52 w-full" />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
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
    Pick<Tutorial, "_id" | "slug" | "title" | "createdAt" | "category" | "tags">
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
            const href = `/${locale}/tutorials/${r.slug}`;
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
                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default function TutorialDetailsCSR() {
  const router = useRouter();
  const { locale = "en", slug } = router.query as {
    locale?: SupportedLocale;
    slug?: string;
  };

  const [loading, setLoading] = React.useState(true);
  const [tutorial, setTutorial] = React.useState<Tutorial | null>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<
    Array<
      Pick<
        Tutorial,
        "_id" | "slug" | "title" | "createdAt" | "category" | "tags"
      >
    >
  >([]);

  const canonicalUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/${locale || "en"}/tutorials/${slug || ""}`;

  React.useEffect(() => {
    if (!slug) return;

    const ac = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const [detailRes] = await Promise.all([
          fetch(`${TUTORIAL_ENDPOINT}/${encodeURIComponent(slug as string)}`, {
            signal: ac.signal,
          }),
          fetch(`${TUTORIAL_ENDPOINT}?limit=6&page=1&status=1`, {
            signal: ac.signal,
          }),
        ]);

        if (!detailRes.ok)
          throw new Error(`Failed to load tutorial (${detailRes.status})`);
        const detailJson = await detailRes.json();
        if (!detailJson?.result?.status)
          throw new Error("This post is not published.");

        setTutorial(detailJson.result);
        setRelatedPosts(detailJson.relatedPosts);
      } catch (err: any) {
        const msg = err?.message || "Failed to load tutorial";
        toast.error(msg);
        setTutorial(null);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [slug]);

  const title = pickByLocale(
    tutorial?.title,
    (locale as SupportedLocale) || "en"
  );
  const summary = pickByLocale(
    tutorial?.summary,
    (locale as SupportedLocale) || "en"
  );
  const description = pickByLocale(
    tutorial?.description,
    (locale as SupportedLocale) || "en"
  );

  return (
    <div className="min-h-screen">
      <Head>
        <title>{title ? `${title} — Tutorials` : "Loading… — Tutorials"}</title>
        <meta name="description" content={summary || title || "Tutorial"} />
        <meta property="og:title" content={title || "Tutorial"} />
        <meta
          property="og:description"
          content={summary || title || "Tutorial"}
        />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <HeadComponent
        title={
          locale === "bn"
            ? tutorial?.title.bangla
            : locale === "banglish"
            ? tutorial?.title.banglish
            : tutorial?.title.english || "Tutorial"
        }
        description={
          locale === "bn"
            ? tutorial?.summary.bangla
            : locale === "banglish"
            ? tutorial?.summary.banglish
            : tutorial?.summary.english || "Tutorial"
        }
        locale={locale}
        pathname={`/${locale}/tutorials/${slug}`}
        type="article"
      />

      <Header />

      {loading ? (
        <PageSkeleton />
      ) : !tutorial ? (
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                Could not load this tutorial.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{summary}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Updated {formatReadableDate(tutorial.updatedAt || new Date())}
                </span>
                <span>•</span>
                <span className="capitalize">
                  Category: {tutorial.category}
                </span>
              </div>

              {tutorial.tags && tutorial.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tutorial.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="capitalize">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            </div>
          </article>
          <aside className="lg:col-span-4 space-y-6">
            <SocialShare url={canonicalUrl} title={title || ""} />
            <RelatedPosts
              relatedPosts={relatedPosts}
              locale={(locale as SupportedLocale) || "en"}
            />
          </aside>
        </div>
      )}
      <Footer locale={(locale as SupportedLocale) || "en"} />
    </div>
  );
}
