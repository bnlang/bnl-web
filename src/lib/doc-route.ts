import { DocItem } from "@/types/doc.types";
import { DOC_ROUTES } from "./routes";

function flatten(nodes: DocItem[], out: DocItem[] = [], base = ""): DocItem[] {
  for (const n of nodes) {
    const full = base ? `${base}/${n.slug}` : n.slug;
    out.push({ ...n, slug: full });
    if (n.children?.length) flatten(n.children, out, full);
  }
  return out;
}

function flattenWithDepth(
  nodes: DocItem[],
  out: {
    slug: string;
    title: string;
    titleBn: string;
    depth: number;
  }[] = [],
  base = "",
  depth = 0
) {
  for (const n of nodes) {
    const full = base ? `${base}/${n.slug}` : n.slug;
    out.push({
      slug: full,
      title: n.title,
      titleBn: n.titleBn,
      depth,
    });
    if (n.children?.length) flattenWithDepth(n.children, out, full, depth + 1);
  }
  return out;
}

export function getSidebar(version: string): DocItem[] {
  return DOC_ROUTES[version] || [];
}

export function getSidebarFlattened(version: string) {
  return flattenWithDepth(getSidebar(version));
}

export function findDocTitle(
  version: string,
  slugPath: string[]
): string | null {
  const target = slugPath.join("/");
  const flat = flatten(DOC_ROUTES[version] || []);
  return flat.find((d) => d.slug === target)?.title ?? null;
}

export function getAllDocPathsUnion() {
  const union = new Set<string>();
  for (const v of Object.keys(DOC_ROUTES)) {
    for (const it of flatten(DOC_ROUTES[v])) union.add(it.slug);
  }
  const versions = Object.keys(DOC_ROUTES);
  const result: { version: string; slug: string[] }[] = [];
  for (const v of versions) {
    for (const s of union) result.push({ version: v, slug: s.split("/") });
  }
  return result;
}
