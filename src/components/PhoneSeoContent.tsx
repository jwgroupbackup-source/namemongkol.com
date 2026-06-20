import React from 'react';
import Link from 'next/link';
import { Zap, Heart, Shield, Star, Sparkles, Target, Award, Banknote, Users, AlertTriangle } from 'lucide-react';

export const PhoneSeoContent = () => {
    return (
        <section className="w-full max-w-5xl mx-auto mt-12 md:mt-24 mb-12 md:mb-16 px-4 relative z-10">
            {/* Hero Content Section */}
            <div className="text-center mb-10 md:mb-16">
                <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold border border-amber-200 mb-6 inline-block">
                    🔢 ศาสตร์แห่งตัวเลข
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-[#1a1a3e] mb-5 md:mb-6 leading-tight">
                    ปลดล็อกพลังซ่อนเร้นใน<span className="text-amber-500">เบอร์โทรศัพท์</span>ของคุณ
                </h2>
                <p className="text-[#5a5a82] max-w-3xl mx-auto text-sm md:text-lg leading-[1.8] md:leading-[1.95]">
                    คุณทราบหรือไม่? ตัวเลขที่คุณใช้โทรทุกวัน กำลังส่งพลังงานสั่นสะเทือนมาถึงคุณตลอดเวลา
                    เบอร์โทรศัพท์ไม่ใช่แค่ตัวเลขสุ่ม แต่คือ <strong>&quot;คลื่นพลังงาน&quot;</strong> ที่มีผลต่อ
                    <strong className="text-amber-700"> ความสำเร็จ การเงิน ความรัก และสุขภาพ</strong> ของคุณโดยตรง!
                </p>
            </div>

            {/* Why Phone Number Matters */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16 text-[#5a5a82]">
                <div className="bg-white p-5 md:p-7 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-colors">
                    <h3 className="text-xl md:text-2xl font-bold text-amber-600 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6" />
                        ทำไมต้องเช็คเบอร์มงคล?
                    </h3>
                    <p className="text-sm md:text-base leading-[1.8] md:leading-[1.95] mb-4">
                        ตามหลัก <strong>เลขศาสตร์</strong> และ <strong>โหราศาสตร์ไทย</strong> ตัวเลขแต่ละตัวมีความถี่พลังงานเฉพาะตัว
                        เบอร์โทรศัพท์ที่คุณใช้ทุกวัน จะส่งคลื่นพลังงานมากระทบชีวิตคุณตลอดเวลา ไม่ว่าจะรู้ตัวหรือไม่ก็ตาม
                    </p>
                    <p className="text-sm md:text-base leading-[1.8] md:leading-[1.95]">
                        <strong>เบอร์มงคล</strong> จะช่วยดึงดูดโอกาสดีๆ ความเจริญก้าวหน้า และความราบรื่นเข้ามา
                        ในขณะที่ <strong className="text-rose-400">เบอร์อัปมงคล</strong> อาจเป็นอุปสรรคขัดขวางที่มองไม่เห็น
                        ทำให้ต้องเหนื่อยมากกว่าปกติ หรือพลาดโอกาสดีๆ ไปอย่างน่าเสียดาย
                    </p>
                </div>

                <div className="bg-white p-6 md:p-7 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-emerald-300 transition-colors">
                    <h3 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        วิเคราะห์เบอร์ลึกถึงแก่นแท้
                    </h3>
                    <p className="leading-[1.95] mb-4">
                        ระบบของ <strong>NameMongkol</strong> ไม่ได้แค่ดูผลรวม แต่วิเคราะห์ลึกถึง <strong>คู่เลข 7 ตัวหลัง</strong>
                        (XX-XYZ-ABCD) ซึ่งเป็นหัวใจสำคัญของเบอร์โทรศัพท์ไทย
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>วิเคราะห์ <strong>คู่เลข</strong> ทั้งหมดและความหมาย</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>ประเมิน <strong>ผลรวม</strong> ตามหลักเลขศาสตร์</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>แสดง <strong>กราฟพลังงาน</strong> 6 ด้านของชีวิต</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>ให้ <strong>เกรดเบอร์</strong> ตั้งแต่ A (ดีเยี่ยม) ถึง F (อัปมงคล)</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Number Pair Meanings */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold border border-blue-200 mb-4 inline-block">
                        📚 ความรู้เรื่องคู่เลข
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">คู่เลขมงคล vs คู่เลขอัปมงคล</h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        เรียนรู้ความหมายของคู่เลขสำคัญ เพื่อเข้าใจพลังงานที่ซ่อนอยู่ในเบอร์โทรศัพท์ของคุณ
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {/* Good Number Pairs */}
                    <div className="p-5 rounded-xl bg-white shadow-sm border border-emerald-100 hover:border-emerald-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-50 flex flex-col items-center justify-center">
                                <span className="text-emerald-600 text-xl font-bold">91</span>
                                <span className="text-emerald-600/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-700">ผู้นำวิสัยทัศน์</h3>
                                <p className="text-xs text-[#5a5a82]">ชื่อเสียง, ความก้าวหน้า</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">ทะเยอทะยาน มุ่งมั่นสูง รักความก้าวหน้า เรียนรู้เร็ว เป็นผู้นำที่ทันสมัย ประสบความสำเร็จไว มีวิสัยทัศน์ไกล เก่งเรื่องเทคโนโลยีและต่างประเทศ</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">ชื่อเสียง</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">ความก้าวหน้า</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-emerald-100 hover:border-emerald-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-50 flex flex-col items-center justify-center">
                                <span className="text-emerald-600 text-xl font-bold">24</span>
                                <span className="text-emerald-600/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-700">เมตตามหานิยม ขุมทรัพย์</h3>
                                <p className="text-xs text-[#5a5a82]">การค้าขาย, วาทศิลป์</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">เลขแห่งความรักและความรวย พูดจาเป็นเงินเป็นทอง ผู้คนรักใคร่ เมตตา ค้าขายดีกำไรงาม ชีวิตสมบูรณ์พูนสุข</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">ความรัก</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">การเงินดีเยี่ยม</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-emerald-100 hover:border-emerald-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-emerald-50 flex flex-col items-center justify-center">
                                <span className="text-emerald-600 text-xl font-bold">65</span>
                                <span className="text-emerald-600/70 text-[10px]">มงคล</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-700">คู่ทรัพย์คู่โชค</h3>
                                <p className="text-xs text-[#5a5a82]">รวยและฉลาด</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">เลขมหาเศรษฐี หาเงินเก่งด้วยปัญญา บริหารเงินดี ชีวิตสุขสบาย ความรักสมหวัง มีผู้อุปถัมภ์ไม่ขาด</p>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">มหาเศรษฐี</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">โอกาสดีๆ</span>
                        </div>
                    </div>

                    {/* Bad Number Pairs */}
                    <div className="p-5 rounded-xl bg-white shadow-sm border border-rose-100 hover:border-rose-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-50 flex flex-col items-center justify-center">
                                <span className="text-rose-600 text-xl font-bold">13</span>
                                <span className="text-rose-600/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-700">อุบัติเหตุ ผ่าตัด</h3>
                                <p className="text-xs text-[#5a5a82]">⚠️ เลขแห่งเคราะห์กรรม</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">ชีวิตมักมีเหตุให้เจ็บตัวหรือสูญเสีย ใจร้อน พูดจาโผงผาง คิดมึนทำปั๊บ ชีวิตพลิกผันรวดเร็วทั้งดีและร้าย</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-700">
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">อุบัติเหตุ</span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">การผ่าตัด</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-rose-100 hover:border-rose-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-50 flex flex-col items-center justify-center">
                                <span className="text-rose-600 text-xl font-bold">67</span>
                                <span className="text-rose-600/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-700">รักร้าว หนี้สิน ทุกข์ระทม</h3>
                                <p className="text-xs text-[#5a5a82]">⚠️ ศัตรูการเงิน</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">ผิดหวังความรัก ครอบครัวแตกแยก การเงินติดขัด เป็นหนี้สินง่าย ภายนอกดูดีแต่ภายในสัตกหุ่ม</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-700">
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">บ้านแตก</span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">เงินล้มเหลว</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-rose-100 hover:border-rose-300 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-14 h-14 rounded-lg bg-rose-50 flex flex-col items-center justify-center">
                                <span className="text-rose-600 text-xl font-bold">18</span>
                                <span className="text-rose-600/70 text-[10px]">ระวัง</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-rose-700">ถูกหักหลัง คดีความ</h3>
                                <p className="text-xs text-[#5a5a82]">⚠️ คนใกล้ตัวทรยศ</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5a5a82] mb-2">ใจปักเลง เผด็จการ ยอมหักไม่ยอมงอ มักคิดการใหญ่แต่ถูกคนใกล้ตัวทรยศ ชีวิตวุ่นวาย มีคดีความ หรือถูกโกง</p>
                        <div className="flex items-center gap-1.5 text-xs text-rose-700">
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">ถูกโกง</span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">เพื่อนทรยศ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pair Classification Types — AEO keyword target */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold border border-purple-200 mb-4 inline-block">
                        🔮 หลักโหราศาสตร์
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">หลักการจำแนกคู่เลข 4 ประเภท</h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        ตามหลักเลขศาสตร์ไทยที่อิงโหราศาสตร์ (ดาวพระเคราะห์ 9 ดวง) คู่เลขแบ่งออกเป็น 4 ประเภทหลัก
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                    <div className="p-5 rounded-xl bg-white shadow-sm border border-emerald-200">
                        <h3 className="font-bold text-emerald-600 text-lg mb-2">🤝 คู่มิตร (เกื้อกูล)</h3>
                        <p className="text-sm text-[#5a5a82] mb-3 leading-relaxed">
                            เลขที่ส่งเสริมซึ่งกันและกัน ดึงดูดโชคลาภ ความรัก การค้าขาย ตามหลัก &quot;อาทิตย์เป็นมิตรกับครู จันทร์โฉมตรูพุธนงเยาว์&quot;
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['15/51','24/42','36/63','78/87'].map(p => (
                                <span key={p} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">{p}</span>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-blue-200">
                        <h3 className="font-bold text-blue-600 text-lg mb-2">⚡ คู่สมพล (เสริมพลัง)</h3>
                        <p className="text-sm text-[#5a5a82] mb-3 leading-relaxed">
                            เลขที่เพิ่มพลังอำนาจ บารมี ความสามารถ และความสำเร็จ ช่วยให้ดวงมีกำลังมากขึ้น
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['16/61','28/82','35/53','49/94'].map(p => (
                                <span key={p} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">{p}</span>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-amber-200">
                        <h3 className="font-bold text-amber-600 text-lg mb-2">🌀 คู่ธาตุ (มั่นคง)</h3>
                        <p className="text-sm text-[#5a5a82] mb-3 leading-relaxed">
                            เลขคู่ธาตุที่ส่งเสริมความมั่นคง ยั่งยืน มีชื่อเสียง แบ่งตามธาตุ 4: ไฟ ดิน ลม น้ำ
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[{p:'17/71',e:'ไฟ'},{p:'28/82',e:'ดิน'},{p:'39/93',e:'ลม'},{p:'46/64',e:'น้ำ'}].map(d => (
                                <span key={d.p} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">{d.p} <span className="text-amber-500/80">({d.e})</span></span>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-white shadow-sm border border-rose-200">
                        <h3 className="font-bold text-rose-600 text-lg mb-2">⚔️ คู่ศัตรู (ขัดแย้ง)</h3>
                        <p className="text-sm text-[#5a5a82] mb-3 leading-relaxed">
                            เลขที่ส่งผลลบ ก่อให้เกิดอุปสรรค ทะเลาะวิวาท คดีความ ควรหลีกเลี่ยงในเบอร์โทรศัพท์
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['13/31','48/84','67/76','25/52'].map(p => (
                                <span key={p} className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">{p}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">
                        เบอร์มงคลช่วยเสริมดวงด้านไหนบ้าง?
                    </h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        เบอร์โทรศัพท์ที่ดีจะส่งพลังงานบวกให้กับชีวิตคุณใน 6 ด้านสำคัญ
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Banknote className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">💰 การเงิน/การงาน</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            ดึงดูดโอกาสทางการเงิน เลื่อนตำแหน่ง ธุรกิจเจริญรุ่งเรือง การค้าขายราบรื่น มีรายได้เข้ามาสม่ำเสมอ
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Star className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">🍀 โชคลาภ</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            เพิ่มโอกาสในการได้รับโชค ลาภลอย สิ่งดีๆ เข้ามาโดยไม่คาดคิด มีคนอุปถัมภ์ช่วยเหลือ
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">💕 เสน่ห์/ความรัก</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            เพิ่มเสน่ห์ดึงดูด เนื้อคู่เข้ามาหา ความรักราบรื่น ครอบครัวอบอุ่น มนุษยสัมพันธ์ดี
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">🏥 สุขภาพ</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            เสริมพลังด้านสุขภาพ ลดความเสี่ยงจากอุบัติเหตุ ความเจ็บป่วย ร่างกายแข็งแรง
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">🧠 สติปัญญา</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            เพิ่มความคิดสร้างสรรค์ การตัดสินใจแม่นยำ เรียนรู้เร็ว ความจำดี
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-[#1a1a3e] mb-2">👁️ เซนส์/สัมผัสที่ 6</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">
                            เสริมสัญชาตญาณ หลีกเลี่ยงอันตราย มองคนออก ตัดสินใจได้ถูกต้อง
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#ddddf0] shadow-sm relative overflow-hidden mb-12 md:mb-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl" />

                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a3e] mb-8 md:mb-10 text-center relative z-10 leading-tight">
                    ระบบวิเคราะห์เบอร์มงคลของเราทำงานอย่างไร?
                </h2>

                <div className="grid md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                    {/* Timeline connector (desktop only) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 z-0" />

                    <div className="bg-slate-50 text-center rounded-2xl p-5 relative border border-[#ddddf0]">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md relative z-10 ring-4 ring-white">1</div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">กรอกเบอร์</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">ใส่เบอร์โทรศัพท์ 10 หลักที่ต้องการวิเคราะห์</p>
                    </div>

                    <div className="bg-slate-50 text-center rounded-2xl p-5 relative border border-[#ddddf0]">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md relative z-10 ring-4 ring-white">2</div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">AI ประมวลผล</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">ระบบวิเคราะห์คู่เลข ผลรวม และพลังงานทุกด้าน</p>
                    </div>

                    <div className="bg-slate-50 text-center rounded-2xl p-5 relative border border-[#ddddf0]">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md relative z-10 ring-4 ring-white">3</div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">ดูผลลัพธ์</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">รับเกรดเบอร์ กราฟพลังงาน และความหมายคู่เลข</p>
                    </div>

                    <div className="bg-slate-50 text-center rounded-2xl p-5 relative border border-[#ddddf0]">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md relative z-10 ring-4 ring-white">4</div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">ตัดสินใจ</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">เก็บเบอร์ดี หรือเปลี่ยนเบอร์ใหม่ที่มงคลกว่า</p>
                    </div>
                </div>
            </div>

            {/* Warning Section */}
            <div className="bg-rose-50 border border-rose-200 shadow-sm rounded-2xl p-6 md:p-7 mb-16 md:mb-20">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-rose-700 mb-2">⚠️ อย่าปล่อยให้เลขร้ายทำลายโอกาสของคุณ!</h3>
                        <p className="leading-[1.9] mb-4 text-[#5a5a82]">
                            หลายคนใช้เบอร์โทรศัพท์ที่มีพลังงานลบมานานหลายปีโดยไม่รู้ตัว ทำให้เหนื่อยเปล่า พลาดโอกาส
                            หรือมีอุปสรรคติดขัดตลอด การเปลี่ยนเบอร์เป็นเบอร์มงคลอาจเป็นจุดเปลี่ยนชีวิตที่คุณรอคอย!
                        </p>
                        <p className="text-amber-700 font-semibold">
                            💡 ลองวิเคราะห์เบอร์ของคุณวันนี้ เพื่อค้นพบว่าเบอร์ที่ใช้อยู่ส่งผลดีหรือร้ายต่อชีวิต
                        </p>
                    </div>
                </div>
            </div>

            {/* Methodology Section — EEAT */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-sm font-semibold border border-violet-200 mb-4 inline-block">
                        🔬 หลักการวิเคราะห์
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">ระบบวิเคราะห์เบอร์คำนวณอย่างไร?</h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        NameMongkol ใช้ 4 องค์ประกอบหลักในการวิเคราะห์เบอร์โทรศัพท์อย่างครบถ้วน
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    <div className="bg-white p-5 rounded-2xl text-center border border-[#ddddf0] shadow-sm hover:border-amber-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-3">
                            <span className="text-2xl">🔗</span>
                        </div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">วิเคราะห์คู่เลข</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">แยกคู่เลข 7 ตัวท้าย (XX-XYZ-ABCD) หาคู่มงคล-อัปมงคล พร้อมความหมายแต่ละคู่</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl text-center border border-[#ddddf0] shadow-sm hover:border-emerald-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-3">
                            <span className="text-2xl">➕</span>
                        </div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">คำนวณผลรวม</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">รวมตัวเลขทั้งหมดเพื่อหาผลรวมมงคล เช่น 24, 32, 41, 46, 51 ที่ส่งผลดีต่อชีวิต</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl text-center border border-[#ddddf0] shadow-sm hover:border-blue-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-3">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">กราฟพลังงาน 6 ด้าน</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">วิเคราะห์พลังงานครบ 6 มิติ: การเงิน, โชคลาภ, เสน่ห์, สุขภาพ, สติปัญญา, เซนส์</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl text-center border border-[#ddddf0] shadow-sm hover:border-rose-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mx-auto mb-3">
                            <span className="text-2xl">🏅</span>
                        </div>
                        <h3 className="font-bold text-[#1a1a3e] mb-2">เกรดเบอร์ A-F</h3>
                        <p className="text-sm text-[#5a5a82] leading-relaxed">ให้เกรดรวม A-F โดยพิจารณาคู่เลข + ผลรวม + กราฟ เพื่อตัดสินใจได้ง่าย</p>
                    </div>
                </div>
            </div>

            {/* Comparison Table — Cannibalization Differentiator */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold border border-cyan-200 mb-4 inline-block">
                        ⚖️ เปรียบเทียบ
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">NameMongkol vs เว็บวิเคราะห์เบอร์อื่น</h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        ดูความแตกต่างที่ทำให้เราเป็นตัวเลือกอันดับ 1 ของคนหาเบอร์มงคล
                    </p>
                </div>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-[#ddddf0]">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-[#ddddf0] bg-slate-50">
                                <th className="text-left py-3 px-4 text-[#1a1a3e] font-semibold rounded-tl-2xl">ฟีเจอร์</th>
                                <th className="text-center py-3 px-4 text-amber-600 font-bold">NameMongkol</th>
                                <th className="text-center py-3 px-4 text-[#5a5a82] font-semibold rounded-tr-2xl">เว็บทั่วไป</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ddddf0]">
                            <tr><td className="py-3 px-4 text-[#5a5a82]">กราฟพลังงาน 6 ด้าน</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">❌</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">เกรดเบอร์ A-F</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">❌</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">วิเคราะห์คู่เลขพร้อมความหมาย</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">บางส่วน</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">ผลรวมเบอร์มงคล</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-emerald-600">✅</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">AI วิเคราะห์เชิงลึก (พรีเมียม)</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">❌</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">วิเคราะห์ฟรีไม่จำกัด</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">จำกัด/มีโฆษณา</td></tr>
                            <tr><td className="py-3 px-4 text-[#5a5a82]">แชร์-บันทึกผลลัพธ์</td><td className="py-3 px-4 text-center text-emerald-600 font-bold">✅</td><td className="py-3 px-4 text-center text-slate-600">❌</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Auspicious Sum Section — AEO */}
            <div className="mb-16 md:mb-20">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-200 mb-4 inline-block">
                        🎯 ผลรวมมงคล
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a1a3e] mb-4">ผลรวมเบอร์เท่าไหร่ถือว่ามงคล?</h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto leading-relaxed">
                        รวมผลรวมเบอร์มงคลยอดนิยมที่คนส่วนใหญ่ต้องการ และผลรวมที่ควรระวัง
                    </p>
                </div>
                <div className="bg-white border border-[#ddddf0] shadow-sm p-6 md:p-8 rounded-2xl mb-5">
                    <h3 className="text-lg font-bold text-emerald-600 mb-4">✨ ผลรวมมงคล (แนะนำ)</h3>
                    <div className="flex flex-wrap gap-3">
                        {[{n:24,l:'มหาลาภ'},{n:32,l:'มีเสน่ห์'},{n:36,l:'ผู้นำ'},{n:41,l:'อำนาจดี'},{n:45,l:'ปัญญาเลิศ'},{n:46,l:'เมตตามหานิยม'},{n:50,l:'มีวาสนา'},{n:51,l:'อำนาจเงิน'},{n:54,l:'มหาเศรษฐี'},{n:59,l:'โชคลาภ'},{n:63,l:'เมตตา'},{n:65,l:'คู่ทรัพย์'}].map(s=>
                            <span key={s.n} className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                                {s.n} <span className="text-emerald-500/80 font-normal">— {s.l}</span>
                            </span>
                        )}
                    </div>
                </div>
                <div className="bg-white border border-[#ddddf0] shadow-sm p-6 md:p-8 rounded-2xl">
                    <h3 className="text-lg font-bold text-rose-600 mb-4">⚠️ ผลรวมที่ควรระวัง</h3>
                    <div className="flex flex-wrap gap-3">
                        {[{n:10,l:'อุปสรรค'},{n:13,l:'อุบัติเหตุ'},{n:17,l:'เผด็จการ'},{n:27,l:'หนี้สิน'},{n:43,l:'ปากร้าย'},{n:67,l:'รักร้าว'}].map(s=>
                            <span key={s.n} className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                                {s.n} <span className="text-rose-500/80 font-normal">— {s.l}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mb-12">
                <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#5a5a82]">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>วิเคราะห์แล้วกว่า <strong className="text-[#1a1a3e]">150,000+</strong> เบอร์</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span>คะแนนความพึงพอใจ <strong className="text-[#1a1a3e]">4.9/5</strong></span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <span>ใช้หลักเลขศาสตร์ <strong className="text-[#1a1a3e]">มาตรฐานสากล</strong></span>
                    </div>
                </div>
            </div>

            {/* Internal Links — Related Services */}
            <div className="bg-white border border-[#ddddf0] shadow-sm rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-amber-600 mb-2">บริการอื่นๆ ที่คุณอาจสนใจ</h3>
                <p className="text-sm text-[#5a5a82] mb-5 leading-relaxed">
                    นอกจากวิเคราะห์เบอร์มงคลแล้ว NameMongkol ยังมีบริการเสริมดวงอีกหลายอย่างในที่เดียว
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                    <Link
                        href="/palm-analysis"
                        className="group rounded-xl border border-[#ddddf0] bg-slate-50 hover:border-blue-300 p-4 transition-all"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Palm Analysis</p>
                        <p className="text-[#1a1a3e] font-bold text-sm leading-snug mb-1">วิเคราะห์ลายมือออนไลน์ด้วย AI</p>
                        <p className="text-xs text-[#5a5a82] leading-relaxed">อ่านเส้นชีวิต เส้นสมอง เส้นหัวใจ เส้นวาสนาจากภาพฝ่ามือ</p>
                        <p className="mt-2 text-xs text-blue-600 group-hover:text-blue-700">ไปหน้า /palm-analysis →</p>
                    </Link>
                    <Link
                        href="/wallpapers"
                        className="group rounded-xl border border-[#ddddf0] bg-slate-50 hover:border-purple-300 p-4 transition-all"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Wallpapers</p>
                        <p className="text-[#1a1a3e] font-bold text-sm leading-snug mb-1">วอลเปเปอร์มงคลเสริมดวง ฟรี</p>
                        <p className="text-xs text-[#5a5a82] leading-relaxed">คอลเลกชันวอลเปเปอร์มงคลตามวันเกิด สีมงคล และองค์เทพ</p>
                        <p className="mt-2 text-xs text-purple-600 group-hover:text-purple-700">ไปหน้า /wallpapers →</p>
                    </Link>
                    <Link
                        href="/"
                        className="group rounded-xl border border-[#ddddf0] bg-slate-50 hover:border-amber-300 p-4 transition-all"
                    >
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Name Analysis</p>
                        <p className="text-[#1a1a3e] font-bold text-sm leading-snug mb-1">วิเคราะห์ชื่อมงคล-นามสกุล ฟรี</p>
                        <p className="text-xs text-[#5a5a82] leading-relaxed">เช็คเกรด ผลรวมเลขศาสตร์ และทักษาปกรณ์จากชื่อ-นามสกุล</p>
                        <p className="mt-2 text-xs text-amber-600 group-hover:text-amber-700">ไปหน้าหลัก →</p>
                    </Link>
                </div>
            </div>
        </section>
    );
};
