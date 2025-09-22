"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { getBnlHighlighter } from "@/lib/bnl-highlighter";
import copy from "copy-to-clipboard";

type PreProps = React.HTMLAttributes<HTMLPreElement>;

function extractCode(children: React.ReactNode) {
  if (typeof children === "string") {
    return { code: children, language: "bnl" };
  }
  if (Array.isArray(children)) {
    const first = children.find((c) => React.isValidElement(c)) as
      | React.ReactElement
      | undefined;
    if (first) return extractCode(first);
    return {
      code: children.filter((x) => typeof x === "string").join(""),
      language: "bnl",
    };
  }
  if (React.isValidElement(children)) {
    const el = children as React.ReactElement<any>;
    const cls = (el.props?.className || "") as string;
    const lang = cls.match(/language-([\w-]+)/)?.[1] ?? "bnl";
    const inner = el.props?.children;
    if (typeof inner === "string") return { code: inner, language: lang };
    if (Array.isArray(inner))
      return {
        code: inner.map((n: any) => (typeof n === "string" ? n : "")).join(""),
        language: lang,
      };
    if (React.isValidElement(inner)) return extractCode(inner);
  }
  return { code: "", language: "bnl" };
}

export default function CodeBlock(props: PreProps) {
  const { className, children } = props;
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const { code, language } = React.useMemo(
    () => extractCode(children),
    [children]
  );

  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const highlighter = await getBnlHighlighter();
      const themeName = theme === "dark" ? "github-dark" : "github-light";
      let highlighted = highlighter.codeToHtml(code, {
        lang: language,
        theme: themeName,
        keepBackground: false,
      });

      highlighted = highlighted.replace(
        /<code\b/,
        `<code data-language="${language}"`
      );

      let line = 0;
      highlighted = highlighted.replace(/class="line"/g, () => {
        line += 1;
        return `class="line" data-line="${line}"`;
      });

      if (mounted) setHtml(highlighted);
    })();
    return () => {
      mounted = false;
    };
  }, [code, language, theme]);

  async function onCopy() {
    const ok = copy(code, { format: "text/plain" });
    setCopied(ok);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <figure className="relative code-highlight-figure">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="absolute top-2 right-2 z-10 border-0"
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>

      {html ? (
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: html }}
          suppressHydrationWarning
        />
      ) : (
        <pre className={className}>
          <code className={`language-${language}`} data-language={language}>
            {code}
          </code>
        </pre>
      )}
    </figure>
  );
}
