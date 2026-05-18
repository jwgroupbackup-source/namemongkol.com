import { Metadata } from 'next';
import Script from 'next/script';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
    title: 'วิเคราะห์ชื่อมงคลขั้นสูง - เจาะลึกดวงชะตาด้วยทักษาและเลขศาสตร์ | NameMongkol',
    description: 'บริการวิเคราะห์ชื่อมงคลขั้นสูงด้วยการคำนวณจากวันเดือนปีและเวลาตกฟาก เจาะลึกกราฟชีวิตรายด้าน (การเงิน การงาน ความรัก) พร้อมแนวทางแก้เคล็ดเสริมดวง',
    keywords: ['วิเคราะห์ชื่อมงคลขั้นสูง', 'ชื่อมงคล Premium', 'ทักษาปกรณ์', 'เลขศาสตร์ชั้นสูง', 'ดูดวงชื่อ', 'ตั้งชื่อตามวันเกิด', 'เปลี่ยนชื่อมงคล', 'ลัคนาราศี', 'เวลาตกฟาก', 'NameMongkol'],

    openGraph: {
        title: 'วิเคราะห์ชื่อมงคลขั้นสูง - เจาะลึกดวงชะตาด้วยทักษาและเลขศาสตร์',
        description: 'วิเคราะห์ชื่อมงคลขั้นสูงด้วยการคำนวณจากวันเดือนปีและเวลาตกฟาก เจาะลึกกราฟชีวิตรายด้าน',
        url: `${baseUrl}/premium-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${baseUrl}/api/og?variant=default&title=วิเคราะห์ชื่อมงคลขั้นสูง&subtitle=เจาะลึกตามวันเดือนปี%20และเวลาตกฟาก%20แม่นยำที่สุด&tag=Premium%20Analysis`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วิเคราะห์ชื่อมงคลขั้นสูง - เจาะลึกดวงชะตา | NameMongkol',
        description: 'วิเคราะห์ชื่อมงคลขั้นสูง แม่นยำกว่าด้วยเวลาตกฟากและลัคนาราศี',
        images: [`${baseUrl}/api/og?variant=default&title=วิเคราะห์ชื่อมงคลขั้นสูง`],
    },
    alternates: {
        canonical: `${baseUrl}/premium-analysis`,
    },
};

// Enhanced JSON-LD Schema - Service type for astrology/naming services
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${baseUrl}/premium-analysis#webpage`,
            'url': `${baseUrl}/premium-analysis`,
            'name': 'วิเคราะห์ชื่อมงคลขั้นสูง - เจาะลึกดวงชะตาด้วยทักษาและเลขศาสตร์ | NameMongkol',
            'description': 'บริการวิเคราะห์ชื่อมงคลขั้นสูงด้วยการคำนวณจากวันเดือนปีและเวลาตกฟาก เจาะลึกกราฟชีวิตรายด้าน พร้อมแนวทางแก้เคล็ดเสริมดวง',
            'inLanguage': 'th-TH',
            'isPartOf': { '@id': `${baseUrl}/#website` },
        },
        {
            '@type': 'SoftwareApplication',
            '@id': `${baseUrl}/premium-analysis#software`,
            'name': 'NameMongkol Premium Analysis',
            'applicationCategory': 'LifestyleApplication',
            'operatingSystem': 'Web',
            'offers': {
                '@type': 'Offer',
                'price': '599',
                'priceCurrency': 'THB',
                'description': 'สมัครสมาชิก VVIP 599 บาทเพื่อวิเคราะห์ชื่อมงคลขั้นสูง'
            }
        },
        {
            '@type': 'Service',
            'name': 'วิเคราะห์ชื่อมงคลขั้นสูง - NameMongkol Premium Analysis',
            'alternateName': 'NameMongkol Premium Naming Analysis',
            'description': 'บริการวิเคราะห์ชื่อมงคลขั้นสูงด้วยการคำนวณจากวันเดือนปีและเวลาตกฟาก เจาะลึกกราฟชีวิตรายด้าน พร้อมแนวทางแก้เคล็ดเสริมดวง',
            'provider': {
                '@type': 'Organization',
                'name': 'NameMongkol',
                'url': baseUrl
            },
            'serviceType': 'Astrology and Numerology Consultation',
            'areaServed': 'TH',
            'url': `${baseUrl}/premium-analysis`,
            'offers': {
                '@type': 'Offer',
                'price': '599',
                'priceCurrency': 'THB',
                'description': 'สมัครสมาชิก VVIP 599 บาทเพื่อวิเคราะห์ชื่อมงคลขั้นสูง',
                'availability': 'https://schema.org/InStock'
            },
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                'name': 'ฟีเจอร์การวิเคราะห์ชื่อมงคลขั้นสูง',
                'itemListElement': [
                    {
                        '@type': 'Offer',
                        'itemOffered': {
                            '@type': 'Service',
                            'name': 'วิเคราะห์ร่วมกับเวลาเกิด (ลัคนาราศี)'
                        }
                    },
                    {
                        '@type': 'Offer',
                        'itemOffered': {
                            '@type': 'Service',
                            'name': 'เจาะลึกเฉพาะด้าน (การเงิน/การงาน/ความรัก/สุขภาพ/อุปถัมภ์)'
                        }
                    },
                    {
                        '@type': 'Offer',
                        'itemOffered': {
                            '@type': 'Service',
                            'name': 'คำนวณผลรวมเลขศาสตร์และอักษรกาลกิณี'
                        }
                    }
                ]
            }
        },
        {
            '@type': 'BreadcrumbList',
            '@id': `${baseUrl}/premium-analysis#breadcrumb`,
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
                    'name': 'วิเคราะห์ชื่อมงคลขั้นสูง',
                    'item': `${baseUrl}/premium-analysis`,
                },
            ],
        }
    ]
};

// FAQ Schema for SEO
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'การวิเคราะห์ชื่อมงคลขั้นสูงต่างจากการวิเคราะห์ทั่วไปอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'การวิเคราะห์ชื่อทั่วไปดูเพียงแค่ผลรวมเลขศาสตร์ แต่การวิเคราะห์ชื่อมงคลขั้นสูงนำ "เวลาตกฟาก" มาคำนวณหาลัคนาราศีที่แท้จริง เพื่อดูว่าชื่อส่งผลต่อดวงกำเนิดของคุณในมุมลึกอย่างไร รวมถึงสามารถเลือกเน้นเจาะลึกเฉพาะด้านที่ต้องการได้ เช่น การเงิน การงาน หรือความรัก'
            }
        },
        {
            '@type': 'Question',
            'name': 'ทำไมต้องระบุเวลาเกิด?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'การระบุเวลาเกิดจะช่วยให้คำนวณลัคนาราศีได้แม่นยำขึ้น ซึ่งมีผลต่อการวิเคราะห์ว่าอักษรและตัวเลขในชื่อจะส่งผลอย่างไรกับดวงชะตาเฉพาะบุคคลของคุณ หากไม่ทราบเวลาเกิดสามารถเลือก "ไม่ทราบเวลา" ได้'
            }
        },
        {
            '@type': 'Question',
            'name': 'วิเคราะห์ชื่อมงคลขั้นสูงต้องสมัครสมาชิกหรือไม่?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'การวิเคราะห์ชื่อมงคลขั้นสูงสำหรับสมาชิก VVIP และทุกครั้งที่กดวิเคราะห์ ระบบจะหัก 30 เครดิตต่อครั้ง โดยระบบจะแสดงรายชื่อมงคล 20 ชื่อที่ถูกคัดสรรตามเกณฑ์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง พร้อมคำอธิบายละเอียดและคะแนนของแต่ละชื่อ'
            }
        }
    ]
};

export default function PremiumAnalysisPage() {
    return (
        <>
            <Script
                id="premium-analysis-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="premium-analysis-faq-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ClientPage />
        </>
    );
}
