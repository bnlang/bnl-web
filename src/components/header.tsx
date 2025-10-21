"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useT } from "@/lib/i18n";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { LangSwitcher } from "./lang-switcher";
import { HeaderSearch } from "./header-search";
import { getLatestVersionString } from "@/lib/routes";
import { SupportedLocale } from "@/types/locale.types";

interface HeaderProps {
  isFullWidth?: boolean;
  locale?: string;
}

export function Header({ isFullWidth, locale = "en" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const t = useT(locale);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div
          className={`mx-auto flex h-16 items-center justify-between px-3 ${
            isFullWidth ? "max-w-full" : "max-w-7xl"
          }`}
        >
          <div className="flex items-center space-x-4">
            <Link href={`/${locale}`}>
              <Logo width={88} />
            </Link>

            <nav
              className={`hidden md:flex items-center space-x-6 sm:space-x-5 ${
                locale === "bn" ? "font-bn" : ""
              }`}
            >
              <Link
                href={`/${locale}`}
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.home")}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.about")}
              </Link>
              <Link
                href={`/${locale}/learn/get-started`}
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.learn")}
              </Link>
              <Link
                href={`/${locale}/docs/${getLatestVersionString()}/introduction`}
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.docs")}
              </Link>
              <Link
                href="https://github.com/bnlang"
                target="_blank"
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.contribute")}
              </Link>
              <Link
                href={`/${locale}/tutorials`}
                className="text-md hover:text-bd-green transition-colors"
              >
                {t("header.tutorials")}
              </Link>
              <Link
                href={`https://bpm.bnlang.dev/`}
                className="text-md hover:text-bd-green transition-colors"
              >
                BPM
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden w-10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search />
            </Button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-md" />
              <Input
                placeholder="⌘ Search Docs..."
                readOnly
                onClick={() => setIsSearchOpen(true)}
                className="w-64 pl-8"
              />
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="https://github.com/bnlang" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
              </Link>
            </Button>
            <LangSwitcher locale={locale} />
            <ModeToggle />
            <Button variant="bdGreen" asChild className="hidden md:inline-flex">
              <Link href={`/${locale}/download`}>{t("header.download")}</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container flex flex-col space-y-4 px-4 py-4">
              <Link
                href={`/${locale}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.home")}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.about")}
              </Link>
              <Link
                href={`/${locale}/learn/get-started`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.learn")}
              </Link>
              <Link
                href={`/${locale}/docs/${getLatestVersionString()}/introduction`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.docs")}
              </Link>
              <Link
                href="https://github.com/bnlang"
                target="_blank"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.contribute")}
              </Link>
              <Link
                href={`/${locale}/tutorials`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.tutorials")}
              </Link>
              <Link
                href={`https://bpm.bnlang.dev`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                BPM
              </Link>
              <Link
                href={`/${locale}/download`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t("header.download")}
              </Link>
              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search Documentation..."
                    readOnly
                    onClick={() => setIsSearchOpen(true)}
                    className="pl-8"
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
      <HeaderSearch
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        locale={locale as SupportedLocale}
      />
    </>
  );
}
