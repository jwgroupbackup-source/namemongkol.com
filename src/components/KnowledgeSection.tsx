'use client';

import React, { useState } from 'react';
import { Book, Calculator, Calendar, Heart, Infinity as InfinityIcon, Sparkles, ChevronDown, ChevronUp, Table } from 'lucide-react';
import Image from 'next/image';
import { thaksaConfig } from '@/data/thaksaConfig';
import { DayKey } from '@/types';
import { useLanguage } from './LanguageProvider';
import { ImageEnlargeModal } from './ImageEnlargeModal';

type ScienceType = 'numerology' | 'thaksa' | 'ayatana' | 'nirun';

import { useSearchParams } from 'next/navigation';

export const KnowledgeSection: React.FC = () => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') as ScienceType | null;
    const [activeTab, setActiveTab] = useState<ScienceType>(initialTab || 'numerology');
    const [selectedThaksaDay, setSelectedThaksaDay] = useState<DayKey>('sunday');
    const [enlargedImageSrc, setEnlargedImageSrc] = useState<string | null>(null);
    const { t } = useLanguage();

    // Update active tab if URL param changes (optional, but good for navigation)
    React.useEffect(() => {
        const tab = searchParams.get('tab') as ScienceType | null;
        if (tab && ['numerology', 'thaksa', 'ayatana', 'nirun'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const dayLabels: Record<DayKey, string> = {
        sunday: 'วันอาทิตย์',
        monday: 'วันจันทร์',
        tuesday: 'วันอังคาร',
        wednesday: 'วันพุธ (กลางวัน)',
        wednesday_night: 'วันพุธ (กลางคืน)',
        thursday: 'วันพฤหัสบดี',
        friday: 'วันศุกร์',
        saturday: 'วันเสาร์'
    };

    return (
        <section id="knowledge-section" className="py-16 px-4 md:px-8 bg-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-sm font-medium mb-4 shadow-sm">
                        <Book size={16} />
                        <span>{t('sections.knowledge.badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a3e] mb-6">
                        {t('sections.knowledge.title')}
                    </h2>
                    <p className="text-[#5a5a82] max-w-2xl mx-auto text-lg">
                        {t('sections.knowledge.description')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    <button
                        onClick={() => setActiveTab('numerology')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${activeTab === 'numerology'
                            ? 'bg-amber-50 border-amber-400 text-amber-600 shadow-sm'
                            : 'bg-white border-[#ddddf0] text-[#5a5a82] hover:bg-[#f8f8fc] hover:text-[#1a1a3e]'
                            }`}
                    >
                        <Calculator size={20} />
                        <span className="font-bold">{t('sections.knowledge.tabs.numerology')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('thaksa')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${activeTab === 'thaksa'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-sm'
                            : 'bg-white border-[#ddddf0] text-[#5a5a82] hover:bg-[#f8f8fc] hover:text-[#1a1a3e]'
                            }`}
                    >
                        <Calendar size={20} />
                        <span className="font-bold">{t('sections.knowledge.tabs.thaksa')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('ayatana')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${activeTab === 'ayatana'
                            ? 'bg-rose-50 border-rose-400 text-rose-600 shadow-sm'
                            : 'bg-white border-[#ddddf0] text-[#5a5a82] hover:bg-[#f8f8fc] hover:text-[#1a1a3e]'
                            }`}
                    >
                        <Heart size={20} />
                        <span className="font-bold">{t('sections.knowledge.tabs.ayatana')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('nirun')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all border ${activeTab === 'nirun'
                            ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm'
                            : 'bg-white border-[#ddddf0] text-[#5a5a82] hover:bg-[#f8f8fc] hover:text-[#1a1a3e]'
                            }`}
                    >
                        <InfinityIcon size={20} />
                        <span className="font-bold">{t('sections.knowledge.tabs.nirun')}</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white backdrop-blur-xl border border-[#ddddf0] rounded-3xl p-6 md:p-10 shadow-sm min-h-[400px]">

                    {/* Numerology Content */}
                    {activeTab === 'numerology' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-amber-50 items-center justify-center">
                                    <Calculator className="w-8 h-8 text-amber-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#1a1a3e]">เลขศาสตร์ (Numerology) คืออะไร?</h3>
                                    <p className="text-[#5a5a82] leading-relaxed text-lg">
                                        เลขศาสตร์เป็นวิธีตีความชื่อด้วยตัวเลขตามตำรา โดยนำตัวอักษร สระ และวรรณยุกต์มาแปลงค่าเป็นตัวเลข แล้วบวกรวมเพื่ออ่านความหมายของ <strong>&quot;ผลรวม&quot;</strong> และใช้ประกอบการพิจารณาในการตั้งชื่อ
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#f8f8fc] rounded-2xl p-6 md:p-8 border border-[#ddddf0]">
                                <h4 className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                                    <Table size={20} /> ตารางเทียบค่าตัวเลขอักษรไทย-อังกฤษ
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => setEnlargedImageSrc('/images/thai-numerology-decoding-chart.webp')}
                                    className="block w-full cursor-zoom-in rounded-xl overflow-hidden shadow-sm border border-[#ddddf0]"
                                    aria-label="คลิกเพื่อดูตารางถอดรหัสเลขศาสตร์แบบขยาย"
                                >
                                    <Image
                                        src="/images/thai-numerology-decoding-chart.webp"
                                        alt="ตารางถอดรหัสเลขศาสตร์ อักษรไทย-อังกฤษ สำหรับวิเคราะห์ชื่อมงคล (Thai Numerology Decoding Chart)"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover"
                                        title="ตารางเทียบค่าตัวเลขอักษรไทย-อังกฤษ เพื่อวิเคราะห์ชื่อมงคล"
                                    />
                                </button>
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-transparent p-6 rounded-2xl border-l-4 border-amber-400">
                                <h4 className="font-bold text-amber-600 mb-2">ตัวอย่างการคำนวณ</h4>
                                <p className="text-[#5a5a82]">
                                    ชื่อ <strong>&quot;กมล&quot;</strong> <br />
                                    ก (1) + ม (5) + ล (6) = 1 + 5 + 6 = <strong>12</strong> (เป็นเลขคู่ศัตรู แนะนำให้เปลี่ยน)<br />
                                    ชื่อ <strong>&quot;รวย&quot;</strong> <br />
                                    ร (4) + ว (6) + ย (8) = 4 + 6 + 8 = <strong>18</strong> (เลขแห่งความเปลี่ยนแปลง)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Thaksa Content */}
                    {activeTab === 'thaksa' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-emerald-50 items-center justify-center">
                                    <Calendar className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#1a1a3e]">ตารางทักษาปกรณ์ (Thaksa)</h3>
                                    <p className="text-[#5a5a82] leading-relaxed text-lg">
                                        เลือก <strong>&quot;วันเกิด&quot;</strong> ของคุณด้านล่าง เพื่อดูตารางทักษาประจำวันเกิด <br />
                                        ระบบจะคำนวณหาอักษรที่เป็นมงคล (บริวาร-มนตรี) และอักษรต้องห้าม (กาลกิณี)
                                    </p>
                                </div>
                            </div>

                            {/* Day Selector */}
                            <div className="flex flex-wrap gap-2 justify-center bg-[#f8f8fc] p-4 rounded-2xl border border-[#ddddf0]">
                                {(Object.keys(dayLabels) as DayKey[]).map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedThaksaDay(day)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedThaksaDay === day
                                            ? 'bg-emerald-500 text-white shadow-md font-bold scale-105'
                                            : 'bg-white text-[#5a5a82] border border-[#ddddf0] hover:bg-[#ddddf0] hover:text-[#1a1a3e]'
                                            }`}
                                    >
                                        {dayLabels[day]}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Table */}
                            <div className="overflow-hidden rounded-2xl border border-[#ddddf0] bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#f8f8fc] text-[#5a5a82] text-sm">
                                            <th className="p-4 font-bold border-b border-[#ddddf0] w-1/3">ภูมิ (ความหมาย)</th>
                                            <th className="p-4 font-bold border-b border-[#ddddf0]">อักษรประจำภูมิ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#ddddf0]">
                                        {[
                                            { key: 'borivan', label: 'บริวาร', text: 'บุตร, สามี, ภรรยา, ผู้ใต้บังคับบัญชา', color: 'text-[#1a1a3e]' },
                                            { key: 'ayu', label: 'อายุ', text: 'สุขภาพ, ความเป็นอยู่', color: 'text-[#1a1a3e]' },
                                            { key: 'dech', label: 'เดช', text: 'อำนาจ, วาสนา, เกียรติยศ', color: 'text-amber-600' },
                                            { key: 'si', label: 'ศรี', text: 'โชคลาภ, เงินทอง, เสน่ห์', color: 'text-emerald-600' },
                                            { key: 'mula', label: 'มูละ', text: 'ทรัพย์สิน, มรดก', color: 'text-[#1a1a3e]' },
                                            { key: 'ussaha', label: 'อุตสาหะ', text: 'ความขยัน, การทำงาน', color: 'text-[#1a1a3e]' },
                                            { key: 'montri', label: 'มนตรี', text: 'ผู้ใหญ่, ผู้ให้การอุปถัมภ์', color: 'text-[#1a1a3e]' },
                                            { key: 'kali', label: 'กาลกิณี', text: 'อุปสรรค, ความโชคร้าย (ต้องห้าม!)', color: 'text-red-600 bg-red-50' },
                                        ].map((row) => (
                                            <tr key={row.key} className={`transition-colors hover:bg-[#f8f8fc] ${row.key === 'kali' ? 'bg-red-50' : ''}`}>
                                                <td className="p-4">
                                                    <div className={`font-bold text-lg ${row.color}`}>{row.label}</div>
                                                    <div className="text-xs text-[#5a5a82]">{row.text}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-lg font-prompt tracking-wider text-[#1a1a3e]">
                                                        {(thaksaConfig[selectedThaksaDay][row.key as keyof typeof thaksaConfig[typeof selectedThaksaDay]] as string[]).join('  ')}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Ayatana Content */}
                    {activeTab === 'ayatana' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-rose-50 items-center justify-center">
                                    <Heart className="w-8 h-8 text-rose-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#1a1a3e]">อายตนะ 6 (Ayatana 6) คืออะไร?</h3>
                                    <p className="text-[#5a5a82] leading-relaxed text-lg">
                                        ศาสตร์ที่วัด <strong>&quot;ภาพลักษณ์และการยอมรับทางสังคม&quot;</strong> สะท้อนถึงบุคลิกภายนอกที่ผู้อื่นมองเห็น ค่าอายตนะคำนวณจากผลรวมของชื่อ (Name Score) แล้วนำมาเทียบกับตารางบุคคล 9 ประเภท เพื่อดูว่าผู้คนจะรู้สึกอย่างไรต่อเจ้าของชื่อนี้
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-rose-50 to-transparent p-6 rounded-2xl border-l-4 border-rose-400">
                                <h4 className="font-bold text-rose-600 mb-2">ตัวอย่างการคำนวณ</h4>
                                <div className="text-[#5a5a82] space-y-2">
                                    <p>
                                        สมมติชื่อ <strong>&quot;สมชาย&quot;</strong> มีค่าเลขศาสตร์ผลรวม = <strong>24</strong> (พลังแห่งมหามงคล)
                                    </p>
                                    <div className="flex items-center gap-2 text-sm md:text-base">
                                        <span className="px-2 py-1 bg-[#ddddf0] rounded">2</span>
                                        <span>+</span>
                                        <span className="px-2 py-1 bg-[#ddddf0] rounded">4</span>
                                        <span>=</span>
                                        <strong className="text-rose-600 text-lg">6</strong>
                                    </div>
                                    <p className="text-sm text-[#8e8eaa] mt-2">
                                        *นำผลลัพธ์เลข 6 ไปเทียบความหมายในตาราง (เปรียบดังราชินี)
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#f8f8fc] p-6 rounded-2xl border border-[#ddddf0]">
                                <h4 className="text-rose-600 font-bold mb-4">ความหมายตัวเลข 1-9</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { num: 1, title: 'อายตนะ 1 (เปรียบดังพ่อ)', desc: 'เป็นผู้นำ มีอำนาจ ผู้คนยำเกรง' },
                                        { num: 2, title: 'อายตนะ 2 (เปรียบดังแม่)', desc: 'จิตใจดี มีเมตตา คนอยากเข้าหา' },
                                        { num: 6, title: 'อายตนะ 6 (เปรียบดังราชินี)', desc: 'มีเสน่ห์ วาสนาดี สุขสบาย' },
                                        { num: 8, title: 'อายตนะ 8 (เปรียบดังเจ้าคนนายคน)', desc: 'บารมีสูง คนเคารพนับถือ' },
                                        { num: 9, title: 'อายตนะ 9 (เปรียบดังพระราชา)', desc: 'ยิ่งใหญ่ แคล้วคลาด มีสิ่งศักดิ์สิทธิ์คุ้มครอง' },
                                        { num: '3, 4, 5, 7', title: 'ตัวเลขที่ควรเลี่ยง', desc: 'มักเหนื่อยยาก ต้องต่อสู้ดิ้นรน ไร้คนอุ้มชู', isBad: true },
                                    ].map((item, idx) => (
                                        <div key={idx} className={`p-4 rounded-xl border ${item.isBad ? 'bg-red-50 border-red-200' : 'bg-white border-[#ddddf0]'}`}>
                                            <div className={`text-lg font-bold mb-1 ${item.isBad ? 'text-red-600' : 'text-[#1a1a3e]'}`}>{item.title}</div>
                                            <div className="text-sm text-[#5a5a82]">{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nirun Content */}
                    {activeTab === 'nirun' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center">
                                    <InfinityIcon className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-[#1a1a3e]">นิรันดร์ศาสตร์ (Nirun Sastra) คืออะไร?</h3>
                                    <p className="text-[#5a5a82] leading-relaxed text-lg">
                                        นี่คือ <strong>&quot;หัวใจสำคัญ&quot;</strong> ที่ขาดไม่ได้ นิรันดร์ศาสตร์คือการคำนวณหาความสมดุลระหว่างชื่อต้นและนามสกุล ไม่ใช่แค่ชื่อดี หรือนามสกุลดี แต่ทั้งสองต้อง <strong>&quot;เกื้อหนุนกัน&quot;</strong> เพื่อสร้างความมงคลที่ยั่งยืน
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div className="bg-[#f8f8fc] p-6 rounded-2xl border border-[#ddddf0]">
                                        <h4 className="text-blue-600 font-bold mb-4">หลักการคำนวณความสมดุล</h4>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                                <p className="text-sm text-[#5a5a82]">นำ <strong>ผลรวมชื่อ</strong> มาคำนวณหากำลังดาว</p>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                                <p className="text-sm text-[#5a5a82]">นำ <strong>ผลรวมนามสกุล</strong> มาคำนวณหากำลังดาว</p>
                                            </li>
                                            <li className="flex gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                                <p className="text-sm text-[#5a5a82]">นำกำลังดาวทั้งสองมาเปรียบเทียบความสัมพันธ์ (เป็นมิตร, ศัตรู, หรือกลางๆ)</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-[#5a5a82] text-sm">
                                        &quot;ต่อให้ชื่อดี 100% แต่ถ้านามสกุลเป็นศัตรูกัน ชีวิตจะขึ้นๆ ลงๆ ไม่สุดสักทาง นิรันดร์ศาสตร์จึงเข้ามาแก้จุดบอดนี้&quot;
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl"></div>
                                    <div className="relative bg-white p-6 rounded-3xl border border-[#ddddf0] text-center space-y-4 shadow-sm">
                                        <div className="flex justify-center items-center gap-4">
                                            <div className="text-center">
                                                <div className="text-sm text-[#5a5a82] mb-1">ชื่อ</div>
                                                <div className="w-16 h-16 rounded-2xl bg-[#f8f8fc] flex items-center justify-center text-2xl font-bold text-[#1a1a3e] border border-[#ddddf0]">63</div>
                                            </div>
                                            <InfinityIcon className="text-blue-500 animate-pulse" size={24} />
                                            <div className="text-center">
                                                <div className="text-sm text-[#5a5a82] mb-1">สกุล</div>
                                                <div className="w-16 h-16 rounded-2xl bg-[#f8f8fc] flex items-center justify-center text-2xl font-bold text-[#1a1a3e] border border-[#ddddf0]">42</div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-[#ddddf0]">
                                            <div className="text-emerald-600 font-bold text-lg mb-1">สมพงศ์กัน (Excellent)</div>
                                            <p className="text-xs text-[#5a5a82]">
                                                ผลรวมเป็นคู่มิตรที่เกื้อหนุนกัน<br />ส่งเสริมความก้าวหน้าอย่างยั่งยืน
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <ImageEnlargeModal
                isOpen={Boolean(enlargedImageSrc)}
                src={enlargedImageSrc}
                alt="ตารางถอดรหัสเลขศาสตร์ อักษรไทย-อังกฤษ สำหรับวิเคราะห์ชื่อมงคล"
                onClose={() => setEnlargedImageSrc(null)}
            />
        </section>
    );
};
