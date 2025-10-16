const LOCALES = ['en', 'bn', 'banglish'];
const STATIC_PAGES = ['/', '/about', '/download', '/tutorials'];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://bnlang.dev',
    outDir: 'public',
    generateRobotsTxt: true,
    changefreq: 'weekly',
    priority: 0.7,
    autoLastmod: true,
    transform: async (config, path) => ({
        loc: path,
        changefreq: 'weekly',
        priority: path === '/en' ? 1.0 : 0.7,
        lastmod: new Date().toISOString(),
    }),
    additionalPaths: async () => {
        const now = new Date().toISOString();
        const localizedStatics = STATIC_PAGES.flatMap((p) =>
            LOCALES.map((l) => (p === '/' ? `/${l}` : `/${l}${p}`))
        );
        const all = [...localizedStatics];

        return all.map((loc) => ({
            loc,
            changefreq: 'weekly',
            priority: loc === '/en' ? 1.0 : 0.7,
            lastmod: now,
        }));
    },
    exclude: ['/404', '/500'],
};
