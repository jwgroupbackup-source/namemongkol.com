import Link from 'next/link';
import { Sparkles, Wand2, Download, ArrowRight } from 'lucide-react';

const benefits = [
    {
        title: 'ตั้งโจทย์ได้ตามเป้าหมาย',
        description: 'เลือกโทนที่เน้นการงาน การเงิน ความรัก หรือโชคลาภให้ตรงช่วงชีวิตของคุณ',
    },
    {
        title: 'ปรับจากข้อมูลเฉพาะบุคคล',
        description: 'ใช้ชื่อ วันเกิด และธีมที่ต้องการ เพื่อสร้างวอลเปเปอร์มงคลส่วนตัวที่ไม่ซ้ำใคร',
    },
    {
        title: 'พร้อมใช้งานบนมือถือทันที',
        description: 'ได้ภาพความคมชัดสูงสำหรับตั้งหน้าจอหลักหรือหน้าจอล็อกในไม่กี่ขั้นตอน',
    },
];

const steps = [
    'กรอกชื่อหรือข้อมูลที่ต้องการให้ระบบตีความพลังงาน',
    'เลือกแนวภาพ สีมงคล และเป้าหมายหลักในช่วงนี้',
    'กดสร้างภาพ และดาวน์โหลดไปตั้งเป็นวอลเปเปอร์ได้ทันที',
];

const faqs = [
    {
        question: 'สร้างวอลเปเปอร์มงคล 2569 ต้องเริ่มจากอะไร?',
        answer:
            'เริ่มจากระบุเป้าหมายที่ต้องการเสริม เช่น การเงินหรือการงาน จากนั้นเลือกสไตล์ภาพและสีมงคลที่ชอบ ระบบจะช่วยสร้างวอลเปเปอร์มงคลส่วนตัวให้เหมาะกับคุณ.',
    },
    {
        question: 'วอลเปเปอร์มงคลส่วนตัวต่างจากวอลเปเปอร์ทั่วไปอย่างไร?',
        answer:
            'วอลเปเปอร์ทั่วไปเป็นภาพที่ทำไว้ล่วงหน้า แต่แบบส่วนตัวจะปรับตามข้อมูลและความตั้งใจของผู้ใช้ ทำให้สื่อความหมายเฉพาะตัวมากกว่า.',
    },
    {
        question: 'ควรเปลี่ยนวอลเปเปอร์บ่อยแค่ไหน?',
        answer:
            'ควรเปลี่ยนเมื่อเป้าหมายชีวิตเปลี่ยน เช่น เริ่มงานใหม่ เปิดโปรเจกต์ใหม่ หรืออยากโฟกัสเรื่องความรักในช่วงเวลาหนึ่ง.',
    },
    {
        question: 'ใช้งานได้ฟรีหรือไม่?',
        answer:
            'มีตัวเลือกให้ใช้งานได้ฟรี และสามารถเลือกฟีเจอร์เพิ่มเติมตามแพ็กเกจที่เหมาะกับความต้องการของคุณ.',
    },
];

const relatedLinks = [
    {
        href: '/wallpapers',
        title: 'รวมวอลเปเปอร์มงคลทั้งหมด',
        description: 'ดูคอลเลกชันภาพมงคลยอดนิยมและธีมที่กำลังมาแรง',
    },
    {
        href: '/wallpapers/day/monday',
        title: 'วอลเปเปอร์ตามวันเกิด',
        description: 'เลือกสีและสัญลักษณ์ที่สอดคล้องกับวันเกิดของคุณ',
    },
    {
        href: '/wallpapers/zodiac',
        title: 'วอลเปเปอร์เสริมดวงตามราศี',
        description: 'โทนภาพและความหมายเฉพาะของแต่ละราศี',
    },
    {
        href: '/wallpapers/intent/finance',
        title: 'วอลเปเปอร์สายการเงิน',
        description: 'โฟกัสด้านโชคลาภ เงินหมุน และความมั่นคงทางการเงิน',
    },
    {
        href: '/name-check',
        title: 'เช็กชื่อมงคลก่อนออกแบบ',
        description: 'วิเคราะห์ชื่อเพื่อช่วยตั้งเจตนาให้ภาพวอลเปเปอร์แม่นยำขึ้น',
    },
];

export default function CustomWallpaperSeoContent() {
    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-14 pt-10 sm:px-6 lg:space-y-10 lg:px-8">
                <div className="rounded-2xl border border-amber-300/20 bg-slate-900/50 p-6 backdrop-blur sm:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        สร้างวอลเปเปอร์มงคล 2569
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                        สร้างวอลเปเปอร์มงคลส่วนตัว ให้ตรงเป้าหมายชีวิตของคุณ
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                        หน้าเครื่องมือนี้ออกแบบสำหรับคนที่อยากสร้างวอลเปเปอร์มงคลแบบเฉพาะบุคคล ทั้งเรื่องการเงิน การงาน ความรัก และพลังใจในปี 2569
                        โดยยังใช้งานง่ายบนมือถือภายในไม่กี่คลิก
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/wallpapers"
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                        >
                            ดูวอลเปเปอร์ยอดนิยม
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/name-check"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-400 hover:text-white"
                        >
                            เช็กชื่อก่อนสร้างภาพ
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {benefits.map((benefit) => (
                        <article
                            key={benefit.title}
                            className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-5"
                        >
                            <h2 className="text-base font-semibold text-white">{benefit.title}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{benefit.description}</p>
                        </article>
                    ))}
                </div>

                <div className="rounded-2xl border border-cyan-300/25 bg-slate-900/50 p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-cyan-200">
                        <Wand2 className="h-4 w-4" />
                        <p className="text-sm font-semibold">วิธีสร้างวอลเปเปอร์มงคลแบบสั้นๆ</p>
                    </div>
                    <ol className="mt-4 space-y-3">
                        {steps.map((step, index) => (
                            <li
                                key={step}
                                className="flex gap-3 rounded-lg border border-slate-700/70 bg-slate-950/40 p-3"
                            >
                                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-xs font-semibold text-cyan-200">
                                    {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed text-slate-200">{step}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                        <Download className="h-4 w-4 text-cyan-200" />
                        เมื่อสร้างเสร็จสามารถดาวน์โหลดและตั้งเป็นวอลเปเปอร์ได้ทันที
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-white">คำถามที่พบบ่อย</h2>
                    <div className="mt-4 space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.question}
                                className="group rounded-lg border border-slate-700/70 bg-slate-950/40 p-4"
                            >
                                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">
                                    {faq.question}
                                </summary>
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>

                <nav className="rounded-2xl border border-amber-300/20 bg-slate-900/50 p-6 sm:p-8" aria-label="ลิงก์แนะนำ">
                    <h2 className="text-xl font-semibold text-white">ลิงก์แนะนำที่เกี่ยวข้อง</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {relatedLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-lg border border-slate-700/80 bg-slate-950/40 p-4 transition hover:border-amber-300/40"
                            >
                                <p className="text-sm font-semibold text-slate-100 group-hover:text-amber-200">{item.title}</p>
                                <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </section>
    );
}