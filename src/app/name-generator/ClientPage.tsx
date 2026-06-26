'use client';
import React, { useState } from 'react';
import { AlertTriangle, BriefcaseBusiness, ChevronDown, Crown, Download, Heart, Lock, Play, RefreshCw, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { pairDefinitions } from '@/data/numerology';
import { pairDefinitions as detailedPairDefinitions } from '@/data/pairDefinitions';
import { getCharValue } from '@/data/numerologyLookup';
import { AUSPICIOUS_SUMS } from '@/utils/gradeResult';
import { supabase } from '@/utils/supabase';
import { getEffectiveCredits } from '@/utils/credits';

// ── Algorithm Engine ──
const NAME_GENERATOR_UNLOCK_COST = 50;
const SAFE_GROUPS = [1, 4, 5, 6, 9];
const ALL_CONSONANTS = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');
const FRAGMENTS = [
    'ณัฐ','ณัฏฐ์','นันท์','มนต์','รวิ','วิณ','ดิณ','ภณ','มิน','นนท์','กร','วัณ','ธาม','คุณ','กัณ','กัน','กิจ','กิณ','กิม','กะ','กิ','กม','กณ','ดน','นต','รณ','วร','อณ','อร','อิม','โณ','ชณ','ชล','ชน','ชิน','พณ','พิม','พิน','ศร','สน','สิร'
];

const isAplusSequence = (seq: number[]) => {
    for (let i = 0; i < seq.length - 1; i++) {
        const p = `${seq[i]}${seq[i + 1]}`;
        const level = pairDefinitions[p]?.level ?? 2;
        if (level !== 1) return false; // STRICT: Only GREEN allowed
    }
    const sum = seq.reduce((a, b) => a + b, 0);
    return AUSPICIOUS_SUMS.includes(sum);
};

const VALID_FRAGMENTS = FRAGMENTS.filter(f => {
    const seq = Array.from(f).map(c => getCharValue(c)).filter((v): v is number => v !== undefined);
    for (let i = 0; i < seq.length - 1; i++) {
        const p = `${seq[i]}${seq[i + 1]}`;
        const level = pairDefinitions[p]?.level ?? 2;
        if (level !== 1) return false;
    }
    return true;
});

const resultCardThemes = [
    {
        card: 'border-pink-200 bg-[linear-gradient(135deg,#fff7fb_0%,#ffeaf4_50%,#fff9ed_100%)] shadow-pink-100/70',
        icon: 'bg-pink-100 text-pink-500',
        rank: 'bg-pink-500 text-white ring-pink-200',
        name: 'text-[#1a1a3e]',
        sum: 'text-pink-700',
        sparkle: 'text-pink-300',
        excellent: 'bg-emerald-100 text-emerald-700',
    },
    {
        card: 'border-emerald-200 bg-[linear-gradient(135deg,#f2fffb_0%,#e8fff5_52%,#f8fffd_100%)] shadow-emerald-100/70',
        icon: 'bg-emerald-100 text-emerald-600',
        rank: 'bg-emerald-500 text-white ring-emerald-200',
        name: 'text-[#12383a]',
        sum: 'text-emerald-700',
        sparkle: 'text-emerald-300',
        excellent: 'bg-teal-100 text-teal-700',
    },
    {
        card: 'border-amber-200 bg-[linear-gradient(135deg,#fffaf0_0%,#fff2cf_52%,#fffdf7_100%)] shadow-amber-100/70',
        icon: 'bg-amber-100 text-amber-600',
        rank: 'bg-amber-500 text-white ring-amber-200',
        name: 'text-[#36240c]',
        sum: 'text-amber-700',
        sparkle: 'text-amber-300',
        excellent: 'bg-emerald-100 text-emerald-700',
    },
    {
        card: 'border-sky-200 bg-[linear-gradient(135deg,#f4fbff_0%,#e8f6ff_52%,#f9fdff_100%)] shadow-sky-100/70',
        icon: 'bg-sky-100 text-sky-600',
        rank: 'bg-sky-500 text-white ring-sky-200',
        name: 'text-[#14304a]',
        sum: 'text-sky-700',
        sparkle: 'text-sky-300',
        excellent: 'bg-emerald-100 text-emerald-700',
    },
    {
        card: 'border-violet-200 bg-[linear-gradient(135deg,#fbf8ff_0%,#f0e8ff_52%,#fffaff_100%)] shadow-violet-100/70',
        icon: 'bg-violet-100 text-violet-600',
        rank: 'bg-violet-500 text-white ring-violet-200',
        name: 'text-[#2b1f5c]',
        sum: 'text-violet-700',
        sparkle: 'text-violet-300',
        excellent: 'bg-emerald-100 text-emerald-700',
    },
    {
        card: 'border-orange-200 bg-[linear-gradient(135deg,#fff8f2_0%,#ffe9dc_52%,#fffafa_100%)] shadow-orange-100/70',
        icon: 'bg-orange-100 text-orange-600',
        rank: 'bg-orange-500 text-white ring-orange-200',
        name: 'text-[#3f2115]',
        sum: 'text-orange-700',
        sparkle: 'text-orange-300',
        excellent: 'bg-emerald-100 text-emerald-700',
    },
];

const fallbackResultTags = ['มงคล', 'ดีเยี่ยม'];

const getResultTags = (sum: number) => {
    const pairKey = String(sum).padStart(2, '0');
    const tags = detailedPairDefinitions[pairKey]?.tags ?? [];
    const normalizedTags = tags
        .map((tag) => tag.replace(/^#/, '').trim())
        .filter(Boolean);

    return (normalizedTags.length > 0 ? normalizedTags : fallbackResultTags).slice(0, 2);
};

const getResultTagTheme = (tag: string) => {
    if (/เมตตา|ความรัก|เสน่ห์|อ่อนหวาน|ครอบครัว/.test(tag)) {
        return { icon: Heart, className: 'text-pink-700 bg-pink-50 border-pink-100' };
    }

    if (/การเงิน|ร่ำรวย|ทรัพย์|เงิน|มั่งคั่ง|ขายดี|ค้าขาย|เศรษฐี/.test(tag)) {
        return { icon: BriefcaseBusiness, className: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    }

    if (/ผู้นำ|อำนาจ|บารมี|ชื่อเสียง|ตำแหน่ง|ผู้ใหญ่|หนุน/.test(tag)) {
        return { icon: Crown, className: 'text-violet-700 bg-violet-50 border-violet-100' };
    }

    if (/โชค|สำเร็จ|ศักดิ์สิทธิ์|ปาฏิหาริย์|คุ้มครอง|แคล้วคลาด/.test(tag)) {
        return { icon: Sparkles, className: 'text-amber-700 bg-amber-50 border-amber-100' };
    }

    return { icon: ShieldCheck, className: 'text-sky-700 bg-sky-50 border-sky-100' };
};

export default function ClientPage() {
    const router = useRouter();
    const [startChar, setStartChar] = useState('ก');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isResultsUnlocked, setIsResultsUnlocked] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [results, setResults] = useState<{name: string, sum: number}[]>([]);
    const selectedCharIsSafe = SAFE_GROUPS.includes(getCharValue(startChar) || 0);
    
    // We will use a fast fragment combiner to generate names
    const generateNames = () => {
        setIsGenerating(true);
        setIsResultsUnlocked(false);
        setResults([]);
        
        // This runs asynchronously so it doesn't freeze the browser completely
        setTimeout(() => {
            const fragments = VALID_FRAGMENTS;

            // Prefix list based on user input
            const prefixes = fragments.filter(f => f.startsWith(startChar));
            // If no fragments start with this char, we just use the char itself
            if (prefixes.length === 0) prefixes.push(startChar);

            const generated = new Set<string>();
            const output: {name: string, sum: number}[] = [];
            
            // Loop to combine 2-3 fragments
            for (let i = 0; i < 5000; i++) {
                if (output.length >= 100) break;
                
                const p1 = prefixes[Math.floor(Math.random() * prefixes.length)];
                const p2 = fragments[Math.floor(Math.random() * fragments.length)];
                const useThree = Math.random() > 0.5;
                const p3 = useThree ? fragments[Math.floor(Math.random() * fragments.length)] : '';
                
                const name = p1 + p2 + p3;
                if (generated.has(name) || name.length > 8) continue;
                generated.add(name);
                
                const seq = Array.from(name).map(c => getCharValue(c)).filter((v): v is number => v !== undefined);
                if (seq.length < 2) continue;
                
                if (isAplusSequence(seq)) {
                    output.push({
                        name,
                        sum: seq.reduce((a, b) => a + b, 0)
                    });
                }
            }
            
            setResults(output);
            setIsGenerating(false);
        }, 100);
    };

    const unlockResults = async () => {
        const Swal = (await import('sweetalert2')).default;
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login?redirect=/name-generator');
            return;
        }

        setIsUnlocking(true);

        try {
            const latestCredits = await getEffectiveCredits(user.id);
            setUserCredits(latestCredits.total);

            if (latestCredits.total < NAME_GENERATOR_UNLOCK_COST) {
                const result = await Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `การปลดล็อกชื่อทั้งหมดต้องใช้ ${NAME_GENERATOR_UNLOCK_COST} เครดิต (คุณมี ${latestCredits.total} เครดิต)`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#94a3b8',
                    background: '#fff9fd',
                    color: '#1a1a3e',
                    customClass: { popup: 'rounded-2xl border border-pink-100' },
                });

                if (result.isConfirmed) router.push('/topup');
                return;
            }

            const confirm = await Swal.fire({
                title: 'ปลดล็อกชื่อทั้งหมด?',
                text: `ใช้ ${NAME_GENERATOR_UNLOCK_COST} เครดิตเพื่อแสดงรายชื่อจริงทั้งหมด ${results.length} รายชื่อ`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน ใช้ ${NAME_GENERATOR_UNLOCK_COST} เครดิต`,
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#ec4899',
                cancelButtonColor: '#94a3b8',
                background: '#fff9fd',
                color: '#1a1a3e',
                customClass: { popup: 'rounded-2xl border border-pink-100' },
            });

            if (!confirm.isConfirmed) return;

            const { error } = await supabase.rpc('deduct_credits', { amount: NAME_GENERATOR_UNLOCK_COST });
            if (error) {
                const message = error.message || 'ไม่สามารถหักเครดิตได้ กรุณาลองใหม่';
                const looksLikeInsufficient = /insufficient|not\s*enough|เครดิตไม่พอ|ไม่เพียงพอ/i.test(message);
                const result = await Swal.fire({
                    title: looksLikeInsufficient ? 'เครดิตไม่เพียงพอ' : 'เกิดข้อผิดพลาด',
                    text: looksLikeInsufficient ? 'เครดิตไม่พอสำหรับการปลดล็อก กดเพื่อเติมเครดิต' : message,
                    icon: looksLikeInsufficient ? 'warning' : 'error',
                    showCancelButton: looksLikeInsufficient,
                    confirmButtonText: looksLikeInsufficient ? 'เติมเครดิต' : 'ตกลง',
                    cancelButtonText: looksLikeInsufficient ? 'ยกเลิก' : undefined,
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#94a3b8',
                    background: '#fff9fd',
                    color: '#1a1a3e',
                    customClass: { popup: 'rounded-2xl border border-pink-100' },
                });

                if (looksLikeInsufficient && result.isConfirmed) router.push('/topup');
                return;
            }

            setUserCredits(latestCredits.total - NAME_GENERATOR_UNLOCK_COST);
            setIsResultsUnlocked(true);
            window.dispatchEvent(new Event('force_credits_update'));

            await Swal.fire({
                title: 'ปลดล็อกสำเร็จ',
                text: `แสดงรายชื่อทั้งหมดแล้ว หัก ${NAME_GENERATOR_UNLOCK_COST} เครดิตเรียบร้อย`,
                icon: 'success',
                timer: 1400,
                showConfirmButton: false,
                background: '#fff9fd',
                color: '#1a1a3e',
                customClass: { popup: 'rounded-2xl border border-pink-100' },
            });
        } finally {
            setIsUnlocking(false);
        }
    };

    const downloadCSV = () => {
        if (results.length === 0 || !isResultsUnlocked) return;
        
        // Add BOM for correct UTF-8 rendering in Excel
        const BOM = "\uFEFF";
        let csvContent = BOM + "Name,Sum,Grade\n";
        
        results.forEach(row => {
            csvContent += `${row.name},${row.sum},A+\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Premium_A_Plus_Names_${startChar}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fff9fd] text-[#1a1a3e] font-sans selection:bg-pink-400 selection:text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 14% 10%, rgba(125, 211, 252, 0.22), transparent 28%),
                        radial-gradient(circle at 88% 8%, rgba(244, 114, 182, 0.20), transparent 24%),
                        radial-gradient(circle at 78% 86%, rgba(134, 239, 172, 0.18), transparent 24%),
                        linear-gradient(135deg, #fffaf7 0%, #fff4fb 38%, #f3fbff 76%, #fffef7 100%)
                    `,
                }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute left-[8%] top-24 text-amber-300/80">
                <Sparkles className="h-7 w-7" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute right-[10%] top-32 text-pink-300/80">
                <Sparkles className="h-8 w-8" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute right-[20%] bottom-24 text-sky-300/70">
                <Sparkles className="h-6 w-6" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
                <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/85 px-4 py-2 text-sm font-bold text-[#5a5a82] shadow-sm">
                        <Wand2 className="h-4 w-4 text-pink-500" />
                        <span>สร้างชื่อมงคลด้วย AI</span>
                    </div>
                    <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-normal text-[#15163f] sm:text-5xl lg:text-6xl">
                        สร้างชื่อมงคลด้วย <span className="text-pink-500">AI</span> <span className="text-orange-500">Grade A+</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-8 text-[#5a5a82] sm:text-lg">
                        ระบบจะประกอบตัวอักษรเป็นชื่อใหม่สำหรับตั้งชื่อลูก เปลี่ยนชื่อ หรือชื่อแบรนด์ โดยคัดเฉพาะผลรวมมงคลและคู่เลขสีเขียวล้วน
                    </p>
                </div>

                <div className="mb-8 rounded-3xl border border-pink-100 bg-white/78 p-4 shadow-[0_24px_80px_rgba(244,114,182,0.16)] backdrop-blur-xl sm:p-6 lg:p-8">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="min-w-0">
                            <label className="mb-2 block text-sm font-bold text-[#5a5a82]">อักษรนำหน้าที่ต้องการ</label>
                            <div className="relative">
                                <select
                                    value={startChar}
                                    onChange={(e) => setStartChar(e.target.value)}
                                    className={`h-14 w-full appearance-none rounded-2xl border bg-white px-5 pr-12 text-2xl font-extrabold shadow-inner outline-none transition-all focus:border-pink-300 focus:ring-4 focus:ring-pink-100 ${
                                        selectedCharIsSafe
                                            ? 'border-pink-100 text-[#1a1a3e]'
                                            : 'border-rose-200 text-rose-600'
                                    }`}
                                >
                                    {ALL_CONSONANTS.map(char => {
                                        const isSafe = SAFE_GROUPS.includes(getCharValue(char) || 0);
                                        return (
                                            <option
                                                key={char}
                                                value={char}
                                                className={isSafe ? 'bg-white text-[#1a1a3e]' : 'bg-rose-50 text-rose-600'}
                                            >
                                                {char} {isSafe ? '' : '(หลีกเลี่ยง)'}
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-500" />
                            </div>
                        </div>
                        <button
                            onClick={generateNames}
                            disabled={!startChar || isGenerating}
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ffb15e_0%,#ff6f91_52%,#ec4899_100%)] px-8 text-base font-extrabold text-white shadow-[0_14px_28px_rgba(236,72,153,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(236,72,153,0.30)] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                        >
                            {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                            สร้าง 100 ชื่อ (Grade A+)
                        </button>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-amber-200 bg-[#fff9ed]/90 text-sm text-[#6b4d1f]">
                        <div className="flex items-start gap-3 border-b border-amber-200/70 px-4 py-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                            <p className="leading-7">รายชื่อที่ได้อาจมีลักษณะคล้ายชื่อเกาหลี ญี่ปุ่น หรือชื่อนวัตกรรมยุคใหม่ เนื่องจากเป็นการใช้ AI ต่อจิ๊กซอว์ตัวอักษรเพื่อหลบเลี่ยงคู่เลขเสียทั้งหมด</p>
                        </div>
                        <div className="flex items-start gap-3 px-4 py-3">
                            <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500" />
                            <p className="leading-7">หากคุณเลือกอักษรที่มี <span className="font-bold text-pink-600">สีแดง (กลุ่มห้ามใช้)</span> ระบบอาจสร้างชื่อ A+ ได้ยากมาก หรือได้ผลลัพธ์ 0 ชื่อ เพราะอักษรนั้นมักจะสร้างคู่เลขกาลกิณีเสมอ</p>
                        </div>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="animate-fade-in-up">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-extrabold text-[#15163f]">ผลลัพธ์: พบ {results.length} ชื่อ</h2>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                                    <ShieldCheck className="h-4 w-4" />
                                    Verified A+
                                </span>
                                {isResultsUnlocked && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-extrabold text-pink-700">
                                        <Lock className="h-3.5 w-3.5" />
                                        ปลดล็อกแล้ว
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={downloadCSV}
                                disabled={!isResultsUnlocked}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 text-sm font-extrabold text-violet-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:w-auto"
                            >
                                <Download className="h-4 w-4" />
                                ดาวน์โหลด CSV
                            </button>
                        </div>
                        {!isResultsUnlocked && (
                            <div className="mb-6 overflow-hidden rounded-3xl border border-pink-200 bg-white/85 p-4 shadow-[0_20px_60px_rgba(236,72,153,0.12)] backdrop-blur-xl sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 ring-4 ring-pink-50">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-[#15163f]">ปลดล็อกชื่อทั้งหมด {results.length} รายชื่อ</h3>
                                            <p className="mt-1 text-sm leading-6 text-[#5a5a82]">
                                                ตอนนี้ระบบแสดงผลรวมและคุณสมบัติของชื่อไว้ก่อน ชื่อจริงจะถูก blur จนกว่าจะปลดล็อกด้วยเครดิต
                                            </p>
                                            {userCredits !== null && (
                                                <p className="mt-1 text-xs font-bold text-emerald-700">เครดิตคงเหลือ: {userCredits}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={unlockResults}
                                        disabled={isUnlocking}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ffb15e_0%,#ff6f91_52%,#ec4899_100%)] px-6 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(236,72,153,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(236,72,153,0.28)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                                    >
                                        {isUnlocking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        ใช้ {NAME_GENERATOR_UNLOCK_COST} เครดิตเพื่อแสดงชื่อ
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {results.map((r, i) => {
                                const theme = resultCardThemes[i % resultCardThemes.length];
                                const tags = getResultTags(r.sum);

                                return (
                                    <div key={i} className={`group relative min-h-[174px] overflow-hidden rounded-2xl border p-4 shadow-lg transition-all hover:-translate-y-1 ${theme.card}`}>
                                        <div className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ring-4 ${theme.rank}`}>
                                            {i + 1}
                                        </div>
                                        <Heart className={`absolute right-4 top-4 h-5 w-5 ${theme.sparkle}`} />
                                        <Sparkles className={`absolute bottom-4 right-5 h-4 w-4 ${theme.sparkle}`} />

                                        <div className="relative z-10 flex h-full flex-col justify-between gap-4 pt-6">
                                            <div className="text-center">
                                                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl font-extrabold ring-4 ring-white/80 ${theme.icon}`}>
                                                    {isResultsUnlocked ? r.name.slice(0, 1) : <Lock className="h-5 w-5" />}
                                                </div>
                                                <div className="relative mx-auto w-fit max-w-full">
                                                    <p
                                                        className={`break-words text-2xl font-extrabold leading-snug transition-all ${theme.name} ${
                                                            isResultsUnlocked ? '' : 'select-none blur-[7px]'
                                                        }`}
                                                        aria-label={isResultsUnlocked ? r.name : 'ชื่อถูกล็อก'}
                                                    >
                                                        {r.name}
                                                    </p>
                                                    {!isResultsUnlocked && (
                                                        <span className="pointer-events-none absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/80 bg-white/85 px-2.5 py-1 text-[10px] font-extrabold text-pink-600 shadow-sm">
                                                            <Lock className="h-3 w-3" />
                                                            ล็อกอยู่
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm">
                                                    <span className={`font-bold ${theme.sum}`}>ผลรวม {r.sum}</span>
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${theme.excellent}`}>ดีเยี่ยม</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                {tags.map((tag) => {
                                                    const tagTheme = getResultTagTheme(tag);
                                                    const TagIcon = tagTheme.icon;

                                                    return (
                                                        <div key={tag} className={`flex min-w-0 items-center justify-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${tagTheme.className}`}>
                                                            <TagIcon className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="truncate">#{tag}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
