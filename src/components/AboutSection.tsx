import Link from 'next/link';
import {
    ArrowRight,
    BookOpen,
    Calendar,
    ChevronLeft,
    FileText,
    HeartHandshake,
    Image,
    Layers,
    Lock,
    MessageCircle,
    Phone,
    ScanLine,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';

const services = [
    {
        title: 'วิเคราะห์ชื่อฟรี',
        description: 'ตรวจชื่อ นามสกุล วันเกิด คะแนนรวม พลังเงา และคำแนะนำเบื้องต้น',
        href: '/name-check',
        icon: Search,
    },
    {
        title: 'วิเคราะห์ชื่อจำนวนมาก',
        description: 'เหมาะกับครอบครัว ทีมงาน หรือผู้ที่ต้องการเปรียบเทียบชื่อหลายรายการ',
        href: '/name-analysis',
        icon: Layers,
    },
    {
        title: 'วิเคราะห์เบอร์มงคล',
        description: 'อ่านคู่เลข พลังรวม จุดเด่น จุดที่ควรระวัง และความเหมาะกับเป้าหมายชีวิต',
        href: '/phone-analysis',
        icon: Phone,
    },
    {
        title: 'วิเคราะห์ลายมือ',
        description: 'ใช้ภาพฝ่ามือเพื่ออ่านแนวโน้มเส้นหลัก พร้อมคำแนะนำเชิงภาพรวม',
        href: '/palm-analysis',
        icon: ScanLine,
    },
    {
        title: 'วิเคราะห์ออร่า',
        description: 'อ่านโทนพลังงาน สีออร่า และแนวทางเสริมสมดุลให้เหมาะกับตัวคุณ',
        href: '/aura-analysis',
        icon: Sparkles,
    },
    {
        title: 'วอลเปเปอร์มงคล',
        description: 'รวมวอลเปเปอร์ตามวันเกิด ราศี และเป้าหมาย เช่น งาน เงิน ความรัก',
        href: '/wallpapers',
        icon: Image,
    },
];

const principles = [
    {
        title: 'เลขศาสตร์',
        description: 'พิจารณาค่าตัวอักษร ผลรวมชื่อและนามสกุล เพื่อดูภาพรวมของพลังตัวเลข',
        icon: Star,
    },
    {
        title: 'ทักษาปกรณ์',
        description: 'เทียบวันเกิดกับอักษรกลุ่มเดช ศรี มนตรี และกาลกิณี เพื่อดูความกลมกลืนของชื่อ',
        icon: Calendar,
    },
    {
        title: 'อายตนะ 6',
        description: 'อ่านความสัมพันธ์ของเสียง ตัวอักษร และความรู้สึกที่ชื่อส่งต่อผู้เรียกและผู้ฟัง',
        icon: HeartHandshake,
    },
    {
        title: 'คำอธิบายด้วย AI',
        description: 'ช่วยสรุปผลให้อ่านง่าย เป็นกลาง และเชื่อมโยงข้อมูลหลายมิติให้นำไปตัดสินใจต่อได้',
        icon: ShieldCheck,
    },
];

const trustLinks = [
    { label: 'อ่านบทความความรู้', href: '/articles', icon: BookOpen },
    { label: 'ดูรีวิวจากผู้ใช้', href: '/reviews', icon: MessageCircle },
    { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy', icon: Lock },
    { label: 'เงื่อนไขการใช้งาน', href: '/terms', icon: FileText },
];

export default function AboutSection() {
    return (
        <section className="relative w-full min-h-screen bg-[#f8f8fc] text-[#5a5a82] overflow-hidden pt-24 md:pt-36 pb-20 font-sans">
            <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.05),transparent_35%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_32%)] pointer-events-none" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 space-y-16 md:space-y-24">
                <Link href="/" className="inline-flex items-center gap-2 text-[#5a5a82] hover:text-[#1a1a3e] transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>กลับหน้าแรก</span>
                </Link>

                <header className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div className="space-y-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#ddddf0] bg-white px-3 py-1 text-sm font-medium text-[#1a1a3e] shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            The Science of Naming
                        </div>
                        <div className="space-y-5">
                            <h1 className="text-4xl font-bold tracking-tight leading-tight md:text-6xl text-amber-600">
                                เกี่ยวกับ NameMongkol
                                <span className="block text-2xl md:text-4xl text-amber-500 mt-4">
                                    วิเคราะห์ชื่อมงคลด้วยหลักศาสตร์ไทยและ AI
                                </span>
                            </h1>
                            <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-[#5a5a82]">
                                NameMongkol คือแพลตฟอร์มสำหรับตรวจชื่อ ตั้งชื่อ วิเคราะห์เบอร์ ลายมือ ออร่า และพลังมงคล
                                โดยออกแบบให้ผลลัพธ์อ่านง่าย โปร่งใส และมีลิงก์ให้ตรวจสอบต่อได้ทั้งบทความ รีวิว นโยบายความเป็นส่วนตัว และเงื่อนไขการใช้งาน
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/name-check"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-white hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-md"
                            >
                                วิเคราะห์ชื่อฟรี
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/articles"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ddddf0] bg-white px-6 py-3 font-semibold text-[#1a1a3e] hover:border-amber-300 hover:text-amber-600 transition-all shadow-sm"
                            >
                                อ่านบทความ
                                <BookOpen size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[#ddddf0] bg-white p-5 shadow-sm">
                        {[
                            ['6+', 'บริการหลัก'],
                            ['4', 'หลักวิเคราะห์ชื่อ'],
                            ['24/7', 'ใช้งานออนไลน์'],
                            ['PDPA', 'ให้ความสำคัญกับข้อมูล'],
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-2xl border border-[#ddddf0] bg-slate-50 p-5 text-center transition-colors hover:border-amber-200">
                                <div className="text-3xl font-bold text-amber-500">{value}</div>
                                <div className="mt-2 text-sm text-[#5a5a82] font-medium">{label}</div>
                            </div>
                        ))}
                    </div>
                </header>

                <section className="grid gap-5 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a3e]">เราช่วยอะไรได้บ้าง</h2>
                        <p className="text-[#5a5a82] leading-relaxed">
                            บริการถูกแยกตาม intent ของผู้ใช้ เพื่อให้เลือกเครื่องมือได้ตรงเป้าหมายและค้นต่อจากบทความได้ง่าย
                        </p>
                    </div>
                    <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <Link
                                    href={service.href}
                                    key={service.title}
                                    className="group rounded-2xl border border-[#ddddf0] bg-white p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg shadow-sm"
                                >
                                    <Icon className="mb-4 text-amber-500 group-hover:scale-110 transition-transform" size={28} />
                                    <h3 className="font-bold text-lg text-[#1a1a3e]">{service.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#5a5a82]">{service.description}</p>
                                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                                        ไปที่เครื่องมือ <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-3xl border border-[#ddddf0] bg-white p-6 md:p-10 shadow-sm relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-50 rounded-full blur-3xl" />
                    
                    <div className="max-w-3xl space-y-4 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a3e]">หลักการวิเคราะห์ที่เราใช้</h2>
                        <p className="text-[#5a5a82] leading-relaxed">
                            ผลลัพธ์บนเว็บไซต์เป็นข้อมูลประกอบการตัดสินใจ ไม่ใช่คำยืนยันชะตาชีวิตแบบตายตัว
                            เราจึงแสดงคะแนน เหตุผล และข้อควรพิจารณาให้ผู้ใช้ประเมินต่อได้ด้วยตัวเอง
                        </p>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-4 relative z-10">
                        {principles.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-2xl border border-[#ddddf0] bg-slate-50 p-5 shadow-sm transition-transform hover:-translate-y-1 duration-300 hover:border-emerald-200">
                                    <Icon className="mb-4 text-emerald-500" size={26} />
                                    <h3 className="font-bold text-[#1a1a3e]">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#5a5a82]">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div className="rounded-3xl border border-[#ddddf0] bg-white p-6 md:p-8 shadow-sm hover:border-blue-200 transition-colors">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-5 border border-blue-100">
                            <Users size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1a3e]">เหมาะกับใคร</h2>
                        <ul className="mt-5 space-y-3 text-[#5a5a82]">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                ผู้ปกครองที่ต้องการไอเดียตั้งชื่อลูกพร้อมเหตุผลประกอบ
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                ผู้ที่อยากตรวจชื่อหรือนามสกุลก่อนเปลี่ยนชื่อ
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                เจ้าของธุรกิจ ทีมขาย หรือผู้ใช้ที่ต้องเปรียบเทียบชื่อ/เบอร์หลายรายการ
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                ผู้ที่ต้องการอ่านบทความประกอบก่อนเลือกใช้เครื่องมือ
                            </li>
                        </ul>
                    </div>
                    <div className="rounded-3xl border border-[#ddddf0] bg-white p-6 md:p-8 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1a3e]">ความโปร่งใสและความเป็นส่วนตัว</h2>
                        <p className="mt-4 text-[#5a5a82] leading-relaxed">
                            ข้อมูลที่ผู้ใช้กรอก เช่น ชื่อ วันเกิด เบอร์โทร หรือภาพที่อัปโหลด ถูกใช้เพื่อประมวลผลบริการที่เลือก
                            และอธิบายไว้ในนโยบายความเป็นส่วนตัวอย่างชัดเจน เราแยกหน้ากฎหมายและหน้ารีวิวไว้ให้ตรวจสอบได้ง่าย
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {trustLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        href={link.href}
                                        key={link.href}
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#ddddf0] bg-slate-50 px-4 py-3 text-sm font-semibold text-[#5a5a82] hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-colors shadow-sm"
                                    >
                                        <Icon size={17} className="text-amber-500" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-[#ddddf0] bg-white p-8 md:p-12 text-center shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a3e] relative z-10">เริ่มจากชื่อของคุณได้เลย</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[#5a5a82] leading-relaxed relative z-10">
                        ลองตรวจชื่อฟรีก่อน แล้วค่อยต่อยอดไปยังบทความ วิเคราะห์เชิงลึก หรือบริการที่เหมาะกับเป้าหมายของคุณ
                    </p>
                    <div className="mt-8 relative z-10">
                        <Link
                            href="/name-check"
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-bold text-white hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-lg shadow-amber-500/20"
                        >
                            วิเคราะห์ชื่อมงคลฟรี
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            </div>
        </section>
    );
}
