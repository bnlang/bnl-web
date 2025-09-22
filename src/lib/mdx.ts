import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { fallbackChain } from "./versions";
import type { Root } from "hast";
import { toString } from "hast-util-to-string";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visitParents } from "unist-util-visit-parents";

export type Heading = { id: string; text: string; depth: number };

export type LoadedDoc =
  | {
    found: true;
    sourceVersion: string;
    mdx: any;
    headings: Heading[];
    frontmatter: Record<string, any>;
  }
  | { found: false };

function mdxPath(version: string, slug: string[]) {
  return path.join(
    process.cwd(),
    "contents",
    "docs",
    version,
    ...slug,
    "index.mdx"
  );
}

export async function loadMdxWithFallback(
  locale: string,
  slug: string[],
  requestedVersion?: string | null,
): Promise<LoadedDoc> {
  let chosen: string | null = null;
  let contentRaw: string | null = null;

  if (requestedVersion) {
    const chain = fallbackChain(requestedVersion);
    for (const v of chain) {
      const fp = mdxPath(v, slug);
      if (fs.existsSync(fp)) {
        chosen = v;
        contentRaw = fs.readFileSync(fp, "utf8");
        break;
      }
    }
  } else {
    const BASE_DIR = path.join(process.cwd(), "contents", "learn");
    const filePath = path.join(BASE_DIR, ...slug, "index.mdx");

    if (fs.existsSync(filePath)) {
      chosen = 'learn';
      contentRaw = fs.readFileSync(filePath, "utf8");
    }
  }

  if (!chosen || !contentRaw) return { found: false };

  const { content, data } = matter(contentRaw);
  const headings: Heading[] = [];
  const wanted = {
    en: "I18nEnglish",
    bn: "I18nBangla",
    banglish: "I18nBanglish",
  }[locale];

  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkRehype],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["no-underline"] } }],
        () => (tree: Root) => {
          visitParents(tree, "element", (node: any, ancestors: any[]) => {
            if (!/^h[1-6]$/.test(node.tagName)) return;
            const depth = Number(node.tagName.slice(1));
            if (depth < 2 || depth > 4) return;

            const wrapper = ancestors
              .reverse()
              .find((a) => ["I18nEnglish", "I18nBangla", "I18nBanglish"].includes(a?.name));

            if (wrapper && wrapper.name !== wanted) return;

            const id = node.properties?.id as string;
            const text = toString(node).trim();
            if (id && text) headings.push({ id, text, depth });
          });
        },
      ],
      format: "mdx",
    },
    parseFrontmatter: false,
  });

  return {
    found: true,
    sourceVersion: chosen,
    mdx,
    headings,
    frontmatter: data || {},
  };
}
