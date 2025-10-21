import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useT, normalizeLocale } from "@/lib/i18n";
import { Header } from "@/components/header";
import HeadComponent from "@/components/head-component";
import { Footer } from "@/components/footer";
import {
  Globe2,
  Code2,
  Users,
  Hammer,
  GitBranch,
  ShieldCheck,
  Cpu,
  Workflow,
  Layers,
  Database,
  Network,
  GitCommit,
  FileCheck2,
  LockKeyhole,
  ServerCog,
  Zap,
} from "lucide-react";
import { SupportedLocale } from "@/types/locale.types";
import { getLatestVersionString } from "@/lib/routes";

type Pillar = { title: string; body: string };
type CardItem = { title: string; body: string };
type Bullet = { strong: string; text: string };
type Props = { locale: SupportedLocale };

function safeArray<T>(v?: T[] | null): T[] {
  return Array.isArray(v) ? v : [];
}

function stableKey(prefix: string, value: string, idx: number) {
  return `${prefix}-${value.replace(/\s+/g, "-").toLowerCase()}-${idx}`;
}

export default function AboutPage({ locale }: Props) {
  const t = useT(locale);

  const title = `${t("about.meta.title")} | Bnlang`;
  const description = t("about.meta.description");

  const whyBullets = safeArray(t.raw<Array<Bullet>>("about.why.bullets"));
  const whyContext = t.raw<{ title: string; body: string }>(
    "about.why.contextCard"
  );

  const howFrontend = t.raw<{ title: string; points: string[] }>(
    "about.how.frontend"
  )!;
  const howBackend = t.raw<{ title: string; points: string[] }>(
    "about.how.backend"
  )!;
  const howNative = t.raw<{ title: string; points: string[] }>(
    "about.how.native"
  )!;
  const howPillars = safeArray(t.raw<Array<Pillar>>("about.how.pillars"));

  const langDesignCards = safeArray(
    t.raw<Array<CardItem>>("about.languageDesign.cards")
  );
  const accessCards = safeArray(
    t.raw<Array<CardItem>>("about.accessibility.cards")
  );
  const adoptionCards = safeArray(
    t.raw<Array<CardItem>>("about.adoption.cards")
  );
  const trustCards = safeArray(t.raw<Array<CardItem>>("about.trust.cards"));
  const roadmapCards = safeArray(t.raw<Array<CardItem>>("about.roadmap.cards"));
  const roadmapCta = t.raw<{
    getStarted: string;
    examples: string;
    github: string;
  }>("about.roadmap.cta")!;

  const productStatusBullets = useMemo(
    () => [
      {
        icon: LockKeyhole,
        title: t("about.projectStatus.status.title"),
        body: t("about.projectStatus.status.body"),
      },
      {
        icon: Zap,
        title: t("about.projectStatus.cost.title"),
        body: t("about.projectStatus.cost.body"),
      },
    ],
    [t]
  );

  const runtimeStack = useMemo(
    () => t.raw<Array<any>>("about.runtimeStack") || [],
    [t]
  );

  return (
    <>
      <HeadComponent
        title={title}
        description={description}
        locale={locale}
        pathname={`/${locale}/about`}
      />
      <Header locale={locale} />
      <main id="main">
        {/* HERO */}
        <section
          className="w-full py-14 border-b"
          aria-labelledby="about-hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(1200px_600px_at_50%_110%,rgba(239,68,68,0.08),transparent_60%)]" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Badge
              className="mb-3 px-3 py-1 text-[0.8rem] border border-bd-green text-bd-green"
              variant="outline"
            >
              {t("about.hero.badge")}
            </Badge>
            <h1
              id="about-hero-heading"
              className="text-3xl font-extrabold tracking-tight"
            >
              {t("about.hero.title")}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
              {t("about.hero.lead")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-bd-green hover:bg-bd-green/90"
                aria-label={t("about.hero.cta.docs")}
              >
                <Link href={`/${locale}/docs/v1.0.0/introduction`}>
                  {t("about.hero.cta.docs")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-bd-red text-bd-red"
                aria-label={t("about.hero.cta.github")}
              >
                <Link
                  href="https://github.com/bnlang"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("about.hero.cta.github")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full mt-8" aria-labelledby="why-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-1 gap-4">
            <Card className="border-l-4 border-bd-green">
              <CardHeader>
                <CardTitle id="why-title">{t("about.why.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>{t("about.why.description")}</p>
                <ul className="list-disc list-inside">
                  {whyBullets.map((b, i) => (
                    <li key={stableKey("why", b.strong + b.text, i)}>
                      <span className="text-foreground font-medium">
                        {b.strong}
                      </span>{" "}
                      {b.text}
                    </li>
                  ))}
                </ul>
                {whyContext && (
                  <div className="mt-3 rounded-md border p-3">
                    <div className="font-medium">{whyContext.title}</div>
                    <p className="text-sm mt-1">{whyContext.body}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full mt-6" aria-labelledby="status-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-4">
            {productStatusBullets.map((item, i) => (
              <Card
                key={stableKey("status", item.title, i)}
                className="border-t-4 border-bd-red"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <item.icon className="h-6 w-6 text-bd-red" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {item.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full py-10 bg-white dark:bg-neutral-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">{t("about.how.title")}</h2>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              {t("about.how.lead")}
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <Card className="border-t-4 border-bd-green">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-6 w-6 text-bd-green" />
                    {howFrontend.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                  <ul className="list-disc list-inside">
                    {howFrontend.points.map((p, i) => (
                      <li key={stableKey("frontend-point", p, i)}>{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-bd-red">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-6 w-6 text-bd-red" />
                    {howBackend.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                  <ul className="list-disc list-inside">
                    {howBackend.points.map((p, i) => (
                      <li key={stableKey("backend-point", p, i)}>{p}</li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Compilation pipeline:</strong> Bnlang transpiles to
                    JavaScript and runs on the V8 engine for execution.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-bd-green">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-bd-green" />
                    {howNative.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                  <ul className="list-disc list-inside">
                    {howNative.points.map((p, i) => (
                      <li key={stableKey("native-point", p, i)}>{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {howPillars.map((c, i) => (
                <Card key={stableKey("pillar", c.title, i)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {i === 0 && (
                        <Database className="h-6 w-6 text-bd-green" />
                      )}
                      {i === 1 && <Hammer className="h-6 w-6 text-bd-red" />}
                      {i === 2 && <Network className="h-6 w-6 text-bd-green" />}
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-10" aria-labelledby="stack-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="stack-title" className="text-2xl font-bold">
              Runtime Stack (under the hood)
            </h2>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              Pragmatic, portable, and proven components for Bangladesh today.
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {runtimeStack.map((item, i) => (
                <Card key={stableKey("stack", item.name, i)} className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ServerCog className="h-6 w-6 text-bd-green" />
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {item.desc}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-10" aria-labelledby="lang-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="lang-title" className="text-2xl font-bold">
              {t("about.languageDesign.title")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              {t("about.languageDesign.lead")}
            </p>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {langDesignCards.map((c, i) => (
                <Card key={stableKey("lang-card", c.title, i)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {i === 0 && <Code2 className="h-6 w-6 text-bd-green" />}
                      {i === 1 && (
                        <ShieldCheck className="h-6 w-6 text-bd-red" />
                      )}
                      {i === 2 && <Globe2 className="h-6 w-6 text-bd-green" />}
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-10" aria-labelledby="access-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="access-title" className="text-2xl font-bold">
              {t("about.accessibility.title")}
            </h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {accessCards.map((c, i) => (
                <Card key={stableKey("access-card", c.title, i)}>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          className="w-full py-10 bg-white dark:bg-neutral-950"
          aria-labelledby="adopt-title"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="adopt-title" className="text-2xl font-bold">
              {t("about.adoption.title")}
            </h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {adoptionCards.map((c, i) => (
                <Card key={stableKey("adopt-card", c.title, i)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {i === 0 && (
                        <GitBranch className="h-6 w-6 text-bd-green" />
                      )}
                      {i === 1 && <GitCommit className="h-6 w-6 text-bd-red" />}
                      {i === 2 && (
                        <FileCheck2 className="h-6 w-6 text-bd-green" />
                      )}
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-10" aria-labelledby="trust-title">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="trust-title" className="text-2xl font-bold">
              {t("about.trust.title")}
            </h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {trustCards.map((c, i) => (
                <Card key={stableKey("trust-card", c.title, i)}>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          className="w-full py-10 bg-white dark:bg-neutral-950"
          aria-labelledby="roadmap-title"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="roadmap-title" className="text-2xl font-bold">
              {t("about.roadmap.title")}
            </h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {roadmapCards.map((c, i) => (
                <Card key={stableKey("roadmap-card", c.title, i)}>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size={"lg"}
                variant={"bdGreen"}
                aria-label={roadmapCta.getStarted}
              >
                <Link href={`/${locale}/docs/${getLatestVersionString()}/introduction`}>
                  {roadmapCta.getStarted}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size={"lg"}
                aria-label={roadmapCta.github}
              >
                <Link
                  href="https://github.com/bnlang"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {roadmapCta.github}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Users
              className="mx-auto h-10 w-10 text-bd-green"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold mt-2">
              {t("about.community.title")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-3xl mx-auto">
              {t("about.community.lead")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                variant={"bdGreen"}
                size={"lg"}
                aria-label={t("about.community.cta.repo")}
              >
                <Link
                  href="https://github.com/bnlang"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("about.community.cta.repo")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size={"lg"}
                aria-label={t("about.community.cta.guide")}
              >
                <Link href={`/${locale}/learn/get-started`}>
                  {t("about.community.cta.guide")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locales: SupportedLocale[] = ["en", "bn"];
  return {
    paths: locales.map((l) => ({ params: { locale: l } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale = normalized as SupportedLocale;
  return { props: { locale } };
};
