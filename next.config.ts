import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source:
          "/:path((?!en|bn|banglish|api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-0\\.xml|sitemap-1\\.xml|sitemap-2\\.xml|static|images|fonts).*)",
        destination: "/en/:path",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
