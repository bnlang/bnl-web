import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Noto_Sans_Bengali, Noto_Serif_Bengali, Roboto } from "next/font/google";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["latin"],
  variable: "--font-noto-sans-bengali",
  weight: ["400", "500", "600", "700"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin"],
  variable: "--font-noto-serif-bengali",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${notoSansBengali.variable} ${notoSerifBengali.variable} ${roboto.variable}`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </main>
  );
}
