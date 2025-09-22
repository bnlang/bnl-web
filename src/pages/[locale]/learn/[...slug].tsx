import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  getAllLearnSlugsFromFS,
  getLearnSidebar,
  findLearnTitle,
} from "@/lib/learn-route";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
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
import { SupportedLocale } from "@/types/locale.types";
import { Heading, SidebarFlat, SidebarNode } from "@/types";
import { LearnItem } from "@/types/learn.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "@/components/CodeBlock";
import { loadMdxWithFallback } from "@/lib/mdx";

type Props =
  | {
      locale: SupportedLocale;
      slug: string[];
      title: string;
      description?: string;
      found: true;
      source: MDXRemoteSerializeResult;
      headings: Heading[];
      sidebar: SidebarFlat[];
    }
  | {
      locale: SupportedLocale;
      slug: string[];
      title: string;
      description?: string;
      found: false;
      sidebar: SidebarFlat[];
    };

function makeI18nBlock(
  current: SupportedLocale,
  want: SupportedLocale,
  tagName: string
) {
  const Block = ({ children }: { children?: React.ReactNode }) =>
    current === want ? <>{children}</> : null;
  (Block as any).displayName = tagName;
  return Block;
}

function flattenLearn(
  items: LearnItem[],
  locale: SupportedLocale,
  base = "",
  depth = 0,
  out: SidebarFlat[] = []
): SidebarFlat[] {
  for (const it of items) {
    const href = base ? `${base}/${it.slug}` : it.slug;
    const label =
      locale === "bn"
        ? it.titleBn ?? it.title
        : locale === "banglish"
        ? it.titleBanglish ?? it.title
        : it.title;

    out.push({ href, label, depth, active: false });

    if (it.children?.length)
      flattenLearn(it.children, locale, href, depth + 1, out);
  }
  return out;
}

function buildSidebarTree(flat: SidebarFlat[]): SidebarNode[] {
  const root: SidebarNode[] = [];
  const index = new Map<string, SidebarNode>();
  const sorted = [...flat];

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

export default function LearnPage(props: Props) {
  const { locale, slug, title, description, sidebar } = props;
  const t = useT(locale);
  const base = `/${locale}/learn`;
  const heading = title || slug[slug.length - 1];

  const I18nEnglish = makeI18nBlock(locale, "en", "I18nEnglish");
  const I18nBangla = makeI18nBlock(locale, "bn", "I18nBangla");
  const I18nBanglish = makeI18nBlock(locale, "banglish", "I18nBanglish");

  const tree = React.useMemo(() => buildSidebarTree(sidebar), [sidebar]);

  const onTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const currentRel = slug.join("/");
  const { node, siblings } = React.useMemo(
    () => findNodeWithParent(tree, currentRel),
    [tree, currentRel]
  );
  const idx = React.useMemo(
    () => (node ? siblings.findIndex((s) => s.href === node.href) : -1),
    [siblings, node]
  );
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  function getTitleBySlug(slug: string): string {
    const item = sidebar.find((s) => s.href === slug);
    return item ? item.label : slug.split("/").pop() || slug;
  }

  function getPathBySlug(slug: string): string {
    return `/${locale}/learn/${slug}`;
  }

  return (
    <>
      <Head>
        <title>{heading ? `${heading} — BNL Learn` : "BNL Learn"}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>

      <HeadComponent
        locale={locale}
        title={`${heading} | Bnlang`}
        description={description}
        pathname={`/${locale}/learn/${slug.join("/")}`}
      />
      <Header locale={locale} isFullWidth />

      <div className="min-h-screen xl:grid xl:grid-cols-[350px_minmax(0,1fr)_280px]">
        <aside className="hidden xl:block border-r">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <ScrollArea className="h-full px-3 py-4">
              <nav aria-label="Learn navigation">
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
                  <Link href={`/${locale}/learn/get-started`}>Learn</Link>
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
                  <SheetTitle>Learn</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-3.25rem)]">
                  <ScrollArea className="h-full px-3 py-4">
                    <nav aria-label="Learn navigation">
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
                We couldn’t find this page in Learn.
              </p>
              <div className="mt-4">
                <Button asChild variant="secondary" size="sm">
                  <a href={`${base}/${sidebar[0]?.href || ""}`}>
                    {t("common.docsHome")}
                  </a>
                </Button>
              </div>
            </Card>
          ) : (
            <>
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

              <nav
                className="mt-8 flex items-center justify-between"
                aria-label="Learn pagination"
              >
                {prev ? (
                  <Link
                    href={`${base}/${prev.href}`}
                    rel="prev"
                    className="max-w-[48%]"
                  >
                    <Button
                      variant="outline"
                      className="w-full truncate justify-start"
                    >
                      ← {prev.label}
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    href={`${base}/${next.href}`}
                    rel="next"
                    className="max-w-[48%]"
                  >
                    <Button
                      variant="outline"
                      className="w-full truncate justify-end"
                    >
                      {next.label} →
                    </Button>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>

              <Separator className="my-8" />
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
  const locales: SupportedLocale[] = ["en", "bn", "banglish"];
  const slugs = getAllLearnSlugsFromFS();

  const paths: { params: { locale: string; slug: string[] } }[] = [];
  for (const l of locales) {
    for (const s of slugs) {
      paths.push({ params: { locale: l, slug: s.slug } });
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const locale = (
    rawLocale === "banglish" ? "banglish" : normalizeLocale(rawLocale)
  ) as SupportedLocale;
  const { slug } = params as { slug: string[] };

  // const loaded = await loadLearnMdx(slug, locale);
  const loaded = await loadMdxWithFallback(locale, slug, null);

  const learnTree = getLearnSidebar() as LearnItem[];
  const flat = flattenLearn(learnTree, locale);
  const activePath = slug.join("/");
  const sidebar = flat.map((it) => ({ ...it, active: it.href === activePath }));

  const fallbackTitle = findLearnTitle(slug) || "";

  if (!loaded.found) {
    return {
      props: {
        locale,
        slug,
        title: fallbackTitle,
        found: false as const,
        sidebar,
      },
    };
  }

  const fm = loaded.frontmatter || {};
  const localizedTitle =
    locale === "bn"
      ? fm.bnTitle || fm.title
      : locale === "banglish"
      ? fm.banglishTitle || fm.bnLatnTitle || fm.title
      : fm.title;

  const localizedDescription =
    locale === "bn"
      ? fm.bnDescription || fm.description
      : locale === "banglish"
      ? fm.banglishDescription || fm.bnLatnDescription || fm.description
      : fm.description;

  return {
    props: {
      locale,
      slug,
      title: localizedTitle || fallbackTitle,
      description: localizedDescription || undefined,
      found: true as const,
      source: loaded.mdx,
      headings: loaded.headings,
      sidebar,
    },
  };
};
