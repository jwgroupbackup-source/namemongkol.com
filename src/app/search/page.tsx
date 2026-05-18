import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
    title: 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง 5,000+ ชื่อ | NameMongkol',
    alternates: { canonical: `${baseUrl}/search` },
    description: 'ค้นหาชื่อมงคลสำหรับตั้งชื่อลูกหรือเปลี่ยนชื่อ จากฐานข้อมูล 5,000+ ชื่อชาย-หญิง ความหมายดี กรองตามวันเกิด เพศ และผลรวมเลขศาสตร์',
    keywords: ['ค้นหาชื่อมงคล', 'ตั้งชื่อลูก', 'ตั้งชื่อลูกชาย', 'ตั้งชื่อลูกหญิง', 'ชื่อมงคลชาย', 'ชื่อมงคลหญิง', 'ชื่อมงคลฟรี', 'ชื่อเสริมดวง', 'ชื่อเกรด A', 'ชื่อความหมายดี', 'ชื่อตามวันเกิด', 'ผลรวมเลขศาสตร์', 'อักษรกาลกิณี', 'รวมชื่อมงคล'],

    openGraph: {
        title: 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง 5,000+ ชื่อ | NameMongkol',
        description: 'ค้นหาชื่อมงคลชาย-หญิง ความหมายดี กรองตามวันเกิด เพศ และผลรวมเลขศาสตร์',
        url: `${baseUrl}/search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${baseUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี&subtitle=ตั้งชื่อลูก%20เปลี่ยนชื่อใหม่%20เสริมดวง&tag=Free%20Names`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง 5,000+ ชื่อ | NameMongkol',
        description: 'ค้นหาชื่อมงคลชาย-หญิงกว่า 5,000 ชื่อ ครบทุกวันเกิด',
        images: [`${baseUrl}/api/og?variant=default&title=ค้นหาชื่อมงคลฟรี`],
    },
};

export default function SearchPage() {
    const webPageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${baseUrl}/search#webpage`,
        'url': `${baseUrl}/search`,
        'name': 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง 5,000+ ชื่อ | NameMongkol',
        'description': 'ระบบค้นหาชื่อมงคลฟรี รวมกว่า 5,000 ชื่อเกรด A+ คัดสรรแล้ว กรองตามวันเกิด เพศ ผลรวมเลขศาสตร์ เหมาะสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่',
        'inLanguage': 'th-TH',
        'isPartOf': { '@id': `${baseUrl}/#website` },
        'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': ['h1', '#search-faq'],
        },
    };

    // Enhanced JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ค้นหาชื่อมงคลฟรีสำหรับตั้งชื่อลูก - NameMongkol',
        'alternateName': 'NameMongkol Free Auspicious Name Search',
        'description': 'ระบบค้นหาชื่อมงคลฟรี รวมกว่า 5,000 ชื่อเกรด A+ คัดสรรแล้ว กรองตามวันเกิด เพศ ผลรวมเลขศาสตร์ เหมาะสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่',
        'url': `${baseUrl}/search`,
        'applicationCategory': 'LifestyleApplication',
        'operatingSystem': 'Web',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'THB',
            'description': 'ค้นหาชื่อมงคลฟรี ไม่มีค่าใช้จ่าย'
        },
        'featureList': [
            'ฐานข้อมูลชื่อมงคลกว่า 5,000 ชื่อ',
            'กรองตามวันเกิด',
            'กรองตามเพศ (ชาย/หญิง)',
            'กรองตามผลรวมเลขศาสตร์',
            'แสดงวันที่ใช้ได้และห้ามใช้',
            'ความหมายครบถ้วน'
        ]
    };

    // FAQ Schema
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลที่ NameMongkol เสียเงินไหม?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ฟรี! ไม่มีค่าใช้จ่าย คุณสามารถค้นหาและตรวจสอบความหมายของชื่อมงคลกว่า 5,000 ชื่อได้ฟรีทันที โดยไม่มีข้อผูกมัดใดๆ'
                }
            },
            {
                '@type': 'Question',
                'name': 'มีรายชื่อมงคลให้เลือกกี่ชื่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เรามีฐานข้อมูลชื่อมงคลที่คัดสรรมาแล้วกว่า 5,000 รายชื่อ ครอบคลุมทุกวันเกิด ทั้งชายและหญิง พร้อมความหมายที่เป็นสิริมงคล'
                }
            },
            {
                '@type': 'Question',
                'name': 'ชื่อมงคลในระบบเชื่อถือได้แค่ไหน?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'รายชื่อทั้งหมดถูกคัดกรองตามหลักเลขศาสตร์และทักษาปกรณ์ โดยเน้นชื่อที่มีความหมายดีและไม่มีอักษรกาลกิณีพื้นฐาน'
                }
            },
            {
                '@type': 'Question',
                'name': 'เลือกชื่อจากที่นี่แล้วต้องทำอย่างไรต่อ?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'เมื่อได้ชื่อที่ถูกใจแล้ว แนะนำให้นำไปวิเคราะห์ชื่อ-นามสกุลอีกครั้ง เพื่อดูผลรวมร่วมกับนามสกุลของคุณว่าได้เกรด A+ หรือไม่'
                }
            },
            {
                '@type': 'Question',
                'name': 'ค้นหาชื่อมงคลฟรีต่างจากเปลี่ยนชื่อมงคล Pro อย่างไร?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ค้นหาชื่อมงคลฟรีให้บริการฟรีจากฐานข้อมูล 5,000+ ชื่อ ส่วนเปลี่ยนชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น สามารถเลือกอักษรนำวรรคเดช/ศรี และผลรวมเลขศาสตร์เกรด A+ เท่านั้น'
                }
            },
            {
                '@type': 'Question',
                'name': 'ผลรวมเลขศาสตร์มงคลมีค่าอะไรบ้าง?',
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'ผลรวมเลขศาสตร์มงคลที่ใช้ในหลักโบราณไทยมี 27 ค่า ได้แก่ 9, 14, 15, 19, 24, 27, 36, 41, 42, 45, 50, 51, 54, 56, 59, 63, 65, 81, 90, 91, 99 เป็นต้น ชื่อ+นามสกุลที่รวมกันได้ค่าเหล่านี้จะได้รับเกรด A (ชื่อมงคล) ช่วยเสริมพลังงาน การเงิน และความสัมพันธ์'
                }
            }
        ]
    };

    // ItemList Schema for better search visibility
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'รายชื่อมงคลยอดนิยม',
        'description': 'รวมชื่อมงคลยอดนิยมที่คัดสรรแล้วสำหรับตั้งชื่อลูกและเปลี่ยนชื่อใหม่',
        'numberOfItems': 5000,
        'itemListOrder': 'https://schema.org/ItemListOrderAscending'
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'หน้าแรก',
                'item': baseUrl,
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'ค้นหาชื่อมงคล ตั้งชื่อลูกชาย-หญิง',
                'item': `${baseUrl}/search`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ClientPage />
        </>
    );
}
