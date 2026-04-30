import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { PhoneSeoContent } from '@/components/PhoneSeoContent';
import { PhoneFAQSection } from '@/components/PhoneFAQSection';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.namemongkol.com';
const siteUrl = rawSiteUrl.includes('namemongkol.com') && !rawSiteUrl.includes('www.')
    ? rawSiteUrl.replace('://namemongkol.com', '://www.namemongkol.com')
    : rawSiteUrl;

export const metadata: Metadata = {
    title: 'เบอร์มงคล ฟรี! เช็คเบอร์โทรศัพท์ กราฟพลังงาน 6 ด้าน เกรด A-F | NameMongkol',
    description: 'เบอร์มงคล เช็คฟรี! วิเคราะห์เบอร์โทรศัพท์ด้วย AI ดูกราฟพลังงาน 6 ด้าน เกรด A-F คู่เลขมงคล ผลรวม รู้ทันทีเบอร์ดีหรือร้าย เหมาะเช็คเบอร์มือสอง เบอร์ใหม่ และเบอร์เสริมดวง',
    keywords: 'เบอร์มงคล, เช็คเบอร์มงคล, วิเคราะห์เบอร์โทรศัพท์, เบอร์โทรศัพท์มงคล, กราฟพลังงาน 6 ด้าน, เกรดเบอร์ A-F, วิเคราะห์คู่เลข, ผลรวมเบอร์มงคล, เบอร์มือสอง, AI วิเคราะห์เบอร์, เบอร์เสริมดวง, เบอร์เงินล้าน, ดูดวงเบอร์โทรศัพท์',
    openGraph: {
        title: 'เบอร์มงคล ฟรี! เช็คเบอร์โทรศัพท์ กราฟพลังงาน 6 ด้าน เกรด A-F | NameMongkol',
        description: 'เบอร์มงคล เช็คฟรี! วิเคราะห์เบอร์โทรศัพท์ด้วย AI ดูกราฟพลังงาน 6 ด้าน เกรด A-F คู่เลขมงคล ผลรวม รู้ทันทีเบอร์ดีหรือร้าย',
        url: `${siteUrl}/phone-analysis`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=phone`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เบอร์มงคล ฟรี! เช็คเบอร์โทรศัพท์ กราฟพลังงาน 6 ด้าน | NameMongkol',
        description: 'เบอร์มงคล เช็คฟรี! วิเคราะห์เบอร์โทรศัพท์ด้วย AI ดูกราฟพลังงาน 6 ด้าน เกรด A-F คู่เลขมงคล รู้ทันทีเบอร์ดีหรือร้าย',
        images: [`${siteUrl}/api/og?variant=phone`],
    },
    alternates: {
        canonical: `${siteUrl}/phone-analysis`,
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
};

export default function PhoneAnalysisPage() {

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/phone-analysis`,
                'url': `${siteUrl}/phone-analysis`,
                'name': 'เช็คเบอร์มงคล ฟรี กราฟพลังงาน 6 ด้าน เกรด A-F | NameMongkol',
                'description': 'วิเคราะห์เบอร์มงคลฟรี ดูกราฟพลังงาน 6 ด้าน เกรด A-F วิเคราะห์คู่เลขและผลรวม เหมาะกับเบอร์ใหม่และเบอร์มือสอง',
                'inLanguage': 'th-TH',
                'isPartOf': {
                    '@type': 'WebSite',
                    'name': 'NameMongkol',
                    'url': siteUrl
                }
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'วิเคราะห์เบอร์มงคล - NameMongkol',
                'description': 'ระบบวิเคราะห์เบอร์โทรศัพท์มงคลด้วย AI พร้อมกราฟพลังงาน 6 ด้าน คู่เลขมงคล และคำทำนายเชิงลึก',
                'applicationCategory': 'LifestyleApplication',
                'operatingSystem': 'Web',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'THB'
                },

            },
            {
                '@type': 'FAQPage',
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': 'วิเคราะห์เบอร์มงคลแม่นยำแค่ไหน?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ระบบวิเคราะห์ของเราใช้หลักเลขศาสตร์สากลและโหราศาสตร์ไทย โดยพิจารณาคู่เลข 7 ตัวท้าย (XX-XYZ-ABCD) และผลรวมเบอร์ เพื่อความแม่นยำสูงสุด ระบบจะวิเคราะห์ทั้งจุดเด่นและจุดอ่อนของเบอร์ พร้อมแสดงกราฟพลังงาน 6 ด้านของชีวิต'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เบอร์มงคลช่วยเรื่องอะไรบ้าง?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'เบอร์ที่ดีจะช่วยส่งเสริมพลังงานด้านบวก ทั้งการงาน การเงิน และความรัก โดยเฉพาะคู่เลขมงคลอย่าง 24 (เมตตามหานิยม ขุมทรัพย์), 46 (เมตตามหานิยม ค้าขายรุ่งเรือง), 65 (มหาเศรษฐี คู่ทรัพย์คู่ปัญญา), 19 (ผู้นำเสน่ห์อำนาจ) จะช่วยดึงดูดโอกาสและความสำเร็จเข้ามาในชีวิต'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'คู่เลขอะไรควรหลีกเลี่ยง?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'คู่เลขที่ควรระวัง ได้แก่ 13/31 (อุบัติเหตุ ผ่าตัด เคราะห์กรรม), 48/84 (คดีความ ถูกโกง ปัญหาเอกสาร), 67/76 (รักร้าว หนี้สิน ครอบครัวแตกแยก), 43 (ปากร้าย สร้างศัตรู) หากเบอร์ของคุณมีคู่เลขเหล่านี้มาก ควรพิจารณาเปลี่ยนเบอร์ใหม่เพื่อชีวิตที่ราบรื่นขึ้น'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'ผลรวมเบอร์ที่ดีควรเป็นเท่าไหร่?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ผลรวมที่ดีขึ้นอยู่กับอาชีพและดวงชะตาของแต่ละบุคคล แต่โดยทั่วไป ผลรวมที่จัดว่าดีเยี่ยมในระดับสากล ได้แก่ 24, 32, 36, 41, 45, 46, 50, 51, 54, 59, 63, 65 ซึ่งส่งผลดีในด้านความสำเร็จและการเงิน'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เปลี่ยนเบอร์แล้วจะเห็นผลเมื่อไหร่?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ตามหลักเลขศาสตร์ เมื่อเปลี่ยนเบอร์ใหม่แล้ว จะเริ่มเห็นผลการเปลี่ยนแปลงภายใน 1-3 เดือน โดยพลังงานของเบอร์ใหม่จะค่อยๆ ส่งผลต่อการสื่อสาร การติดต่อ และดึงดูดสิ่งดีๆ เข้ามา ยิ่งใช้เบอร์นานยิ่งเห็นผลชัดเจน'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เบอร์มงคลกับวันเกิดมีความสัมพันธ์กันไหม?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'มีความสัมพันธ์กันครับ! บางตัวเลขอาจเป็นมงคลสำหรับคนวันเกิดหนึ่ง แต่อาจไม่เหมาะกับอีกวันเกิดหนึ่ง เช่น เลข 6 และ 9 เหมาะกับคนเกิดวันอาทิตย์ แนะนำให้วิเคราะห์เบอร์ร่วมกับวันเกิดเพื่อผลลัพธ์ที่แม่นยำที่สุด'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'วิเคราะห์เบอร์ฟรีจริงไหม?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ใช่ครับ! การวิเคราะห์เบอร์มงคลขั้นพื้นฐานที่ NameMongkol ฟรี 100% ไม่มีค่าใช้จ่าย คุณสามารถดูเกรดเบอร์ คู่เลข และกราฟพลังงานได้ทันที'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'กราฟพลังงาน 6 ด้านคืออะไร?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'กราฟพลังงาน 6 ด้านคือการแสดงผลพลังงานของเบอร์โทรศัพท์ในรูปแบบเรดาร์กราฟ ครอบคลุม 6 มิติ ได้แก่ การเงิน/การงาน, โชคลาภ, เสน่ห์/ความรัก, สุขภาพ, สติปัญญา และเซนส์/สัมผัสที่ 6 ช่วยให้เห็นจุดเด่นและจุดอ่อนของเบอร์อย่างชัดเจน'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'ซื้อเบอร์มือสองมาใช้ ต้องเช็คเบอร์ไหม?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'แนะนำอย่างยิ่งครับ! เบอร์มือสองอาจพกพลังงานจากเจ้าของเดิมมาด้วย ควรเช็คเบอร์ก่อนซื้อเพื่อดูว่าคู่เลข ผลรวม และเกรดเบอร์เป็นมงคลหรือไม่ ระบบ NameMongkol ให้วิเคราะห์ฟรีไม่จำกัดจำนวนเบอร์'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'เกรดเบอร์ A-F หมายความว่าอย่างไร?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ระบบจะวิเคราะห์เบอร์และให้เกรดตั้งแต่ A (ดีเยี่ยม มงคลสูงสุด) ไปจนถึง F (อัปมงคล ควรเปลี่ยน) โดยพิจารณาจากคู่เลข ผลรวม กราฟพลังงาน 6 ด้าน และองค์ประกอบตัวเลขโดยรวม เบอร์เกรด A-B ถือว่ามงคลใช้ได้ดี'
                        }
                    }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': `${siteUrl}/phone-analysis#pair-types`,
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': 'คู่มิตร คู่ศัตรู คู่ธาตุ คู่สมพล ต่างกันอย่างไร?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'ในหลักเลขศาสตร์ไทย คู่เลขแบ่งเป็น 4 ประเภทตามดาวพระเคราะห์: (1) คู่มิตร เช่น 15/51, 24/42, 36/63, 78/87 ส่งเสริมเกื้อกูลกัน (2) คู่สมพล เช่น 16/61, 28/82, 35/53, 49/94 เสริมพลังอำนาจและบารมี (3) คู่ธาตุ เช่น 17/71 (ไฟ), 28/82 (ดิน), 39/93 (ลม), 46/64 (น้ำ) ส่งเสริมความมั่นคง (4) คู่ศัตรู เช่น 13/31, 48/84, 67/76 ส่งผลลบ ควรหลีกเลี่ยง'
                        }
                    }
                ]
            },
            {
                '@type': 'HowTo',
                'name': 'วิธีวิเคราะห์เบอร์โทรศัพท์มงคล',
                'description': 'ขั้นตอนการวิเคราะห์เบอร์โทรศัพท์มงคลที่ NameMongkol',
                'step': [
                    {
                        '@type': 'HowToStep',
                        'position': 1,
                        'name': 'กรอกเบอร์โทรศัพท์',
                        'text': 'ใส่เบอร์โทรศัพท์ 10 หลักที่ต้องการวิเคราะห์'
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 2,
                        'name': 'ระบบ AI ประมวลผล',
                        'text': 'ระบบจะวิเคราะห์คู่เลข ผลรวม และพลังงานทุกด้านของเบอร์'
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 3,
                        'name': 'ดูผลลัพธ์',
                        'text': 'รับเกรดเบอร์ กราฟพลังงาน 6 ด้าน และความหมายคู่เลขทั้งหมด'
                    },
                    {
                        '@type': 'HowToStep',
                        'position': 4,
                        'name': 'ตัดสินใจ',
                        'text': 'เก็บเบอร์ดีไว้ใช้ หรือพิจารณาเปลี่ยนเบอร์ใหม่ที่มงคลกว่า'
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Server-rendered H1 for SEO — always Thai for Googlebot */}
            <h1 className="sr-only">วิเคราะห์เบอร์มงคล แม่นยำที่สุด! เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน</h1>

            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400" />
                </div>
            }>
                <ClientPage />
            </Suspense>

            {/* SSR SEO Content — always visible to Googlebot regardless of client state */}
            <div className="w-full">
                <PhoneSeoContent />
                <PhoneFAQSection />
            </div>
        </>
    );
}
