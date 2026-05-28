import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingContactFAB } from "@/components/FloatingContactFAB";
import { createClient } from '@supabase/supabase-js';
import CookieConsentWrapper from '@/components/CookieConsentWrapper';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import Script from 'next/script';
import { siteUrl } from '@/lib/seo';

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "NameMongkol | วิเคราะห์ชื่อ ตั้งชื่อมงคล ทำนายชื่อ-นามสกุล แม่นยำที่สุด",
    template: "%s | NameMongkol"
  },
  description: "NameMongkol (เนมมงคล) บริการวิเคราะห์ชื่อ ตั้งชื่อมงคล ตั้งชื่อลูก ดูผลรวมชื่อ-นามสกุล พลังเงา และความหมายตามหลักเลขศาสตร์และทักษาปกรณ์ ฟรี! เช็คชื่อของคุณวันนี้เพื่อความเป็นสิริมงคล",
  keywords: ["NameMongkol", "วิเคราะห์ชื่อ", "ชื่อมงคล", "ตั้งชื่อมงคล", "ตั้งชื่อลูก", "เบอร์มงคล", "ดูดวงชื่อ", "เลขศาสตร์", "เปลี่ยนชื่อ", "ความหมายเลขศาสตร์", "ทักษาปกรณ์", "ตั้งชื่อมงคลวันเกิด"],
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: siteUrl,
    siteName: 'NameMongkol',
    title: 'NameMongkol - วิเคราะห์ชื่อ ตั้งชื่อมงคล อันดับ 1',
    description: 'วิเคราะห์ชื่อ นามสกุล ตั้งชื่อมงคล ตั้งชื่อลูก ฟรี! ด้วยศาสตร์คำนวณที่แม่นยำที่สุด',
    images: [
      {
        url: `${siteUrl}/api/og?variant=default`,
        width: 1200,
        height: 630,
        alt: 'NameMongkol - วิเคราะห์ชื่อ ตั้งชื่อมงคล',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NameMongkol - วิเคราะห์ชื่อ ตั้งชื่อมงคล',
    description: 'วิเคราะห์ชื่อ นามสกุล ดูผลรวม พลังเงา และความหมายมงคล ฟรี',
    images: [`${siteUrl}/api/og?variant=default`],
    creator: '@namemongkol',
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googleda422e9133accc04',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      'url': siteUrl,
      'name': 'NameMongkol',
      'alternateName': 'เนมมงคล',
      'description': 'บริการวิเคราะห์ชื่อมงคลและตั้งชื่อใหม่ตามหลักเลขศาสตร์',
      'inLanguage': 'th-TH',
      'publisher': {
        '@id': `${siteUrl}/#organization`
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${siteUrl}/?name={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      'name': 'NameMongkol',
      'alternateName': 'เนมมงคล',
      'url': siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/icon-512.png`,
        'width': 512,
        'height': 512
      },
      'image': `${siteUrl}/icon-512.png`,
      'sameAs': [
        'https://www.facebook.com/namemongkol',
        'https://line.me/ti/p/@namemongkol'
      ]
    }
  ]
}

import { unstable_cache } from 'next/cache';

const getSettings = unstable_cache(
  async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['gtm_id', 'tiktok_pixel_id', 'facebook_pixel_id']);

      // Default values
      const settings = {
        gtmId: 'GTM-WCW8R5BK',
        tiktokPixelId: '',
        facebookPixelId: ''
      };

      if (data) {
        data.forEach(item => {
          if (item.key === 'gtm_id') settings.gtmId = item.value || settings.gtmId;
          if (item.key === 'tiktok_pixel_id') settings.tiktokPixelId = item.value || '';
          if (item.key === 'facebook_pixel_id') settings.facebookPixelId = item.value || '';
        });
      }
      return settings;
    } catch {
      return { gtmId: 'GTM-WCW8R5BK', tiktokPixelId: '', facebookPixelId: '' };
    }
  },
  ['app-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { gtmId, tiktokPixelId, facebookPixelId } = await getSettings();
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {isProduction ? <GoogleTagManager gtmId={gtmId} /> : null}
            <CookieConsentWrapper />

            {/* Facebook Pixel */}
            {isProduction && facebookPixelId && (
              <Script id="facebook-pixel" strategy="lazyOnload">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${facebookPixelId}');
                  fbq('track', 'PageView');
                  `}
              </Script>
            )}

            {/* TikTok Pixel */}
            {isProduction && tiktokPixelId && (
              <Script id="tiktok-pixel" strategy="lazyOnload">
                {`
                  !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq.methods[i=0];i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);return ttq},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${tiktokPixelId}');
                  ttq.page();
                  }(window, document, 'ttq');
                  `}
              </Script>
            )}

            <LayoutWrapper>
              {children}
              <ScrollToTop />
              {isProduction ? <Analytics /> : null}
              <AnalyticsProvider />
            </LayoutWrapper>
            <FloatingContactFAB />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
