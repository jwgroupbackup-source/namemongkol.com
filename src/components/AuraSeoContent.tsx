import React from 'react';
import Link from 'next/link';
import { Eye, Heart, Palette, Briefcase, Shield, Star, Users, Brain, Award } from 'lucide-react';

export const AuraSeoContent = () => {
    return (
        <section className="w-full max-w-5xl mx-auto mt-20 md:mt-24 mb-12 md:mb-16 px-4 relative z-10">

            {/* ── Hero Block ── */}
            <div className="text-center mb-12 md:mb-16">
                <span className="px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold border border-purple-500/20 mb-6 inline-block">
                    ✨ ศาสตร์แห่งพลังงานชื่อ
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    ค้นพบ
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-500">
                        {' '}ออร่าและตัวตนที่แท้จริง
                    </span>{' '}
                    ซ่อนอยู่ในชื่อของคุณ
                </h2>
                <p className="text-slate-300/80 max-w-3xl mx-auto text-base md:text-lg leading-[1.95]">
                    ชื่อไม่ใช่แค่คำเรียก แต่คือ <strong>&quot;พลังงานสั่นสะเทือน&quot;</strong> ที่กำหนดออร่า
                    บุคลิกภาพ และเส้นทางชีวิตของคุณ ทุกครั้งที่มีคนเรียกชื่อคุณ พลังงานนั้นจะส่งผลต่อ
                    <strong className="text-purple-400"> ตัวตน ความสัมพันธ์ อาชีพ และความสำเร็จ</strong> ในทุกมิติ
                </p>
            </div>

            {/* ── What is Aura Analysis + What AI Analyzes ── */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 md:mb-16">
                <div className="bg-slate-900/60 border border-purple-500/15 backdrop-blur-sm p-6 md:p-7 rounded-2xl hover:border-purple-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <Eye className="w-6 h-6 shrink-0" />
                        วิเคราะห์ออร่าจากชื่อคืออะไร?
                    </h3>
                    <p className="text-slate-300/75 leading-[1.95] mb-4">
                        <strong>การวิเคราะห์ออร่าจากชื่อ</strong> คือกระบวนการถอดรหัสพลังงานที่ซ่อนอยู่ในทุกตัวอักษรของชื่อ
                        โดยใช้หลักการผสมผสานระหว่าง <strong>จิตวิทยา Archetype</strong> ของ Carl Jung,
                        {' '}<strong>ศาสตร์ตัวเลข (Numerology)</strong> และ{' '}
                        <strong>การวิเคราะห์สัทศาสตร์ (Phonetics)</strong>
                    </p>
                    <p className="text-slate-300/75 leading-[1.95]">
                        ระบบ AI ของ NameMongkol จะวิเคราะห์ชื่อของคุณผ่านมิติต่าง ๆ เพื่อสะท้อน
                        <strong className="text-purple-300"> บุคลิกภาพ จุดแข็ง จุดอ่อน</strong> และ
                        <strong className="text-purple-300"> เส้นทางชีวิตที่เหมาะสม</strong> ที่สุดสำหรับคุณ
                    </p>
                </div>

                <div className="bg-slate-900/60 border border-violet-500/15 backdrop-blur-sm p-6 md:p-7 rounded-2xl hover:border-violet-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-violet-400 mb-4 flex items-center gap-2">
                        <Brain className="w-6 h-6 shrink-0" />
                        AI วิเคราะห์อะไรบ้าง?
                    </h3>
                    <p className="text-slate-300/75 leading-[1.95] mb-4">
                        ระบบ <strong>AI Personality &amp; Name Mirroring</strong> ของ NameMongkol
                        วิเคราะห์ชื่อคุณอย่างครบถ้วนใน <strong>7 มิติหลัก</strong>:
                    </p>
                    <ul className="space-y-3">
                        {[
                            { bold: 'Archetype ตัวตน', rest: 'คุณเป็นนักรบ นักปราชญ์ หรือศิลปิน?' },
                            { bold: 'สี Moodboard มงคล', rest: 'สีที่เสริมพลังให้ชื่อคุณ' },
                            { bold: 'อาชีพที่เหมาะสม', rest: 'สายงานที่ชื่อส่งเสริม' },
                            { bold: 'Voice & Tone', rest: 'สไตล์การสื่อสารที่เป็นเอกลักษณ์' },
                            { bold: 'Spirit Animal', rest: 'สัตว์สัญลักษณ์ประจำตัว' },
                        ].map(({ bold, rest }) => (
                            <li key={bold} className="flex items-start gap-2">
                                <span className="text-violet-400 shrink-0 mt-0.5">✦</span>
                                <span className="text-slate-300/75">
                                    <strong>{bold}</strong> — {rest}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── 12 Archetypes ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold border border-indigo-500/20 mb-4 inline-block">
                        🎭 Archetype 12 แบบ
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">ชื่อของคุณเป็น Archetype แบบไหน?</h2>
                    <p className="text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
                        ตามทฤษฎี Archetype ของ <strong>Carl Jung</strong>{' '}
                        มนุษย์ทุกคนมีตัวตนหลัก 1 ใน 12 แบบ ชื่อของคุณจะบ่งบอกว่าคุณมีพลังงานแบบใดเป็นหลัก
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {[
                        { emoji: '⚔️', name: 'The Hero (นักรบ)', cardCls: 'bg-rose-950/20 border-rose-500/15 hover:border-rose-500/35', nameCls: 'text-rose-400', desc: 'กล้าหาญ มุ่งมั่น พิชิตอุปสรรค ไม่ยอมแพ้ง่าย ๆ เป็นแรงบันดาลใจให้คนรอบข้าง' },
                        { emoji: '📚', name: 'The Sage (นักปราชญ์)', cardCls: 'bg-blue-950/20 border-blue-500/15 hover:border-blue-500/35', nameCls: 'text-blue-400', desc: 'รักการเรียนรู้ มีปัญญา ค้นหาความจริงเสมอ เชื่อในพลังของความรู้' },
                        { emoji: '🎨', name: 'The Creator (ผู้สร้างสรรค์)', cardCls: 'bg-amber-950/20 border-amber-500/15 hover:border-amber-500/35', nameCls: 'text-amber-400', desc: 'จินตนาการสูง สร้างสิ่งใหม่ มีวิสัยทัศน์ ชอบแสดงออกทางศิลปะและนวัตกรรม' },
                        { emoji: '👑', name: 'The Ruler (ผู้ปกครอง)', cardCls: 'bg-purple-950/20 border-purple-500/15 hover:border-purple-500/35', nameCls: 'text-purple-400', desc: 'เป็นผู้นำ มีอำนาจบารมี ควบคุมสถานการณ์ได้ สร้างความมั่นคงและระเบียบ' },
                        { emoji: '🤲', name: 'The Caregiver (ผู้ดูแล)', cardCls: 'bg-emerald-950/20 border-emerald-500/15 hover:border-emerald-500/35', nameCls: 'text-emerald-400', desc: 'เมตตา ห่วงใย ชอบช่วยเหลือผู้อื่น ทำให้คนรอบข้างดีขึ้นเสมอ' },
                        { emoji: '🔮', name: 'The Magician (นักมายากล)', cardCls: 'bg-violet-950/20 border-violet-500/15 hover:border-violet-500/35', nameCls: 'text-violet-400', desc: 'เปลี่ยนแปลงโลก สร้างปาฏิหาริย์ มีพลังดึงดูดสูง มองเห็นสิ่งที่คนอื่นมองไม่เห็น' },
                        { emoji: '💝', name: 'The Lover (นักรัก)', cardCls: 'bg-pink-950/20 border-pink-500/15 hover:border-pink-500/35', nameCls: 'text-pink-400', desc: 'ใส่ใจความสัมพันธ์ มีเสน่ห์ดึงดูด รักความงดงาม ชอบสร้างความสุขให้คนรอบข้าง' },
                        { emoji: '🎭', name: 'The Jester (นักสนุก)', cardCls: 'bg-orange-950/20 border-orange-500/15 hover:border-orange-500/35', nameCls: 'text-orange-400', desc: 'มองโลกสดใส สร้างเสียงหัวเราะ มีอารมณ์ขัน ทำให้ทุกอย่างดูเบาลง' },
                        { emoji: '🧭', name: 'The Explorer (นักสำรวจ)', cardCls: 'bg-cyan-950/20 border-cyan-500/15 hover:border-cyan-500/35', nameCls: 'text-cyan-400', desc: 'รักอิสระ ชอบค้นหาสิ่งใหม่ กล้าออกนอกกรอบ ต้องการประสบการณ์ที่หลากหลาย' },
                        { emoji: '🔥', name: 'The Rebel (นักปฏิวัติ)', cardCls: 'bg-red-950/20 border-red-500/15 hover:border-red-500/35', nameCls: 'text-red-400', desc: 'ท้าทายกฎเกณฑ์ กล้าคิดต่าง สร้างการเปลี่ยนแปลง ไม่ยอมตามกระแส' },
                        { emoji: '🕊️', name: 'The Innocent (ผู้บริสุทธิ์)', cardCls: 'bg-sky-950/20 border-sky-500/15 hover:border-sky-500/35', nameCls: 'text-sky-400', desc: 'มองโลกในแง่ดี ซื่อสัตย์ มีความหวังเสมอ เชื่อในความดีและความสุขง่าย ๆ' },
                        { emoji: '🤝', name: 'The Everyman (คนธรรมดา)', cardCls: 'bg-teal-950/20 border-teal-500/15 hover:border-teal-500/35', nameCls: 'text-teal-400', desc: 'เข้ากับทุกคนได้ จริงใจ เป็นตัวของตัวเอง เชื่อในความเท่าเทียมและมิตรภาพ' },
                    ].map((a) => (
                        <div
                            key={a.name}
                            className={`p-5 rounded-xl border transition-colors ${a.cardCls}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{a.emoji}</span>
                                <h3 className={`font-bold ${a.nameCls}`}>{a.name}</h3>
                            </div>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{a.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Benefits ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        วิเคราะห์ออร่าจากชื่อ ช่วยคุณได้อย่างไร?
                    </h2>
                    <p className="text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
                        ผลวิเคราะห์จะช่วยให้คุณเข้าใจตัวเองลึกซึ้งขึ้น และนำไปใช้ในชีวิตจริงได้ทันที
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: <Eye className="w-7 h-7" />, title: '🔮 รู้จักตัวตนที่แท้จริง', desc: 'เข้าใจ Archetype หลักของคุณ จุดแข็ง จุดอ่อน และรูปแบบพฤติกรรมที่ซ่อนอยู่ในชื่อ เพื่อพัฒนาตัวเองอย่างตรงจุด' },
                        { icon: <Palette className="w-7 h-7" />, title: '🎨 ค้นพบสีมงคลประจำตัว', desc: 'รู้ว่าสีไหนเสริมพลังให้ชื่อคุณ นำไปใช้เลือกเสื้อผ้า ตกแต่งห้อง วอลเปเปอร์มือถือ หรือออกแบบโลโก้แบรนด์' },
                        { icon: <Briefcase className="w-7 h-7" />, title: '💼 เลือกอาชีพที่ใช่', desc: 'AI แนะนำอาชีพที่สอดคล้องกับพลังงานในชื่อ ช่วยให้คุณเลือกเส้นทางที่ดึงศักยภาพออกมาได้มากที่สุด' },
                        { icon: <Heart className="w-7 h-7" />, title: '💕 เข้าใจความสัมพันธ์', desc: 'รู้ว่าสไตล์ความรักของคุณเป็นแบบไหน ชอบแบบเปิดเผยหรือเก็บซ่อน มีวิธีดูแลคนรอบข้างอย่างไร' },
                        { icon: <Users className="w-7 h-7" />, title: '👥 เสริมทักษะสื่อสาร', desc: 'ค้นพบ Voice & Tone ที่เป็นเอกลักษณ์ เพิ่มประสิทธิภาพการสื่อสาร การนำเสนอ และ Personal Brand' },
                        { icon: <Shield className="w-7 h-7" />, title: '🛡️ ตั้งชื่อลูก / แบรนด์', desc: 'ใช้ผลวิเคราะห์ประกอบการตั้งชื่อลูก หรือตั้งชื่อแบรนด์ ให้ชื่อส่งพลังงานดี สร้างภาพจำที่แข็งแกร่ง' },
                    ].map((b, i) => (
                        <div key={i} className="bg-slate-900/60 border border-white/5 backdrop-blur-sm p-6 rounded-2xl hover:border-purple-500/20 transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                {b.icon}
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">{b.title}</h3>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── How It Works ── */}
            <div className="bg-slate-900/50 border border-white/5 backdrop-blur-sm rounded-3xl p-7 md:p-8 relative overflow-hidden mb-12 md:mb-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10 text-center relative z-10 leading-tight">
                    ระบบวิเคราะห์ออร่าจากชื่อ ทำงานอย่างไร?
                </h2>
                <div className="grid md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                    {[
                        { n: 1, title: 'กรอกชื่อ', desc: 'ใส่ชื่อที่ต้องการวิเคราะห์ พร้อมเลือกว่าเป็นชื่อตัวเอง ชื่อลูก หรือชื่อแบรนด์' },
                        { n: 2, title: 'AI ประมวลผล', desc: 'ระบบวิเคราะห์พลังงานตัวอักษร ถอดรหัส Archetype สี Voice & Tone และสัตว์สัญลักษณ์' },
                        { n: 3, title: 'ดูผลลัพธ์', desc: 'รับผลวิเคราะห์ครบ 7 มิติ พร้อม Moodboard สีมงคล และคำแนะนำเฉพาะตัว' },
                        { n: 4, title: 'นำไปใช้จริง', desc: 'บันทึกภาพหรือแชร์ผลลัพธ์ได้ทันที นำสีมงคลและคำแนะนำไปใช้ในชีวิตประจำวัน' },
                    ].map((s) => (
                        <div key={s.n} className="bg-slate-800/40 border border-white/5 text-center rounded-2xl p-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-purple-500/25 ring-4 ring-slate-900/60">
                                {s.n}
                            </div>
                            <h3 className="font-bold text-white mb-2">{s.title}</h3>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Use Cases ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-semibold border border-pink-500/20 mb-4 inline-block">
                        🎯 เหมาะกับใคร?
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">วิเคราะห์ออร่าชื่อได้ 3 รูปแบบ</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            emoji: '👤',
                            title: 'วิเคราะห์ชื่อตัวเอง',
                            wrapCls: 'border-sky-500/15 hover:border-sky-500/30',
                            iconCls: 'bg-sky-500/10 border-sky-500/20',
                            titleCls: 'text-sky-400',
                            desc: 'ค้นพบ Archetype บุคลิกภาพ สีมงคล และอาชีพที่เหมาะกับชื่อจริงของคุณ เข้าใจตัวเองลึกซึ้งยิ่งขึ้น',
                        },
                        {
                            emoji: '👶',
                            title: 'ตั้งชื่อลูก',
                            wrapCls: 'border-pink-500/15 hover:border-pink-500/30',
                            iconCls: 'bg-pink-500/10 border-pink-500/20',
                            titleCls: 'text-pink-400',
                            desc: 'ลองกรอกชื่อที่คิดไว้ เพื่อดูว่ามี Archetype แบบไหน สีมงคลอะไร เหมาะกับอนาคตที่คุณหวังให้ลูกหรือไม่',
                        },
                        {
                            emoji: '🏢',
                            title: 'ตั้งชื่อแบรนด์',
                            wrapCls: 'border-amber-500/15 hover:border-amber-500/30',
                            iconCls: 'bg-amber-500/10 border-amber-500/20',
                            titleCls: 'text-amber-400',
                            desc: 'วิเคราะห์ชื่อแบรนด์เพื่อดูว่าสื่อถึง Archetype ไหน สร้างภาพจำแบบไหน และเหมาะกับกลุ่มเป้าหมายหรือไม่',
                        },
                    ].map((u) => (
                        <div key={u.title} className={`bg-slate-900/60 border backdrop-blur-sm p-6 rounded-2xl text-center transition-colors ${u.wrapCls}`}>
                            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${u.iconCls}`}>
                                <span className="text-3xl">{u.emoji}</span>
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${u.titleCls}`}>{u.title}</h3>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{u.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Methodology (EEAT) ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm font-semibold border border-violet-500/20 mb-4 inline-block">
                        🔬 หลักการวิเคราะห์
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">AI ใช้หลักการอะไรในการวิเคราะห์?</h2>
                    <p className="text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
                        การวิเคราะห์ออร่าจากชื่อของ NameMongkol ไม่ใช่การสุ่ม แต่ใช้ทฤษฎีที่ได้รับการยอมรับ
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {[
                        { emoji: '🎭', title: 'Jungian Archetype', desc: 'อิงทฤษฎี 12 Archetype ของ Carl Jung ที่ใช้กันทั่วโลกในด้านจิตวิทยาและการตลาด' },
                        { emoji: '🔢', title: 'Numerology', desc: 'แปลงตัวอักษรเป็นตัวเลข วิเคราะห์ความถี่พลังงานในแต่ละตัวอักษรของชื่อ' },
                        { emoji: '🗣️', title: 'สัทศาสตร์ (Phonetics)', desc: 'วิเคราะห์เสียงของชื่อ ความรู้สึกที่เสียงสร้าง และอิทธิพลทางจิตวิทยาของการออกเสียง' },
                        { emoji: '🤖', title: 'AI Deep Analysis', desc: 'ระบบ AI ผสมผสานทุกศาสตร์ เพื่อสร้างโปรไฟล์บุคลิกภาพที่เฉพาะเจาะจงสำหรับคุณ' },
                    ].map((m) => (
                        <div key={m.title} className="bg-slate-900/60 border border-white/5 backdrop-blur-sm p-5 rounded-2xl text-center">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">{m.emoji}</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">{m.title}</h3>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Comparison Table ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold border border-cyan-500/20 mb-4 inline-block">
                        ⚖️ เปรียบเทียบ
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">NameMongkol vs เว็บวิเคราะห์ออร่าจากชื่ออื่น ๆ</h2>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/40">
                                <th className="text-left py-3 px-4 text-slate-400 font-semibold">ฟีเจอร์</th>
                                <th className="text-center py-3 px-4 text-purple-400 font-bold">NameMongkol</th>
                                <th className="text-center py-3 px-4 text-slate-400 font-semibold">เว็บทั่วไป</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {[
                                ['วิเคราะห์ Archetype ตัวตน', true, false],
                                ['Moodboard สีมงคลประจำตัว', true, false],
                                ['แนะนำอาชีพที่เหมาะ', true, false],
                                ['วิเคราะห์ Voice & Tone', true, false],
                                ['สัตว์สัญลักษณ์ประจำตัว (Spirit Animal)', true, false],
                                ['รองรับชื่อลูก & ชื่อแบรนด์', true, 'เฉพาะชื่อบุคคล'],
                                ['AI วิเคราะห์เชิงลึก', true, false],
                                ['บันทึก & แชร์ผลลัพธ์', true, false],
                            ].map(([feat, nm, other]) => (
                                <tr key={String(feat)} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="py-3 px-4 text-slate-300">{feat as string}</td>
                                    <td className="py-3 px-4 text-center text-emerald-400 font-bold">{nm ? '✅' : '❌'}</td>
                                    <td className="py-3 px-4 text-center text-slate-500">
                                        {typeof other === 'string' ? <span className="text-slate-400">{other}</span> : other ? '✅' : '❌'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── FAQ ── */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 mb-4 inline-block">
                        ❓ คำถามที่พบบ่อย
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        คำถามที่พบบ่อยเกี่ยวกับการวิเคราะห์ออร่าจากชื่อ
                    </h2>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            q: 'วิเคราะห์ออร่าจากชื่อ แม่นยำแค่ไหน?',
                            a: 'ระบบของเราใช้หลักทฤษฎี 12 Archetype ของ Carl Jung ผสมกับ Numerology และสัทศาสตร์ ผ่านการประมวลผลด้วย AI เพื่อให้ผลวิเคราะห์เชิงตีความที่เฉพาะเจาะจง อย่างไรก็ตาม ผลวิเคราะห์เป็นการสะท้อนพลังงานจากชื่อ ควรใช้เป็นแนวทางประกอบการตัดสินใจ',
                        },
                        {
                            q: 'วิเคราะห์ออร่าจากชื่อฟรีไหม?',
                            a: 'ใช่ครับ สามารถวิเคราะห์ได้ฟรีโดยใช้เครดิตในระบบ ผู้ใช้ใหม่จะได้รับเครดิตต้อนรับฟรีเมื่อสมัครสมาชิก และสามารถเติมเครดิตเพิ่มได้เมื่อต้องการ',
                        },
                        {
                            q: 'Archetype คืออะไร?',
                            a: 'Archetype คือแนวคิดทางจิตวิทยาของ Carl Jung ที่แบ่งบุคลิกภาพมนุษย์ออกเป็น 12 แบบหลัก เช่น The Hero (นักรบ), The Sage (นักปราชญ์), The Creator (ผู้สร้างสรรค์) แต่ละคนจะมี Archetype หลักที่กำหนดวิธีคิด วิธีสื่อสาร และเส้นทางชีวิต',
                        },
                        {
                            q: 'สีมงคลจากชื่อ ใช้ยังไง?',
                            a: 'สีมงคลที่ได้จากการวิเคราะห์สามารถนำไปใช้ได้หลายทาง เช่น เลือกเสื้อผ้าสีที่เสริมดวง ใช้เป็นสีวอลเปเปอร์มือถือ ตกแต่งโต๊ะทำงาน หรือใช้เป็นสีหลักของแบรนด์และโลโก้ เพื่อดึงดูดพลังงานที่ดีมาถึงตัวคุณ',
                        },
                        {
                            q: 'วิเคราะห์ชื่อภาษาอังกฤษได้ไหม?',
                            a: 'ได้ครับ ระบบรองรับทั้งชื่อภาษาไทยและภาษาอังกฤษ AI จะวิเคราะห์พลังงานจากตัวอักษร เสียง และความหมายที่แฝงอยู่ในชื่อ',
                        },
                        {
                            q: 'Spirit Animal คืออะไร?',
                            a: 'Spirit Animal (สัตว์สัญลักษณ์ประจำตัว) คือสัตว์ที่สะท้อนพลังงานและบุคลิกภาพของชื่อคุณ เช่น ถ้าชื่อมีพลังงานแบบผู้นำ อาจได้สิงโต ถ้ามีพลังงานแบบปัญญา อาจเป็นนกฮูก',
                        },
                    ].map((faq) => (
                        <div key={faq.q} className="bg-slate-900/60 border border-white/5 backdrop-blur-sm p-5 md:p-6 rounded-2xl">
                            <h3 className="font-bold text-white text-base mb-2">{faq.q}</h3>
                            <p className="text-sm text-slate-300/70 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Internal Links ── */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-white mb-5 text-center">บริการอื่น ๆ ที่คุณอาจสนใจ</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { href: '/', label: '🔮 วิเคราะห์ชื่อมงคล' },
                        { href: '/phone-analysis', label: '📱 วิเคราะห์เบอร์มงคล' },
                        { href: '/palm-analysis', label: '🖐️ วิเคราะห์ลายมือ AI' },
                        { href: '/search', label: '🔍 ค้นหาชื่อมงคล' },
                        { href: '/premium-analysis', label: '✨ ออกแบบชื่อ Premium' },
                        { href: '/articles', label: '📚 บทความ' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 rounded-xl bg-slate-800/60 border border-white/5 text-slate-300 text-sm hover:text-white hover:border-purple-500/30 hover:bg-slate-700/60 transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Trust Indicators ── */}
            <div className="text-center pt-4 border-t border-white/5">
                <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300/70">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400 shrink-0" />
                        <span>วิเคราะห์แล้วกว่า <strong className="text-white">50,000+</strong> ชื่อ</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>คะแนนความพึงพอใจ <strong className="text-white">4.9/5</strong></span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>อิงทฤษฎี <strong className="text-white">Carl Jung</strong> + AI</span>
                    </div>
                </div>
            </div>

        </section>
    );
};
