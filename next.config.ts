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
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    remotePatterns,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'canvas-confetti', 'date-fns'],
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
      // SEO: Consolidate /name-check → / to prevent keyword cannibalization
      // Both pages shared identical <ClientHome /> content targeting "วิเคราะห์ชื่อ"
      {
        source: '/name-check',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
