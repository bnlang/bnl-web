import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import * as React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  getAllDocPathsUnion,
  getSidebarFlattened,
  findDocTitle,
} from "@/lib/doc-route";
import { loadMdxWithFallback, Heading } from "@/lib/mdx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useT, normalizeLocale } from "@/lib/i18n";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import HeadComponent from "@/components/head-component";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllVersionStrings, getLatestVersionString } from "@/lib/routes";
import { SupportedLocale } from "@/types/locale.types";
import { SidebarFlat, SidebarNode } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "@/components/CodeBlock";

function localizedMeta(
  locale: SupportedLocale,
  fm: Record<string, any>,
  fallbackTitle: string
): { title: string; description?: string } {
  if (locale === "bn") {
    return {
      title: fm.bnTitle || fallbackTitle || fm.title || "",
      description: fm.bnDescription || fm.description || undefined,
    };
  }
  if (locale === "banglish") {
    return {
      title:
        fm.banglishTitle || fm.bnLatnTitle || fallbackTitle || fm.title || "",
      description:
        fm.banglishDescription ||
        fm.bnLatnDescription ||
        fm.description ||
        undefined,
    };
  }
  return {
    title: fm.title || fallbackTitle || "",
    description: fm.description || undefined,
  };
}

function makeShowIf(current: SupportedLocale, want: SupportedLocale) {
  return function ShowIf({ children }: { children?: React.ReactNode }) {
    return current === want ? <>{children}</> : null;
  };
}

function buildSidebarTree(flat: SidebarFlat[]): SidebarNode[] {
  const root: SidebarNode[] = [];
  const index = new Map<string, SidebarNode>();
  const sorted = flat;

  for (const item of sorted) {
    const parts = item.href.split("/").filter(Boolean);
    let path = "";
    let parentArray = root;

    for (let i = 0; i < parts.length; i++) {
      path = path ? `${path}/${parts[i]}` : parts[i];

      let node = index.get(path);
      if (!node) {
        node = {
          href: path,
          label: parts[i].replace(/[-_]/g, " "),
          active: false,
          children: [],
        };
        index.set(path, node);
        parentArray.push(node);
      }

      if (i === parts.length - 1) {
        node.label = item.label;
        node.active = node.active || item.active;
      }

      parentArray = node.children;
    }
  }

  const markParents = (nodes: SidebarNode[]): boolean => {
    let any = false;
    for (const n of nodes) {
      const childActive = markParents(n.children);
      if (childActive) n.active = true;
      any = any || n.active;
    }
    return any;
  };
  markParents(root);
  return root;
}

function findNodeWithParent(
  nodes: SidebarNode[],
  targetHref: string,
  parent: SidebarNode | null = null
): {
  node: SidebarNode | null;
  parent: SidebarNode | null;
  siblings: SidebarNode[];
} {
  for (const n of nodes) {
    if (n.href === targetHref) {
      return { node: n, parent, siblings: parent ? parent.children : nodes };
    }
    const res = findNodeWithParent(n.children, targetHref, n);
    if (res.node) return res;
  }
  return { node: null, parent: null, siblings: nodes };
}

function SidebarTree({
  items,
  base,
  onNavigate,
}: {
  items: SidebarNode[];
  base: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="list-none space-y-0.5">
      {items.map((item) => (
        <li key={item.href} className="my-0.5">
          <Link
            href={`${base}/${item.href}`}
            className={[
              "group flex items-center gap-2 rounded-md py-1.5 pr-2 text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              item.active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-foreground/90",
              "pl-2",
            ].join(" ")}
            aria-current={item.active ? "page" : undefined}
            onClick={onNavigate}
          >
            <span
              className={[
                "mt-px h-1.5 w-1.5 shrink-0 rounded-full",
                item.active
                  ? "bg-primary"
                  : "bg-muted-foreground/50 group-hover:bg-muted-foreground",
              ].join(" ")}
            />
            <span className="truncate">{item.label}</span>
          </Link>
          {item.children.length > 0 && (
            <div className="pl-4 ml-[7px] border-l border-muted-foreground/20">
              <SidebarTree
                items={item.children}
                base={base}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function norm(s: string) {
  if (!s) return "/";
  return s.startsWith("/") ? s.slice(1) : s;
}

function DocNavigation({
  tree,
  locale,
  version,
  current,
  allPages,
}: {
  tree: SidebarNode[];
  locale: string;
  version: string;
  current: string;
  allPages?: string[];
}) {
  const currentRel = norm(current);
  const { node, siblings } = React.useMemo(
    () => findNodeWithParent(tree, currentRel),
    [tree, currentRel]
  );

  const pageSet = React.useMemo(
    () => (allPages && allPages.length ? new Set(allPages.map(norm)) : null),
    [allPages]
  );

  const filteredSiblings = React.useMemo(() => {
    if (!pageSet) return siblings;
    const list = siblings.filter((s) => pageSet.has(norm(s.href)));
    if (node && !list.find((s) => s.href === node.href)) return siblings;
    return list.length ? list : siblings;
  }, [siblings, node, pageSet]);

  const idx = React.useMemo(
    () => (node ? filteredSiblings.findIndex((s) => s.href === node.href) : -1),
    [filteredSiblings, node]
  );

  const prev = idx > 0 ? filteredSiblings[idx - 1] : null;
  const next =
    idx >= 0 && idx < filteredSiblings.length - 1
      ? filteredSiblings[idx + 1]
      : null;

  const makeFullHref = (href: string) => `/${locale}/docs/${version}/${href}`;

  return (
    <nav
      className="mt-8 flex items-center justify-between"
      aria-label="Doc pagination"
    >
      {prev ? (
        <Link href={makeFullHref(prev.href)} rel="prev" className="max-w-[48%]">
          <Button variant="outline" className="w-full truncate justify-start">
            ← {prev.label}
          </Button>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link href={makeFullHref(next.href)} rel="next" className="max-w-[48%]">
          <Button variant="outline" className="w-full truncate justify-end">
            {next.label} →
          </Button>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

type Props =
  | {
      locale: SupportedLocale;
      version: string;
      slug: string[];
      title: string;
      description?: string;
      found: true;
      source: MDXRemoteSerializeResult;
      headings: Heading[];
      sourceVersion: string;
      sidebar: SidebarFlat[];
    }
  | {
      locale: SupportedLocale;
      version: string;
      slug: string[];
      title: string;
      description?: string;
      found: false;
      sidebar: SidebarFlat[];
    };

export default function DocPage(props: Props) {
  const { locale, version, slug, sidebar, title, description } = props;
  const t = useT(locale);
  const base = `/${locale}/docs/${version}`;
  const heading = title || slug[slug.length - 1];

  const I18nEnglish = makeShowIf(locale, "en");
  const I18nBangla = makeShowIf(locale, "bn");
  const I18nBanglish = makeShowIf(locale, "banglish");

  const tree = React.useMemo(() => buildSidebarTree(sidebar), [sidebar]);

  const onTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const allPages = React.useMemo(() => sidebar.map((s) => s.href), [sidebar]);
  const currentHref = `/${slug.join("/")}`;

  function getTitleBySlug(slug: string): string {
    const item = sidebar.find((s) => s.href === slug);
    return item ? item.label : slug.split("/").pop() || slug;
  }

  function getPathBySlug(slug: string): string {
    return `/${locale}/docs/${version}/${slug}`;
  }

  return (
    <>
      <HeadComponent
        locale={locale}
        title={`${heading} | Bnlang`}
        description={description}
        pathname={`/${locale}/docs/${version}/${slug.join("/")}`}
      />
      <Header locale={locale} isFullWidth />

      <div className="min-h-screen xl:grid xl:grid-cols-[300px_minmax(0,1fr)_270px]">
        <aside className="hidden xl:block border-r">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <ScrollArea className="h-full px-3 py-4">
              <div className="mb-3 px-2 text-xs font-medium text-muted-foreground">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={getLatestVersionString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllVersionStrings().map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <nav aria-label="Docs navigation">
                <SidebarTree items={tree} base={base} />
              </nav>
            </ScrollArea>
          </div>
        </aside>

        <main className="px-4 md:px-8 py-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}/docs/${version}/introduction`}>
                    Docs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {slug.map((part, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator className="me-2" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href={getPathBySlug(slug.slice(0, index + 1).join("/"))}
                      >
                        {getTitleBySlug(slug.slice(0, index + 1).join("/"))}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-4 xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  ☰ {t("common.docsHome")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] p-0">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle>Docs — {version}</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-3.25rem)]">
                  <ScrollArea className="h-full px-3 py-4">
                    <nav aria-label="Docs navigation">
                      <SidebarTree
                        items={tree}
                        base={base}
                        onNavigate={() => {
                          const closeBtn =
                            document.querySelector<HTMLElement>(
                              "[data-sheet-close]"
                            );
                          closeBtn?.click();
                        }}
                      />
                    </nav>
                  </ScrollArea>
                </div>
                <SheetClose data-sheet-close className="hidden" />
              </SheetContent>
            </Sheet>
          </div>

          {!("found" in props) || !props.found ? (
            <Card className="p-6">
              <h1 className="text-2xl font-semibold mb-2">{heading}</h1>
              <p className="text-muted-foreground">
                We couldn’t find this page in{" "}
                <span className="font-mono">{version}</span> or any previous
                version.
              </p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <a href={`/${locale}/docs/${version}`}>
                    {t("common.docsHome")}
                  </a>
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                {props.sourceVersion !== version && (
                  <Badge
                    variant="secondary"
                    title={`Shown from ${props.sourceVersion}`}
                  >
                    Inherited from {props.sourceVersion}
                  </Badge>
                )}
              </div>

              <article className="prose prose-zinc dark:prose-invert max-w-none [&_*:where(h2,h3,h4)]:scroll-mt-24">
                <MDXRemote
                  {...props.source}
                  components={{
                    I18nEnglish,
                    I18nBangla,
                    I18nBanglish,
                    Tabs,
                    TabsContent,
                    TabsList,
                    TabsTrigger,
                    pre: CodeBlock,
                  }}
                />
              </article>
              <Separator className="my-8" />
              <DocNavigation
                tree={tree}
                locale={locale}
                version={version}
                current={currentHref}
                allPages={allPages}
              />
            </>
          )}
        </main>

        <aside className="hidden xl:block border-l">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <ScrollArea className="h-full px-3 py-4">
              <div className="mb-3 text-xs font-semibold text-muted-foreground">
                {t("common.onThisPage")}
              </div>
              {"found" in props && props.found && props.headings.length > 0 ? (
                <nav aria-label="Table of contents" className="space-y-1">
                  {props.headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      onClick={(e) => onTocClick(e, h.id)}
                      className={[
                        "block text-sm leading-5 hover:underline",
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
        </aside>
      </div>
      <Footer locale={locale} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const localesForPaths: SupportedLocale[] = ["en", "bn", "banglish"];
  const paths: {
    params: { locale: string; version: string; slug: string[] };
  }[] = [];

  const all = getAllDocPathsUnion();
  for (const l of localesForPaths) {
    for (const p of all) {
      paths.push({ params: { locale: l, version: p.version, slug: p.slug } });
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale =
    (rawLocale === "banglish" ? "banglish" : (normalized as any)) || "en";

  const { version, slug } = params as { version: string; slug: string[] };
  const loaded = await loadMdxWithFallback(locale, slug, version);

  const flat = getSidebarFlattened(version) as Array<
    { slug: string; depth: number } & Record<string, any>
  >;
  const activePath = slug.join("/");

  const sidebar: SidebarFlat[] = flat.map((it) => ({
    href: it.slug,
    label:
      locale === "bn"
        ? it.titleBn ?? it.title
        : locale === "banglish"
        ? it.titleBanglish ?? it.title
        : it.title,
    depth: it.depth,
    active: it.slug === activePath || activePath.startsWith(it.slug + "/"),
  }));

  const fallbackTitle = findDocTitle(version, slug) || "";

  if (!loaded.found) {
    const meta = localizedMeta(locale, {}, fallbackTitle);
    return {
      props: {
        locale,
        version,
        slug,
        title: meta.title,
        description: meta.description,
        found: false as const,
        sidebar,
      },
    };
  }

  const meta = localizedMeta(locale, loaded.frontmatter || {}, fallbackTitle);

  return {
    props: {
      locale,
      version,
      slug,
      title: meta.title,
      description: meta.description,
      found: true as const,
      source: loaded.mdx,
      headings: loaded.headings,
      sourceVersion: loaded.sourceVersion,
      sidebar,
    },
  };
};
