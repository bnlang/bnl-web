"use client";
import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import Link from "next/link";
import { localeHref } from "@/lib/i18n";

const COOKIE_NAME = "NEXT_LOCALE";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function setLocaleCookie(locale: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${locale}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en") parts.shift();
  return "/" + parts.join("/");
}

export function LangSwitcher({}: { locale?: string }) {
  const router = useRouter();

  function switchTo(newLocale: string): string {
    const base = stripLocalePrefix(router.asPath || "/");
    return localeHref(newLocale, base);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <span className="sr-only">Language Switcher</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-bangla" asChild>
          <Link href={switchTo("bn")} onClick={() => setLocaleCookie("bn")}>
            বাংলা (Bangla)
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={switchTo("en")} onClick={() => setLocaleCookie("en")}>
            English
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
