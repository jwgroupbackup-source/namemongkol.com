
import React from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { thaksaConfig, VOWELS } from '@/data/thaksaConfig';
import { ThaksaDayConfig } from '@/types';

const THAKSA_ROWS = [
    { key: 'borivan' as keyof ThaksaDayConfig, label: 'บริวาร', meaning: 'ด้านญาติมิตร', color: 'text-white' },
    { key: 'ayu' as keyof ThaksaDayConfig, label: 'อายุ', meaning: 'ด้านสุขภาพ', color: 'text-white' },
    { key: 'dech' as keyof ThaksaDayConfig, label: 'เดช', meaning: 'ด้านเกียรติยศ', color: 'text-amber-400' },
    { key: 'si' as keyof ThaksaDayConfig, label: 'ศรี', meaning: 'ด้านความงามและทรัพย์', color: 'text-emerald-400' },
    { key: 'mula' as keyof ThaksaDayConfig, label: 'มูลละ', meaning: 'ด้านฐานะครอบครัว', color: 'text-white' },
    { key: 'ussaha' as keyof ThaksaDayConfig, label: 'อุตสาหะ', meaning: 'ด้านความขยัน', color: 'text-white' },
    { key: 'montri' as keyof ThaksaDayConfig, label: 'มนตรี', meaning: 'ด้านมีผู้อุปถัมภ์', color: 'text-white' },
    { key: 'kali' as keyof ThaksaDayConfig, label: 'กาลกิณี', meaning: '⚠️ ควรเลี่ยง', color: 'text-red-400' },
];

const DAY_CONTENT = [
    {
        dayKey: 'sunday',
        emoji: '☀️',
        title: 'อักษรมงคลคนเกิดวันอาทิตย์',
        image: '/birthday/thai-astrology-sunday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันอาทิตย์ ทักษาปกรณ์',
        description: 'สำหรับผู้ที่เกิดวันอาทิตย์ พลังของพระอาทิตย์คือความรุ่งโรจน์ การเลือกกลุ่มอักษรควรเน้นการเสริม "ศรี" และ "เดช" เพื่อสร้างบารมี',
    },
    {
        dayKey: 'monday',
        emoji: '🌙',
        title: 'อักษรมงคลคนเกิดวันจันทร์',
        image: '/birthday/thai-astrology-monday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันจันทร์ ทักษาปกรณ์',
        description: 'ชาววันจันทร์มีเสน่ห์ดั่งพระจันทร์ อักษรที่เลือกควรเน้นกลุ่ม "มูลละ" เพื่อความมั่นคงในที่อยู่อาศัยและทรัพย์สิน',
    },
    {
        dayKey: 'tuesday',
        emoji: '🔥',
        title: 'อักษรมงคลคนเกิดวันอังคาร',
        image: '/birthday/thai-astrology-tuesday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันอังคาร ทักษาปกรณ์',
        description: 'ด้วยพลังแห่งนักสู้ของวันอังคาร การใช้กลุ่มอักษร "อายุ" และ "อุตสาหะ" จะช่วยส่งเสริมพลังกายและใจให้เข้มแข็ง',
    },
    {
        dayKey: 'wednesday',
        emoji: '🍃',
        title: 'อักษรมงคลคนเกิดวันพุธ (กลางวัน)',
        image: '/birthday/thai-astrology-wednesday-lunch.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันพุธกลางวัน ทักษาปกรณ์',
        description: 'ผู้ที่เกิดเวลา 06.00 - 17.59 น. เน้นอักษรกลุ่ม "เดช" และ "ศรี" เพื่อเสริมทักษะการเจรจาและการค้าขาย',
    },
    {
        dayKey: 'wednesday_night',
        emoji: '🌑',
        title: 'อักษรมงคลคนเกิดวันพุธ (กลางคืน)',
        image: '/birthday/thai-astrology-wednesday-night.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันพุธกลางคืน ราหู ทักษาปกรณ์',
        description: 'พระราหูให้คุณด้านไหวพริบและการพลิกแพลง อักษรกลุ่ม "มนตรี" จะช่วยให้มีผู้ใหญ่คอยเกื้อหนุนในยามคับขัน',
    },
    {
        dayKey: 'thursday',
        emoji: '🎓',
        title: 'อักษรมงคลคนเกิดวันพฤหัสบดี',
        image: '/birthday/thai-astrology-thursday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันพฤหัสบดี ทักษาปกรณ์',
        description: 'วันแห่งครูและปัญญา ควรเน้นตัวอักษร "ศรี" เพื่อความสง่างามและโชคลาภที่มาจากความรู้ความสามารถ',
    },
    {
        dayKey: 'friday',
        emoji: '✨',
        title: 'อักษรมงคลคนเกิดวันศุกร์',
        image: '/birthday/thai-astrology-friday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันศุกร์ ทักษาปกรณ์',
        description: 'วันแห่งความรักและศิลปะ อักษรกลุ่ม "บริวาร" และ "ศรี" จะช่วยให้เป็นที่รักของคนรอบข้างและดึงดูดทรัพย์เข้าหาตัว',
    },
    {
        dayKey: 'saturday',
        emoji: '⚓',
        title: 'อักษรมงคลคนเกิดวันเสาร์',
        image: '/birthday/thai-astrology-saturday.webp',
        alt: 'ตารางอักษรมงคลคนเกิดวันเสาร์ ทักษาปกรณ์',
        description: 'ความหนักแน่นคือเอกลักษณ์ของวันเสาร์ อักษรกลุ่ม "อุตสาหะ" จะช่วยให้ความเพียรพยายามนำมาซึ่งความสำเร็จที่ยั่งยืน',
    },
];

export const BirthdayThaksaSection = () => {
    return (
        <section className="w-full max-w-5xl mx-auto mt-16 mb-12 px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 mb-4 inline-block">
                    <BookOpen className="w-4 h-4 inline-block mr-1 -mt-0.5" />
                    คัมภีร์ทักษาปกรณ์
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    รวมตารางอักษรมงคลตามวันเกิด
                </h2>
                <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    การเลือก &quot;ชื่อมงคล&quot; ไม่ใช่เพียงแค่ความไพเราะ แต่คือการวางรากฐานดวงชะตาด้วยพลังของตัวอักษรที่สอดคล้องกับวันเกิด
                    เราได้รวบรวมตารางอักษรมงคล (ทักษา) ครบทั้ง 8 วัน (รวมพุธกลางวัน/กลางคืน) เพื่อให้คุณใช้เป็นแนวทางในการเลือกชื่อที่ช่วยส่งเสริมด้านทรัพย์ สุขภาพ และบารมี พร้อมหลีกเลี่ยงอักษรกาลกิณีอย่างแม่นยำ
                </p>
            </div>

            {/* Day Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DAY_CONTENT.map((day) => {
                    const config = thaksaConfig[day.dayKey];
                    if (!config) return null;

                    return (
                        <article
                            key={day.dayKey}
                            className="bg-slate-900/40 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden hover:border-amber-500/20 transition-colors"
                        >
                            {/* Day Image */}
                            <div className="w-full flex justify-center bg-gradient-to-b from-slate-900/40 to-transparent pt-6 sm:pt-8 pb-2 px-4">
                                <Image
                                    src={day.image}
                                    alt={day.alt}
                                    width={600}
                                    height={600}
                                    className="w-full max-w-[280px] md:max-w-[340px] h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-[1.03] transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-5 md:p-6">
                                {/* Day Title */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    <span className="mr-2">{day.emoji}</span>
                                    {day.title}
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    {day.description}
                                </p>

                                {/* Thaksa Table */}
                                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-800/30">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-slate-300">
                                                <th className="p-3 font-bold border-b border-white/10 w-2/5">ภูมิ (ความหมาย)</th>
                                                <th className="p-3 font-bold border-b border-white/10">อักษรประจำภูมิ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {THAKSA_ROWS.map((row) => {
                                                const letters = config[row.key];
                                                if (!letters || typeof letters === 'string') return null;

                                                return (
                                                    <tr
                                                        key={row.key}
                                                        className={`transition-colors hover:bg-white/5 ${row.key === 'kali' ? 'bg-red-500/5' : ''}`}
                                                    >
                                                        <td className="p-3">
                                                            <span className={`font-bold ${row.color}`}>{row.label}</span>
                                                            <span className="text-xs text-slate-400 ml-1">({row.meaning})</span>
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="text-slate-200 tracking-wider">
                                                                {letters === VOWELS ? 'อ และ สระทั้งหมด' : (letters as string[]).join(' ')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Closing CTA */}
            <div className="mt-12 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                    ทำไมต้องตรวจสอบอักษรมงคลที่ namemongkol.com?
                </h3>
                <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    เราวิเคราะห์ชื่อโดยใช้หลัก <strong className="text-amber-400">ทักษาปกรณ์</strong> ร่วมกับ <strong className="text-emerald-400">เลขศาสตร์</strong> เพื่อหาความสมดุลที่ดีที่สุดสำหรับคุณ เพราะชื่อคือเข็มทิศของชีวิต ให้เราช่วยคุณหาทิศทางที่สว่างไสวที่สุด
                </p>
            </div>
        </section>
    );
};
