const fs = require('fs');
const path = require('path');

const STATIC_PAGES = [
    '/',
    '/about',
    '/download',
    '/blogs',
    '/tutorials',
    '/releases',
    '/privacy',
    '/terms',
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bnlang.dev';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * URL scheme:
 *  - Bangla pages live at unprefixed paths: /, /about, /docs/v2.0.0/intro
 *  - English pages live at /en/...: /en, /en/about, /en/docs/v2.0.0/intro
 */
function bnPath(p) {
    return p === '/' ? '/' : p;
}
function enPath(p) {
    return p === '/' ? '/en' : `/en${p}`;
}

function walkMdx(rootDir) {
    const slugs = [];
    if (!fs.existsSync(rootDir)) return slugs;

    const walk = (dir, rel = []) => {
        for (const name of fs.readdirSync(dir)) {
            const fp = path.join(dir, name);
            const st = fs.statSync(fp);
            if (st.isDirectory()) {
                walk(fp, [...rel, name]);
            } else if (name.endsWith('.mdx')) {
                const base = name.replace(/\.mdx$/, '');
                const parts = base === 'index' ? rel : [...rel, base];
                if (parts.length) slugs.push(parts.join('/'));
            }
        }
    };

    walk(rootDir);
    return Array.from(new Set(slugs));
}

function readDocsVersions() {
    try {
        const file = path.join(process.cwd(), 'contents', 'docs', 'versions.json');
        if (!fs.existsSync(file)) return [];
        const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
        return Array.isArray(parsed.order) ? parsed.order : [];
    } catch {
        return [];
    }
}

function collectDocPaths() {
    const versions = readDocsVersions();
    const docsRoot = path.join(process.cwd(), 'contents', 'docs');
    const out = new Set();
    for (const v of versions) {
        const versionDir = path.join(docsRoot, v);
        const slugs = walkMdx(versionDir);
        for (const slug of slugs) {
            out.add(`/docs/${v}/${slug}`);
        }
    }
    return Array.from(out);
}

function collectLearnPaths() {
    const learnRoot = path.join(process.cwd(), 'contents', 'learn');
    return walkMdx(learnRoot).map((slug) => `/learn/${slug}`);
}

async function fetchSlugs(endpoint) {
    if (!API_URL) return [];
    try {
        const all = [];
        let page = 1;
        const limit = 100;
        while (true) {
            const res = await fetch(`${API_URL}/${endpoint}?page=${page}&limit=${limit}`);
            if (!res.ok) break;
            const data = await res.json();
            const records = Array.isArray(data?.records) ? data.records : [];
            for (const r of records) {
                if (r?.slug) all.push(r.slug);
            }
            const total = Number(data?.total ?? records.length);
            if (page * limit >= total || records.length === 0) break;
            page += 1;
        }
        return Array.from(new Set(all));
    } catch (err) {
        console.warn(`[sitemap] Failed to fetch ${endpoint}:`, err?.message || err);
        return [];
    }
}

function buildEntry(loc, now, priority) {
    return {
        loc,
        changefreq: 'weekly',
        priority,
        lastmod: now,
    };
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: SITE_URL,
    outDir: 'public',
    generateRobotsTxt: true,
    changefreq: 'weekly',
    priority: 0.7,
    autoLastmod: true,
    transform: async (config, loc) => ({
        loc,
        changefreq: 'weekly',
        priority: loc === '/' || loc === '/en' ? 1.0 : 0.7,
        lastmod: new Date().toISOString(),
    }),
    additionalPaths: async () => {
        const now = new Date().toISOString();

        const staticPaths = STATIC_PAGES.flatMap((p) => [bnPath(p), enPath(p)]);

        const docPaths = collectDocPaths();
        const learnPaths = collectLearnPaths();

        const [blogSlugs, tutorialSlugs] = await Promise.all([
            fetchSlugs('blogs'),
            fetchSlugs('tutorials'),
        ]);

        const dynamicLogical = [
            ...blogSlugs.map((s) => `/blogs/${s}`),
            ...tutorialSlugs.map((s) => `/tutorials/${s}`),
            ...docPaths,
            ...learnPaths,
        ];

        const dynamicPaths = dynamicLogical.flatMap((p) => [bnPath(p), enPath(p)]);

        const all = [...staticPaths, ...dynamicPaths];

        return all.map((loc) =>
            buildEntry(loc, now, loc === '/' || loc === '/en' ? 1.0 : 0.7)
        );
    },
    exclude: ['/404', '/500', '/bn', '/bn/*'],
};
