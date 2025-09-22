"use client";

import { getBnlHighlighter } from "@/lib/bnl-highlighter";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import copy from "copy-to-clipboard";

type Props = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  mode?: "light" | "dark";
};

export default function SingleCodeBlock({
  code,
  language = "bnl",
  showLineNumbers = false,
  className = "",
  mode,
}: Props) {
  const preRef = React.useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    const code = preRef.current?.querySelector("code");
    const text = code?.innerText ?? "";
    const ok = copy(text, { format: "text/plain" });
    setCopied(ok);
    setTimeout(() => setCopied(false), 1200);
  }

  const [html, setHtml] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const highlighter = await getBnlHighlighter();
      const themeColor = mode ? mode : theme;
      let highlighted = highlighter.codeToHtml(code, {
        lang: language,
        theme: themeColor === "dark" ? "github-dark" : "github-light",
        keepBackground: false,
      });

      const langAttr = String(language).replace(/"/g, "&quot;");
      highlighted = highlighted.replace(
        /<code\b/,
        `<code data-language="${langAttr}"`
      );

      let lineNo = 0;
      highlighted = highlighted.replace(/class="line"/g, () => {
        lineNo += 1;
        return `data-line="${lineNo}"`;
      });

      setHtml(highlighted);
    })();
  }, [code, theme, mode, language, showLineNumbers]);

  return (
    <div className="code-highlight-figure single">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCopy}
        className={`absolute top-2 right-2 z-10 focus:opacity-100 transition-opacity border-0 ${
          mode === "dark" ? "bg-black/70 hover:bg-black/50 text-white hover:text-white" : ""
        }`}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>

      <div
        className={`${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
        ref={preRef}
      />
    </div>
  );
}
