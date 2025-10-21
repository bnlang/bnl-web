import type { GetStaticPaths, GetStaticProps } from "next";
import { normalizeLocale } from "@/lib/i18n";
import { HomeComponent } from "@/components/home-component";
import HeadComponent from "@/components/head-component";
import { SupportedLocale } from "@/types/locale.types";

type Props = {
  locale: SupportedLocale;
};

export default function HomePage({ locale }: Props) {
  return (
    <>
      <HeadComponent locale={locale} pathname={`/${locale}`} />
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
