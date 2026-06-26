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
                'text': 'ระบบเปลี่ยนชื่อมงคล Pro ใช้ ฐานข้อมูลชื่อคัดกรอง ที่ผ่านการคัดกรอง 3 ชั้น: 1) คัดตามหลักทักษา ไม่มีอักษรกาลกิณี 2) คัดเฉพาะผลรวมเลขศาสตร์ระดับ A+ 3) ความหมายดี ไพเราะ ทันสมัย และสามารถเลือกอักษรนำวรรคเดช/ศรี ได้'
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
            <section
                className="relative mt-12 overflow-hidden border-t border-amber-100/70 bg-[#f8f8fc] px-4 pb-24 pt-16"
            >
                <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#c9933a]/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#9b8ec4]/10 blur-3xl" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="mb-12 text-center md:text-left">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                            Premium Name Selection
                        </p>
                        <h2 className="text-3xl font-black text-[#1a1a3e] sm:text-4xl">
                            เปลี่ยนชื่อมงคล <span className="text-emerald-700">Pro</span> เหมาะกับกรณีไหน?
                        </h2>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5a5a82] sm:text-base mx-auto md:mx-0">
                            หน้านี้เหมาะกับคนที่ตัดสินใจจริงจังเรื่องเปลี่ยนชื่อและต้องการคัดชื่อจากฐานข้อมูลพรีเมียม
                            โดยใช้เงื่อนไขวันเกิด อักษรกาลกิณี วรรคเดช วรรคศรี และผลรวมเลขศาสตร์ร่วมกัน
                            ถ้าคุณยังไม่แน่ใจว่าชื่อปัจจุบันดีหรือไม่ ควรเริ่มจากการวิเคราะห์ชื่อฟรีก่อน
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="group rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-cyan-50/70 to-white p-8 shadow-[0_18px_42px_rgba(14,165,233,0.08)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_22px_52px_rgba(14,165,233,0.13)]">
                            <h3 className="text-lg font-black text-[#1a1a3e] transition-colors group-hover:text-sky-700">1. เริ่มจากเช็กชื่อเดิม</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5a5a82]">
                                วิเคราะห์ชื่อและนามสกุลปัจจุบัน เพื่อดูว่าปัญหาอยู่ที่ผลรวม คู่เลข หรืออักษรกาลกิณี
                            </p>
                            <Link href="/name-check" className="mt-6 inline-flex items-center text-sm font-bold text-sky-700 hover:text-sky-600">
                                ไปวิเคราะห์ชื่อฟรี →
                            </Link>
                        </div>
                        <div className="group rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50/70 to-white p-8 shadow-[0_18px_42px_rgba(245,158,11,0.08)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_22px_52px_rgba(245,158,11,0.13)]">
                            <h3 className="text-lg font-black text-[#1a1a3e] transition-colors group-hover:text-amber-700">2. หาไอเดียชื่อทั่วไป</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5a5a82]">
                                ถ้ายังอยู่ในขั้นสำรวจชื่อจำนวนมาก ให้เริ่มจากฐานข้อมูลชื่อมงคลฟรีหรือเครื่องมือสร้างชื่อด้วย AI
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/search" className="inline-flex items-center text-sm font-bold text-amber-700 hover:text-amber-600">
                                    ค้นหาชื่อมงคลฟรี →
                                </Link>
                                <Link href="/name-generator" className="inline-flex items-center text-sm font-bold text-pink-600 hover:text-pink-500">
                                    สร้างชื่อมงคลด้วย AI →
                                </Link>
                            </div>
                        </div>
                        <div className="group rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-white p-8 shadow-[0_18px_42px_rgba(16,185,129,0.08)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_22px_52px_rgba(16,185,129,0.13)]">
                            <h3 className="text-lg font-black text-emerald-800">3. คัดชื่อสำหรับเปลี่ยนจริง</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#5a5a82]">
                                ใช้ Pro เมื่อต้องการชื่อที่คัดตามวันเกิดและอักษรนำ พร้อมลดโอกาสเจอชื่อที่ขัดกับหลักทักษา
                            </p>
                            <Link href="/premium-analysis" className="mt-6 inline-flex items-center text-sm font-bold text-emerald-700 hover:text-emerald-600">
                                วิเคราะห์ชื่อขั้นสูงต่อ →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
