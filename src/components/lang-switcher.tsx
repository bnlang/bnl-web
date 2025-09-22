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

export function LangSwitcher({}: { locale?: string }) {
  const router = useRouter();
  function switchTo(newLocale: string) {
    if (!router.asPath) return;

    const parts = router.asPath.split("/").filter(Boolean);

    if (parts.length > 0) {
      parts[0] = newLocale;
    } else {
      parts.unshift(newLocale);
    }

    const newPath = "/" + parts.join("/");

    router.push(newPath);
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
        <DropdownMenuItem
          className="font-bangla"
          onClick={() => switchTo("bn")}
        >
          বাংলা
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTo("banglish")}>
          Banglish (Bangla)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchTo("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
