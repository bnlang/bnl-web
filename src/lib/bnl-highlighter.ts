import { createHighlighter, type BundledTheme } from "shiki";
import bnlGrammar from "./grammars/bnl-language.json";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { toString } from "hast-util-to-string";

let _highlighter: any;

export async function getBnlHighlighter() {
    if (_highlighter) return _highlighter;

    _highlighter = await createHighlighter({
        themes: ["github-dark", "github-light"] as BundledTheme[],
        langs: [

            "js",
            "bash",
            "json",
            {
                ...(bnlGrammar as any),
                name: "bnl",
                scopeName: "source.bnl",
                aliases: ["bnlang"],
            },
        ],
    });

    return _highlighter;
}

function stripBackgroundStyle(props: any) {
    if (!props) return;
    const s = props.style;
    if (!s) return;
    if (typeof s === "string") {
        props.style = s.replace(/background-color\s*:\s*[^;]+;?/gi, "").trim();
        if (!props.style) delete props.style;
    } else if (typeof s === "object") {
        if ("backgroundColor" in s) delete s.backgroundColor;
        if (Object.keys(s).length === 0) delete props.style;
    }
}

export function rehypeBnlShiki(highlighter: any, theme: string = "github-light") {
    return async (tree: Root) => {
        const targets: Array<{ pre: any; code: any }> = [];

        visit(tree, "element", (node: any) => {
            if (node.tagName !== "pre") return;
            const code = node.children?.[0];
            if (!code || code.tagName !== "code") return;

            const classList = (code.properties?.className ?? []) as string[];
            const langFromClass = classList.find((c) => c.startsWith("language-"))?.slice("language-".length);
            const lang = (code.properties?.["data-language"] as string) || langFromClass;

            if (lang === "bnl" || lang === "bnlang") {
                targets.push({ pre: node, code });
            }
        });

        for (const { pre } of targets) {
            const raw = toString(pre);

            const html = await highlighter.codeToHtml(raw, { lang: "bnl", theme });
            const hast = fromHtml(html, { fragment: true }).children[0];

            const codeEl = Array.isArray((hast as any).children)
                ? (hast as any).children.find((c: any) => c.type === "element" && c.tagName === "code")
                : null;
            if (codeEl) {
                codeEl.properties = codeEl.properties || {};
                codeEl.properties["data-language"] = "bnl";
            }

            visit(hast, "element", (node: any) => {
                const cls = node.properties?.className as string[] | undefined;
                if (cls?.includes("line")) {
                    node.properties = node.properties || {};
                    node.properties["data-line"] = "";
                    const filtered = cls.filter((c) => c !== "line");
                    if (filtered.length) node.properties.className = filtered;
                    else delete node.properties.className;
                }
                stripBackgroundStyle(node.properties);
            });

            if (hast && hast.type === "element" && hast.properties) {
                stripBackgroundStyle(hast.properties);
            }

            for (const k of Object.keys(pre)) delete (pre as any)[k];
            Object.assign(pre, hast);

            pre.properties = pre.properties || {};
            const cls = (pre.properties.className ?? []) as string[];
            pre.properties.className = Array.from(new Set([...cls, "not-prose"]));
            pre.properties["data-line-numbers"] = "";
        }
    };
}