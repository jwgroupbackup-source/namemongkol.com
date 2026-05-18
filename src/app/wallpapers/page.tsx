import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import ClientPage from './ClientPage';
import { Sparkles, Sun, Moon, Flame, MessageCircle, BookOpen, Heart, Shield, Crown, Star, Zap, Download, ChevronRight, HelpCircle } from 'lucide-react';
import { siteUrl } from '@/lib/seo';

// Inline style for content-visibility sections (avoids Tailwind purge issues)
const deferredSectionStyle = {
    contentVisibility: 'auto' as const,
    containIntrinsicSize: 'auto 600px',
} as React.CSSProperties;

export const metadata: Metadata = {
    title: 'วอลเปเปอร์มงคล เสริมดวง งาน เงิน รัก บารมี | NameMongkol',
    alternates: { canonical: `${siteUrl}/wallpapers` },
    description: 'ดาวน์โหลดวอลเปเปอร์มงคลเสริมดวงชะตา ออกแบบตามหลักฮวงจุ้ย โหราศาสตร์ไทย สีมงคลตามวันเกิด พร้อมสัญลักษณ์ศักดิ์สิทธิ์ ท้าวเวสสุวรรณ และเลขมงคล 4289',
    keywords: [
        'วอลเปเปอร์มงคล', 'วอลเปเปอร์เสริมดวง', 'วอลเปเปอร์สายมู',
        'พื้นหลังมงคล', 'ฮวงจุ้ย', 'ดาวน์โหลดวอลเปเปอร์มงคล',
        'วอลเปเปอร์ท้าวเวสสุวรรณ', 'วอลเปเปอร์ตามวันเกิด',
        'วอลเปเปอร์มงคลฟรี', 'เลขมงคล 4289', 'สีมงคลตามวันเกิด',
        'NameMongkol',
    ],
    openGraph: {
        title: 'วอลเปเปอร์มงคล เสริมดวง งาน เงิน รัก บารมี',
        description: 'แจกฟรี! วอลเปเปอร์มงคลเสริมดวงรอบด้าน การเงิน ความรัก การงาน ออกแบบตามศาสตร์มงคลแท้',
        url: `${siteUrl}/wallpapers`,
        siteName: 'NameMongkol',
        locale: 'th_TH',
        type: 'website',
        images: [`${siteUrl}/api/og?variant=default&title=วอลเปเปอร์มงคล&subtitle=แจกฟรี%20ดีไซน์เสริมดวง%20การเงิน%20การงาน%20ความรัก%20บารมี&tag=Wallpapers`],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'วอลเปเปอร์มงคล | NameMongkol',
        description: 'แจกฟรี! วอลเปเปอร์สายมู เสริมดวงรอบด้าน ออกแบบตามหลักฮวงจุ้ยและโหราศาสตร์',
        images: [`${siteUrl}/api/og?variant=default&title=วอลเปเปอร์มงคล`],
    },
};

// --- JSON-LD Schemas ---
const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/wallpapers`,
    'url': `${siteUrl}/wallpapers`,
    'name': 'วอลเปเปอร์มงคล เสริมดวง งาน เงิน รัก บารมี | NameMongkol',
    'description': 'ดาวน์โหลดวอลเปเปอร์มงคลเสริมดวงชะตา ออกแบบตามหลักฮวงจุ้ย โหราศาสตร์ไทย สีมงคลตามวันเกิด ท้าวเวสสุวรรณ และเลขมงคล 4289',
    'inLanguage': 'th-TH',
    'isPartOf': {
        '@type': 'WebSite',
        'name': 'NameMongkol',
        'url': siteUrl,
    },
};

const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'วอลเปเปอร์มงคล เสริมดวงชะตา',
    'description': 'คอลเลกชันวอลเปเปอร์มงคลเสริมดวงชะตาตามหลักฮวงจุ้ย โหราศาสตร์ไทย และสีมงคลตามวันเกิด ดาวน์โหลดฟรี',
    'url': `${siteUrl}/wallpapers`,
    'inLanguage': 'th-TH',
    'isPartOf': {
        '@type': 'WebSite',
        'name': 'NameMongkol',
        'url': siteUrl,
    },
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'วอลเปเปอร์มงคลช่วยเรื่องอะไร?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'วอลเปเปอร์มงคลช่วยเสริมกำลังใจ สร้างโฟกัส และดึงดูดพลังงานบวกผ่านการเห็นสัญลักษณ์มงคลบ่อยๆ ในแต่ละวัน ตามหลักจิตวิทยาสี (Color Psychology) การเห็นสีและภาพมงคลอย่างสม่ำเสมอสามารถส่งผลเชิงบวกต่อจิตใจและการตัดสินใจ',
            },
        },
        {
            '@type': 'Question',
            'name': 'ควรเปลี่ยนวอลเปเปอร์มงคลตอนไหน?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'สามารถเปลี่ยนได้ตามเป้าหมายของชีวิตในช่วงนั้น เช่น ต้องการเน้นเรื่องงานหรือเน้นเรื่องความรักเป็นพิเศษ หรือเปลี่ยนตามวันพิเศษ เช่น วันขึ้นปีใหม่ วันมงคลตั้งชื่อ หรือเมื่อต้องการเริ่มต้นสิ่งใหม่',
            },
        },
        {
            '@type': 'Question',
            'name': 'มีวอลเปเปอร์สำหรับแก้ชงไหม?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'มีครับ เรามีคอลเลกชันพิเศษสำหรับเสริมดวงตามปีนักษัตรเพื่อบรรเทาเคราะห์และเสริมโชค รวมถึงวอลเปเปอร์ท้าวเวสสุวรรณที่ช่วยเรื่องปลดหนี้และป้องกันภัย',
            },
        },
    ],
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'หน้าหลัก', 'item': siteUrl },
        { '@type': 'ListItem', 'position': 2, 'name': 'วอลเปเปอร์มงคล', 'item': `${siteUrl}/wallpapers` },
    ],
};

// --- Day Data ---
const dayCollections = [
    { day: 'วันอาทิตย์', name: 'สิงห์ทองนำโชค เลข 159', color: 'from-red-500 to-orange-500', textColor: 'text-red-400', borderColor: 'border-red-500/30', bgColor: 'bg-red-500/10', icon: Sun, desc: 'สิงห์ทองคำผู้ทรงอำนาจประทับบนดอกบัวทอง ล้อมด้วยเหรียญโชคลาภ พร้อมยันต์มงคลและรัศมีพระอาทิตย์ทองอร่าม เลขมงคล 159 เสริมอำนาจบารมี ความเป็นผู้นำ โชคลาภก้อนใหญ่ สีมงคลแดง-ทอง เหมาะสำหรับผู้บริหาร นักปกครอง นักการเมือง และผู้ที่ต้องการความยิ่งใหญ่' },
    { day: 'วันจันทร์', name: 'เทพพระจันทร์ประทานพร เลข 246', color: 'from-yellow-400 to-amber-400', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30', bgColor: 'bg-yellow-500/10', icon: Moon, desc: 'เทพองค์ทรงเครื่องประทับนั่งสมาธิบนดอกบัว พระหัตถ์ถือดอกบัวขาว พร้อมพระจันทร์เต็มดวง สิงห์คู่ผู้พิทักษ์ และเหรียญทองนำโชค เลขมงคล 246 เสริมเสน่ห์ เมตตามหานิยม สีมงคลขาว-เงิน เหมาะสำหรับนักประชาสัมพันธ์และผู้ที่ทำงานเกี่ยวข้องกับผู้คน' },
    { day: 'วันอังคาร', name: 'พระปางไสยาสน์ มณฑลยันต์ เลข 356', color: 'from-pink-500 to-rose-500', textColor: 'text-pink-400', borderColor: 'border-pink-500/30', bgColor: 'bg-pink-500/10', icon: Flame, desc: 'พระปางไสยาสน์ทองคำประทับบนดอกบัวชมพูภายในมณฑลยันต์ (Mandala) ทรงศักดิ์สิทธิ์ ล้อมด้วยสิงห์คู่ทองคำ ยันต์มงคล 3 ดวง เลขมงคล 356 เสริมความกล้าหาญ ก้าวหน้าในการงาน สีมงคลชมพู-ทอง เหมาะสำหรับนักแข่งขัน ทหาร ตำรวจ และนักกีฬา' },
    { day: 'วันพุธ(กลางวัน)', name: 'พระแม่ลักษมี เรียกทรัพย์ เลข 456', color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30', bgColor: 'bg-emerald-500/10', icon: MessageCircle, desc: 'พระแม่ลักษมีเทพีแห่งความมั่งคั่งทรงฉลองพระองค์สีเขียว-ทอง พระหัตถ์ถือดอกบัว ยืนบนดอกบัวชมพูท่ามกลางเหรียญทองร่วงจากสวรรค์ ช้างมงคลโปรยน้ำ เลขมงคล 456 เสริมวาจาเรียกทรัพย์ ค้าขายร่ำรวย สีมงคลเขียว เหมาะสำหรับนักธุรกิจ นักขาย และพ่อค้าแม่ค้า' },
    { day: 'วันพุธ(กลางคืน)', name: 'พระราหูอมจันทร์ ยันต์คุ้มครอง เลข 789', color: 'from-slate-500 to-gray-700', textColor: 'text-slate-300', borderColor: 'border-slate-500/30', bgColor: 'bg-slate-500/10', icon: Moon, desc: 'พระราหูอมจันทร์ทรงมหิทธิฤทธิ์ ประทับบนดอกบัวเขียวมรกต สวมมงกุฎทองวิจิตร วงยันต์มงคลทองเรืองรองท่ามกลางท้องฟ้ายามค่ำคืน พร้อมมณีเขียวมรกตล้อมรอบ เลขมงคล 789 เสริมพลังป้องกันภัย แคล้วคลาด สีมงคลดำ-เขียว เหมาะสำหรับผู้ที่ทำงานกะดึก เดินทางกลางคืน' },
    { day: 'วันพฤหัสบดี', name: 'พระพุทธรูปทองคำ ปัญญาบารมี เลข 659', color: 'from-orange-500 to-amber-500', textColor: 'text-orange-400', borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/10', icon: BookOpen, desc: 'พระพุทธรูปทองคำปางสมาธิทรงรัศมีส่องสว่าง วงยันต์อักขระขอมศักดิ์สิทธิ์ คัมภีร์ทองประดับอัญมณี หนูคู่มงคลสื่อถึงความขยัน เลขมงคล 659 เสริมสติปัญญา ผู้ใหญ่อุปถัมภ์ สีมงคลส้ม-ทอง เหมาะสำหรับนักเรียน นักวิจัย ครู อาจารย์ และผู้ที่ต้องการก้าวหน้าทางวิชาการ' },
    { day: 'วันศุกร์', name: 'พระพุทธรูปเรืองแสง ดอกบัวทิพย์ เลข 624', color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400', borderColor: 'border-cyan-500/30', bgColor: 'bg-cyan-500/10', icon: Heart, desc: 'พระพุทธรูปปางห้ามญาติทรงรัศมีฟ้าครามเรืองรอง ประทับบนดอกบัวชมพูทิพย์ มณฑลยันต์ฟ้า พระแม่ลักษมี เหรียญทอง อัญมณี และเมฆมงคลจีน เลขมงคล 624 เสริมโชคลาภ ทรัพย์สินพูนทวี ความรัก สีมงคลฟ้า-เขียว เหมาะสำหรับศิลปิน นักออกแบบ และผู้หญิงทำงาน' },
    { day: 'วันเสาร์', name: 'พระนาคปรก เสือคู่นำโชค 招財 เลข 156', color: 'from-purple-500 to-violet-500', textColor: 'text-purple-400', borderColor: 'border-purple-500/30', bgColor: 'bg-purple-500/10', icon: Shield, desc: 'พระพุทธรูปปางนาคปรกทองคำบนพญานาค 7 เศียรสีม่วง วงยันต์โหราศาสตร์ อักษรจีน招財(เรียกทรัพย์) เสือคู่ทองคำผู้พิทักษ์ ช้างมงคล เหรียญทอง เลขมงคล 156 เสริมอำนาจวาสนา ปกป้องคุ้มครอง สีมงคลม่วง-ทอง เหมาะสำหรับผู้พิพากษา ทนายความ และข้าราชการ' },
];

// --- Deity Data ---
const deityCollections = [
    { name: 'ท้าวเวสสุวรรณ ปลดหนี้', desc: 'เสริมโชคลาภ ป้องกันภัย และช่วยเรื่องการเงินที่ติดขัด ปลดหนี้สิน ป้องกันอันตรายทุกรูปแบบ พระคาถาท้าวเวสสุวรรณเป็นที่นิยมมากที่สุดในหมู่คนไทยสายมู', emoji: '🛡️' },
    { name: 'เทพเจ้าไฉ่ซิงเอี้ย', desc: 'เทพแห่งโชคลาภในความเชื่อจีน ช่วยเรียกทรัพย์และเปิดทางรับเงินทอง เหมาะกับนักธุรกิจ พ่อค้าแม่ค้า และผู้ที่ต้องการดวงโชคลาภ', emoji: '💰' },
    { name: 'พญานกฟีนิกซ์', desc: 'สัญลักษณ์ของการเกิดใหม่ ความสำเร็จ และชัยชนะเหนือปัญหา เหมาะสำหรับผู้ที่ต้องการเริ่มต้นชีวิตใหม่หรือเอาชนะอุปสรรค', emoji: '🔥' },
    { name: 'เลขมงคล 4289 / 6395', desc: 'พลังตัวเลขเรียกทรัพย์ที่ผสานเข้ากับภาพพื้นหลังอย่างลงตัว 4289 หมายถึง "สี่ร่ำรวย สองมั่งมี แปดมาก เก้าก้าวหน้า" เสริมดวงการเงินอย่างทรงพลัง', emoji: '🔢' },
];

export default function WallpapersPage() {
    return (
        <>
            {/* JSON-LD Schemas — using native script tags for zero JS overhead */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* SSR H1 for Googlebot — hidden visually, H1 in ClientPage is visible */}
            <h1 className="sr-only">วอลเปเปอร์มงคล เสริมดวง งาน เงิน รัก บารมี</h1>

            {/* ===== Interactive Client Gallery ===== */}
            <Suspense fallback={
                <div className="w-full max-w-[1400px] px-3 sm:px-4 pt-16 md:pt-32 pb-28 min-h-screen bg-[#050b14] text-slate-200">
                    <div className="max-w-7xl mx-auto space-y-5 md:space-y-8">
                        <div className="flex flex-col gap-3 md:gap-4">
                            <div className="h-9 md:h-12 w-4/5 md:w-3/4 bg-slate-800 rounded-xl animate-pulse" />
                            <div className="h-5 md:h-6 w-2/3 md:w-1/2 bg-slate-800/60 rounded-lg animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-[9/16] bg-slate-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <ClientPage />
            </Suspense>

            {/* ===== SEO Content Sections (Server-Rendered) ===== */}
            <div className="w-full max-w-[1400px] px-3 sm:px-4 pb-28 bg-[#0f172a] text-slate-200">
                <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

                    {/* --- Section 1: Hero Intro --- */}
                    <section className="relative border-t border-white/10 pt-8 md:pt-12">
                        <div className="relative max-w-3xl">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Auspicious Wallpapers</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-5 leading-tight">
                                เปลี่ยนหน้าจอมือถือให้เป็น<span className="text-amber-300">ขุมทรัพย์แห่งความโชคดี</span>
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-5 max-w-[70ch]">
                                ยกระดับพลังบวกให้กับชีวิตทุกครั้งที่เปิดหน้าจอมือถือ! <strong className="text-white">NameMongkol</strong> ขอนำเสนอคอลเลกชัน <strong className="text-amber-300">วอลเปเปอร์มงคล (Auspicious Wallpapers)</strong> ที่ออกแบบอย่างประณีตโดยผสานศาสตร์แห่งสัญลักษณ์มงคล สีมงคลตามวันเกิด และพลังเลขศาสตร์เข้าด้วยกัน เพื่อเป็นเครื่องยึดเหนี่ยวจิตใจและดึงดูดพลังงานดีๆ เข้ามาสู่ตัวคุณในทุกวัน
                            </p>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-[70ch]">
                                เช่นเดียวกับที่เราใส่ใจในการ<Link href="/" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">วิเคราะห์ชื่อมงคลเกรด A+</Link> วอลเปเปอร์ทุกชิ้นถูกสร้างสรรค์ด้วยความละเอียดสูง ผสานพลังจากสีมงคลตามจิตวิทยาสี (Color Psychology) สัญลักษณ์ศักดิ์สิทธิ์ตามตำรา และพลังเลขศาสตร์ เพื่อส่งผลดีที่สุดต่อผู้ใช้งาน
                            </p>
                        </div>
                    </section>

                    {/* --- Section 2: Day-based Collection --- */}
                    <section style={deferredSectionStyle}>
                        <div className="mb-7 md:mb-10 max-w-3xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                เลือก<span className="text-amber-300">วอลเปเปอร์มงคลเสริมดวง</span>ตามวันเกิด
                            </h2>
                            <p className="text-slate-400 max-w-[70ch] leading-relaxed">
                                แต่ละวันเกิดมีสีมงคลและพลังประจำวันที่แตกต่างกัน เลือกวอลเปเปอร์ที่ตรงกับวันเกิดของคุณเพื่อเสริมดวงชะตาอย่างตรงจุด
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {dayCollections.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <article
                                        key={item.day}
                                        className={`group relative border-b border-white/10 pb-4 md:pb-5`}
                                    >
                                        <div className="flex items-center gap-3 mb-2.5">
                                            <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                                <IconComponent className={`w-5 h-5 ${item.textColor}`} />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${item.textColor} text-sm`}>{item.day}</h3>
                                                <p className="text-white font-bold text-base">{item.name}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                        <div className="mt-8">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                ลัดไปหน้าวอลเปเปอร์รายวันยอดนิยม
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/wallpapers/day/monday" className="text-xs bg-slate-700/50 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์มงคลวันจันทร์ ฟรี
                                </Link>
                                <Link href="/wallpapers/day/wednesday" className="text-xs bg-slate-700/50 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์เรียกทรัพย์วันพุธ
                                </Link>
                                <Link href="/wallpapers/day/friday" className="text-xs bg-slate-700/50 hover:bg-cyan-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์เสริมความรักวันศุกร์
                                </Link>
                                <Link href="/wallpapers/day/saturday" className="text-xs bg-slate-700/50 hover:bg-purple-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์บารมีวันเสาร์
                                </Link>
                                <Link href="/wallpapers/intent/finance" className="text-xs bg-slate-700/50 hover:bg-amber-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์เสริมดวงการเงิน
                                </Link>
                                <Link href="/wallpapers/intent/love" className="text-xs bg-slate-700/50 hover:bg-pink-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์เสริมดวงความรัก
                                </Link>
                                <Link href="/wallpapers/intent/work" className="text-xs bg-slate-700/50 hover:bg-blue-500/20 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                    วอลเปเปอร์เสริมดวงการงาน
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* --- Section 3: Special Deity Collection --- */}
                    <section style={deferredSectionStyle}>
                        <div className="mb-7 md:mb-10 max-w-3xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                วอลเปเปอร์<span className="text-purple-300">องค์เทพยอดนิยม</span> เสริมดวงเฉพาะจุด
                            </h2>
                            <p className="text-slate-400 max-w-[70ch] leading-relaxed">
                                นอกจากวอลเปเปอร์ตามวันเกิดแล้ว เรายังมีคอลเลกชันพิเศษจากองค์เทพและสัญลักษณ์ศักดิ์สิทธิ์ เพื่อเสริมดวงชะตาเฉพาะด้าน
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {deityCollections.map((item) => (
                                <article
                                    key={item.name}
                                    className="group border-b border-white/10 pb-4 md:pb-5"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl flex-shrink-0 mt-1">{item.emoji}</span>
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-2">{item.name}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* --- Section 4: Value Proposition --- */}
                    <section className="border-t border-amber-500/20 pt-8 md:pt-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                            ทำไมวอลเปเปอร์มงคลจาก <span className="text-amber-400">NameMongkol</span> ถึงแตกต่าง?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                            <div className="space-y-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-white font-bold text-lg">การออกแบบระดับ A+</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    ทุกภาพถูกสร้างสรรค์ด้วยความละเอียดสูง (High Resolution) สวยงามทันสมัยแบบพรีเมียม ไม่ใช่ภาพสำเร็จรูปทั่วไป แต่ออกแบบขึ้นมาเฉพาะสำหรับ NameMongkol
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-white font-bold text-lg">ศาสตร์มงคลที่ถูกต้อง</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    ผสานพลังจากสีมงคล (Color Psychology) และสัญลักษณ์ศักดิ์สิทธิ์ตามตำรา ไม่ว่าจะเป็นหลักฮวงจุ้ย โหราศาสตร์ไทย หรือศาสตร์เลขมงคลจีน ทุกรายละเอียดถูกตรวจสอบ
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-white font-bold text-lg">พลังเลขศาสตร์หนุนดวง</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    เช่นเดียวกับที่เราวิเคราะห์ <Link href="/search" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">ชื่อมงคลเกรด A+</Link> เราใส่ใจในทุกรายละเอียดของภาพเพื่อให้ส่งผลดีที่สุดต่อผู้ใช้งาน ผ่านพลังตัวเลขมงคล
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* --- Section 5: FAQ --- */}
                    <section style={deferredSectionStyle}>
                        <div className="mb-7 md:mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                                <HelpCircle className="w-7 h-7 text-amber-400" />
                                คำถามที่พบบ่อยเกี่ยวกับวอลเปเปอร์มงคล
                            </h2>
                        </div>
                        <div className="space-y-3 max-w-3xl">
                            <details className="group border-b border-white/10 overflow-hidden" open>
                                <summary className="flex items-center justify-between py-4 cursor-pointer hover:text-amber-200 transition-colors">
                                    <h3 className="font-bold text-white text-base">วอลเปเปอร์มงคลช่วยเรื่องอะไร?</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="pb-5 text-slate-400 text-sm leading-relaxed">
                                    ช่วยเสริมกำลังใจ สร้างโฟกัส และดึงดูดพลังงานบวกผ่านการเห็นสัญลักษณ์มงคลบ่อยๆ ในแต่ละวัน ตามหลักจิตวิทยาสี (Color Psychology) การเห็นสีและภาพมงคลอย่างสม่ำเสมอสามารถส่งผลเชิงบวกต่อจิตใจและการตัดสินใจ เป็นการเสริมดวงชะตาในเชิงจิตวิทยาที่มีประสิทธิภาพ
                                </div>
                            </details>
                            <details className="group border-b border-white/10 overflow-hidden">
                                <summary className="flex items-center justify-between py-4 cursor-pointer hover:text-amber-200 transition-colors">
                                    <h3 className="font-bold text-white text-base">ควรเปลี่ยนวอลเปเปอร์มงคลตอนไหน?</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="pb-5 text-slate-400 text-sm leading-relaxed">
                                    สามารถเปลี่ยนได้ตามเป้าหมายของชีวิตในช่วงนั้น เช่น ต้องการเน้นเรื่องงานหรือเน้นเรื่องความรักเป็นพิเศษ นอกจากนี้ยังสามารถเปลี่ยนตามวันพิเศษต่างๆ เช่น วันขึ้นปีใหม่ วันมงคลตั้งชื่อ วันเปลี่ยนงานใหม่ หรือเมื่อต้องการเริ่มต้นสิ่งใหม่ หลักสำคัญคือเปลี่ยนเมื่อ "จิตพร้อม" และตั้งมั่นในเป้าหมายใหม่
                                </div>
                            </details>
                            <details className="group border-b border-white/10 overflow-hidden">
                                <summary className="flex items-center justify-between py-4 cursor-pointer hover:text-amber-200 transition-colors">
                                    <h3 className="font-bold text-white text-base">มีวอลเปเปอร์สำหรับแก้ชงไหม?</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="pb-5 text-slate-400 text-sm leading-relaxed">
                                    มีครับ เรามีคอลเลกชันพิเศษสำหรับเสริมดวงตามปีนักษัตรเพื่อบรรเทาเคราะห์และเสริมโชค โดยเฉพาะวอลเปเปอร์ท้าวเวสสุวรรณที่ช่วยเรื่องปลดหนี้ ป้องกันภัย และกันสิ่งชั่วร้าย เหมาะสำหรับทุกคนที่ต้องการเสริมความมั่นคงในชีวิต
                                </div>
                            </details>
                            <details className="group border-b border-white/10 overflow-hidden">
                                <summary className="flex items-center justify-between py-4 cursor-pointer hover:text-amber-200 transition-colors">
                                    <h3 className="font-bold text-white text-base">วอลเปเปอร์มงคลต่างจากวอลเปเปอร์ทั่วไปอย่างไร?</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="pb-5 text-slate-400 text-sm leading-relaxed">
                                    วอลเปเปอร์มงคลจาก NameMongkol ถูกออกแบบโดยคำนึงถึงหลักศาสตร์มงคลหลายแขนง ทั้งสีมงคลตามวันเกิด สัญลักษณ์ศักดิ์สิทธิ์ตามหลักฮวงจุ้ย และพลังตัวเลขเลขศาสตร์ ไม่ใช่ภาพสวยอย่างเดียว แต่ทุกองค์ประกอบมีความหมายและเจตนาในการเสริมดวงชะตาอย่างแท้จริง
                                </div>
                            </details>
                        </div>
                    </section>

                    {/* --- Section 6: CTA --- */}
                    <section className="border-t border-white/10 pt-8 md:pt-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <Download className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">เตรียมรับพลังบวกวันนี้!</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            เลือกคอลเลกชันที่คุณต้องการ แล้วเปลี่ยนหน้าจอมือถือ
                        </h2>
                        <p className="text-slate-400 max-w-xl mb-8">
                            ดาวน์โหลดวอลเปเปอร์มงคลเพื่อเปลี่ยนหน้าจอมือถือของคุณให้เป็นขุมทรัพย์แห่งความโชคดี หรือสร้างวอลเปเปอร์ส่วนตัวเฉพาะของคุณเอง
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                            <Link
                                href="/wallpapers"
                                className="justify-center px-6 md:px-8 py-3.5 rounded-xl bg-amber-500 text-black font-bold text-base shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:shadow-amber-500/40 transition-all flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                ดูวอลเปเปอร์ทั้งหมด
                            </Link>
                            <Link
                                href="/wallpapers/custom"
                                className="justify-center px-6 md:px-8 py-3.5 rounded-xl bg-white/10 text-white font-bold text-base border border-white/10 hover:bg-white/15 transition-all flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                ออกแบบวอลเปเปอร์ส่วนตัว
                            </Link>
                        </div>
                    </section>

                    {/* --- Section 7: Internal Links SEO Footer --- */}
                    <section className="border-t border-white/10 pt-8">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">บริการอื่นๆ ของ NameMongkol</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            นอกจากวอลเปเปอร์มงคลแล้ว <strong className="text-slate-300">NameMongkol</strong> ยังมีบริการครบวงจรเกี่ยวกับชื่อมงคลและเลขศาสตร์ ใช้ระบบ AI ผสานศาสตร์โบราณ ครอบคลุม <strong className="text-slate-300">เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6</strong> และ <strong className="text-slate-300">อักษรกาลกิณี</strong>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์ชื่อฟรี
                            </Link>
                            <Link href="/search" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                ค้นหาชื่อมงคล
                            </Link>
                            <Link href="/name-analysis" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                เช็คชื่อมงคลหลายชื่อพร้อมกัน
                            </Link>
                            <Link href="/premium-search" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                ค้นหาชื่อมงคล Premium
                            </Link>
                            <Link href="/premium-analysis" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์ชื่อ Premium
                            </Link>
                            <Link href="/phone-analysis" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                วิเคราะห์เบอร์มงคล
                            </Link>
                            <Link href="/articles" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                บทความชื่อมงคล
                            </Link>
                            <Link href="/reviews" className="text-xs bg-slate-700/50 hover:bg-amber-600/30 px-3 py-1.5 rounded-full text-slate-300 hover:text-white transition-colors">
                                รีวิวจากผู้ใช้งาน
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
