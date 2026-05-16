import { localeHref, useT } from "@/lib/i18n";
import Head from "next/head";
import Script from "next/script";

interface HeadComponentProps {
  locale: string;
  /** Locale-agnostic path, e.g. "about", "/blogs/slug". Omit for home. */
  pathname?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  type?: "article" | "website";
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bnlang.dev";

const SUPPORTED_LOCALES = ["en", "bn"] as const;

function ogLocaleFor(locale: string): string {
  return locale === "bn" ? "bn_BD" : "en_US";
}

export default function HeadComponent({
  title,
  description,
  keywords,
  locale,
  ogImage,
  pathname,
  type = "website",
  structuredData,
  noindex,
}: HeadComponentProps) {
  const t = useT(locale);

  const resolvedTitle = title || t("head.title");
  const resolvedDescription = description || t("head.description");
  const resolvedKeywords = keywords || t("head.keywords");

  const canonicalPath = localeHref(locale, pathname || "");
  const url = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const image =
    ogImage && ogImage.trim() ? ogImage : `${SITE_URL}/images/og_image.jpg`;

  const jsonLd: Array<Record<string, any>> = [];
  if (Array.isArray(structuredData)) jsonLd.push(...structuredData);
  else if (structuredData) jsonLd.push(structuredData);

  const altHref = (l: string) => {
    const p = localeHref(l, pathname || "");
    return `${SITE_URL}${p === "/" ? "" : p}`;
  };

  return (
    <>
      <Head>
        <title>{resolvedTitle}</title>

        <meta name="description" content={resolvedDescription} />
        <meta name="keywords" content={resolvedKeywords} />
        <meta
          name="robots"
          content={noindex ? "noindex, nofollow" : "index, follow"}
        />
        <meta name="theme-color" content="#da291c" />

        <link rel="canonical" href={url} key="canonical" />

        {SUPPORTED_LOCALES.map((l) => (
          <link
            key={`alt-${l}`}
            rel="alternate"
            hrefLang={l === "bn" ? "bn-BD" : "en"}
            href={altHref(l)}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={altHref("en")}
          key="alt-x-default"
        />

        <meta property="og:title" content={resolvedTitle} />
        <meta property="og:description" content={resolvedDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content={title ? title : "Bnlang"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Bnlang" />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content={ogLocaleFor(locale)} />
        {SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => (
          <meta
            key={l}
            property="og:locale:alternate"
            content={ogLocaleFor(l)}
          />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={resolvedTitle} />
        <meta name="twitter:description" content={resolvedDescription} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content={title ? title : "Bnlang"} />

        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {jsonLd.map((node, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}
      </Head>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-P2GS8KPLZJ"
      ></Script>
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-P2GS8KPLZJ');
        `}
      </Script>
    </>
  );
}
