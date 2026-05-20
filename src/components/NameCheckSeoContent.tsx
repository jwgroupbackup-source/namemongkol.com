import Link from 'next/link';

const faqItems = [
    {
        question: 'วิเคราะห์ชื่อ นามสกุล ฟรี ต้องสมัครสมาชิกไหม?',
        answer:
            'เพียงสมัครสมาชิกและเข้าสู่ระบบ จากนั้นกรอกชื่อ นามสกุล และวันเกิด ระบบจะคำนวณผลรวมเลขศาสตร์ ตรวจอักษรกาลกิณี และวิเคราะห์ความสมพงศ์ของชื่อกับนามสกุลให้ทันที',
    },
    {
        question: 'วิเคราะห์ชื่อ แล้วได้ข้อมูลอะไรบ้าง?',
        answer:
            'คุณจะเห็นผลรวมเลขศาสตร์ เกรดชื่อ คำทำนายพลังชื่อ วิเคราะห์ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ และคู่เลขที่ต้องระวังในชื่อกับนามสกุล',
    },
    {
        question: 'ทำไมต้องวิเคราะห์ทั้งชื่อและนามสกุล?',
        answer:
            'เพราะผลรวมเลขศาสตร์ที่มีผลจริงคำนวณจากชื่อและนามสกุลรวมกัน อีกทั้งนิรันดร์ศาสตร์ยังใช้ดูว่าทั้งสองส่วนส่งเสริมกันหรือขัดกัน',
    },
    {
        question: 'ถ้าผลวิเคราะห์ยังไม่ดี ควรทำอะไรต่อ?',
        answer:
            'ถ้าต้องการหาชื่อใหม่สามารถไปที่หน้าค้นหาชื่อมงคล หรือถ้าต้องการเจาะลึกให้เหมาะกับวันเวลาเกิดมากขึ้น สามารถใช้บริการวิเคราะห์ชื่อมงคลขั้นสูงได้ต่อทันที',
    },
];

export function NameCheckSeoContent() {
    return (
        <section className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-16 md:pb-24">
            <div className="rounded-[2rem] border border-white/8 bg-slate-950/45 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(5,8,20,0.28)]">
                <div className="max-w-3xl">
                    <p className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                        วิเคราะห์ชื่อ
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        วิเคราะห์ชื่อ คืออะไร และทำไมคนค้นหาชื่อนี้ถึงต้องเช็กทั้งชื่อกับนามสกุลพร้อมกัน
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                        การวิเคราะห์ชื่อที่แม่นขึ้นไม่ได้ดูแค่ชื่อจริงอย่างเดียว แต่ต้องดูผลรวมเลขศาสตร์ของชื่อและนามสกุล,
                        อักษรกาลกิณีตามวันเกิด, พลังพื้นดวงจากอายตนะ 6 และความสมพงศ์ระหว่างชื่อกับนามสกุลในนิรันดร์ศาสตร์
                        หน้านี้จึงถูกออกแบบมาเพื่อคนที่ต้องการรู้ผลทันทีว่าชื่อปัจจุบันส่งเสริมหรือฉุดพลังชีวิตด้านงาน เงิน ความรัก และภาพลักษณ์หรือไม่
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-6">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            วิธีวิเคราะห์ชื่อ ด้วย 4 ศาสตร์ที่ใช้ใน NameMongkol
                        </h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-amber-400/15 bg-black/15 p-5">
                                <h3 className="font-semibold text-amber-300">เลขศาสตร์</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    แปลงตัวอักษรเป็นตัวเลขเพื่อดูผลรวมหลักของชื่อและนามสกุลว่าอยู่ในกลุ่มเลขส่งเสริมหรือเลขที่ต้องระวัง
                                </p>
                            </div>
                            <div className="rounded-2xl border border-emerald-400/15 bg-black/15 p-5">
                                <h3 className="font-semibold text-emerald-300">ทักษาปกรณ์</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    ตรวจอักษรเดช ศรี มนตรี และกาลกิณีตามวันเกิด เพื่อดูว่าตัวอักษรในชื่อช่วยหนุนหรือสร้างแรงต้าน
                                </p>
                            </div>
                            <div className="rounded-2xl border border-rose-400/15 bg-black/15 p-5">
                                <h3 className="font-semibold text-rose-300">อายตนะ 6</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    ใช้วัดภาพลักษณ์และการยอมรับจากคนรอบตัวว่าชื่อนี้เปิดโอกาสด้านสังคม การงาน และความน่าเชื่อถือมากแค่ไหน
                                </p>
                            </div>
                            <div className="rounded-2xl border border-blue-400/15 bg-black/15 p-5">
                                <h3 className="font-semibold text-blue-300">นิรันดร์ศาสตร์</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    ตรวจความสัมพันธ์ระหว่างชื่อกับนามสกุล เพื่อดูว่าทั้งสองส่วนทำงานร่วมกันในทางเสริมหรือหักล้างกัน
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/8 bg-white/5 p-6">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            ผลที่ได้จากการวิเคราะห์ชื่อ บนหน้านี้
                        </h2>
                        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                            <li>รู้เกรดชื่อและผลรวมเลขศาสตร์ของชื่อกับนามสกุลทันที</li>
                            <li>เห็นจุดเด่น จุดเสี่ยง และตัวอักษรที่กระทบพลังชื่อ</li>
                            <li>เช็กได้ว่าชื่อกับนามสกุลส่งเสริมกันจริงหรือไม่</li>
                            <li>ใช้ผลลัพธ์ต่อยอดไปหาชื่อใหม่หรืออัปเกรดเป็นการวิเคราะห์แบบลึกได้</li>
                        </ul>

                        <div className="mt-6 space-y-3 text-sm">
                            <Link href="/search" className="block rounded-2xl border border-amber-400/15 bg-amber-400/5 px-4 py-3 text-amber-200 transition-colors hover:bg-amber-400/10">
                                ค้นหาชื่อมงคลใหม่ หากต้องการเริ่มจากรายชื่อแนะนำ
                            </Link>
                            <Link href="/premium-analysis" className="block rounded-2xl border border-purple-400/15 bg-purple-400/5 px-4 py-3 text-purple-200 transition-colors hover:bg-purple-400/10">
                                วิเคราะห์ชื่อมงคลขั้นสูง หากต้องการเจาะลึกตามวันและเวลาเกิด
                            </Link>
                            <Link href="/name-analysis" className="block rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-3 text-cyan-200 transition-colors hover:bg-cyan-400/10">
                                เช็กหลายชื่อพร้อมกัน หากต้องการคัดชื่อจำนวนมากในครั้งเดียว
                            </Link>
                        </div>
                    </div>
                </div>

                <div id="name-check-faq" className="mt-10">
                    <h2 className="text-xl font-bold text-white sm:text-2xl">คำถามที่พบบ่อยเกี่ยวกับการวิเคราะห์ชื่อ</h2>
                    <div className="mt-5 grid gap-4">
                        {faqItems.map((item) => (
                            <div key={item.question} className="rounded-2xl border border-white/8 bg-black/15 p-5">
                                <h3 className="font-semibold text-white">{item.question}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
