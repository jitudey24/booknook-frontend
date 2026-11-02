import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/b/**",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default function loadConfig(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...nextConfig,
      images: {
        ...nextConfig.images,
        /* Next 16 caches optimized images on disk keyed only by URL
           (`.next/dev/cache/images`) and does not revalidate them until
           `images.minimumCacheTTL` expires — 4 hours by default. Replacing a
           file in `public/images` therefore keeps serving the OLD optimized
           copy for hours. Disabling the disk cache in dev makes replaced
           images show up immediately; production keeps the default caching. */
        maximumDiskCacheSize: 0,
      },
    };
  }

  return nextConfig;
}
