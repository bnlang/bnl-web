import { useT } from "@/lib/i18n";
import Head from "next/head";
import Script from "next/script";

interface HeadComponentProps {
  locale: string;
  pathname?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  type?: "article" | "website";
}

export default function HeadComponent({
  title,
  description,
  keywords,
  locale,
  ogImage,
  pathname,
  type = "website",
}: HeadComponentProps) {
  const t = useT(locale);

  return (
    <>
      <Head>
        <title>{title || t("head.title")}</title>

        <meta name="title" content={title || t("head.title")} />
        <meta
          name="description"
          content={description || t("head.description")}
        />
        <meta name="keywords" content={keywords || t("head.keywords")} />

        <meta property="og:title" content={title || t("head.title")} />
        <meta
          property="og:description"
          content={description || t("head.description")}
        />
        <meta property="og:image:alt" content={title ? title : "Bnlang"} />
        <meta property="og:site_name" content="Bnlang" />
        <meta property="og:type" content={type} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_SITE_URL}${
            pathname ? pathname : ""
          }`}
        />
        <meta
          property="og:image"
          content={
            ogImage
              ? ogImage
              : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og_image.jpg`
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="theme-color" content="#da291c" />
        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}${
            pathname ? pathname : ""
          }`}
        />

        <link rel="shortcut icon" href="/favicon.png" />
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
