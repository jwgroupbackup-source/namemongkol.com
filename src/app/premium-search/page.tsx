import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import ClientPage from './ClientPage';
import { siteUrl } from '@/lib/seo';

const baseUrl = siteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
    title: 'เปลี่ยนชื่อมงคล Pro คัดชื่อเสริมดวงจากฐานข้อมูลพรีเมียม | NameMongkol',
    description: 'คัดชื่อเสริมดวงสำหรับเปลี่ยนชื่อมงคลแบบจริงจัง กรองด้วยวรรคเดช วรรคศรี ทักษา เลขศาสตร์ และอักษรกาลกิณี จากฐานข้อมูลชื่อคัดพิเศษ',
    keywords: ['เปลี่ยนชื่อมงคล', 'เปลี่ยนชื่อเสริมดวง', 'คัดชื่อเสริมดวง', 'ชื่อมงคลพรีเมียม', 'คัดเลือกชื่อมงคล Pro', 'วรรคเดช', 'วรรคศรี', 'ผลรวมเลขศาสตร์', 'อักษรนำ', 'ชื่อมงคลขั้นสูง', 'ตัวกรองชื่อ', 'ชื่อคัดพิเศษ'],

    openGraph: {
        title: 'เปลี่ยนชื่อมงคล Pro คัดชื่อเสริมดวงจากฐานข้อมูลพรีเมียม',
        description: 'คัดชื่อเสริมดวงสำหรับเปลี่ยนชื่อมงคล กรองด้วยวรรคเดช วรรคศรี ทักษา และเลขศาสตร์',
        url: `${baseUrl}/premium-search`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${baseUrl}/api/og?variant=default&title=เปลี่ยนชื่อมงคล%20Pro&subtitle=คัดชื่อเสริมดวงจากฐานข้อมูลพรีเมียม&tag=Premium%20Search`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เปลี่ยนชื่อมงคล Pro คัดชื่อเสริมดวง | NameMongkol',
        description: 'คัดชื่อเสริมดวงสำหรับเปลี่ยนชื่อมงคล กรองด้วยวรรคเดช วรรคศรี ทักษา และเลขศาสตร์',
        images: [`${baseUrl}/api/og?variant=default&title=เปลี่ยนชื่อมงคล%20Pro`],
    },
    alternates: {
        canonical: `${baseUrl}/premium-search`,
    },
};

// Enhanced JSON-LD Schema for SEO
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${baseUrl}/premium-search#webpage`,
            'url': `${baseUrl}/premium-search`,
            'name': 'เปลี่ยนชื่อมงคล Pro คัดชื่อเสริมดวงจากฐานข้อมูลพรีเมียม | NameMongkol',
            'description': 'คัดชื่อเสริมดวงสำหรับเปลี่ยนชื่อมงคลแบบจริงจัง กรองด้วยวรรคเดช วรรคศรี ทักษา เลขศาสตร์ และอักษรกาลกิณี',
            'inLanguage': 'th-TH',
            'isPartOf': { '@id': `${baseUrl}/#website` },
            'mainEntity': { '@id': `${baseUrl}/premium-search#software` },
        },
        {
            '@type': 'SoftwareApplication',
            '@id': `${baseUrl}/premium-search#software`,
            'name': 'NameMongkol Premium Search - เปลี่ยนชื่อมงคล Pro',
            'alternateName': 'คัดชื่อเสริมดวง Pro',
            'description': 'โปรแกรมคัดชื่อเสริมดวงสำหรับเปลี่ยนชื่อมงคลแบบจริงจัง ผ่านการคัดกรอง 3 ชั้น: ทักษา เลขศาสตร์ และความหมาย',
            'applicationCategory': 'LifestyleApplication',
            'operatingSystem': 'Web',
            'url': `${baseUrl}/premium-search`,
            'offers': {
                '@type': 'Offer',
                'price': '15',
                'priceCurrency': 'THB',
                'description': '15 เครดิตต่อการค้นหา 1 ครั้ง'
            },
            'featureList': [
                'ฐานข้อมูลชื่อมงคล 1,172 ชื่อที่คัดสรรแล้ว',
                'ระบบคัดกรองอักษรกาลกิณี 100%',
                'เลือกอักษรนำตามทักษา (วรรคเดช/วรรคศรี)',
                'กรองตามผลรวมเลขศาสตร์ เกรด A+ เท่านั้น',
                'กรองตามวันเกิดและเพศ',
                'ชื่อมีความหมายดี ไพเราะ ทันสมัย'
            ]
        },
        {
            '@type': 'BreadcrumbList',
            '@id': `${baseUrl}/premium-search#breadcrumb`,
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
                    'name': 'เปลี่ยนชื่อมงคล Pro',
                    'item': `${baseUrl}/premium-search`,
                },
            ],
        },
    ]
};

// FAQ Schema for SEO
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'เปลี่ยนชื่อมงคล Pro ต่างจากค้นหาทั่วไปอย่างไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'ระบบเปลี่ยนชื่อมงคล Pro ใช้ Premium Database ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้'
            }
        },
        {
            '@type': 'Question',
            'name': 'วรรคเดชและวรรคศรีคืออะไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'วรรคเดช คืออักษรนำที่ส่งเสริมเรื่องอำนาจบารมี การเลื่อนขั้นเลื่อนตำแหน่ง เหมาะกับผู้ต้องการความก้าวหน้าในหน้าที่การงาน ส่วนวรรคศรี คืออักษรนำที่ส่งเสริมเรื่องโชคลาภ เสน่ห์ความรัก เหมาะกับผู้ต้องการดึงดูดความโชคดีและเสน่ห์'
            }
        },
        {
            '@type': 'Question',
            'name': 'เปลี่ยนชื่อมงคล Pro ใช้กี่เครดิต?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'การคัดชื่อในระบบเปลี่ยนชื่อมงคล Pro ใช้ 15 เครดิตต่อ 1 ครั้ง โดยระบบจะสุ่มแสดงผล 20 รายชื่อจากฐานข้อมูลที่ตรงตามเงื่อนไขที่คุณเลือก'
            }
        }
    ]
};

export default function PremiumSearchPage() {
    return (
        <>
            <Script
                id="premium-search-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="premium-search-faq-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <ClientPage />
            <section className="bg-[#0f172a] px-4 pb-20 text-slate-200">
                <div className="mx-auto max-w-5xl border-t border-white/10 pt-12">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                        Premium Name Selection
                    </p>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        เปลี่ยนชื่อมงคล Pro เหมาะกับกรณีไหน
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                        หน้านี้เหมาะกับคนที่ตัดสินใจจริงจังเรื่องเปลี่ยนชื่อและต้องการคัดชื่อจากฐานข้อมูลพรีเมียม
                        โดยใช้เงื่อนไขวันเกิด อักษรกาลกิณี วรรคเดช วรรคศรี และผลรวมเลขศาสตร์ร่วมกัน
                        ถ้าคุณยังไม่แน่ใจว่าชื่อปัจจุบันดีหรือไม่ ควรเริ่มจากการวิเคราะห์ชื่อฟรีก่อน
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-400/15 bg-white/5 p-5">
                            <h3 className="font-semibold text-white">เริ่มจากเช็กชื่อเดิม</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                วิเคราะห์ชื่อและนามสกุลปัจจุบัน เพื่อดูว่าปัญหาอยู่ที่ผลรวม คู่เลข หรืออักษรกาลกิณี
                            </p>
                            <Link href="/name-check" className="mt-4 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                                ไปวิเคราะห์ชื่อฟรี
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                            <h3 className="font-semibold text-amber-200">หาไอเดียชื่อทั่วไป</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                ถ้ายังอยู่ในขั้นสำรวจชื่อจำนวนมาก ให้เริ่มจากฐานข้อมูลชื่อมงคลฟรีหรือเครื่องมือสร้างชื่อด้วย AI
                            </p>
                            <Link href="/search" className="mt-4 inline-block text-sm font-semibold text-amber-300 hover:text-amber-200">
                                ค้นหาชื่อมงคลฟรี
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                            <h3 className="font-semibold text-emerald-200">คัดชื่อสำหรับเปลี่ยนจริง</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                ใช้ Pro เมื่อต้องการชื่อที่คัดตามวันเกิดและอักษรนำ พร้อมลดโอกาสเจอชื่อที่ขัดกับหลักทักษา
                            </p>
                            <Link href="/premium-analysis" className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                                วิเคราะห์ชื่อขั้นสูงต่อ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
