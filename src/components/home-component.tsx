import { useT } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./header";
import { Footer } from "./footer";
import {
  ArrowRight,
  BookOpen,
  Rocket,
  Code2,
  Globe2,
  Package,
  TerminalSquare,
  Hammer,
  Wrench,
  Boxes,
  Users,
  Star,
  GitBranch,
} from "lucide-react";
import SingleCodeBlock from "./SingleCodeblock";
import { getLatestVersionString } from "@/lib/routes";

interface HomeProps {
  locale: string;
}

function HeroCodeBox() {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border">
      <Tabs defaultValue="bn" className="hero-tabs">
        <TabsList className="flex justify-start gap-2 pb-0 pt-0 bg-black text-md rounded-none">
          <TabsTrigger value="bn" className="hero-code-tab-items">
            বাংলা
          </TabsTrigger>
          <TabsTrigger value="en" className="hero-code-tab-items">
            English
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="mt-0 home-hero-code-tab">
          <Card className="rounded-none shadow-none border-0">
            <CardContent className="p-0 ">
              <SingleCodeBlock
                className="rounded-none max-h-80 overflow-auto scrollbar-dark"
                mode="dark"
                code={`// Some example code with english
print("Hello, World!");
print('My golden Bengal, thee I love!');

let score = 75;

if (score >= 80) {
  print("Grade: A+");
} else {
  print("Grade: Below A+");
}

switch (score / 10) {
  case 7:
    print("Grade: B");
    break;
  case 6:
    print("Grade: C");
    break;
  default:
    print("Other grade");
}

for (let i = 1; i <= 3; i++) {
  print("For loop:", i);
}

let n = 3;
while (n > 0) {
  print("While loop:", n);
  n--;
}

try {
  throw "Example error!";
} catch (e) {
  print("Caught error:", e);
}`}
                language="bnl"
                showLineNumbers={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bn" className="mt-0">
          <Card className="rounded-none shadow-none border-0">
            <CardContent className="p-0">
              <SingleCodeBlock
                className="rounded-none max-h-80 overflow-auto scrollbar-dark"
                mode="dark"
                code={`// বাংলা ভাষায় লেখা একটি প্রোগ্রামের উদাহরণ 
লিখুন("হ্যালো, বিশ্ব!");
লিখুন("আমার সোনার বাংলা। আমি তোমায় ভালোবাসি।");

ধরি নম্বর = ৭৫;

যদি (নম্বর >= ৮০) {
  লিখুন("গ্রেড: A+");
} নাহলে {
  লিখুন("গ্রেড: A+ এর নিচে");
}

বিকল্প (নম্বর / ১০) {
  অবস্থা ৭:
    লিখুন("গ্রেড: B");
    থামুন;
  অবস্থা ৬:
    লিখুন("গ্রেড: C");
    থামুন;
  অন্যথায়:
    লিখুন("অন্য গ্রেড");
}

প্রতি (ধরি i = ১; i <= ৩; i++) {
  লিখুন("প্রতি লুপ:", i);
}

ধরি গণনা = ৩;
যতক্ষণ (গণনা > ০) {
  লিখুন("যতক্ষণ লুপ:", গণনা);
  গণনা--;
}

চেষ্টা {
  নিক্ষেপ "উদাহরণ ত্রুটি!";
} ধরুন (e) {
  লিখুন("ধরা পড়া ত্রুটি:", e);
}`}
                language="bnl"
                showLineNumbers={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlatformIcon({
  name,
  className,
}: {
  name: "windows" | "macos" | "linux";
  className?: string;
}) {
  const cn = `h-4 w-4 ${className ?? ""}`;
  switch (name) {
    case "windows":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 256 257"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
        >
          <path
            d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302 104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z"
            fill="#00ADEF"
          />
        </svg>
      );
    case "macos":
      return (
        <svg
          height="16"
          preserveAspectRatio="xMidYMid"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-14.558 0 270.558 315.162"
        >
          <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.388-27.82-12.483-51.888-12.483-24.061 0-31.582 12.088-51.51 12.871-20.68.783-36.428-20.71-49.64-39.793-27-39.033-47.633-110.3-19.928-158.406 13.763-23.89 38.36-39.017 65.056-39.405 20.307-.387 39.475 13.662 51.889 13.662 12.406 0 35.699-16.895 60.186-14.414 10.25.427 39.026 4.14 57.503 31.186-1.49.923-34.335 20.044-33.978 59.822M174.24 50.199c10.98-13.29 18.369-31.79 16.353-50.199-15.826.636-34.962 10.546-46.314 23.828-10.173 11.763-19.082 30.589-16.678 48.633 17.64 1.365 35.66-8.964 46.64-22.262" />
        </svg>
      );
    case "linux":
      return <img src="/images/linux.png" alt="Linux Tux" className={cn} />;
  }
}

export function HomeComponent({ locale }: HomeProps) {
  const t = useT(locale);

  const whyCards = (t as any).raw?.("home.why.cards") ?? [];
  const whyBadges = (t as any).raw?.("home.why.badges") ?? [];

  const ecosystemCards = (t as any).raw?.("home.ecosystem.cards") ?? [];

  const stats = (t as any).raw?.("home.stats.items") ?? [];

  const getIcon = (name?: string, options?: { size?: number }) => {
    switch (name) {
      case "Code2":
        return <Code2 size={options?.size} className="text-bd-green" />;
      case "Rocket":
        return <Rocket size={options?.size} className="text-bd-red" />;
      case "Globe2":
        return <Globe2 size={options?.size} className="text-bd-green" />;
      case "Package":
        return <Package size={options?.size} className="text-bd-green" />;
      case "Wrench":
        return <Wrench size={options?.size} className="text-bd-red" />;
      case "Hammer":
        return <Hammer size={options?.size} className="text-bd-green" />;
      case "BookOpen":
        return <BookOpen size={options?.size} className="text-bd-red" />;
      case "Boxes":
        return <Boxes size={options?.size} className="text-bd-green" />;
      case "TerminalSquare":
        return (
          <TerminalSquare size={options?.size} className="text-bd-green" />
        );
      case "Code2Red":
        return <Code2 size={options?.size} className="text-bd-red" />;

      case "Package":
        return <Package size={options?.size} className="text-bd-green" />;
      case "Hammer":
        return <Hammer size={options?.size} className="text-bd-green" />;
      case "BookOpen":
        return <BookOpen size={options?.size} className="text-bd-red" />;
      case "Boxes":
        return <Boxes size={options?.size} className="text-bd-green" />;

      default:
        return <Code2 size={options?.size} className="text-bd-green" />;
    }
  };

  return (
    <>
      <Header locale={locale} />
      <main>
        <section className="w-full pt-12 md:pt-20 lg:pt-24 pb-14">
          <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="min-w-0">
              <Badge
                className="mb-4 px-3 py-1 text-[0.8rem] border border-bd-green text-bd-green"
                variant="outline"
              >
                {t("home.hero.badge")}
              </Badge>

              {locale === "en" ? (
                <h1 className="text-4xl font-extrabold">
                  <span className="text-bd-green">Write code in</span>{" "}
                  <span className="text-bd-red">
                    বাংলা এবং English
                  </span>
                </h1>
              ) : locale === "bn" ? (
                <h1 className="text-4xl font-extrabold">
                  <span className="text-bd-green font-bn">কোড লিখুন</span>{" "}
                  <span className="text-bd-red">
                    <span className="font-bn">বাংলা</span>,<span className="font-bn">এবং</span> English <span className="font-bn">ভাষায়</span>
                  </span>
                </h1>
              ) : (
                <h1 className="text-4xl font-extrabold">
                  <span className="text-bd-green">Write code in</span>{" "}
                  <span className="text-bd-red">
                    বাংলা এবং English
                  </span>
                </h1>
              )}

              <p className={`mt-5 text-base sm:text-lg md:text-lg text-muted-foreground max-w-2xl ${locale === "bn" ? "font-bn" : ""}`}>
                {t("home.hero.subtitle")}
              </p>

              <div className="mt-7 sm:mt-8 flex flex-wrap gap-3">
                <Button asChild variant="bdGreen" size="lg">
                  <Link href={`/${locale}/docs/v1.0.0/introduction`}>
                    {t("home.hero.cta.docs")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={`/${locale}/download`}>Get Bnlang</Link>
                </Button>
              </div>

              <div className={`mt-6 sm:mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${locale === "bn" ? "font-bn" : ""}`}>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-bd-green" />{" "}
                  {t("home.hero.signals.stableCore")}
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-bd-red" />{" "}
                  {t("home.hero.signals.versionedReleases")}
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-bd-green" />{" "}
                  {t("home.hero.signals.trilingual")}
                </div>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-tr from-bd-green/20 to-bd-red/20 rounded-3xl" />
              <HeroCodeBox />
            </div>
          </div>
        </section>

        <section className="w-full py-8 bg-white/70 dark:bg-neutral-900/50 border-y border-neutral-200/60 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center ${locale === "bn" ? "font-bn" : ""}`}>
              {stats.map((s: any, i: number) => (
                <div className="p-4" key={i}>
                  <div
                    className={`text-2xl sm:text-3xl font-extrabold ${
                      i % 2 ? "text-bd-red" : "text-bd-green"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div className="text-md text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-neutral-200/60 dark:border-neutral-800 pt-5">
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                  {t("home.stats.platforms.title")}
                </p>

                <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${locale === "bn" ? "font-bn" : ""}`}>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-md bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-200 ring-1 ring-neutral-200/70 dark:ring-neutral-700">
                    <PlatformIcon
                      name="windows"
                      className="text-sky-600 dark:text-sky-400"
                    />
                    {t("home.stats.platforms.windows")}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-md bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-200 ring-1 ring-neutral-200/70 dark:ring-neutral-700">
                    <PlatformIcon
                      name="macos"
                      className="text-neutral-900 dark:text-neutral-100"
                    />
                    {t("home.stats.platforms.macos")}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-md bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-200 ring-1 ring-neutral-200/70 dark:ring-neutral-700">
                    <PlatformIcon
                      name="linux"
                      className="text-amber-600 dark:text-amber-400"
                    />
                    {t("home.stats.platforms.linux")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-bd-green to-bd-red bg-clip-text text-transparent">
                {t("home.why.title")}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t("home.why.subtitle")}
              </p>
            </header>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {whyBadges.map((b: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {whyCards.map((c: any, i: number) => (
                <Card
                  key={i}
                  className={[
                    "group relative h-full border-t-4 transition",
                    i % 3 === 0
                      ? "border-bd-green"
                      : i % 3 === 1
                      ? "border-bd-red"
                      : "border-bd-blue",
                    "hover:shadow-lg",
                  ].join(" ")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">{getIcon(c.icon)}</div>
                      <CardTitle className="leading-tight">{c.title}</CardTitle>
                    </div>
                    {c.kicker ? (
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {c.kicker}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="text-muted-foreground space-y-3">
                    <p>{c.body}</p>

                    {Array.isArray(c.points) && c.points.length > 0 && (
                      <ul className="mt-2 space-y-2 text-sm">
                        {c.points.map((p: string, k: number) => (
                          <li key={k} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>

                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </Card>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="bdGreen" size="lg" asChild>
                <Link
                  href={`/${locale}/docs/${getLatestVersionString()}/introduction`}
                >
                  {t("home.why.cta_primary")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  href={`/${locale}/learn/get-started/introduction-to-bnlang`}
                >
                  {t("home.why.cta_secondary")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative w-full py-12 sm:py-14 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(1200px_600px_at_50%_110%,rgba(239,68,68,0.08),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-bd-green to-bd-red bg-clip-text text-transparent">
                {t("home.features.title")}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                {t("home.features.subtitle")}
              </p>
            </header>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <article className="group min-w-0 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:shadow-md">
                <div className="px-3 sm:px-4 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bd-red/10 ring-1 ring-bd-red/20">
                      {getIcon("Code2")}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                      {t("home.features.blocks.trilingual.title")}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("home.features.blocks.trilingual.body")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.trilingual.points.0")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.trilingual.points.1")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.trilingual.points.2")}
                    </li>
                  </ul>
                </div>
              </article>

              <article className="group min-w-0 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:shadow-md">
                <div className="px-3 sm:px-4 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bd-red/10 ring-1 ring-bd-red/20">
                      {getIcon("TerminalSquare")}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                      {t("home.features.blocks.async.title")}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("home.features.blocks.async.body")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.async.points.0")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.async.points.1")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.async.points.2")}
                    </li>
                  </ul>
                </div>
              </article>

              <article className="group min-w-0 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:shadow-md">
                <div className="px-3 sm:px-4 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bd-green/10 ring-1 ring-bd-green/20">
                      {getIcon("Package")}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                      {t("home.features.blocks.packages.title")}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("home.features.blocks.packages.body")}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("home.features.blocks.packages.caption")}
                  </p>
                </div>
              </article>

              <article className="group min-w-0 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:shadow-md">
                <div className="px-3 sm:px-4 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bd-red/10 ring-1 ring-bd-red/20">
                      {getIcon("Wrench")}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                      {t("home.features.blocks.testing.title")}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("home.features.blocks.testing.body")}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("home.features.blocks.testing.caption")}
                  </p>
                </div>
              </article>

              <article className="group min-w-0 md:col-span-2 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/50 supports-[backdrop-filter]:backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:shadow-md">
                <div className="px-3 sm:px-4 pt-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bd-green/10 ring-1 ring-bd-green/20">
                      {getIcon("Boxes")}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight">
                      {t("home.features.blocks.io.title")}
                    </h3>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("home.features.blocks.io.body")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.io.points.0")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.io.points.1")}
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />{" "}
                      {t("home.features.blocks.io.points.2")}
                    </li>
                  </ul>
                </div>
              </article>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild variant="bdGreen" size="lg">
                <Link href="/docs/get-started">
                  {t("home.features.cta_primary")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs/examples">
                  {t("home.features.cta_secondary")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-bd-green to-bd-red bg-clip-text text-transparent">
              {t("home.ecosystem.title")}
            </h2>
            <p className="mt-3 text-center text-muted-foreground max-w-3xl mx-auto">
              {t("home.ecosystem.subtitle")}
            </p>

            <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ecosystemCards.map((c: any, i: any) => (
                <Card key={i}>
                  <CardHeader>
                    {getIcon(c.icon)}
                    <CardTitle className="pt-2">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {c.body}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-14 sm:py-16 border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Users className="mx-auto h-10 w-10 text-bd-green" />
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 bg-gradient-to-r from-bd-green to-bd-red bg-clip-text text-transparent">
              {t("home.community.title")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {t("home.community.subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="bdGreen" size="lg">
                <Link
                  href="https://github.com/bnlang"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("home.community.cta.github")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/bnlang">
                  {t("home.community.cta.guide")}
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
