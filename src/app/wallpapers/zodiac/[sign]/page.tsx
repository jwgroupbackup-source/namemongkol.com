import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ClientPage from '../../ClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.namemongkol.com';

const ZODIAC_META: Record<string, { label: string; emoji: string; desc: string; keywords: string[] }> = {
    aries:       { label: 'ราศีเมษ',   emoji: '♈', desc: 'วอลเปเปอร์มงคลราศีเมษ 2569 ผสานพลังพระพิฆเนศกับสัญลักษณ์แกะทองคำ ราศีแห่งความเป็นผู้นำ กล้าตัดสินใจ และจุดเริ่มต้นใหม่ เลขมงคล 36, 639 เสริมดวงโชคลาภและความสำเร็จทุกครั้งที่ปลดล็อกหน้าจอ', keywords: ['วอลเปเปอร์ราศีเมษ', 'เสริมดวงราศีเมษ', 'วอลเปเปอร์มงคลราศีเมษ 2569', 'พระพิฆเนศราศีเมษ', 'เลขมงคลราศีเมษ', 'วอลเปเปอร์เสริมความเป็นผู้นำ', 'แกะทองคำมงคล'] },
    taurus:      { label: 'ราศีพฤษภ',  emoji: '♉', desc: 'วอลเปเปอร์มงคลราศีพฤษภ 2569 ผสานพลังพระแม่ลักษมีกับสัญลักษณ์วัวทองคำ ราศีแห่งความมั่นคง ร่ำรวย และความอดทนสู่ความสำเร็จ เลขมงคลเสริมดวงการเงิน บ้าน และทรัพย์สินมั่นคงยั่งยืน', keywords: ['วอลเปเปอร์ราศีพฤษภ', 'เสริมดวงราศีพฤษภ', 'วอลเปเปอร์มงคลราศีพฤษภ 2569', 'วอลเปเปอร์เสริมความมั่นคง', 'วัวทองคำมงคล', 'พระแม่ลักษมีราศีพฤษภ', 'เลขมงคลราศีพฤษภ'] },
    gemini:      { label: 'ราศีเมถุน',  emoji: '♊', desc: 'วอลเปเปอร์มงคลราศีเมถุน 2569 ผสานพลังพระพุธกับสัญลักษณ์คู่แฝดทองคำ ราศีแห่งทักษะการสื่อสาร ความเฉลียวฉลาด และไหวพริบในการเจรจา เลขมงคลเสริมดวงการค้าขาย การเรียน และความคิดสร้างสรรค์', keywords: ['วอลเปเปอร์ราศีเมถุน', 'เสริมดวงราศีเมถุน', 'วอลเปเปอร์มงคลราศีเมถุน 2569', 'วอลเปเปอร์เสริมการสื่อสาร', 'คู่แฝดมงคล', 'พระพุธราศีเมถุน', 'เลขมงคลราศีเมถุน'] },
    cancer:      { label: 'ราศีกรกฎ',  emoji: '♋', desc: 'วอลเปเปอร์มงคลราศีกรกฎ 2569 ผสานพลังพระจันทร์กับสัญลักษณ์ปูทองคำ ราศีแห่งความรัก ครอบครัว และพลังอันอบอุ่น เลขมงคลเสริมดวงความสัมพันธ์ เมตตา และความเจริญในครอบครัว', keywords: ['วอลเปเปอร์ราศีกรกฎ', 'เสริมดวงราศีกรกฎ', 'วอลเปเปอร์มงคลราศีกรกฎ 2569', 'วอลเปเปอร์เสริมความรัก', 'ปูทองคำมงคล', 'พระจันทร์ราศีกรกฎ', 'เลขมงคลราศีกรกฎ'] },
    leo:         { label: 'ราศีสิงห์',  emoji: '♌', desc: 'วอลเปเปอร์มงคลราศีสิงห์ 2569 ผสานพลังพระอาทิตย์กับสัญลักษณ์สิงโตทองคำ ราศีแห่งบารมี เกียรติยศ และความโดดเด่น เลขมงคลเสริมดวงอำนาจ ความสำเร็จ และการเป็นที่ยอมรับในสังคม', keywords: ['วอลเปเปอร์ราศีสิงห์', 'เสริมดวงราศีสิงห์', 'วอลเปเปอร์มงคลราศีสิงห์ 2569', 'วอลเปเปอร์เสริมบารมี', 'สิงโตทองคำมงคล', 'พระอาทิตย์ราศีสิงห์', 'เลขมงคลราศีสิงห์'] },
    virgo:       { label: 'ราศีกันย์',  emoji: '♍', desc: 'วอลเปเปอร์มงคลราศีกันย์ 2569 ผสานพลังพระแม่สรัสวดีกับสัญลักษณ์หญิงสาวทองคำ ราศีแห่งสติปัญญา ความรอบคอบ และวิจารณญาณ เลขมงคลเสริมดวงการเรียน สุขภาพ และความก้าวหน้าในหน้าที่การงาน', keywords: ['วอลเปเปอร์ราศีกันย์', 'เสริมดวงราศีกันย์', 'วอลเปเปอร์มงคลราศีกันย์ 2569', 'วอลเปเปอร์เสริมสติปัญญา', 'พระแม่สรัสวดีราศีกันย์', 'เลขมงคลราศีกันย์', 'วอลเปเปอร์เสริมสุขภาพ'] },
    libra:       { label: 'ราศีตุลย์',  emoji: '♎', desc: 'วอลเปเปอร์มงคลราศีตุลย์ 2569 ผสานพลังพระศุกร์กับสัญลักษณ์ตาชั่งทองคำ ราศีแห่งความรัก ความสมดุล และเสน่ห์ดึงดูด เลขมงคลเสริมดวงความสัมพันธ์ ความงาม ความสุข และการพบเจอสิ่งดีๆ', keywords: ['วอลเปเปอร์ราศีตุลย์', 'เสริมดวงราศีตุลย์', 'วอลเปเปอร์มงคลราศีตุลย์ 2569', 'วอลเปเปอร์เสริมความรัก', 'ตาชั่งทองคำมงคล', 'พระศุกร์ราศีตุลย์', 'เลขมงคลราศีตุลย์'] },
    scorpio:     { label: 'ราศีพิจิก',  emoji: '♏', desc: 'วอลเปเปอร์มงคลราศีพิจิก 2569 ผสานพลังพระอังคารกับสัญลักษณ์แมงป่องทองคำ ราศีแห่งพลังภายใน ความมุ่งมั่น และความเข้มแข็ง เลขมงคลเสริมดวงความสำเร็จด้านการงาน การลงทุน และการคุ้มครองคนรัก', keywords: ['วอลเปเปอร์ราศีพิจิก', 'เสริมดวงราศีพิจิก', 'วอลเปเปอร์มงคลราศีพิจิก 2569', 'วอลเปเปอร์เสริมพลัง', 'แมงป่องทองคำมงคล', 'พระอังคารราศีพิจิก', 'เลขมงคลราศีพิจิก'] },
    sagittarius: { label: 'ราศีธนู',    emoji: '♐', desc: 'วอลเปเปอร์มงคลราศีธนู 2569 ผสานพลังพระพฤหัสบดีกับสัญลักษณ์คนธนูทองคำ ราศีแห่งโชคลาภ ความอิสระ และการเดินทาง เลขมงคลเสริมดวงโชคดี การท่องเที่ยว การศึกษา และการเปิดรับโอกาสใหม่', keywords: ['วอลเปเปอร์ราศีธนู', 'เสริมดวงราศีธนู', 'วอลเปเปอร์มงคลราศีธนู 2569', 'วอลเปเปอร์เสริมโชคลาภ', 'คนธนูทองคำมงคล', 'พระพฤหัสบดีราศีธนู', 'เลขมงคลราศีธนู'] },
    capricorn:   { label: 'ราศีมังกร',  emoji: '♑', desc: 'วอลเปเปอร์มงคลราศีมังกร 2569 ผสานพลังพระเสาร์กับสัญลักษณ์มังกรทองคำ ราศีแห่งความสำเร็จ อำนาจ และความก้าวหน้าอย่างยั่งยืน เลขมงคลเสริมดวงธุรกิจ อาชีพ และการสร้างมรดกที่ยิ่งใหญ่', keywords: ['วอลเปเปอร์ราศีมังกร', 'เสริมดวงราศีมังกร', 'วอลเปเปอร์มงคลราศีมังกร 2569', 'วอลเปเปอร์เสริมความสำเร็จ', 'มังกรทองคำมงคล', 'พระเสาร์ราศีมังกร', 'เลขมงคลราศีมังกร'] },
    aquarius:    { label: 'ราศีกุมภ์',  emoji: '♒', desc: 'วอลเปเปอร์มงคลราศีกุมภ์ 2569 ผสานพลังพระยูเรนัสกับสัญลักษณ์ผู้แบกคนโทน้ำทองคำ ราศีแห่งความคิดสร้างสรรค์ นวัตกรรม และความเป็นปัจเจก เลขมงคลเสริมดวงเทคโนโลยี ความฝัน และการเปลี่ยนแปลงสังคม', keywords: ['วอลเปเปอร์ราศีกุมภ์', 'เสริมดวงราศีกุมภ์', 'วอลเปเปอร์มงคลราศีกุมภ์ 2569', 'วอลเปเปอร์เสริมความคิดสร้างสรรค์', 'คนโทน้ำทองคำมงคล', 'พระยูเรนัสราศีกุมภ์', 'เลขมงคลราศีกุมภ์'] },
    pisces:      { label: 'ราศีมีน',    emoji: '♓', desc: 'วอลเปเปอร์มงคลราศีมีน 2569 ผสานพลังพระโพสิดอนกับสัญลักษณ์ปลาคู่ทองคำ ราศีแห่งญาณทิพย์ พลังจิตวิญญาณ และเมตตาบารมี เลขมงคลเสริมดวงความสุขสงบ การบำบัดจิตใจ และการดึงดูดพลังงานบวกจากจักรวาล', keywords: ['วอลเปเปอร์ราศีมีน', 'เสริมดวงราศีมีน', 'วอลเปเปอร์มงคลราศีมีน 2569', 'วอลเปเปอร์เสริมจิตวิญญาณ', 'ปลาคู่ทองคำมงคล', 'พระโพสิดอนราศีมีน', 'เลขมงคลราศีมีน'] },
};

const VALID_SIGNS = Object.keys(ZODIAC_META);

type Props = { params: Promise<{ sign: string }> };

export async function generateStaticParams() {
    return VALID_SIGNS.map((sign) => ({ sign }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sign } = await params;
    const meta = ZODIAC_META[sign];
    if (!meta) return {};

    const title = `วอลเปเปอร์มงคล${meta.label} ${meta.emoji} 2569 เสริมดวง | NameMongkol`;
    return {
        title,
        description: meta.desc,
        keywords: [...meta.keywords, 'วอลเปเปอร์มงคล', 'วอลเปเปอร์ราศี', 'NameMongkol'],
        openGraph: {
            title,
            description: meta.desc,
            url: `${siteUrl}/wallpapers/zodiac/${sign}`,
            siteName: 'NameMongkol',
            locale: 'th_TH',
            type: 'website',
            images: [`${siteUrl}/api/og?variant=default&title=${encodeURIComponent(`วอลเปเปอร์${meta.label}`)}&subtitle=${encodeURIComponent(meta.desc.slice(0, 50))}&tag=Wallpapers`],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: meta.desc,
        },
        alternates: {
            canonical: `${siteUrl}/wallpapers/zodiac/${sign}`,
        },
    };
}

export default async function ZodiacWallpapersPage({ params }: Props) {
    const { sign } = await params;
    if (!VALID_SIGNS.includes(sign)) notFound();

    const meta = ZODIAC_META[sign];

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'วอลเปเปอร์มงคล', item: `${siteUrl}/wallpapers` },
            { '@type': 'ListItem', position: 3, name: `วอลเปเปอร์ตามราศี`, item: `${siteUrl}/wallpapers/zodiac` },
            { '@type': 'ListItem', position: 4, name: `${meta.label}`, item: `${siteUrl}/wallpapers/zodiac/${sign}` },
        ],
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `วอลเปเปอร์มงคล${meta.label}ช่วยเสริมด้านไหน?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `วอลเปเปอร์มงคล${meta.label}ช่วยเสริมพลังตามคาแรกเตอร์ของราศี เช่น จุดแข็งด้านงาน การเงิน ความรัก หรือการตัดสินใจ โดยใช้สีและสัญลักษณ์ที่สอดคล้องกับราศี`,
                },
            },
            {
                '@type': 'Question',
                name: `ควรตั้งวอลเปเปอร์ราศีเมื่อไรถึงจะเห็นผล?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ควรตั้งเป็นหน้าจอล็อกหรือหน้าจอหลักที่เห็นทุกวัน และใช้ต่อเนื่องอย่างน้อย 2-4 สัปดาห์ร่วมกับการตั้งเป้าหมายชัดเจนเพื่อเพิ่มผลลัพธ์เชิงพฤติกรรม',
                },
            },
        ],
    };

    return (
        <>
            <h1 className="sr-only">{`วอลเปเปอร์มงคล${meta.label} ฟรี 2569 เสริมดวงตามราศี`}</h1>
            <Script
                id={`wallpapers-zodiac-${sign}-breadcrumb`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <Script
                id={`wallpapers-zodiac-${sign}-faq`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Suspense>
                <ClientPage initialCategory="zodiac" initialZodiac={sign} initialTab="collection" />
            </Suspense>
            <section className="w-full bg-[#050b14] text-slate-200 px-4 pb-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {`วอลเปเปอร์มงคล${meta.label} 2569 เสริมดวงตามราศี`}
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        {`สำหรับผู้ที่ต้องการวอลเปเปอร์มงคลตามราศีแบบเฉพาะเจาะจง หน้านี้รวบรวมดีไซน์ที่เชื่อมโยงกับพลังเด่นของ${meta.label} เพื่อใช้เสริมโฟกัสในเรื่องที่ต้องการผลักดันในปี 2569`}
                    </p>
                    <div className="border-t border-slate-800/50 pt-5">
                        <h3 className="text-sm font-semibold text-slate-300 mb-3">เจาะจงเสริมดวงเฉพาะด้าน:</h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/wallpapers/intent/finance" className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-300 hover:text-emerald-200 transition-colors">💰 เสริมการเงิน ค้าขาย โชคลาภ</Link>
                            <Link href="/wallpapers/intent/work" className="text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-300 hover:text-amber-200 transition-colors">📈 เสริมการงาน เลื่อนตำแหน่ง</Link>
                            <Link href="/wallpapers/intent/love" className="text-xs bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-3 py-1.5 rounded-full text-pink-300 hover:text-pink-200 transition-colors">💖 เสริมความรัก เสน่ห์ เมตตา</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
