import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabaseServer';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'เติมเครดิต (Top Up) - แพ็กเกจสุดคุ้ม | NameMongkol',
    description: 'เติมเครดิตเพื่อใช้งานบริการวิเคราะห์ชื่อมงคลขั้นสูงและดาวน์โหลดวอลเปเปอร์พรีเมียม สะดวกรวดเร็วผ่าน QR Code พร้อมเพย์ เริ่มต้นเพียง 29 บาท',
    keywords: ['เติมเครดิต', 'Top Up', 'ซื้อเครดิต', 'NameMongkol', 'พร้อมเพย์', 'QR Code', 'แพ็กเกจ'],

    openGraph: {
        title: 'เติมเครดิต (Top Up) | NameMongkol',
        description: 'เติมเครดิตง่ายๆ ผ่าน QR Code พร้อมเพย์ ใช้งานได้ทันที เริ่มต้นเพียง 29 บาท',
        url: `${siteUrl}/topup`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=เติมเครดิต%20Top%20Up&subtitle=สแกน%20QR%20พร้อมเพย์%20รับเครดิตทันที&tag=Top-up`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เติมเครดิต (Top Up) | NameMongkol',
        description: 'เติมเครดิตง่ายๆ ผ่าน QR Code พร้อมเพย์ ใช้งานได้ทันที',
        images: [`${siteUrl}/api/og?variant=default&title=เติมเครดิต%20Top%20Up&subtitle=สแกน%20QR%20พร้อมเพย์%20รับเครดิตทันที&tag=Top-up`],
    },
    alternates: {
        canonical: `${siteUrl}/topup`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

// JSON-LD for Top Up Page
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'เติมเครดิต NameMongkol',
    description: 'เติมเครดิตเพื่อใช้งานบริการวิเคราะห์ชื่อมงคลขั้นสูง',
    url: `${siteUrl}/topup`,
    isPartOf: {
        '@type': 'WebSite',
        name: 'NameMongkol',
        url: siteUrl,
    },
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'หน้าหลัก',
                item: siteUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'เติมเครดิต',
                item: `${siteUrl}/topup`,
            },
        ],
    },
};

export default async function TopUpPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['payment_gateway', 'promptpay_number', 'promptpay_id', 'promptpay', 'promptpay_phone', 'promptpay_account']);

    const settingsMap = (data || []).reduce<Record<string, string>>((acc, curr) => {
        acc[curr.key] = curr.value || '';
        return acc;
    }, {});

    // Default to 'stripe' if not set
    const gateway = settingsMap['payment_gateway'] || 'stripe';
    const promptpayNumber =
        settingsMap['promptpay_number'] ||
        settingsMap['promptpay_id'] ||
        settingsMap['promptpay'] ||
        settingsMap['promptpay_phone'] ||
        settingsMap['promptpay_account'] ||
        '';

    return (
        <>
            <Script
                id="topup-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense>
                <ClientPage gateway={gateway} promptpayNumber={promptpayNumber} />
            </Suspense>
        </>
    );
}
