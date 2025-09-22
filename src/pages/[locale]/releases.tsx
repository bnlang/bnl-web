import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeadComponent from "@/components/head-component";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Download, Package } from "lucide-react";
import { normalizeLocale, useT } from "@/lib/i18n";
import { SupportedLocale } from "@/types/locale.types";
import { ApiRelease, ApiResponse, Props } from "@/types/releases.types";

function statusBadge(s?: string) {
  if (!s) return null;
  const lower = s.toLowerCase();
  if (lower === "stable")
    return <Badge className="bg-bd-green/90">Stable</Badge>;
  if (lower.includes("pre"))
    return (
      <Badge variant="outline" className="border-bd-red text-bd-red">
        Pre-release
      </Badge>
    );
  if (lower.includes("alpha")) return <Badge variant="secondary">Alpha</Badge>;
  return <Badge variant="secondary">{s}</Badge>;
}

function formatBytes(n?: number) {
  if (!n || n < 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 2 : 0)} ${units[i]}`;
}

function noteForLocale(r: ApiRelease, locale: SupportedLocale) {
  if (locale === "bn" && r.noteBangla) return r.noteBangla;
  if (locale === "banglish" && r.noteBanglish) return r.noteBanglish;
  return r.noteEnglish ?? "";
}

export default function ReleasesPage({ locale }: Props) {
  const t = useT(locale);
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CDN_URL}/releases.json`,
          {
            headers: { Accept: "application/json" },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load releases.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    const list = data?.releases ?? [];
    return [...list].sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    );
  }, [data]);

  const filtered = useMemo(() => {
    let list = sorted;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.version.toLowerCase().includes(q));
    }
    if (fromDate) list = list.filter((r) => r.date >= fromDate);
    if (toDate) list = list.filter((r) => r.date <= toDate);

    return list;
  }, [sorted, query, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function onFilterChange(cb: () => void) {
    cb();
    setPage(1);
  }

  const title = `${t("releases.meta.title")} — Bnlang`;
  const description = `${t("releases.meta.description")}`;

  return (
    <>
      <HeadComponent
        title={title}
        description={description}
        locale={locale}
        pathname={`/${locale}/releases`}
      />
      <Header locale={locale} />

      <main>
        <section className="w-full py-14 border-b bg-gradient-to-br from-bd-green/5 via-background to-bd-red/5 dark:from-bd-green/10 dark:via-background dark:to-bd-red/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Badge
              className="mb-3 px-3 py-1 text-[0.8rem] border border-bd-green text-bd-green"
              variant="outline"
            >
              {t("releases.hero.badge")}
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {t("releases.hero.title")}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
              {t("releases.hero.description")}
            </p>
          </div>
        </section>

        <section className="w-full py-6">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search">
                  {t("releases.common.search_by_version")}
                </Label>
                <Input
                  id="search"
                  placeholder="e.g. v1.0.0"
                  value={query}
                  onChange={(e) =>
                    onFilterChange(() => setQuery(e.target.value))
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />{" "}
                  {t("releases.common.from")}
                </Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    onFilterChange(() => setFromDate(e.target.value))
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> {t("releases.common.to")}
                </Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    onFilterChange(() => setToDate(e.target.value))
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="w-full py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-4">
            {loading && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={`sk-${i}`} className="border">
                    <CardHeader className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded-md" />
                          <Skeleton className="h-6 w-40" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        {Array.from({ length: 2 }).map((__, j) => (
                          <div key={j} className="rounded-md border p-3">
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {!loading && err && (
              <div className="text-center text-red-500 py-8">
                Failed to load releases. {err}
              </div>
            )}

            {!loading &&
              !err &&
              pageItems.map((r) => (
                <Card key={`${r.version}-${r.date}`} className="border">
                  <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-6 w-6 text-bd-green" />
                        <span className="text-2xl font-bold">{r.version}</span>
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        {statusBadge(r.status)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {noteForLocale(r, locale)}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {r.files?.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-3">
                        {r.files.map((a) => {
                          const url = `${data?.baseUrl ?? ""}${r.version}/${
                            a.name
                          }`;
                          return (
                            <div
                              key={`${r.version}-${a.name}-${a.platform}-${
                                a.arch ?? "na"
                              }`}
                              className="rounded-md border p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="font-medium">{a.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Platform: {a.platform}
                                    {a.arch ? ` • ${a.arch}` : ""}
                                    {a.sizeBytes
                                      ? ` • ${formatBytes(a.sizeBytes)}`
                                      : a.sizeLabel
                                      ? ` • ${a.sizeLabel}`
                                      : ""}
                                  </div>
                                  {a.sha256 && (
                                    <div className="mt-1 text-[11px] text-muted-foreground break-all">
                                      SHA256: {a.sha256}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="border-bd-green text-bd-green"
                                >
                                  <Link href={url}>
                                    <Download className="h-4 w-4 mr-1" />{" "}
                                    {t("releases.common.download")}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

            {!loading && !err && filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {t("releases.common.no_results")}
              </div>
            )}

            {!loading && !err && filtered.length > 0 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← {t("releases.common.previous")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("releases.common.page")} {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {t("releases.common.next")} →
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
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
