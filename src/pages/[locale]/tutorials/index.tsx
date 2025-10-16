/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticProps } from "next";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { SupportedLocale } from "@/types/locale.types";
import { normalizeLocale } from "@/lib/i18n";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { tutorialCategories } from "@/lib/data/tutorial-categories";
import HeadComponent from "@/components/head-component";
import { Tutorial } from "@/types/tutorials.types";
import { formatReadableDate } from "@/lib/utils";

type TutorialsResponse = {
  total: number;
  page: number;
  limit: number;
  records: Tutorial[];
};

type Props = { locale: SupportedLocale };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const ENDPOINT = `${API_URL}/tutorials`;
const DEFAULT_LIMIT = 9;

const TAGS = ["Bnlang", "BPM", "Syntax", "Modules"];

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
};

async function fetchTutorials(opts: {
  page: number;
  limit: number;
  q?: string;
  category?: string;
  tags?: string[];
  signal?: AbortSignal;
}): Promise<TutorialsResponse> {
  const { page, limit, q, category, tags, signal } = opts;
  const qs = buildQuery({
    page,
    limit,
    keyword: q,
    category: category && category !== "All" ? category : undefined,
    tags: tags && tags.length ? tags.join(",") : undefined,
  });

  const res = await fetch(`${ENDPOINT}?${qs}`, { signal, cache: "no-store" });
  if (!res.ok) {
    const msg = `Failed to load tutorials: ${res.status}`;
    throw new Error(msg);
  }
  const data = (await res.json()) as TutorialsResponse;
  return {
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
    records: Array.isArray(data.records) ? data.records : [],
  };
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PaginationBar({
  total,
  page,
  limit,
  onPageChange,
}: {
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const pages = React.useMemo(() => {
    const w = 2;
    const start = Math.max(1, page - w);
    const end = Math.min(pageCount, page + w);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    if (!arr.includes(1)) arr.unshift(1);
    if (!arr.includes(pageCount)) arr.push(pageCount);
    return Array.from(new Set(arr));
  }, [page, pageCount]);

  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <div className="text-sm text-muted-foreground">
        Showing page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{pageCount}</span> —{" "}
        <span className="font-medium">{total}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
        >
          Prev
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "bdGreen" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function SidebarFilters({
  category,
  setCategory,
  selectedTags,
  toggleTag,
  clearFilters,
  locale,
}: {
  locale: SupportedLocale;
  category: string;
  setCategory: (c: string) => void;
  selectedTags: string[];
  toggleTag: (t: string) => void;
  clearFilters: () => void;
}) {
  return (
    <aside className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            {
              id: 0,
              name_en: "All",
              name_bn: "সব",
              name_banglish: "Shob",
              slug: "",
            },
            ...tutorialCategories,
          ].map((c) => (
            <button
              key={c.id}
              className={`w-full text-left px-2 py-1 rounded-md text-sm transition ${
                c.slug === category
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
              onClick={() => setCategory(c.slug)}
            >
              {locale === "banglish"
                ? c.name_banglish
                : locale === "bn"
                ? c.name_bn
                : c.name_en}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {TAGS.map((t) => {
            const checked = selectedTags.includes(t);
            return (
              <label
                key={t}
                className={`flex items-center gap-2 rounded-md border px-2 py-1 text-sm cursor-pointer ${
                  checked ? "border-primary" : "border-border"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleTag(t)}
                />
                <span>{t}</span>
              </label>
            );
          })}
        </CardContent>
      </Card>

      <Button variant="secondary" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </aside>
  );
}

function Hero({
  qInput,
  setQInput,
  onSubmit,
}: {
  qInput: string;
  setQInput: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="relative isolate border-b mb-5">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(1200px_600px_at_50%_110%,rgba(239,68,68,0.08),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/60 to-background" />
      <div className="mx-auto max-w-5xl py-12 sm:py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Bnlang Tutorials
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore a wide range of tutorials to learn Bangla language, from
          basics to advanced topics.
        </p>

        <form
          className="mx-auto mt-6 max-w-2xl flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search tutorials by keyword…"
            className="h-11"
          />
          <Button type="submit" variant="bdGreen" className="h-11 px-6">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}

export default function TutorialsPage({ locale }: Props) {
  const router = useRouter();
  const sp = router.query;
  const [page, setPage] = React.useState<number>(Number(sp.page ?? 1));
  const [limit] = React.useState<number>(Number(sp.limit ?? DEFAULT_LIMIT));
  const [qInput, setQInput] = React.useState<string>(
    typeof sp.q === "string" ? sp.q : ""
  );
  const [category, setCategory] = React.useState<string>(
    typeof sp.category === "string" ? sp.category : "All"
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    typeof sp.tags === "string"
      ? sp.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : []
  );

  const [qApplied, setQApplied] = React.useState<string>(
    typeof sp.q === "string" ? sp.q : ""
  );

  React.useEffect(() => {
    const _page = Number(sp.page ?? 1);
    const _q = typeof sp.q === "string" ? sp.q : "";
    const _category = typeof sp.category === "string" ? sp.category : "All";
    const _tags =
      typeof sp.tags === "string"
        ? sp.tags
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [];

    setPage(_page);
    setQApplied(_q);
    setCategory(_category);
    setSelectedTags(_tags);
    setQInput(_q);
  }, [sp.page, sp.q, sp.category, sp.tags]);

  const [data, setData] = React.useState<TutorialsResponse>({
    total: 0,
    page: 1,
    limit,
    records: [],
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  const pushQuery = React.useCallback(
    (
      next: Partial<{
        page: number;
        q: string;
        category: string;
        tags: string[];
      }>
    ) => {
      const current = new URLSearchParams(window.location.search);
      if (next.page !== undefined) current.set("page", String(next.page));
      if (next.q !== undefined)
        next.q ? current.set("q", next.q) : current.delete("q");
      if (next.category !== undefined)
        next.category && next.category !== "All"
          ? current.set("category", next.category)
          : current.delete("category");
      if (next.tags !== undefined)
        next.tags.length
          ? current.set("tags", next.tags.join(","))
          : current.delete("tags");
      if (!current.get("limit")) current.set("limit", String(limit));

      router.push(
        {
          pathname: `/${locale}/tutorials`,
          query: Object.fromEntries(current),
        },
        undefined,
        { shallow: true }
      );
    },
    [router, locale, limit]
  );

  React.useEffect(() => {
    const ac = new AbortController();
    setLoading(true);

    fetchTutorials({
      page,
      limit,
      q: qApplied || undefined,
      category,
      tags: selectedTags,
      signal: ac.signal,
    })
      .then((res) => setData(res))
      .catch((err) => {
        const msg = err?.message || "Failed to load tutorials";
        toast.error(msg);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [page, limit, qApplied, category, selectedTags]);

  const toggleTag = (t: string) =>
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const clearFilters = () => {
    setCategory("All");
    setSelectedTags([]);
    setQInput("");
    pushQuery({ page: 1, q: "", category: "All", tags: [] });
  };

  const onManualSearch = () => {
    pushQuery({ page: 1, q: qInput, category, tags: selectedTags });
    setPage(1);
  };

  return (
    <>
      <HeadComponent
        title={"Tutorials | Bnlang"}
        description={
          "Explore a wide range of tutorials to learn Bangla language, from basics to advanced topics."
        }
        locale={locale}
        pathname={`/${locale}/tutorials`}
      />

      <div className="min-h-screen">
        <Header />
        <Hero qInput={qInput} setQInput={setQInput} onSubmit={onManualSearch} />

        <div className="mx-auto max-w-7xl px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <SidebarFilters
                locale={locale}
                category={category}
                setCategory={(c) => {
                  setCategory(c);
                  pushQuery({ page: 1, category: c });
                }}
                selectedTags={selectedTags}
                toggleTag={(t) => {
                  toggleTag(t);
                }}
                clearFilters={clearFilters}
              />
            </div>
            <div className="lg:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    "Loading results…"
                  ) : (
                    <>
                      Found <span className="font-medium">{data.total}</span>{" "}
                      tutorial{data.total === 1 ? "" : "s"}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {category !== "All" && (
                    <Badge variant="secondary" className="capitalize">
                      {category}
                    </Badge>
                  )}
                  {selectedTags.map((t) => (
                    <Badge key={t} variant="outline" className="capitalize">
                      #{t}
                    </Badge>
                  ))}
                  {(category !== "All" ||
                    selectedTags.length > 0 ||
                    qApplied) && (
                    <>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {loading ? (
                <GridSkeleton />
              ) : data.records.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No tutorials matched your filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                    {data.records.map((tut) => {
                      const title =
                        locale === "banglish"
                          ? tut.title.banglish
                          : locale === "bn"
                          ? tut.title.bangla
                          : tut.title.english;
                      const summary =
                        locale === "banglish"
                          ? tut.summary.banglish
                          : locale === "bn"
                          ? tut.summary.bangla
                          : tut.summary.english;

                      const href = `/${locale}/tutorials/${tut.slug}`;

                      return (
                        <Card
                          key={tut._id}
                          className="group relative overflow-hidden hover:shadow-lg transition"
                        >
                          <Link
                            href={href}
                            className="absolute inset-0 z-10"
                            aria-label={title}
                          />
                          <CardHeader className="pb-2">
                            <CardTitle className="line-clamp-1 group-hover:underline">
                              {title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {summary}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tut.category && (
                                <Badge
                                  variant="secondary"
                                  className="capitalize"
                                >
                                  {tut.category}
                                </Badge>
                              )}
                              {(tut.tags || []).slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            {tut.updatedAt && (
                              <p className="text-xs text-muted-foreground">
                                Updated {formatReadableDate(tut.updatedAt)}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <PaginationBar
                    total={data.total}
                    page={data.page}
                    limit={data.limit}
                    onPageChange={(p) => {
                      setPage(p);
                      pushQuery({ page: p });
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <Footer locale={locale} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locales: SupportedLocale[] = ["en", "bn", "banglish"];
  return {
    paths: locales.map((l) => ({ params: { locale: l } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale =
    rawLocale === "banglish" ? "banglish" : (normalized as SupportedLocale);
  return { props: { locale } };
};
