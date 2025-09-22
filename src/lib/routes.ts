import { VersionMap } from "@/types/doc.types";
import { LearnItem } from "@/types/learn.types";

export const DOC_ROUTES: VersionMap = {
  "v1.0.0": [
    {
      slug: "introduction",
      title: "Introduction",
      titleBn: "ভূমিকা",
      titleBanglish: "Vumika",
    },
    {
      slug: "usage-and-example",
      title: "Usage and example",
      titleBn: "ব্যবহার এবং উদাহরণ",
      titleBanglish: "Byabohar ebong udahoron",
    },
    {
      slug: "keywords",
      title: "Keywords",
      titleBn: "কীওয়ার্ডস",
      titleBanglish: "Keywords",
      children: [
        // ===================== Control flow =====================
        {
          slug: "if-keyword",
          title: "if",
          titleBn: "যদি",
          titleBanglish: "jodi",
        },
        {
          slug: "else-keyword",
          title: "else",
          titleBn: "নাহলে",
          titleBanglish: "nahole",
        },
        {
          slug: "switch-case-keyword",
          title: "switch/case",
          titleBn: "বিকল্প/অবস্থা",
          titleBanglish: "bikolpo/obostha",
        },
        {
          slug: "default-keyword",
          title: "default",
          titleBn: "অন্যথায়",
          titleBanglish: "onnothay",
        },
        {
          slug: "for-keyword",
          title: "for",
          titleBn: "প্রতি",
          titleBanglish: "proti",
        },
        {
          slug: "while-keyword",
          title: "while",
          titleBn: "যতক্ষণ",
          titleBanglish: "jotokkhon",
        },
        {
          slug: "do-keyword",
          title: "do",
          titleBn: "করুন",
          titleBanglish: "korun",
        },
        {
          slug: "break-keyword",
          title: "break",
          titleBn: "থামুন",
          titleBanglish: "thamun",
        },
        {
          slug: "continue-keyword",
          title: "continue",
          titleBn: "চলুন",
          titleBanglish: "colun",
        },
        {
          slug: "return-keyword",
          title: "return",
          titleBn: "ফেরত",
          titleBanglish: "ferot",
        },
        {
          slug: "throw-keyword",
          title: "throw",
          titleBn: "নিক্ষেপ",
          titleBanglish: "nikkhep",
        },
        {
          slug: "try-catch-finally-keyword",
          title: "try/catch/finally",
          titleBn: "চেষ্টা/ধরুন/অবশেষে",
          titleBanglish: "ceshta/dhorun/obosheshe",
        },
        // ===================== Declarations / Classes =====================
        {
          slug: "let-var-const-keyword",
          title: "let/var/const",
          titleBn: "ধরি/চলক/ধ্রুবক",
          titleBanglish: "dhori/cholok/dhrubok",
        },
        {
          slug: "function-keyword",
          title: "Function",
          titleBn: "ফাংশন",
          titleBanglish: "Function",
        },
        {
          slug: "class-keyword",
          title: "class",
          titleBn: "শ্রেণী",
          titleBanglish: "shreni",
        },
        // ===================== Word operators / type =====================
        {
          slug: "typeof-keyword",
          title: "typeof",
          titleBn: "ধরন",
          titleBanglish: "dhoron",
        },
        {
          slug: "instanceof-keyword",
          title: "instanceof",
          titleBn: "উদাহরণ_হিসেবে",
          titleBanglish: "udahoron_hisebe",
        },
        {
          slug: "in-of-keyword",
          title: "in/of",
          titleBn: "মধ্যে/এর",
          titleBanglish: "modhye/er",
        },
        {
          slug: "void-keyword",
          title: "void",
          titleBn: "ফাঁকা",
          titleBanglish: "faka",
        },
        {
          slug: "delete-keyword",
          title: "delete",
          titleBn: "মুছুন",
          titleBanglish: "muchun",
        },

        // ===================== Async / Generators =====================
        {
          slug: "async-await-keyword",
          title: "async/await",
          titleBn: "অসমলয়/অপেক্ষা",
          titleBanglish: "osomoloy/opekkha",
        },
        {
          slug: "yield-keyword",
          title: "yield",
          titleBn: "উৎপন্ন_করুন",
          titleBanglish: "utponno_korun",
        },

        // ===================== Misc reserved =====================
        {
          slug: "this-super-extends-new-keyword",
          title: "this/super/extends/new",
          titleBn: "এটি/অভিভাবক/প্রসারিত/নতুন",
          titleBanglish: "eti/obhibhabok/prosarito/notun",
        },
        {
          slug: "with-keyword",
          title: "with",
          titleBn: "সাথে",
          titleBanglish: "sathe",
        },
        {
          slug: "debugger-keyword",
          title: "debugger",
          titleBn: "ডিবাগার",
          titleBanglish: "dibagar",
        },
        {
          slug: "static-keyword",
          title: "static",
          titleBn: "স্থির",
          titleBanglish: "sthir",
        },
      ],
    },
    {
      title: "Operators",
      titleBn: "অপারেটরসমূহ",
      titleBanglish: "Operators",
      slug: "operators",
    },
    {
      slug: "modules",
      title: "Modules",
      titleBn: "মডিউলসমূহ",
      titleBanglish: "Modulshomuh",
      children: [
        {
          slug: "process-module",
          title: "process",
          titleBn: "প্রক্রিয়া",
          titleBanglish: "process",
        },
        {
          slug: "fs-module",
          title: "fs",
          titleBn: "এফএস",
          titleBanglish: "fs",
        },
        {
          slug: "path-module",
          title: "path",
          titleBn: "পাথ",
          titleBanglish: "path",
        },
        {
          slug: "buffer-module",
          title: "buffer",
          titleBn: "বাফার",
          titleBanglish: "buffer",
        },
        {
          slug: "net-module",
          title: "net",
          titleBn: "নেট",
          titleBanglish: "net",
        },
        {
          slug: "http-module",
          title: "http",
          titleBn: "এইচটিটিপি",
          titleBanglish: "http",
        },
        {
          slug: "https-module",
          title: "https",
          titleBn: "এইচটিটিপিএস",
          titleBanglish: "https",
        },
        {
          slug: "tls-module",
          title: "tls",
          titleBn: "টিএলএস",
          titleBanglish: "tls",
        },
        {
          slug: "url-module",
          title: "url",
          titleBn: "ইউআরএল",
          titleBanglish: "url",
        },
        {
          slug: "events-module",
          title: "events",
          titleBn: "ইভেন্টস",
          titleBanglish: "events",
        },
        {
          slug: "stream-module",
          title: "stream",
          titleBn: "স্ট্রিম",
          titleBanglish: "stream",
        },
        {
          slug: "assert-module",
          title: "assert",
          titleBn: "অ্যাসার্ট",
          titleBanglish: "assert",
        },
        {
          slug: "child_process-module",
          title: "child_process",
          titleBn: "চাইল্ড প্রসেস",
          titleBanglish: "child_process",
        },
        {
          slug: "dns-module",
          title: "dns",
          titleBn: "ডিএনএস",
          titleBanglish: "dns",
        },
        {
          slug: "os-module",
          title: "os",
          titleBn: "ওএস",
          titleBanglish: "os",
        },
        {
          slug: "crypto-module",
          title: "crypto",
          titleBn: "ক্রিপ্টো",
          titleBanglish: "crypto",
        },
        {
          slug: "zlib-module",
          title: "zlib",
          titleBn: "জেডলিব",
          titleBanglish: "zlib",
        },
        {
          slug: "string_decoder-module",
          title: "string_decoder",
          titleBn: "স্ট্রিং_ডিকোডার",
          titleBanglish: "string_decoder",
        },
        {
          slug: "readline-module",
          title: "readline",
          titleBn: "রিডলাইন",
          titleBanglish: "readline",
        },
        {
          slug: "bnl_test-module",
          title: "bnl_test",
          titleBn: "বিএনএল_টেস্ট",
          titleBanglish: "bnl_test",
        },
        {
          slug: "fetch-module",
          title: "fetch",
          titleBn: "ফেচ",
          titleBanglish: "fetch",
        },
        {
          slug: "formdata-module",
          title: "formdata",
          titleBn: "ফর্মডাটা",
          titleBanglish: "formdata",
        },
        {
          slug: "blob-module",
          title: "blob",
          titleBn: "ব্লব",
          titleBanglish: "blob",
        },
        {
          slug: "html_render-module",
          title: "html_render",
          titleBn: "এইচটিএমএল_রেন্ডার",
          titleBanglish: "html_render",
        },
      ],
    },
    {
      title: "Built-ins",
      titleBn: "বিল্ট ইনস",
      titleBanglish: "Built-ins",
      slug: "built-ins",
      children: [
        {
          slug: "global-objects",
          title: "Global Objects",
          titleBn: "গ্লোবাল অবজেক্টস",
          titleBanglish: "Global Objects",
          children: [
            {
              slug: "console",
              title: "console",
              titleBn: "কনসোল",
              titleBanglish: "Console",
            },
            {
              slug: "array",
              title: "Array",
              titleBn: "তালিকা",
              titleBanglish: "Talika",
            },
            {
              slug: "atomics",
              title: "Atomics",
              titleBn: "অ্যাটোমিকস",
              titleBanglish: "Atomics",
            },
            {
              slug: "date",
              title: "Date",
              titleBn: "তারিখ",
              titleBanglish: "Tarikh",
            },
            {
              slug: "constructor-function",
              title: "Function",
              titleBn: "নির্মাতা_ফাংশন",
              titleBanglish: "NirmataFunction",
            },
            {
              slug: "json",
              title: "JSON",
              titleBn: "জেসন",
              titleBanglish: "Jeson",
            },
            {
              slug: "map",
              title: "Map",
              titleBn: "মানচিত্র",
              titleBanglish: "Manchitro",
            },
            {
              slug: "math",
              title: "Math",
              titleBn: "গণিত",
              titleBanglish: "Gonit",
            },
            {
              slug: "number",
              title: "Number",
              titleBn: "সংখ্যা",
              titleBanglish: "Sonkha",
            },
            {
              slug: "object",
              title: "Object",
              titleBn: "বস্তু",
              titleBanglish: "Bostu",
            },
            {
              slug: "promise",
              title: "প্রতিশ্রুতি",
              titleBn: "প্রতিশ্রুতি",
              titleBanglish: "Protishruti",
            },
            {
              slug: "proxy",
              title: "Proxy",
              titleBn: "প্রক্সি",
              titleBanglish: "Proxy",
            },
            {
              slug: "reflect",
              title: "Reflect",
              titleBn: "প্রতিফলন",
              titleBanglish: "Protifolon",
            },
            {
              slug: "regexp",
              title: "RegExp",
              titleBn: "রেজেক্স",
              titleBanglish: "RegEx",
            },
            {
              slug: "set",
              title: "Set",
              titleBn: "সমষ্টি",
              titleBanglish: "Somoshti",
            },
            {
              slug: "string",
              title: "String",
              titleBn: "অক্ষরমালা",
              titleBanglish: "Okkhoromala",
            },
            {
              slug: "symbol",
              title: "Symbol",
              titleBn: "প্রতীক",
              titleBanglish: "Protik",
            },
            {
              slug: "weakmap",
              title: "WeakMap",
              titleBn: "দুর্বল_মানচিত্র",
              titleBanglish: "DurbolManchitro",
            },
            {
              slug: "weakset",
              title: "WeakSet",
              titleBn: "দুর্বল_সমষ্টি",
              titleBanglish: "DurbolSomoshti",
            }
          ]
        },
        {
          slug: "global-functions",
          title: "Global Functions",
          titleBn: "গ্লোবাল ফাংশন",
          titleBanglish: "Global Functions",
        },
        {
          slug: "global-properties",
          title: "Global Properties",
          titleBn: "গ্লোবাল প্রপার্টিজ",
          titleBanglish: "Global Properties",
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
    titleBanglish: "Shuru Korun",
    children: [
      {
        slug: "introduction-to-bnlang",
        title: "Introduction to BNLang",
        titleBn: "BNLang পরিচিতি",
        titleBanglish: "BNLang Porichiti",
      },
      {
        slug: "how-bnlang-works-internally",
        title: "How Bnlang work internally",
        titleBn: "BNLang কিভাবে কাজ করে",
        titleBanglish: "BNLang Kivabe Kaj Kore",
      },
      {
        slug: "the-javascript",
        title: "The Javascript",
        titleBn: "জাভাস্ক্রিপ্ট",
        titleBanglish: "The Javascript",
      },
      {
        slug: "usecase-of-bnlang",
        title: "Usecase of Bnlang",
        titleBn: "BNLang এর ব্যবহার",
        titleBanglish: "BNLang er Byabohar",
      },
      {
        slug: "the-v8-javascript-engine",
        title: "The V8 Javascript Engine",
        titleBn: "V8 জাভাস্ক্রিপ্ট ইঞ্জিন",
        titleBanglish: "V8 Javascript Engine",
      },
      {
        slug: "difference-between-bnlang-and-nodejs",
        title: "Difference between Bnlang and Nodejs",
        titleBn: "BNLang এবং Nodejs ভাষার মধ্যে পার্থক্য",
        titleBanglish: "BNLang ebong Nodejs er modhye Parthokko",
      },
    ],
  },
  {
    slug: "asynchronous-work",
    title: "Asynchronous Work",
    titleBn: "অ্যাসিঙ্ক্রোনাস কাজ",
    titleBanglish: "Asynchronous Kaj",
    children: [
      {
        title: "Asynchronous flow control",
        titleBn: "অ্যাসিঙ্ক্রোনাস ফ্লো কন্ট্রোল",
        slug: "asynchronous-flow-control",
        titleBanglish: "Asynchronous Flow Control",
      },
      {
        title: "Overview of Blocking vs Non-Blocking",
        titleBn: "ব্লকিং বনাম নন-ব্লকিং এর সারসংক্ষেপ",
        slug: "overview-of-blocking-vs-non-blocking",
        titleBanglish: "Blocking vs Non-Blocking er Saranshop",
      },
      {
        title: "JavaScript Asynchronous Programming and Callbacks",
        titleBn: "জাভাস্ক্রিপ্ট অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং এবং কলব্যাক",
        slug: "javascript-asynchronous-programming-and-callbacks",
        titleBanglish: "JavaScript Asynchronous Programming ebong Callbacks",
      },
      {
        title: "Discover Promises in Bnlang",
        titleBn: "BNLang এ প্রতিশ্রুতি আবিষ্কার করুন",
        slug: "discover-promises-in-bnlang",
        titleBanglish: "BNLang e Protishruti Abishkar Korun",
      },
      {
        title: "Discover JavaScript Timers",
        titleBn: "জাভাস্ক্রিপ্ট টাইমার আবিষ্কার করুন",
        slug: "discover-javascript-timers",
        titleBanglish: "JavaScript Timer Abishkar Korun",
      },
      {
        title: "The Bnlang Event Loop",
        titleBn: "BNLang ইভেন্ট লুপ",
        slug: "the-bnlang-event-loop",
        titleBanglish: "BNLang Event Loop",
      },
      {
        title: "The Bnlang Event emitter",
        titleBn: "BNLang ইভেন্ট এমিটার",
        slug: "the-bnlang-event-emitter",
        titleBanglish: "BNLang Event Emitter",
      },
      {
        title: "Understanding process.nextTick()",
        titleBn: "BNLang এর process.nextTick() বোঝা",
        slug: "understanding-process-nexttick",
        titleBanglish: "BNLang er process.nextTick() Bojha",
      },
      {
        title: "Understanding setImmediate()",
        titleBn: "BNLang এর setImmediate() বোঝা",
        slug: "understanding-setimmediate",
        titleBanglish: "BNLang er setImmediate() Bojha",
      },
    ],
  },
  {
    slug: "manipulating-files",
    title: "Manipulating Files",
    titleBn: "ফাইল ম্যানিপুলেশন",
    titleBanglish: "File Manipulation",
    children: [
      {
        title: "Bnlang File stats",
        titleBn: "BNLang ফাইল পরিসংখ্যান",
        slug: "bnlang-file-stats",
        titleBanglish: "BNLang File Porisongkhan",
      },
      {
        title: "Bnlang File Paths",
        titleBn: "BNLang ফাইল পাথ",
        slug: "bnlang-file-paths",
        titleBanglish: "BNLang File Paths",
      },
      {
        title: "Reading Files in Bnlang",
        titleBn: "BNLang ফাইল পড়া",
        slug: "reading-files-in-bnlang",
        titleBanglish: "BNLang File Porha",
      },
      {
        title: "Writing Files in Bnlang",
        titleBn: "BNLang ফাইল লেখা",
        slug: "writing-files-in-bnlang",
        titleBanglish: "BNLang File Lekha",
      },
      {
        title: "Working with Directories in Bnlang",
        titleBn: "BNLang ডিরেক্টরির সাথে কাজ করা",
        slug: "working-with-directories-in-bnlang",
        titleBanglish: "BNLang Directory Shathe Kaj Kora",
      },
    ],
  },
  {
    slug: "command-line",
    title: "Command Line",
    titleBn: "কমান্ড লাইন",
    titleBanglish: "Command Line",
    children: [
      {
        title: "Run Bnlang scripts from command line",
        titleBn: "কমান্ড লাইন থেকে BNLang স্ক্রিপ্ট চালান",
        slug: "run-bnlang-scripts-from-command-line",
        titleBanglish: "Command Line theke BNLang Script Chalan",
      },
      {
        title: "How to read environment variables from Bnlang",
        titleBn: "Bnlang থেকে পরিবেশ ভেরিয়েবলগুলি কীভাবে পড়বেন",
        slug: "how-to-read-environment-variables-from-bnlang",
        titleBanglish: "Bnlang theke Poribesh Variable guli Kivabe Porben",
      },
      {
        title: "Output to console in Bnlang",
        titleBn: "Bnlang এ কনসোলে আউটপুট",
        slug: "output-to-console-in-bnlang",
        titleBanglish: "Bnlang e Console Output",
      },
      {
        title: "Accept input from command line in Bnlang",
        titleBn: "Bnlang থেকে কমান্ড লাইন থেকে ইনপুট গ্রহণ করুন",
        slug: "accept-input-from-command-line-in-bnlang",
        titleBanglish: "Bnlang theke Command Line theke Input Grohon Korun",
      },
    ],
  },
  {
    title: "BNLang Package Manager (BPM)",
    titleBn: "BNLang প্যাকেজ ম্যানেজার (BPM)",
    slug: "bnlang-package-manager",
    titleBanglish: "BNLang Package Manager (BPM)",
  },
  {
    title: "Test Runner",
    titleBn: "BNLang টেস্ট রানার",
    slug: "bnlang-test-runner",
    titleBanglish: "BNLang Test Runner",
    children: [
      {
        title: "Discovering banlang's test runner",
        titleBn: "BNLang এর টেস্ট রানার আবিষ্কার",
        slug: "discovering-bnlang-test-runner",
        titleBanglish: "BNLang er Test Runner Abiskar",
      },
      {
        title: "Using banlang's test runner",
        titleBn: "BNLang এর টেস্ট রানার ব্যবহার",
        slug: "using-bnlang-test-runner",
        titleBanglish: "BNLang er Test Runner Babohar",
      },
    ],
  },
];
