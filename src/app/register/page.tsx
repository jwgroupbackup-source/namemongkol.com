import { Metadata } from 'next';
import Script from 'next/script';
import RegisterClientPage from './ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

export const metadata: Metadata = {
    title: 'สมัครสมาชิก | NameMongkol - วิเคราะห์ชื่อมงคลฟรี',
    description: 'สมัครสมาชิก NameMongkol ฟรี! เพื่อรับเครดิตต้อนรับและใช้งานบริการวิเคราะห์ชื่อมงคล เบอร์มงคล พร้อมฟีเจอร์พิเศษมากมาย',
    keywords: ['สมัครสมาชิก', 'ลงทะเบียน', 'Register', 'NameMongkol', 'สมัครฟรี', 'เครดิตฟรี'],

    openGraph: {
        title: 'สมัครสมาชิก | NameMongkol',
        description: 'สมัครสมาชิกฟรี! รับเครดิตต้อนรับทันที พร้อมใช้งานบริการวิเคราะห์ชื่อมงคลครบวงจร',
        url: `${siteUrl}/register`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=สมัครสมาชิก&subtitle=รับเครดิตฟรี%20ทันที&tag=Register`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'สมัครสมาชิก | NameMongkol',
        description: 'สมัครสมาชิกฟรี! รับเครดิตต้อนรับทันที พร้อมใช้งานบริการวิเคราะห์ชื่อมงคลครบวงจร',
        images: [`${siteUrl}/api/og?variant=default&title=สมัครสมาชิก&subtitle=รับเครดิตฟรี%20ทันที&tag=Register`],
    },
    alternates: {
        canonical: `${siteUrl}/register`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

// JSON-LD for Register Page
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'สมัครสมาชิก NameMongkol',
    description: 'สมัครสมาชิกเพื่อใช้งานบริการวิเคราะห์ชื่อมงคล รับเครดิตฟรี',
    url: `${siteUrl}/register`,
    isPartOf: {
        '@type': 'WebSite',
        name: 'NameMongkol',
        url: siteUrl,
    },
    mainEntity: {
        '@type': 'Service',
        name: 'บริการวิเคราะห์ชื่อมงคล NameMongkol',
        description: 'บริการวิเคราะห์ชื่อและเบอร์มงคลด้วย AI',
        provider: {
            '@type': 'Organization',
            name: 'NameMongkol',
        },
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
                name: 'สมัครสมาชิก',
                item: `${siteUrl}/register`,
            },
        ],
    },
};

export default function RegisterPage() {
    return (
        <>
            <Script
                id="register-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RegisterClientPage />
        </>
    );
}
