import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabaseServer';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: {
        absolute: 'เติมเครดิต | NameMongkol',
    },
    description: 'เติมเครดิตเพื่อใช้งานบริการวิเคราะห์ชื่อเชิงลึก วอลเปเปอร์มงคล และบริการพรีเมียมของ NameMongkol ผ่านช่องทางชำระเงินที่ระบบรองรับ',
    keywords: ['เติมเครดิต', 'ซื้อเครดิต', 'NameMongkol', 'PromptPay', 'วิเคราะห์ชื่อพรีเมียม'],
    openGraph: {
        title: 'เติมเครดิต | NameMongkol',
        description: 'เติมเครดิตเพื่อใช้งานบริการพรีเมียมของ NameMongkol',
        url: `${siteUrl}/topup`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent('เติมเครดิต')}&subtitle=${encodeURIComponent('ใช้งานบริการพรีเมียม')}&tag=Top-up`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เติมเครดิต | NameMongkol',
        description: 'เติมเครดิตเพื่อใช้งานบริการพรีเมียมของ NameMongkol',
        images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent('เติมเครดิต')}`],
    },
    alternates: {
        canonical: `${siteUrl}/topup`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'เติมเครดิต NameMongkol',
    description: 'เติมเครดิตเพื่อใช้งานบริการพรีเมียมของ NameMongkol',
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
                name: 'หน้าแรก',
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
