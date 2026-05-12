'use client';
import React, { useState, useMemo } from 'react';
import { Sparkles, Wand2, RefreshCw, AlertTriangle, Play, Download } from 'lucide-react';
import { charValues, pairDefinitions } from '@/data/numerology';
import { KALAKINI_RULES } from '@/utils/nameAnalysis';
import { AUSPICIOUS_SUMS } from '@/utils/gradeResult';

// ── Algorithm Engine ──
const SAFE_CHARS = ['ก','ด','ถ','ท','ภ','ฤ','า','ำ','ุ','่', // 1
                    'ค','ธ','ร','ญ','ษ','โ','ะ','ั','ิ', // 4
                    'ฉ','ฌ','ฎ','ณ','น','ม','ห','ฮ','ฬ','ึ', // 5
                    'จ','ล','ว','อ','ใ', // 6
                    'ฏ','ฐ','ไ','์']; // 9

const SAFE_GROUPS = [1, 4, 5, 6, 9];
const ALL_CONSONANTS = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');

// Thai syllable building blocks (Onsets, Nuclei, Codas, Markers) to prevent gibberish
const ONSETS = ['ก','ค','จ','ฉ','ช','ซ','ณ','ด','ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ษ','ส','ห','อ'];
const VOWELS = ['ะ','า','ิ','ี','ึ','ื','ุ','ู','เ','แ','โ','ใ','ไ'];
const FINAL_CONS = ['ก','ข','ค','ฆ','ง','จ','ช','ญ','ฎ','ฏ','ฐ','ฑ','ฒ','ณ','ด','ต','ถ','ท','ธ','น','บ','ป','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ษ','ส','ฬ'];

const isAplusSequence = (seq: number[]) => {
    for (let i = 0; i < seq.length - 1; i++) {
        const p = `${seq[i]}${seq[i + 1]}`;
        const level = pairDefinitions[p]?.level ?? 2;
        if (level !== 1) return false; // STRICT: Only GREEN allowed
    }
    const sum = seq.reduce((a, b) => a + b, 0);
    return AUSPICIOUS_SUMS.includes(sum);
};

export default function ClientPage() {
    const [startChar, setStartChar] = useState('ก');
    const [isGenerating, setIsGenerating] = useState(false);
    const [results, setResults] = useState<{name: string, sum: number}[]>([]);
    
    // We will use a fast fragment combiner to generate names
    const generateNames = () => {
        setIsGenerating(true);
        setResults([]);
        
        // This runs asynchronously so it doesn't freeze the browser completely
        setTimeout(() => {
            const fragments = [
                'ณัฐ','ณัฏฐ์','นันท์','มนต์','รวิ','วิณ','ดิณ','ภณ','มิน','นนท์','กร','วัณ','ธาม','คุณ','กัณ','กัน','กิจ','กิณ','กิม','กะ','กิ','กม','กณ','ดน','นต','รณ','วร','อณ','อร','อิม','โณ','ชณ','ชล','ชน','ชิน','พณ','พิม','พิน','ศร','สน','สิร'
            ].filter(f => {
                // Filter fragments to only keep ones where internal math is 100% green
                const seq = Array.from(f).map(c => charValues[c]).filter(v => v !== undefined);
                for (let i = 0; i < seq.length - 1; i++) {
                    const p = `${seq[i]}${seq[i + 1]}`;
                    const level = pairDefinitions[p]?.level ?? 2;
                    if (level !== 1) return false;
                }
                return true;
            });

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
                
                const seq = Array.from(name).map(c => charValues[c]).filter(v => v !== undefined);
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

    const downloadCSV = () => {
        if (results.length === 0) return;
        
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
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-24 pb-20">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm mb-4">
                        <Wand2 className="w-4 h-4" />
                        <span>AI Name Generator (Beta)</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        สร้างชื่อมงคล <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Grade A+</span>
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        ระบบจะใช้หลักคณิตศาสตร์ประกอบตัวอักษรขึ้นมาใหม่ เพื่อบังคับให้ได้ผลรวมมงคลและคู่เลขสีเขียวล้วน (100% ไม่มีกาลกิณีคู่เลข)
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-slate-400 mb-2">อักษรนำหน้าที่ต้องการ</label>
                            <select 
                                value={startChar}
                                onChange={(e) => setStartChar(e.target.value)}
                                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all appearance-none cursor-pointer ${SAFE_GROUPS.includes(charValues[startChar] || 0) ? 'text-white' : 'text-red-400'}`}
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'white\\\' stroke-width=\\\'2\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'%3e%3cpolyline points=\\\'6 9 12 15 18 9\\\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                            >
                                {ALL_CONSONANTS.map(char => {
                                    const isSafe = SAFE_GROUPS.includes(charValues[char] || 0);
                                    return (
                                        <option 
                                            key={char} 
                                            value={char} 
                                            className={isSafe ? "bg-slate-900 text-white" : "bg-red-950 text-red-400"}
                                        >
                                            {char} {isSafe ? '' : '(หลีกเลี่ยง)'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <button 
                                onClick={generateNames}
                                disabled={!startChar || isGenerating}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                                สร้าง 100 ชื่อ (Grade A+)
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200/80 flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                            <p>รายชื่อที่ได้อาจมีลักษณะคล้ายชื่อเกาหลี ญี่ปุ่น หรือชื่อนวัตกรรมยุคใหม่ เนื่องจากเป็นการใช้ AI ต่อจิ๊กซอว์ตัวอักษรเพื่อหลบเลี่ยงคู่เลขเสียทั้งหมด</p>
                        </div>
                        <div className="flex items-start gap-3 mt-1">
                            <div className="w-5 h-5 shrink-0 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500"></div></div>
                            <p>หากคุณเลือกอักษรที่มี <span className="text-red-400">สีแดง (กลุ่มห้ามใช้)</span> ระบบอาจสร้างชื่อ A+ ได้ยากมาก หรือได้ผลลัพธ์ 0 ชื่อ เพราะอักษรนั้นมักจะสร้างคู่เลขกาลกิณีเสมอ</p>
                        </div>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-white">ผลลัพธ์: พบ {results.length} ชื่อ</h2>
                                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">Verified A+</span>
                            </div>
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 text-slate-200 py-1.5 px-3 rounded-lg border border-white/10 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                ดาวน์โหลด CSV
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {results.map((r, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.06] transition-all rounded-xl p-4 flex flex-col items-center justify-center gap-1 group">
                                    <span className="text-xl font-bold text-slate-200 group-hover:text-amber-300 transition-colors">{r.name}</span>
                                    <span className="text-xs text-slate-500 group-hover:text-amber-500/80">ผลรวม: {r.sum}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
