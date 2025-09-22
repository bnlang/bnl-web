"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Info, Book } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DOC_ROUTES, getLatestVersionString, LEARN_ROUTE } from "@/lib/routes";

type SupportedLocale = "en" | "bn" | "banglish";

type RouteNode = {
  slug: string;
  title: string;
  titleBn?: string;
  titleBanglish?: string;
  children?: RouteNode[];
};

function joinSlug(parts: string[]) {
  return parts.filter(Boolean).join("/");
}

function labelForLocale(node: RouteNode, locale: SupportedLocale) {
  if (locale === "bn") return node.titleBn || node.title;
  if (locale === "banglish") return node.titleBanglish || node.title;
  return node.title;
}

type FlatItem = {
  kind: "docs" | "learn";
  href: string;
  label: string;
  value: string;
};

function flattenTree(
  nodes: RouteNode[],
  locale: SupportedLocale,
  baseKind: "docs" | "learn",
  urlBase: string,
  parentSlugs: string[] = []
): FlatItem[] {
  const out: FlatItem[] = [];
  for (const n of nodes) {
    const fullSlugs = [...parentSlugs, n.slug];
    const href = `${urlBase}/${joinSlug(fullSlugs)}`;
    const label = labelForLocale(n, locale);
    const value = [
      label,
      n.title,
      n.titleBn,
      n.titleBanglish,
      joinSlug(fullSlugs),
    ]
      .filter(Boolean)
      .join(" ");

    out.push({ kind: baseKind, href, label, value });

    if (n.children?.length) {
      out.push(
        ...flattenTree(n.children, locale, baseKind, urlBase, fullSlugs)
      );
    }
  }
  return out;
}

interface HeaderSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale: SupportedLocale;
}

export function HeaderSearch({
  open,
  onOpenChange,
  locale,
}: HeaderSearchProps) {
  const router = useRouter();
  const version = getLatestVersionString();
  const docRoutes = DOC_ROUTES[version] as RouteNode[];

  const { docsItems, learnItems } = React.useMemo(() => {
    const docsBase = `/${locale}/docs/${version}`;
    const learnBase = `/${locale}/learn`;
    return {
      docsItems: flattenTree(
        docRoutes as RouteNode[],
        locale,
        "docs",
        docsBase
      ),
      learnItems: flattenTree(
        LEARN_ROUTE as RouteNode[],
        locale,
        "learn",
        learnBase
      ),
    };
  }, [locale, version, docRoutes]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const onSelectHref = (href: string) => {
    onOpenChange?.(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => onSelectHref(`/${locale}/about`)}>
            <Info className="mr-2 h-4 w-4" />
            <span>About</span>
          </CommandItem>
          <CommandItem
            onSelect={() => onSelectHref(`/${locale}/learn/get-started`)}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Learn</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              onSelectHref(`/${locale}/docs/${version}/introduction`)
            }
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Docs</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {docsItems.length > 0 && (
          <CommandGroup heading="Docs">
            {docsItems.map((it) => (
              <CommandItem
                key={`docs:${it.href}`}
                value={it.value}
                onSelect={() => onSelectHref(it.href)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="truncate">{it.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {learnItems.length > 0 && (
          <CommandGroup heading="Learn">
            {learnItems.map((it) => (
              <CommandItem
                key={`learn:${it.href}`}
                value={it.value}
                onSelect={() => onSelectHref(it.href)}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                <span className="truncate">{it.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
