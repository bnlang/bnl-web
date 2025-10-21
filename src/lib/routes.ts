import { VersionMap } from "@/types/doc.types";
import { LearnItem } from "@/types/learn.types";

export const DOC_ROUTES: VersionMap = {
  "v1.0.0": [
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
          slug: "switch-case-keyword",
          title: "switch/case",
          titleBn: "বিকল্প/অবস্থা",
        },
        {
          slug: "default-keyword",
          title: "default",
          titleBn: "অন্যথায়",
        },
        {
          slug: "for-keyword",
          title: "for",
          titleBn: "প্রতি",
        },
        {
          slug: "while-keyword",
          title: "while",
          titleBn: "যতক্ষণ",
        },
        {
          slug: "do-keyword",
          title: "do",
          titleBn: "করুন",
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
        {
          slug: "throw-keyword",
          title: "throw",
          titleBn: "নিক্ষেপ",
        },
        {
          slug: "try-catch-finally-keyword",
          title: "try/catch/finally",
          titleBn: "চেষ্টা/ধরুন/অবশেষে",
        },
        // ===================== Declarations / Classes =====================
        {
          slug: "let-var-const-keyword",
          title: "let/var/const",
          titleBn: "ধরি/চলক/ধ্রুবক",
        },
        {
          slug: "function-keyword",
          title: "Function",
          titleBn: "ফাংশন",
        },
        {
          slug: "class-keyword",
          title: "class",
          titleBn: "শ্রেণী",
        },
        // ===================== Word operators / type =====================
        {
          slug: "typeof-keyword",
          title: "typeof",
          titleBn: "ধরন",
        },
        {
          slug: "instanceof-keyword",
          title: "instanceof",
          titleBn: "উদাহরণ_হিসেবে",
        },
        {
          slug: "in-of-keyword",
          title: "in/of",
          titleBn: "মধ্যে/এর",
        },
        {
          slug: "void-keyword",
          title: "void",
          titleBn: "ফাঁকা",
        },
        {
          slug: "delete-keyword",
          title: "delete",
          titleBn: "মুছুন",
        },

        // ===================== Async / Generators =====================
        {
          slug: "async-await-keyword",
          title: "async/await",
          titleBn: "অসমলয়/অপেক্ষা",
        },
        {
          slug: "yield-keyword",
          title: "yield",
          titleBn: "উৎপন্ন_করুন",
        },

        // ===================== Misc reserved =====================
        {
          slug: "this-super-extends-new-keyword",
          title: "this/super/extends/new",
          titleBn: "এটি/অভিভাবক/প্রসারিত/নতুন",
        },
        {
          slug: "with-keyword",
          title: "with",
          titleBn: "সাথে",
        },
        {
          slug: "debugger-keyword",
          title: "debugger",
          titleBn: "ডিবাগার",
        },
        {
          slug: "static-keyword",
          title: "static",
          titleBn: "স্থির",
        },
      ],
    },
    {
      title: "Operators",
      titleBn: "অপারেটরসমূহ",

      slug: "operators",
    },
    {
      slug: "modules",
      title: "Modules",
      titleBn: "মডিউলসমূহ",

      children: [
        {
          slug: "process-module",
          title: "process",
          titleBn: "প্রক্রিয়া",
        },
        {
          slug: "fs-module",
          title: "fs",
          titleBn: "এফএস",
        },
        {
          slug: "path-module",
          title: "path",
          titleBn: "পাথ",
        },
        {
          slug: "buffer-module",
          title: "buffer",
          titleBn: "বাফার",
        },
        {
          slug: "net-module",
          title: "net",
          titleBn: "নেট",
        },
        {
          slug: "http-module",
          title: "http",
          titleBn: "এইচটিটিপি",
        },
        {
          slug: "https-module",
          title: "https",
          titleBn: "এইচটিটিপিএস",
        },
        {
          slug: "tls-module",
          title: "tls",
          titleBn: "টিএলএস",
        },
        {
          slug: "url-module",
          title: "url",
          titleBn: "ইউআরএল",
        },
        {
          slug: "events-module",
          title: "events",
          titleBn: "ইভেন্টস",
        },
        {
          slug: "stream-module",
          title: "stream",
          titleBn: "স্ট্রিম",
        },
        {
          slug: "assert-module",
          title: "assert",
          titleBn: "অ্যাসার্ট",
        },
        {
          slug: "child_process-module",
          title: "child_process",
          titleBn: "চাইল্ড প্রসেস",
        },
        {
          slug: "dns-module",
          title: "dns",
          titleBn: "ডিএনএস",
        },
        {
          slug: "os-module",
          title: "os",
          titleBn: "ওএস",
        },
        {
          slug: "crypto-module",
          title: "crypto",
          titleBn: "ক্রিপ্টো",
        },
        {
          slug: "zlib-module",
          title: "zlib",
          titleBn: "জেডলিব",
        },
        {
          slug: "string_decoder-module",
          title: "string_decoder",
          titleBn: "স্ট্রিং_ডিকোডার",
        },
        {
          slug: "readline-module",
          title: "readline",
          titleBn: "রিডলাইন",
        },
        {
          slug: "bnl_test-module",
          title: "bnl_test",
          titleBn: "বিএনএল_টেস্ট",
        },
        {
          slug: "fetch-module",
          title: "fetch",
          titleBn: "ফেচ",
        },
        {
          slug: "formdata-module",
          title: "formdata",
          titleBn: "ফর্মডাটা",
        },
        {
          slug: "blob-module",
          title: "blob",
          titleBn: "ব্লব",
        },
        {
          slug: "html_render-module",
          title: "html_render",
          titleBn: "এইচটিএমএল_রেন্ডার",
        },
      ],
    },
    {
      title: "Built-ins",
      titleBn: "বিল্ট ইনস",

      slug: "built-ins",
      children: [
        {
          slug: "global-objects",
          title: "Global Objects",
          titleBn: "গ্লোবাল অবজেক্টস",

          children: [
            {
              slug: "console",
              title: "console",
              titleBn: "কনসোল",
            },
            {
              slug: "array",
              title: "Array",
              titleBn: "তালিকা",
            },
            {
              slug: "atomics",
              title: "Atomics",
              titleBn: "অ্যাটোমিকস",
            },
            {
              slug: "date",
              title: "Date",
              titleBn: "তারিখ",
            },
            {
              slug: "constructor-function",
              title: "Function",
              titleBn: "নির্মাতা_ফাংশন",
            },
            {
              slug: "json",
              title: "JSON",
              titleBn: "জেসন",
            },
            {
              slug: "map",
              title: "Map",
              titleBn: "মানচিত্র",
            },
            {
              slug: "math",
              title: "Math",
              titleBn: "গণিত",
            },
            {
              slug: "number",
              title: "Number",
              titleBn: "সংখ্যা",
            },
            {
              slug: "object",
              title: "Object",
              titleBn: "বস্তু",
            },
            {
              slug: "promise",
              title: "প্রতিশ্রুতি",
              titleBn: "প্রতিশ্রুতি",
            },
            {
              slug: "proxy",
              title: "Proxy",
              titleBn: "প্রক্সি",
            },
            {
              slug: "reflect",
              title: "Reflect",
              titleBn: "প্রতিফলন",
            },
            {
              slug: "regexp",
              title: "RegExp",
              titleBn: "রেজেক্স",
            },
            {
              slug: "set",
              title: "Set",
              titleBn: "সমষ্টি",
            },
            {
              slug: "string",
              title: "String",
              titleBn: "অক্ষরমালা",
            },
            {
              slug: "symbol",
              title: "Symbol",
              titleBn: "প্রতীক",
            },
            {
              slug: "weakmap",
              title: "WeakMap",
              titleBn: "দুর্বল_মানচিত্র",
            },
            {
              slug: "weakset",
              title: "WeakSet",
              titleBn: "দুর্বল_সমষ্টি",
            },
          ],
        },
        {
          slug: "global-functions",
          title: "Global Functions",
          titleBn: "গ্লোবাল ফাংশন",
        },
        {
          slug: "global-properties",
          title: "Global Properties",
          titleBn: "গ্লোবাল প্রপার্টিজ",
        },
      ],
    },
  ],
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
        title: "Introduction to BNLang",
        titleBn: "BNLang পরিচিতি",
      },
      {
        slug: "how-bnlang-works-internally",
        title: "How Bnlang work internally",
        titleBn: "BNLang কিভাবে কাজ করে",
      },
      {
        slug: "the-javascript",
        title: "The Javascript",
        titleBn: "জাভাস্ক্রিপ্ট",
      },
      {
        slug: "usecase-of-bnlang",
        title: "Usecase of Bnlang",
        titleBn: "BNLang এর ব্যবহার",
      },
      {
        slug: "the-v8-javascript-engine",
        title: "The V8 Javascript Engine",
        titleBn: "V8 জাভাস্ক্রিপ্ট ইঞ্জিন",
      },
      {
        slug: "difference-between-bnlang-and-nodejs",
        title: "Difference between Bnlang and Nodejs",
        titleBn: "BNLang এবং Nodejs ভাষার মধ্যে পার্থক্য",
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
        title: "Overview of Blocking vs Non-Blocking",
        titleBn: "ব্লকিং বনাম নন-ব্লকিং এর সারসংক্ষেপ",
        slug: "overview-of-blocking-vs-non-blocking",
      },
      {
        title: "JavaScript Asynchronous Programming and Callbacks",
        titleBn: "জাভাস্ক্রিপ্ট অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং এবং কলব্যাক",
        slug: "javascript-asynchronous-programming-and-callbacks",
      },
      {
        title: "Discover Promises in Bnlang",
        titleBn: "BNLang এ প্রতিশ্রুতি আবিষ্কার করুন",
        slug: "discover-promises-in-bnlang",
      },
      {
        title: "Discover JavaScript Timers",
        titleBn: "জাভাস্ক্রিপ্ট টাইমার আবিষ্কার করুন",
        slug: "discover-javascript-timers",
      },
      {
        title: "The Bnlang Event Loop",
        titleBn: "BNLang ইভেন্ট লুপ",
        slug: "the-bnlang-event-loop",
      },
      {
        title: "The Bnlang Event emitter",
        titleBn: "BNLang ইভেন্ট এমিটার",
        slug: "the-bnlang-event-emitter",
      },
      {
        title: "Understanding process.nextTick()",
        titleBn: "BNLang এর process.nextTick() বোঝা",
        slug: "understanding-process-nexttick",
      },
      {
        title: "Understanding setImmediate()",
        titleBn: "BNLang এর setImmediate() বোঝা",
        slug: "understanding-setimmediate",
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
        titleBn: "BNLang ফাইল পরিসংখ্যান",
        slug: "bnlang-file-stats",
      },
      {
        title: "Bnlang File Paths",
        titleBn: "BNLang ফাইল পাথ",
        slug: "bnlang-file-paths",
      },
      {
        title: "Reading Files in Bnlang",
        titleBn: "BNLang ফাইল পড়া",
        slug: "reading-files-in-bnlang",
      },
      {
        title: "Writing Files in Bnlang",
        titleBn: "BNLang ফাইল লেখা",
        slug: "writing-files-in-bnlang",
      },
      {
        title: "Working with Directories in Bnlang",
        titleBn: "BNLang ডিরেক্টরির সাথে কাজ করা",
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
        titleBn: "কমান্ড লাইন থেকে BNLang স্ক্রিপ্ট চালান",
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
    title: "BNLang Package Manager (BPM)",
    titleBn: "BNLang প্যাকেজ ম্যানেজার (BPM)",
    slug: "bnlang-package-manager",
  },
  {
    title: "Test Runner",
    titleBn: "BNLang টেস্ট রানার",
    slug: "bnlang-test-runner",

    children: [
      {
        title: "Discovering banlang's test runner",
        titleBn: "BNLang এর টেস্ট রানার আবিষ্কার",
        slug: "discovering-bnlang-test-runner",
      },
      {
        title: "Using banlang's test runner",
        titleBn: "BNLang এর টেস্ট রানার ব্যবহার",
        slug: "using-bnlang-test-runner",
      },
    ],
  },
];
