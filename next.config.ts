import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import withBundleAnalyzer from '@next/bundle-analyzer';

// Derive Supabase host at build time so Next/Image allows the correct domain in each env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const remotePatterns: RemotePattern[] = [
  // Supabase storage public URLs
  ...(supabaseHost ? [{ protocol: 'https' as const, hostname: supabaseHost }] : []),
  // Legacy CDN bucket
  {
    protocol: 'https',
    hostname: 'img5.pic.in.th',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    // Most site images are pre-compressed WebP/PNG assets or Supabase-hosted user uploads.
    // Serving them directly avoids consuming Vercel Hobby Image Optimization Transformations.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],  // avif first for ~30% smaller payloads on mobile
    minimumCacheTTL: 2592000,          // Cache 30 days — prevents re-transformation on every request
    qualities: [50, 75],                   // Single quality — eliminates duplicate transform variants
    deviceSizes: [640, 750, 1080, 1920],  // Reduced set — covers mobile to desktop efficiently
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'canvas-confetti', 'date-fns', 'sweetalert2'],
  },
  async redirects() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayRedirects = days.map((day) => ({
      source: '/wallpapers',
      has: [{ type: 'query' as const, key: 'day', value: day }],
      destination: `/wallpapers/day/${day}`,
      permanent: true,
    }));
    const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const zodiacRedirects = zodiacSigns.map((sign) => ({
      source: '/wallpapers',
      has: [{ type: 'query' as const, key: 'zodiac', value: sign }],
      destination: `/wallpapers/zodiac/${sign}`,
      permanent: true,
    }));
    return [
      ...dayRedirects,
      ...zodiacRedirects,
      {
        source: '/wallpapers',
        has: [{ type: 'query' as const, key: 'tab', value: 'custom' }],
        destination: '/wallpapers/custom',
        permanent: true,
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
