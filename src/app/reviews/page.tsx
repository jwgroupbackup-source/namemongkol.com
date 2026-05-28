import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { createClient } from '@/utils/supabaseServer';
import { Review, ReviewServiceType } from '@/types';
import { siteUrl } from '@/lib/seo';

// Service type mapping for SEO - ชื่อบริการและ URL
const SERVICE_INFO: Record<ReviewServiceType, { name: string; url: string }> = {
    'name-analysis': { name: 'วิเคราะห์ชื่อมงคล', url: '/name-analysis' },
    'phone-analysis': { name: 'วิเคราะห์เบอร์มงคล', url: '/phone-analysis' },
    'premium-search': { name: 'ค้นหาชื่อมงคลพรีเมียม', url: '/premium-search' },
    'premium-analysis': { name: 'วิเคราะห์ชื่อแบบพรีเมียม', url: '/premium-analysis' },
    'wallpapers': { name: 'วอลเปเปอร์มงคล', url: '/wallpapers' },
    'general': { name: 'บริการ NameMongkol', url: '/' }
};

export const metadata: Metadata = {
    title: 'รวมรีวิว NameMongkol: เปลี่ยนชื่อ-เบอร์โทรศัพท์มงคล ชีวิตเปลี่ยนจริงไหม?',
    description: 'รวมประสบการณ์จริงจากผู้ใช้งาน NameMongkol ที่เปลี่ยนชื่อมงคลและเบอร์โทรศัพท์แล้วชีวิตดีขึ้น ทั้งเรื่องการเงิน การงาน และความรัก พิสูจน์ความแม่นยำด้วยตัวคุณเองได้ที่นี่',
    keywords: ['รีวิวเปลี่ยนชื่อมงคล', 'ประสบการณ์เปลี่ยนชื่อ', 'ตั้งชื่อมงคลที่ไหนดี', 'วิเคราะห์เบอร์โทรแม่นๆ', 'รีวิวเบอร์มงคล', 'แก้กรรมด้วยชื่อ', 'รีวิว NameMongkol'],

    openGraph: {
        title: 'รวมรีวิว NameMongkol: เปลี่ยนชื่อ-เบอร์โทรศัพท์มงคล ชีวิตเปลี่ยนจริงไหม?',
        description: 'รวมประสบการณ์จริงจากผู้ใช้งาน NameMongkol ที่เปลี่ยนชื่อมงคลและเบอร์โทรศัพท์แล้วชีวิตดีขึ้น ทั้งเรื่องการเงิน การงาน และความรัก',
        url: `${siteUrl}/reviews`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=รีวิวจากทางบ้าน&subtitle=ประสบการณ์จริงจากผู้ใช้%20NameMongkol&tag=Reviews`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'รีวิวจากทางบ้าน | NameMongkol',
        description: 'ประสบการณ์จริงจากผู้ใช้ NameMongkol',
        images: [`${siteUrl}/api/og?variant=default&title=รีวิวจากทางบ้าน`],
    },
    alternates: {
        canonical: `${siteUrl}/reviews`,
    },
};

async function getReviews() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        return (data || []) as Review[];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

export default async function ReviewsPage() {
    const reviews = await getReviews();

    // Serialize dates for Client Component if passing data directly, 
    // but here we only use it for JSON-LD. ClientPage fetches its own data.

    // Calculate aggregate rating for SEO
    const totalRatings = reviews.length;
    const avgRating = totalRatings > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : "5";

    // Enhanced Schema Markup for SEO - ปรับปรุงตาม Google Guidelines
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "รีวิวจากผู้ใช้งานจริง NameMongkol",
        "description": "รวมประสบการณ์เปลี่ยนชื่อมงคลและเบอร์มงคล ผู้ใช้งานจริงยืนยันผลลัพธ์ที่ดีขึ้น",
        "url": `${siteUrl}/reviews`,
        "mainEntity": {
            "@type": "LocalBusiness",
            "name": "NameMongkol - บริการวิเคราะห์ชื่อและเบอร์มงคล",
            "image": `${siteUrl}/logo.png`,
            "url": siteUrl,
            "telephone": "",
            "priceRange": "฿",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": avgRating,
                "reviewCount": totalRatings.toString(),
                "bestRating": "5",
                "worstRating": "1"
            },
            "review": reviews.slice(0, 20).map((review) => {
                const serviceType = (review.service_type || 'general') as ReviewServiceType;
                const serviceInfo = SERVICE_INFO[serviceType] || SERVICE_INFO['general'];

                return {
                    "@type": "Review",
                    "itemReviewed": {
                        "@type": "Service",
                        "name": serviceInfo.name,
                        "url": `${siteUrl}${serviceInfo.url}`
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": review.rating.toString(),
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "author": {
                        "@type": "Person",
                        "name": review.nickname
                    },
                    "datePublished": review.created_at || review.date,
                    "reviewBody": review.content,
                    ...(review.images && review.images.length > 0 && {
                        "image": review.images
                    }),
                    ...(review.is_verified && {
                        "author": {
                            "@type": "Person",
                            "name": review.nickname,
                            "identifier": "verified-user"
                        }
                    })
                };
            })
        }
    };

    // FAQ Schema for additional SEO value
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "เปลี่ยนชื่อมงคลแล้วนานแค่ไหนถึงจะเห็นผล?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "จากรีวิวเปลี่ยนชื่อมงคลของผู้ใช้งานส่วนใหญ่ การเปลี่ยนแปลงมักเริ่มเห็นผลชัดเจนภายใน 3-6 เดือน โดยเริ่มจากความรู้สึกมั่นใจและความสบายใจ ซึ่งส่งผลดีต่อการตัดสินใจในชีวิตประจำวัน ทั้งนี้ขึ้นอยู่กับพื้นดวงเดิมและการปฏิบัติตัวของแต่ละบุคคล"
                }
            },
            {
                "@type": "Question",
                "name": "วิเคราะห์เบอร์โทรศัพท์กับ NameMongkol แม่นยำแค่ไหน?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ระบบวิเคราะห์เบอร์โทรแม่นๆ ของเราใช้หลักเลขศาสตร์สากลและโหราศาสตร์ไทยประยุกต์ ผสานกับฐานข้อมูลสถิติจากผู้ใช้จริง ทำให้ผลลัพธ์มีความละเอียดและตรงกับสถานการณ์ชีวิตของผู้ใช้"
                }
            },
            {
                "@type": "Question",
                "name": "รีวิวใน NameMongkol มาจากผู้ใช้จริงหรือไม่?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "รีวิวทั้งหมดมาจากผู้ใช้งานจริงที่ผ่านการยืนยันตัวตน โดยต้องล็อกอินเข้าสู่ระบบและมีประวัติการใช้งานบริการของเราก่อนจึงจะสามารถเขียนรีวิวได้ เราไม่มีการสร้างรีวิวปลอม"
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ClientPage />
        </>
    );
}
