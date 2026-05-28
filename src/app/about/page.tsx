import AboutSection from '@/components/AboutSection';
import { Metadata } from 'next';
import Script from 'next/script';
import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'เกี่ยวกับเรา | NameMongkol วิเคราะห์ชื่อ เบอร์ ลายมือ ออร่า',
    alternates: { canonical: `${siteUrl}/about` },
    description: 'NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคลอันดับ 1 ของไทย ผสาน 4 ศาสตร์โบราณเข้ากับ AI บริการครบวงจร: วิเคราะห์ชื่อเจาะลึก (Premium/Bulk), เช็คเบอร์มงคล, วิเคราะห์ลายมือ, วิเคราะห์ออร่า, วอลเปเปอร์มงคล และตั้งชื่อเสริมดวง',
    keywords: 'เกี่ยวกับ NameMongkol, ตั้งชื่อมงคล, วิเคราะห์ชื่อ, วิเคราะห์ชื่อพรีเมียม, โปรแกรมวิเคราะห์ชื่อจำนวนมาก, ดูดวงชื่อ, เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6, ชื่อมงคล, เปลี่ยนชื่อ, ตั้งชื่อลูก, เช็คเบอร์มงคล, วิเคราะห์เบอร์โทรศัพท์, คู่เลขมงคล, คู่มิตร, คู่ศัตรู, วิเคราะห์ลายมือ, วิเคราะห์ลายมือออนไลน์, ดูดวงลายมือ, เส้นชีวิต, เส้นสมอง, เส้นหัวใจ, นิรันดร์ศาสตร์, วิเคราะห์ออร่า, วอลเปเปอร์มงคล, วอลเปเปอร์ราศี, วอลเปเปอร์วันเกิด, วอลเปเปอร์เสริมดวง',
    openGraph: {
        title: 'เกี่ยวกับเรา | NameMongkol วิเคราะห์ชื่อ เบอร์ ลายมือ',
        description: 'NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคลอันดับ 1 ของไทย ครบวงจรด้วยบริการวิเคราะห์ชื่อเจาะลึก เช็คเบอร์ วิเคราะห์ลายมือ AI ออร่า และวอลเปเปอร์มงคล',
        url: `${siteUrl}/about`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [
            {
                url: `${siteUrl}/api/og?variant=about`,
                width: 1200,
                height: 630,
                alt: 'NameMongkol - วิเคราะห์ชื่อมงคล ตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เกี่ยวกับเรา | NameMongkol วิเคราะห์ชื่อ เบอร์ ลายมือ',
        description: 'NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคลอันดับ 1 ของไทย พร้อมเช็คเบอร์มงคลฟรี วิเคราะห์ลายมือออนไลน์ ช่วยตั้งชื่อลูก เปลี่ยนชื่อเสริมดวง',
        images: [`${siteUrl}/api/og?variant=about`],
    },

};

export default function AboutPage() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NameMongkol",
        "alternateName": "เนมมงคล",
        "url": "https://www.namemongkol.com",
        "logo": "https://www.namemongkol.com/logo.png",
        "description": "แพลตฟอร์มวิเคราะห์ชื่อมงคล เช็คเบอร์มงคล และวิเคราะห์ลายมืออันดับ 1 ของไทย ผสานศาสตร์โบราณเข้ากับ AI",
        "foundingDate": "2024",
        "sameAs": [
            "https://www.facebook.com/namemongkol",
            "https://line.me/ti/p/@namemongkol"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Thai", "English"]
        },
        "areaServed": {
            "@type": "Country",
            "name": "Thailand"
        },
        "knowsAbout": [
            "เลขศาสตร์",
            "ทักษาปกรณ์",
            "อายตนะ 6",
            "นิรันดร์ศาสตร์",
            "การตั้งชื่อมงคล",
            "วิเคราะห์ชื่อเจาะลึก (Premium Analysis)",
            "วิเคราะห์ชื่อจำนวนมาก (Bulk Analysis)",
            "โหราศาสตร์ไทย",
            "วิเคราะห์เบอร์โทรศัพท์",
            "วิเคราะห์ลายมือด้วย AI",
            "หัตถศาสตร์",
            "วิเคราะห์ออร่าและพลังงาน",
            "วอลเปเปอร์มงคลประจำราศี",
            "วอลเปเปอร์เสริมดวงตามวันเกิด",
            "วอลเปเปอร์เสริมดวงการเงินและการงาน"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "วิธีวิเคราะห์ชื่อมงคลกับ NameMongkol",
        "description": "ขั้นตอนการตรวจสอบชื่อและนามสกุลของคุณว่าถูกโฉลกตามหลักเลขศาสตร์และทักษาปกรณ์หรือไม่",
        "totalTime": "PT1M",
        "step": [
            {
                "@type": "HowToStep",
                "name": "กรอกข้อมูล",
                "text": "ระบุชื่อ นามสกุล และวันเกิด ของคุณในแบบฟอร์มหน้าแรก",
                "position": 1
            },
            {
                "@type": "HowToStep",
                "name": "AI ประมวลผล",
                "text": "ระบบจะวิเคราะห์ข้อมูลของคุณด้วย 4 ศาสตร์มงคล (เลขศาสตร์, ทักษา, อายตนะ, นิรันดร์)",
                "position": 2
            },
            {
                "@type": "HowToStep",
                "name": "รับคำทำนาย",
                "text": "ดูผลคะแนน เกรดมงคล และคำแนะนำในการปรับเปลี่ยนชื่อ (ถ้ามี)",
                "position": 3
            }
        ]
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://www.namemongkol.com/about",
        "url": "https://www.namemongkol.com/about",
        "name": "เกี่ยวกับเรา | NameMongkol - ผู้เชี่ยวชาญวิเคราะห์ชื่อมงคล",
        "description": "NameMongkol แพลตฟอร์มวิเคราะห์ชื่อมงคลอันดับ 1 ของไทย ผสานศาสตร์โบราณ 4 แขนง เข้ากับเทคโนโลยี AI",
        "inLanguage": "th-TH",
        "isPartOf": {
            "@type": "WebSite",
            "name": "NameMongkol",
            "url": "https://www.namemongkol.com"
        },
        "about": {
            "@type": "Thing",
            "name": "การวิเคราะห์ชื่อมงคล",
            "description": "ศาสตร์การตั้งชื่อมงคลตามหลักเลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์"
        },
        "mainEntity": {
            "@type": "Organization",
            "name": "NameMongkol"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าแรก",
                "item": "https://www.namemongkol.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "เกี่ยวกับเรา",
                "item": "https://www.namemongkol.com/about"
            }
        ]
    };

    return (
        <main className="bg-slate-950 min-h-screen pb-28">
            <Script
                id="organization-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="howto-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <Script
                id="webpage-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <Script
                id="breadcrumb-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <AboutSection />
        </main>
    );
}
