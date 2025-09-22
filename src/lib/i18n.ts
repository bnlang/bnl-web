import { useMemo } from "react";
import { useRouter } from "next/router";

// Common translations
import enCommon from "../../locales/en/common.json";
import bnCommon from "../../locales/bn/common.json";
import banglishCommon from "../../locales/banglish/common.json";

// Head Translations
import enHead from "../../locales/en/head.json";
import bnHead from "../../locales/bn/head.json";
import bnLatnHead from "../../locales/banglish/head.json";

// Header Translations
import enHeader from "../../locales/en/header.json";
import bnHeader from "../../locales/bn/header.json";
import bnLatnHeader from "../../locales/banglish/header.json";

// Footer Translations
import enFooter from "../../locales/en/footer.json";
import bnFooter from "../../locales/bn/footer.json";
import bnLatnFooter from "../../locales/banglish/footer.json";

// Home Translations
import enHome from "../../locales/en/home.json";
import bnHome from "../../locales/bn/home.json";
import bnLatnHome from "../../locales/banglish/home.json";

// About Translations
import enAbout from "../../locales/en/about.json";
import bnAbout from "../../locales/bn/about.json";
import bnLatnAbout from "../../locales/banglish/about.json";

// Terms Translations
import enTerms from "../../locales/en/terms.json";
import bnTerms from "../../locales/bn/terms.json";
import bnLatnTerms from "../../locales/banglish/terms.json";

// privacy Translations
import enPrivacy from "../../locales/en/privacy.json";
import bnPrivacy from "../../locales/bn/privacy.json";
import bnLatnPrivacy from "../../locales/banglish/privacy.json";

// Download Translations
import enDownload from "../../locales/en/download.json";
import bnDownload from "../../locales/bn/download.json";
import bnLatnDownload from "../../locales/banglish/download.json";

// Releases Translations
import enReleases from "../../locales/en/releases.json";
import bnReleases from "../../locales/bn/releases.json";
import bnLatnReleases from "../../locales/banglish/releases.json";

type Dict = Record<string, any>;
type Namespaced = Record<string, Dict>;
type Locale = "en" | "bn" | "banglish";

const EN: Namespaced = {
  common: enCommon as Dict,
  head: enHead as Dict,
  header: enHeader as Dict,
  footer: enFooter as Dict,
  home: enHome as Dict,
  about: enAbout as Dict,
  terms: enTerms as Dict,
  privacy: enPrivacy as Dict,
  download: enDownload as Dict,
  releases: enReleases as Dict,
};
const BN: Namespaced = {
  common: bnCommon as Dict,
  head: bnHead as Dict,
  header: bnHeader as Dict,
  footer: bnFooter as Dict,
  home: bnHome as Dict,
  about: bnAbout as Dict,
  terms: bnTerms as Dict,
  privacy: bnPrivacy as Dict,
  download: bnDownload as Dict,
  releases: bnReleases as Dict,
};
const BNLATN: Namespaced = {
  common: banglishCommon as Dict,
  head: bnLatnHead as Dict,
  header: bnLatnHeader as Dict,
  footer: bnLatnFooter as Dict,
  home: bnLatnHome as Dict,
  about: bnLatnAbout as Dict,
  terms: bnLatnTerms as Dict,
  privacy: bnLatnPrivacy as Dict,
  download: bnLatnDownload as Dict,
  releases: bnLatnReleases as Dict,
};

// Single place to expand/alias locales (e.g. bn-BD -> bn)
const LOCALE_ALIASES: Record<string, Locale> = {
  en: "en",
  "en-US": "en",
  "en-GB": "en",
  bn: "bn",
  "bn-BD": "bn",
  banglish: "banglish",
  "bn-Latn": "banglish",
};

const TABLE: Record<Locale, Namespaced> = {
  en: EN,
  bn: BN,
  banglish: BNLATN,
};

export function normalizeLocale(raw?: string): Locale {
  const key = String(raw || "en");
  return LOCALE_ALIASES[key] ?? "en";
}

function getPath(obj: any, path?: string): any {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

function interpolate(str: string, args?: Record<string, any>): string {
  if (!args) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in args ? String(args[k]) : `{${k}}`));
}

function resolveKey(key: string): { ns: keyof Namespaced; inner: string } {
  const i = key.indexOf(".");
  return i === -1
    ? ({ ns: "common", inner: key } as const)
    : ({ ns: key.slice(0, i) as keyof Namespaced, inner: key.slice(i + 1) } as const);
}

function isProd() {
  return process.env.NODE_ENV === "production";
}

/** Factory usable anywhere (SSR or non-React files). */
export function getTranslator(localeRaw?: string) {
  const locale = normalizeLocale(localeRaw || "en");

  const translate = (key: string, args?: Record<string, any>): string => {
    if (!key) return "";
    const { ns, inner } = resolveKey(key);
    const dict = TABLE[locale]?.[ns];
    const fallback = TABLE.en?.[ns];

    let val = getPath(dict, inner);
    if (val === undefined) {
      if (!isProd()) {
        console.warn(`[i18n] Missing key "${ns}.${inner}" for locale "${locale}"`);
      }
      val = getPath(fallback, inner);
    }

    if (typeof val === "string") return interpolate(val, args);
    // If non-string, return a readable hint instead of "[object Object]"
    return typeof val === "undefined" ? key : JSON.stringify(val);
  };

  // Raw getter for arrays/objects without string interpolation
  translate.raw = <T = unknown>(key: string): T | undefined => {
    const { ns, inner } = resolveKey(key);
    const dict = TABLE[locale]?.[ns];
    const fallback = TABLE.en?.[ns];
    let val = getPath(dict, inner);
    if (val === undefined) {
      if (!isProd()) {
        console.warn(`[i18n] Missing raw key "${ns}.${inner}" for locale "${locale}"`);
      }
      val = getPath(fallback, inner);
    }
    return val as T | undefined;
  };

  return translate as typeof translate & { raw: <T = unknown>(key: string) => T | undefined };
}

/** React hook: optionally override locale; otherwise uses router.locale. */
export function useT(overrideLocale?: string) {
  const { locale: routerLocale } = useRouter();
  const effective = normalizeLocale(overrideLocale ?? routerLocale ?? "en");
  return useMemo(() => getTranslator(effective), [effective]);
}

/** Convenience for server code (getStaticProps) */
export const tSSR = (localeRaw: string | undefined, key: string, args?: Record<string, any>) =>
  getTranslator(localeRaw)(key, args);
