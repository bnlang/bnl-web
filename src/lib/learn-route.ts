import fs from "fs";
import path from "path";
import { LEARN_ROUTE } from "./routes";
import { LearnItem } from "@/types/learn.types";

function flatten(
  nodes: LearnItem[],
  out: LearnItem[] = [],
  base = ""
): LearnItem[] {
  for (const n of nodes) {
    const full = base ? `${base}/${n.slug}` : n.slug;
    out.push({ ...n, slug: full });
    if (n.children?.length) flatten(n.children, out, full);
  }
  return out;
}

export function getLearnSidebar(): LearnItem[] {
  return LEARN_ROUTE;
}

export function findLearnTitle(slugPath: string[]): string | null {
  const target = slugPath.join("/");
  const flat = flatten(LEARN_ROUTE);
  return flat.find((d) => d.slug === target)?.title ?? null;
}

export function getAllLearnSlugsFromFS(): { slug: string[] }[] {
  const base = path.join(process.cwd(), "contents", "learn");

  const results: { slug: string[] }[] = [];
  const walk = (dir: string, rel: string[] = []) => {
    const idx = path.join(dir, "index.mdx");
    if (fs.existsSync(idx)) {
      results.push({ slug: rel });
    }

    for (const name of fs.readdirSync(dir)) {
      const fp = path.join(dir, name);
      const st = fs.statSync(fp);
      if (st.isDirectory()) walk(fp, [...rel, name]);
    }
  };

  if (fs.existsSync(base)) walk(base);
  return results;
}
