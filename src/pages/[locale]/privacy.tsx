import type { GetStaticPaths, GetStaticProps } from "next";
import { useT, normalizeLocale } from "@/lib/i18n";
import HeadComponent from "@/components/head-component";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SupportedLocale } from "@/types/locale.types";

type Props = { locale: SupportedLocale };

export default function PrivacyPage({ locale }: Props) {
  const t = useT(locale);

  const title = `${t("privacy.meta.title")} | Bnlang`;
  const description = t("privacy.meta.description");

  const sections =
    t.raw<Array<{ id: string; title: string; body: string[] }>>(
      "privacy.sections"
    ) ?? [];

  return (
    <>
      <HeadComponent
        title={title}
        description={description}
        locale={locale}
        pathname={`/${locale}/privacy`}
      />
      <Header locale={locale} />
      <main>
        <section className="py-14 border-b bg-gradient-to-br from-bd-green/5 via-background to-bd-red/5 dark:from-bd-green/10 dark:via-background dark:to-bd-red/10">
          <div className="max-w-5xl mx-auto px-4">
            <Badge
              className="mb-3 px-3 py-1 text-[0.8rem] border border-bd-green text-bd-green"
              variant="outline"
            >
              {t("privacy.hero.badge")}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("privacy.hero.title")}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("privacy.hero.intro")}
            </p>
            <p className="mt-2 text-md text-muted-foreground">
              <span className="font-medium">
                {t("privacy.hero.lastUpdatedLabel")}:
              </span>{" "}
              {t("privacy.hero.lastUpdated")}
            </p>
          </div>
        </section>

        <section className="pb-8">
          <div className="max-w-5xl mx-auto px-4 prose prose-neutral dark:prose-invert">
            {sections.map((s, idx) => (
              <div key={s.id || idx} className="mb-4">
                <h2 className="text-xl font-medium mb-2">{s.title}</h2>
                {s.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
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

  return { props: { locale } };
};
