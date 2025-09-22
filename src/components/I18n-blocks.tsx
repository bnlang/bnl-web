import { useRouter } from "next/router";
import { ReactNode } from "react";

function makeI18n(localeCode: string) {
  return function I18nLocale({ children }: { children: ReactNode }) {
    const { locale } = useRouter();
    return locale === localeCode ? <>{children}</> : null;
  };
}

export const I18nEnglish = makeI18n("en");
export const I18nBangla = makeI18n("bn");
export const I18nBanglish = makeI18n("banglish");
