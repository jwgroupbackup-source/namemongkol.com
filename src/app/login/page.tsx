import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import LoginClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'เข้าสู่ระบบ | NameMongkol - วิเคราะห์ชื่อมงคล',
    description: 'เข้าสู่ระบบ NameMongkol เพื่อใช้งานบริการวิเคราะห์ชื่อมงคล ดูประวัติการวิเคราะห์ และเข้าถึงฟีเจอร์พิเศษสำหรับสมาชิก',
    keywords: ['เข้าสู่ระบบ', 'ล็อกอิน', 'สมาชิก', 'NameMongkol', 'บัญชีผู้ใช้'],

    openGraph: {
        title: 'เข้าสู่ระบบ | NameMongkol',
        description: 'เข้าสู่ระบบเพื่อใช้งานบริการวิเคราะห์ชื่อมงคลครบวงจร',
        url: `${siteUrl}/login`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=เข้าสู่ระบบ&subtitle=สมาชิก%20NameMongkol&tag=Login`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เข้าสู่ระบบ | NameMongkol',
        description: 'เข้าสู่ระบบเพื่อใช้งานบริการวิเคราะห์ชื่อมงคลครบวงจร',
        images: [`${siteUrl}/api/og?variant=default&title=เข้าสู่ระบบ&subtitle=สมาชิก%20NameMongkol&tag=Login`],
    },
    alternates: {
        canonical: `${siteUrl}/login`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

// JSON-LD for Login Page
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'เข้าสู่ระบบ NameMongkol',
    description: 'เข้าสู่ระบบเพื่อใช้งานบริการวิเคราะห์ชื่อมงคล',
    url: `${siteUrl}/login`,
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
                name: 'เข้าสู่ระบบ',
                item: `${siteUrl}/login`,
            },
        ],
    },
};

export default function LoginPage() {
    return (
        <>
            <Script
                id="login-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense>
                <LoginClientPage />
            </Suspense>
        </>
    );
}
