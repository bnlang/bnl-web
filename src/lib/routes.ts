import { DocItem, VersionMap } from "@/types/doc.types";
import { LearnItem } from "@/types/learn.types";

const DOC_TREE: DocItem[] = [
    {
      slug: "introduction",
      title: "Introduction",
      titleBn: "ভূমিকা",
    },
    {
      slug: "usage-and-example",
      title: "Usage and example",
      titleBn: "ব্যবহার এবং উদাহরণ",
    },
    {
      slug: "keywords",
      title: "Keywords",
      titleBn: "কীওয়ার্ডস",

      children: [
        // ===================== Declarations =====================
        {
          slug: "var-keyword",
          title: "var",
          titleBn: "চলক",
        },
        {
          slug: "function-keyword",
          title: "function",
          titleBn: "ফাংশন",
        },
        {
          slug: "class-keyword",
          title: "class / extends / super",
          titleBn: "শ্রেণী / প্রসারিত / উপরের",
        },
        {
          slug: "import-keyword",
          title: "import / as",
          titleBn: "আমদানি / যেমন",
        },
        // ===================== Control flow =====================
        {
          slug: "if-keyword",
          title: "if",
          titleBn: "যদি",
        },
        {
          slug: "else-keyword",
          title: "else",
          titleBn: "নাহলে",
        },
        {
          slug: "for-keyword",
          title: "for / of",
          titleBn: "প্রতি / এর",
        },
        {
          slug: "while-keyword",
          title: "while",
          titleBn: "যতক্ষণ",
        },
        {
          slug: "switch-case-keyword",
          title: "switch / case / default",
          titleBn: "বিকল্প / অবস্থা / অন্যথায়",
        },
        {
          slug: "break-keyword",
          title: "break",
          titleBn: "থামুন",
        },
        {
          slug: "continue-keyword",
          title: "continue",
          titleBn: "চলুন",
        },
        {
          slug: "return-keyword",
          title: "return",
          titleBn: "ফেরত",
        },
        // ===================== Error handling =====================
        {
          slug: "throw-keyword",
          title: "throw",
          titleBn: "নিক্ষেপ",
        },
        {
          slug: "try-catch-finally-keyword",
          title: "try / catch / finally",
          titleBn: "চেষ্টা / ধরুন / অবশেষে",
        },
        // ===================== Asynchronous =====================
        {
          slug: "wait-keyword",
          title: "wait",
          titleBn: "অপেক্ষা",
        },
      ],
    },
    {
      slug: "operators",
      title: "Operators",
      titleBn: "অপারেটরসমূহ",
    },
    {
      slug: "globals",
      title: "Global functions",
      titleBn: "গ্লোবাল ফাংশন",
    },
    {
      slug: "modules",
      title: "Modules",
      titleBn: "মডিউলসমূহ",

      children: [
        // Core
        { slug: "sys-module",      title: "sys",      titleBn: "sys" },
        { slug: "io-module",       title: "io",       titleBn: "io" },
        { slug: "path-module",     title: "path",     titleBn: "path" },
        { slug: "timers-module",   title: "timers",   titleBn: "timers" },
        { slug: "time-module",     title: "time",     titleBn: "time" },
        // Async
        { slug: "future-module",   title: "Future + wait", titleBn: "Future + wait" },
        // Utilities
        { slug: "log-module",      title: "log",      titleBn: "log" },
        { slug: "dotenv-module",   title: "dotenv",   titleBn: "dotenv" },
        { slug: "cli-module",      title: "cli",      titleBn: "cli" },
        { slug: "uuid-module",     title: "uuid",     titleBn: "uuid" },
        // Data
        { slug: "json-module",     title: "json",     titleBn: "json" },
        { slug: "csv-module",      title: "csv",      titleBn: "csv" },
        { slug: "regex-module",    title: "regex",    titleBn: "regex" },
        // Crypto + math
        { slug: "crypto-module",   title: "crypto",   titleBn: "crypto" },
        { slug: "random-module",   title: "random",   titleBn: "random" },
        { slug: "math-module",     title: "math",     titleBn: "math" },
        { slug: "zlib-module",     title: "zlib",     titleBn: "zlib" },
        // Network
        { slug: "net-module",      title: "net",      titleBn: "net" },
        { slug: "dns-module",      title: "dns",      titleBn: "dns" },
        { slug: "tls-module",      title: "tls",      titleBn: "tls" },
        { slug: "url-module",      title: "url",      titleBn: "url" },
        // HTTP / Web
        { slug: "web-module",      title: "web",      titleBn: "web" },
        { slug: "request-module",  title: "request",  titleBn: "request" },
        { slug: "ws-module",       title: "ws",       titleBn: "ws" },
        { slug: "cookie-module",   title: "cookie",   titleBn: "cookie" },
        { slug: "session-module",  title: "session",  titleBn: "session" },
        { slug: "multipart-module",title: "multipart",titleBn: "multipart" },
        { slug: "template-module", title: "template", titleBn: "template" },
        // Database
        { slug: "sqlite-module",   title: "sqlite",   titleBn: "sqlite" },
        { slug: "pg-module",       title: "pg",       titleBn: "pg" },
        { slug: "mongo-module",    title: "mongo",    titleBn: "mongo" },
        // Process & test
        { slug: "exec-module",     title: "exec",     titleBn: "exec" },
        { slug: "test-module",     title: "test",     titleBn: "test" },
      ],
    },
    {
      slug: "bilingual",
      title: "Bilingual aliases",
      titleBn: "দ্বিভাষিক নাম",
    },
    {
      slug: "plugins",
      title: "Plugin development",
      titleBn: "প্লাগইন ডেভেলপমেন্ট",
    },
];

export const DOC_ROUTES: VersionMap = {
  "v1.0.0": DOC_TREE,
  "v2.0.0": DOC_TREE,
};

export function getLatestVersionString() {
  const versions = Object.keys(DOC_ROUTES);
  return versions[versions.length - 1];
}

export function getAllVersionStrings() {
  return Object.keys(DOC_ROUTES);
}

export const LEARN_ROUTE: LearnItem[] = [
  {
    slug: "get-started",
    title: "Get Started",
    titleBn: "শুরু করুন",

    children: [
      {
        slug: "introduction-to-bnlang",
        title: "Introduction to Bnlang",
        titleBn: "Bnlang পরিচিতি",
      },
      {
        slug: "how-bnlang-works-internally",
        title: "How Bnlang works internally",
        titleBn: "Bnlang কিভাবে কাজ করে",
      },
      {
        slug: "usecase-of-bnlang",
        title: "Use cases of Bnlang",
        titleBn: "Bnlang এর ব্যবহার",
      },
    ],
  },
  {
    slug: "asynchronous-work",
    title: "Asynchronous Work",
    titleBn: "অ্যাসিঙ্ক্রোনাস কাজ",

    children: [
      {
        title: "Asynchronous flow control",
        titleBn: "অ্যাসিঙ্ক্রোনাস ফ্লো কন্ট্রোল",
        slug: "asynchronous-flow-control",
      },
      {
        title: "Overview of blocking vs non-blocking",
        titleBn: "ব্লকিং বনাম নন-ব্লকিং এর সারসংক্ষেপ",
        slug: "overview-of-blocking-vs-non-blocking",
      },
      {
        title: "The Bnlang event loop",
        titleBn: "Bnlang ইভেন্ট লুপ",
        slug: "the-bnlang-event-loop",
      },
      {
        title: "Timers in Bnlang",
        titleBn: "Bnlang এ টাইমার",
        slug: "timers-in-bnlang",
      },
    ],
  },
  {
    slug: "manipulating-files",
    title: "Manipulating Files",
    titleBn: "ফাইল ম্যানিপুলেশন",

    children: [
      {
        title: "Bnlang File stats",
        titleBn: "Bnlang ফাইল পরিসংখ্যান",
        slug: "bnlang-file-stats",
      },
      {
        title: "Bnlang File Paths",
        titleBn: "Bnlang ফাইল পাথ",
        slug: "bnlang-file-paths",
      },
      {
        title: "Reading Files in Bnlang",
        titleBn: "Bnlang ফাইল পড়া",
        slug: "reading-files-in-bnlang",
      },
      {
        title: "Writing Files in Bnlang",
        titleBn: "Bnlang ফাইল লেখা",
        slug: "writing-files-in-bnlang",
      },
      {
        title: "Working with Directories in Bnlang",
        titleBn: "Bnlang ডিরেক্টরির সাথে কাজ করা",
        slug: "working-with-directories-in-bnlang",
      },
    ],
  },
  {
    slug: "command-line",
    title: "Command Line",
    titleBn: "কমান্ড লাইন",

    children: [
      {
        title: "Run Bnlang scripts from command line",
        titleBn: "কমান্ড লাইন থেকে Bnlang স্ক্রিপ্ট চালান",
        slug: "run-bnlang-scripts-from-command-line",
      },
      {
        title: "How to read environment variables from Bnlang",
        titleBn: "Bnlang থেকে পরিবেশ ভেরিয়েবলগুলি কীভাবে পড়বেন",
        slug: "how-to-read-environment-variables-from-bnlang",
      },
      {
        title: "Output to console in Bnlang",
        titleBn: "Bnlang এ কনসোলে আউটপুট",
        slug: "output-to-console-in-bnlang",
      },
      {
        title: "Accept input from command line in Bnlang",
        titleBn: "Bnlang থেকে কমান্ড লাইন থেকে ইনপুট গ্রহণ করুন",
        slug: "accept-input-from-command-line-in-bnlang",
      },
    ],
  },
  {
    title: "Bnlang Package Manager (BPM)",
    titleBn: "Bnlang প্যাকেজ ম্যানেজার (BPM)",
    slug: "bnlang-package-manager",
  },
  {
    title: "Test framework",
    titleBn: "Bnlang টেস্ট ফ্রেমওয়ার্ক",
    slug: "bnlang-test-runner",

    children: [
      {
        title: "Discovering Bnlang's test framework",
        titleBn: "Bnlang এর টেস্ট ফ্রেমওয়ার্ক আবিষ্কার",
        slug: "discovering-bnlang-test-runner",
      },
      {
        title: "Using Bnlang's test framework",
        titleBn: "Bnlang এর টেস্ট ফ্রেমওয়ার্ক ব্যবহার",
        slug: "using-bnlang-test-runner",
      },
    ],
  },
];
