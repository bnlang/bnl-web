import type { GetStaticPaths, GetStaticProps } from "next";
import { localeHref, normalizeLocale } from "@/lib/i18n";
import { HomeComponent } from "@/components/home-component";
import HeadComponent from "@/components/head-component";
import { SupportedLocale } from "@/types/locale.types";

type Props = {
  locale: SupportedLocale;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bnlang.dev";

export default function HomePage({ locale }: Props) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Bnlang",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      sameAs: ["https://github.com/bnlang"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Bnlang",
      url: SITE_URL,
      inLanguage: locale === "bn" ? "bn-BD" : "en",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}${localeHref(locale, "blogs")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Bnlang",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows, macOS, Linux",
      url: SITE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        locale === "bn"
          ? "Bnlang হলো একটি প্রোগ্রামিং ভাষা যা বাংলা এবং ইংরেজি উভয় ভাষায় কোড লেখা এবং চালানোর সুবিধা দেয়।"
          : "Bnlang is a programming language that lets you write code in Bangla or English and run it effortlessly.",
    },
  ];

  return (
    <>
      <HeadComponent
        locale={locale}
        pathname=""
        structuredData={structuredData}
      />
      <HomeComponent locale={locale} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locales: SupportedLocale[] = ["en", "bn"];
  const paths = locales.map((l) => ({ params: { locale: l } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale = normalized as SupportedLocale;

  return {
    props: { locale },
  };
};
