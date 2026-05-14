'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Trash2, ClipboardList, CheckCircle2, Download, XCircle, Info, Hash, ArrowDownWideNarrow, Printer, Coins, PlayCircle, LogIn, Users, FileSpreadsheet, Zap, HelpCircle } from 'lucide-react';
import { analyzeName } from '@/utils/nameAnalysis';
import { NameAnalysisDetailCard } from '@/components/NameAnalysisDetailCard';
// import { toPng } from 'html-to-image';
// import jsPDF from 'jspdf';
import { supabase } from '@/utils/supabase';

// Define Result Interface to clear 'any' types if needed, but inferring is fine for now based on usage
interface AnalysisResultItem {
    id: number;
    name: string;
    grade: string;
    sum: number;
    goodDays: string[];
    pairs: { pair: string; type: string }[];
}

export default function NameAnalysisPage() {
    const router = useRouter();
    const [inputText, setInputText] = useState("");
    const [isSorted, setIsSorted] = useState(false);

    // Core State
    const [results, setResults] = useState<AnalysisResultItem[]>([]);
    const [selectedResult, setSelectedResult] = useState<AnalysisResultItem | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // Ref for PDF Capture
    const printRef = useRef<HTMLDivElement>(null);

    // Fetch User Credits on Mount
    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits, welcome_credits, welcome_credits_granted_at')
                    .eq('id', user.id)
                    .maybeSingle();
                if (data) {
                    let total = data.credits ?? 0;
                    if (data.welcome_credits && data.welcome_credits > 0 && data.welcome_credits_granted_at) {
                        const grantedAt = new Date(data.welcome_credits_granted_at).getTime();
                        if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                            total += data.welcome_credits;
                        }
                    }
                    setUserCredits(total);
                }
            }
        };
        fetchCredits();
    }, []);

    const countNames = (text: string) => {
        return text.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .length;
    };

    const calculateCost = (count: number) => {
        if (count <= 10) return 5; // Entry
        if (count <= 100) return 30; // Standard
        return 100; // Power User (101-1000)
    };

    const handleAnalyzeClick = async () => {
        // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
        const count = countNames(inputText);

        if (count === 0) {
            Swal.fire({
                title: 'กรุณากรอกรายชื่อ',
                text: 'โปรดใส่รายชื่อที่ต้องการวิเคราะห์อย่างน้อย 1 ชื่อ',
                icon: 'warning',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        if (count > 1000) {
            Swal.fire({
                title: 'เกินขีดจำกัด',
                text: 'รองรับสูงสุด 1,000 รายชื่อต่อครั้ง',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        // Check Login
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const result = await Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านต้องเข้าสู่ระบบก่อนเริ่มการวิเคราะห์',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });
            if (result.isConfirmed) {
                router.push('/login');
            }
            return;
        }

        const cost = calculateCost(count);

        // Confirmation & Payment
        if (cost > 0) {
            // Check Balance
            if (userCredits !== null && userCredits < cost) {
                const result = await Swal.fire({
                    title: 'เครดิตไม่เพียงพอ',
                    text: `การวิเคราะห์นี้ต้องใช้ ${cost} เครดิต (ท่านมี ${userCredits})`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'เติมเครดิต',
                    cancelButtonText: 'ยกเลิก',
                    confirmButtonColor: '#10b981',
                    background: '#1e293b',
                    color: '#fff'
                });
                if (result.isConfirmed) router.push('/topup');
                return;
            }

            // Confirm Deduct
            const confirm = await Swal.fire({
                title: 'ยืนยันการวิเคราะห์',
                text: `วิเคราะห์ ${count} รายชื่อ ใช้ ${cost} เครดิต`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: `ยืนยัน (ใช้ ${cost} เครดิต)`,
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });

            if (!confirm.isConfirmed) return;

            // Process Deduction
            setIsAnalyzing(true);
            const { error } = await supabase.rpc('deduct_credits', { amount: cost });
            if (error) {
                console.error(error);
                Swal.fire('ข้อผิดพลาด', 'ไม่สามารถตัดเครดิตได้ กรุณาลองใหม่', 'error');
                setIsAnalyzing(false);
                return;
            }
            // Update local credits
            setUserCredits(prev => (prev !== null ? prev - cost : null));
            window.dispatchEvent(new Event('force_credits_update'));
        }

        // Perform Analysis
        setIsAnalyzing(true);

        // Slight delay to show loading state (UX)
        await new Promise(resolve => setTimeout(resolve, 800));

        const names = inputText.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .slice(0, 1000);

        const mapped = names.map((name, index) => {
            const analysis = analyzeName(name);
            return {
                id: index + 1,
                name,
                ...analysis!
            };
        });

        setResults(mapped);
        setIsAnalyzing(false);

        if (cost > 0) {
            Swal.fire({
                title: 'วิเคราะห์สำเร็จ!',
                text: `ตัด ${cost} เครดิตเรียบร้อยแล้ว`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1e293b',
                color: '#fff',
                toast: true,
                position: 'top-end'
            });
        }
    };

    // Sort Logic
    const sortedResults = [...results];
    if (isSorted) {
        const gradeWeight: Record<string, number> = { 'A+': 4, 'A': 3, 'B': 2, 'C': 1 };
        sortedResults.sort((a, b) => {
            const scoreA = gradeWeight[a.grade] || 0;
            const scoreB = gradeWeight[b.grade] || 0;
            if (scoreA !== scoreB) return scoreB - scoreA;
            return b.sum - a.sum;
        });
    }

    const handleClear = () => {
        if (window.confirm("ต้องการล้างข้อมูลรายชื่อทั้งหมดใช่หรือไม่?")) {
            setInputText("");
            setResults([]);
        }
    };

    const exportCSV = () => {
        const header = "ลำดับ,รายชื่อ,เกรด,ผลรวมชื่อ,วันที่ใช้ได้,วิเคราะห์คู่เลข\n";
        const rows = sortedResults.map(r => {
            const pairDisplay = r.pairs.map(p => `${p.pair}${p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}`).join(" - ");
            return `${r.id},${r.name},${r.grade},${r.sum},"${r.goodDays.join(", ")}",${pairDisplay}`;
        }).join("\n");
        const blob = new Blob(["\ufeff" + header + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `วิเคราะห์ชื่อมงคล_${new Date().getTime()}.csv`;
        link.click();
    };

    const handleExportPDF = async () => {
        const { toPng } = await import('html-to-image');
        const jsPDF = (await import('jspdf')).default;
        // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;

        if (!printRef.current) return;
        const scrollContainer = printRef.current.querySelector('.custom-scrollbar');
        const printHeader = printRef.current.querySelector('.print-header') as HTMLElement;
        const originalOverflow = scrollContainer ? (scrollContainer as HTMLElement).style.overflow : '';
        const originalHeight = scrollContainer ? (scrollContainer as HTMLElement).style.height : '';
        const originalHeaderDisplay = printHeader ? printHeader.style.display : '';

        if (scrollContainer) {
            (scrollContainer as HTMLElement).style.overflow = 'visible';
            (scrollContainer as HTMLElement).style.height = 'auto';
        }
        if (printHeader) {
            printHeader.style.display = 'block';
            printHeader.classList.remove('hidden');
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(printRef.current, { cacheBust: true, backgroundColor: '#0f172a' });
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`namemongkol-analysis-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการสร้าง PDF', 'error');
        } finally {
            if (scrollContainer) {
                (scrollContainer as HTMLElement).style.overflow = originalOverflow;
                (scrollContainer as HTMLElement).style.height = originalHeight;
            }
            if (printHeader) {
                printHeader.style.display = originalHeaderDisplay;
                printHeader.classList.add('hidden');
            }
        }
    };

    // Calculate current cost for display
    const currentCount = countNames(inputText);
    const cost = calculateCost(currentCount);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            <main className="w-full max-w-[1400px] transition-all duration-300 min-h-screen px-4 pt-20 md:pt-32 pb-28 relative overflow-hidden">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl space-y-8 pt-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <ClipboardList className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200">
                                    เช็คชื่อมงคล วิเคราะห์หลายชื่อพร้อมกัน
                                </h1>
                                <p className="text-indigo-300/80 font-medium text-sm flex items-center gap-2 mt-2">
                                    <CheckCircle2 className="w-4 h-4" /> จัดเกรด A+ ตรวจคู่เลข กาลกิณี สูงสุด 1,000 ชื่อ
                                </p>
                            </div>
                        </div>
                        {/* Credits Balance (Optional Display) */}
                        {userCredits !== null && (
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                                <span className="text-slate-400 text-sm">เครดิตคงเหลือ</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-amber-400 font-bold text-xl">{userCredits}</span>
                                    <Coins className="w-4 h-4 text-amber-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Input Panel */}
                        <div className="lg:col-span-4 space-y-6 sticky top-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-indigo-400" />
                                        รายชื่อที่ต้องการวิเคราะห์
                                    </h3>
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold border ${currentCount >= 1000
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                                        }`}>
                                        {currentCount.toLocaleString()} / 1,000
                                    </span>
                                </div>
                                <div>
                                    <textarea
                                        className="w-full h-[280px] p-6 text-lg border border-white/5 rounded-2xl focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 outline-none transition-all resize-none bg-slate-900/30 text-slate-200 placeholder:text-slate-600 font-medium custom-scrollbar leading-loose shadow-inner"
                                        placeholder="วางรายชื่อที่นี่...&#10;เช่น:&#10;ณวิธ&#10;กลิ่นหอม"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                </div>

                                {/* Analysis Action */}
                                <div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center text-sm px-1">
                                            <span className="text-slate-400">รายการวิเคราะห์:</span>
                                            <span className="font-bold text-white">{currentCount} รายชื่อ</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm px-1">
                                            <span className="text-slate-400">ค่าบริการ:</span>
                                            <span className="font-bold text-amber-400">
                                                {cost} เครดิต
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleAnalyzeClick}
                                            disabled={isAnalyzing || currentCount === 0 || currentCount > 1000}
                                            data-track="nameAnalysis.form.analyze"
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-lg"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                    กำลังวิเคราะห์...
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    เริ่มการวิเคราะห์
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Pricing Info */}
                                <div>
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
                                        <p className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                            <Info className="w-4 h-4" /> อัตราค่าบริการ (Credit)
                                        </p>
                                        <ul className="text-xs text-slate-400 space-y-2 ml-1">
                                            <li className="flex justify-between">
                                                <span>1 - 10 ชื่อ</span>
                                                <span className="text-amber-400 font-bold">5 Credit</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>11 - 100 ชื่อ</span>
                                                <span className="text-amber-400 font-bold">30 Credit</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>101 - 1,000 ชื่อ</span>
                                                <span className="text-amber-400 font-bold">100 Credit</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Display */}
                        <div className="lg:col-span-8">
                            <div ref={printRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[720px] flex flex-col pt-0">
                                {/* Actions Toolbar */}
                                {(results.length > 0) && (
                                    <div className="p-4 border-b border-white/[0.02] flex gap-3 justify-end bg-white/[0.01]">
                                        <button
                                            onClick={() => setIsSorted(!isSorted)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold border ${isSorted
                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                                : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <ArrowDownWideNarrow className="w-3 h-3" />
                                            {isSorted ? 'เรียงตามมงคล' : 'เรียงตามชื่อ'}
                                        </button>
                                        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-all text-xs font-bold border border-indigo-500/20">
                                            <Download className="w-3 h-3" /> CSV
                                        </button>
                                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg transition-all text-xs font-bold border border-rose-500/20">
                                            <Printer className="w-3 h-3" /> PDF
                                        </button>
                                        <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all text-xs font-bold border border-white/10">
                                            <Trash2 className="w-3 h-3" /> ล้าง
                                        </button>
                                    </div>
                                )}

                                {/* Print Header */}
                                <div className="bg-indigo-900/20 p-6 border-b border-indigo-500/30 mb-2 hidden print:block print-header">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <ClipboardList className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">NAMEMONGKOL</h1>
                                            <p className="text-indigo-200 text-sm">รายงานวิเคราะห์ชื่อมงคล</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-b border-white/5 bg-white/[0.02] font-bold text-slate-200 flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-lg">ตารางวิเคราะห์ผลลัพธ์</span>
                                    {isSorted && <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">เรียงตามความมงคล</span>}
                                </div>
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                    {sortedResults.length > 0 ? (
                                        <table className="w-full text-left border-collapse min-w-[700px]">
                                            <thead className="bg-indigo-950/40 sticky top-0 z-10 backdrop-blur-md">
                                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5">
                                                    <th className="px-6 py-4 w-16 text-center">#</th>
                                                    <th className="px-6 py-4 w-20 text-center">เกรด</th>
                                                    <th className="px-6 py-4">ชื่อ</th>
                                                    <th className="px-6 py-4 text-center">ผลรวม</th>
                                                    <th className="px-6 py-4">วันที่มงคล</th>
                                                    <th className="px-6 py-4">คู่เลข</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {sortedResults.map((row) => (
                                                    <tr
                                                        key={row.id}
                                                        className="hover:bg-white/[0.05] transition-colors group cursor-pointer"
                                                        onClick={() => setSelectedResult(row)}
                                                    >
                                                        <td className="px-6 py-6 text-slate-500 font-mono text-center text-sm group-hover:text-indigo-400 transition-colors">
                                                            {row.id.toString().padStart(3, '0')}
                                                        </td>
                                                        <td className="px-6 py-6 text-center">
                                                            <div className={`
                                                                w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border
                                                                ${row.grade === 'A+' ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' :
                                                                    row.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                                        row.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                                            'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                                                            `}>
                                                                {row.grade}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{row.name}</span>
                                                        </td>
                                                        <td className="px-6 py-6 text-center">
                                                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform border border-white/10">
                                                                {row.sum}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                                                                {row.goodDays.length > 0 ? (
                                                                    row.goodDays.map(day => (
                                                                        <span key={day} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase">
                                                                            {day}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-rose-400 text-[11px] font-medium flex items-center gap-1 opacity-70">
                                                                        <XCircle className="w-3 h-3" /> ไม่แนะนำ
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {row.pairs.length > 0 ? row.pairs.map((p, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <div className={`flex flex-col items-center px-2 py-1.5 rounded-lg border transition-all min-w-[40px] ${p.type === 'GREEN' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                                                            p.type === 'ORANGE' ? 'bg-orange-500/10 border-orange-500/20' :
                                                                                'bg-rose-500/10 border-rose-500/20'
                                                                            }`}>
                                                                            <span className={`text-sm font-bold leading-none mb-1 ${p.type === 'GREEN' ? 'text-emerald-400' :
                                                                                p.type === 'ORANGE' ? 'text-orange-400' :
                                                                                    'text-rose-400'
                                                                                }`}>
                                                                                {p.pair}
                                                                            </span>
                                                                            <span className="text-[10px] opacity-80">
                                                                                {p.type === 'GREEN' ? '🟢' : p.type === 'ORANGE' ? '🟠' : '🔴'}
                                                                            </span>
                                                                        </div>
                                                                        {i < row.pairs.length - 1 && <span className="text-slate-600 text-xs">›</span>}
                                                                    </React.Fragment>
                                                                )) : <span className="text-slate-600 text-xs italic">สั้นเกินไป</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-6 py-32">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                                                <Search className="w-8 h-8 opacity-30 text-white" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-xl font-bold text-slate-400">ระบุรายชื่อเพื่อเริ่มต้น</p>
                                                <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">
                                                    {userCredits === null ? 'กรุณาเข้าสู่ระบบ' : 'กดปุ่มเพื่อเริ่มวิเคราะห์'}
                                                </p>
                                            </div>
                                            {userCredits === null && (
                                                <button
                                                    onClick={() => router.push('/login')}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all font-bold"
                                                >
                                                    <LogIn className="w-4 h-4" /> เข้าสู่ระบบ
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend / Key Summary */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl border border-emerald-500/20">🟢</div>
                            <div>
                                <p className="font-bold text-emerald-400 text-sm">คู่เลขมงคล (Good)</p>
                                <p className="text-slate-500 text-xs mt-0.5">ส่งเสริมด้านโชคลาภ/บารมี</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl border border-orange-500/20">🟠</div>
                            <div>
                                <p className="font-bold text-orange-400 text-sm">ปานกลาง (Average)</p>
                                <p className="text-slate-500 text-xs mt-0.5">เหนื่อยแต่สำเร็จ/ต้องอดทน</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center text-xl border border-rose-500/20">🔴</div>
                            <div>
                                <p className="font-bold text-rose-400 text-sm">ควรระวัง (Caution)</p>
                                <p className="text-slate-500 text-xs mt-0.5">อาจมีอุปสรรค/ปัญหาสุขภาพ</p>
                            </div>
                        </div>
                    </div>

                    {/* ==================== SEO Content Sections ==================== */}

                    {/* Why Bulk Analysis */}
                    <section className="mt-24 mb-16 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 mb-6 tracking-tight leading-tight">
                            ทำไมต้องใช้ Bulk Analysis วิเคราะห์ชื่อแบบกลุ่ม?
                        </h2>
                        <p className="text-center text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                            เครื่องมือที่ช่วยให้คุณตรวจสอบและเปรียบเทียบชื่อหลายชื่อได้ในคลิกเดียว ประหยัดเวลา และตัดสินใจได้แม่นยำขึ้น
                        </p>
                        <div className="grid md:grid-cols-4 gap-6">
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/25 transition-all group">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-200 mb-3">รวดเร็วทันใจ</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    วิเคราะห์ได้สูงสุด 1,000 ชื่อพร้อมกันในไม่กี่วินาที ไม่ต้องพิมพ์ทีละชื่อ
                                </p>
                            </article>
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/25 transition-all group">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowDownWideNarrow className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-200 mb-3">จัดเกรดอัตโนมัติ</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    ระบบจัดเกรด A+, A, B, C อัตโนมัติ พร้อมเรียงลำดับจากดีที่สุด
                                </p>
                            </article>
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/25 transition-all group">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FileSpreadsheet className="w-7 h-7 text-amber-400" />
                                </div>
                                <h3 className="font-semibold text-slate-200 mb-2">Export CSV/PDF</h3>
                                <p className="text-slate-400 text-sm">
                                    ดาวน์โหลดผลลัพธ์เป็น Excel หรือ PDF สำหรับพิมพ์หรือแชร์ได้ทันที
                                </p>
                            </article>
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/25 transition-all group">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-7 h-7 text-rose-400" />
                                </div>
                                <h3 className="font-semibold text-slate-200 mb-2">เหมาะกับทุกคน</h3>
                                <p className="text-slate-400 text-sm">
                                    พ่อแม่ตั้งชื่อลูก, ผู้เปลี่ยนชื่อ, นักเลขศาสตร์, HR บริษัท
                                </p>
                            </article>
                        </div>
                    </section>

                    {/* Pricing Tiers Table */}
                    <section className="mt-16 mb-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-300 mb-8">
                            ราคาตามจำนวนรายชื่อ
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Entry Tier */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                                <div className="text-center mb-6">
                                    <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-3">ENTRY</span>
                                    <h3 className="text-xl font-bold text-slate-200">1 - 10 ชื่อ</h3>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-emerald-400">5</span>
                                        <span className="text-slate-400 ml-1">เครดิต</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> เหมาะสำหรับทดลองใช้</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ตั้งชื่อลูก 2-3 ตัวเลือก</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ผลลัพธ์ครบทุกฟีเจอร์</li>
                                </ul>
                            </div>
                            {/* Standard Tier */}
                            <div className="bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6 relative scale-105 shadow-xl shadow-indigo-500/10">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full">แนะนำ</span>
                                </div>
                                <div className="text-center mb-6">
                                    <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full mb-3">STANDARD</span>
                                    <h3 className="text-xl font-bold text-slate-200">11 - 100 ชื่อ</h3>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-indigo-400">30</span>
                                        <span className="text-slate-400 ml-1">เครดิต</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> เหมาะสำหรับเปรียบเทียบ</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> มีหลายตัวเลือกให้เลือก</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> คุ้มค่าที่สุด!</li>
                                </ul>
                            </div>
                            {/* Power User Tier */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                                <div className="text-center mb-6">
                                    <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full mb-3">POWER USER</span>
                                    <h3 className="text-xl font-bold text-slate-200">101 - 1,000 ชื่อ</h3>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-amber-400">100</span>
                                        <span className="text-slate-400 ml-1">เครดิต</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> สำหรับนักเลขศาสตร์</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> HR วิเคราะห์พนักงาน</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> ประมวลผลจำนวนมาก</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How to Use Steps */}
                    <section className="mt-16 mb-12 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 mb-8">
                            วิธีใช้งานใน 3 ขั้นตอน
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-5 items-start bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 mb-2">วางรายชื่อที่ต้องการวิเคราะห์</h3>
                                    <p className="text-slate-400 text-sm">
                                        พิมพ์หรือ Copy/Paste รายชื่อลงในช่อง โดยใส่ <strong className="text-cyan-400">1 ชื่อต่อ 1 บรรทัด</strong> รองรับสูงสุด 1,000 ชื่อต่อครั้ง
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 mb-2">กดปุ่ม &quot;เริ่มวิเคราะห์&quot;</h3>
                                    <p className="text-slate-400 text-sm">
                                        ระบบจะตัดเครดิตตามจำนวนชื่อ (5/30/100 เครดิต) และประมวลผลทันที ใช้เวลาไม่ถึง 5 วินาที
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 mb-2">ดูผลลัพธ์และ Export</h3>
                                    <p className="text-slate-400 text-sm">
                                        ดูเกรด, ผลรวม, คู่ตัวเลข และวันที่ใช้ได้ จัดเรียงตามเกรด และ Export เป็น <strong className="text-cyan-400">CSV</strong> หรือ <strong className="text-cyan-400">PDF</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases */}
                    <section className="mt-16 mb-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-pink-300 mb-8">
                            ใครควรใช้ Bulk Analysis?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
                                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">👶</span> พ่อแม่ที่กำลังตั้งชื่อลูก
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    มีรายชื่อที่ชอบหลายชื่อ? วางทั้งหมดแล้วให้ระบบจัดเกรดและเปรียบเทียบให้ เลือกชื่อที่ดีที่สุดได้ง่ายขึ้น
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
                                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">✨</span> ผู้ที่ต้องการเปลี่ยนชื่อ
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    คิดชื่อใหม่ไว้หลายตัวเลือก? วิเคราะห์พร้อมกันแล้วเลือกชื่อที่มีเกรด A+ เพื่อเปลี่ยนแปลงชีวิตให้ดีขึ้น
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
                                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">🔮</span> นักเลขศาสตร์และหมอดู
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    รับตั้งชื่อให้ลูกค้าหลายคน? ใช้ Bulk Analysis ประมวลผลรายชื่อจำนวนมากได้รวดเร็ว พร้อม Export รายงาน PDF
                                </p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
                                <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">🏢</span> HR และฝ่ายบุคคล
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    วิเคราะห์ชื่อพนักงานหรือทีมงาน เพื่อดูภาพรวมความเป็นมงคลและความเหมาะสมในการทำงานร่วมกัน
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="mt-16 mb-12 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-purple-300 mb-8">
                            <HelpCircle className="inline-block w-7 h-7 mr-2 mb-1" />
                            คำถามที่พบบ่อย (FAQ)
                        </h2>
                        <div className="space-y-4">
                            <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer open:bg-white/[0.05] transition-colors">
                                <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                    Bulk Analysis วิเคราะห์ได้กี่ชื่อพร้อมกัน?
                                    <span className="transition-transform group-open:rotate-180 text-violet-400">▼</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm pl-4 border-l-2 border-violet-500">
                                    รองรับสูงสุด <strong className="text-violet-300">1,000 ชื่อต่อครั้ง</strong> โดยแบ่งเป็น 3 ระดับ: Entry (1-10 ชื่อ = 5 เครดิต), Standard (11-100 ชื่อ = 30 เครดิต), Power User (101-1,000 ชื่อ = 100 เครดิต)
                                </p>
                            </details>

                            <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer open:bg-white/[0.05] transition-colors">
                                <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                    เกรด A+ หมายความว่าอย่างไร?
                                    <span className="transition-transform group-open:rotate-180 text-violet-400">▼</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm pl-4 border-l-2 border-violet-500">
                                    เกรด A+ คือชื่อที่มี<strong className="text-violet-300">ผลรวมเลขศาสตร์เป็นมงคลสูงสุด</strong> มีคู่ตัวเลขที่ดี (🟢) และใช้ได้กับหลายวันเกิด ถือเป็นชื่อที่แนะนำอย่างยิ่ง
                                </p>
                            </details>

                            <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer open:bg-white/[0.05] transition-colors">
                                <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                    คู่ตัวเลข 🟢🟠🔴 หมายความว่าอย่างไร?
                                    <span className="transition-transform group-open:rotate-180 text-violet-400">▼</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm pl-4 border-l-2 border-violet-500">
                                    🟢 <strong className="text-emerald-400">สีเขียว</strong> = คู่ตัวเลขมงคล ส่งเสริมโชคลาภและบารมี<br />
                                    🟠 <strong className="text-orange-400">สีส้ม</strong> = ปานกลาง ต้องอดทนแต่จะสำเร็จ<br />
                                    🔴 <strong className="text-rose-400">สีแดง</strong> = ควรระวัง อาจมีอุปสรรคหรือปัญหาสุขภาพ
                                </p>
                            </details>

                            <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer open:bg-white/[0.05] transition-colors">
                                <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                    สามารถ Export ผลลัพธ์ออกมาได้ไหม?
                                    <span className="transition-transform group-open:rotate-180 text-violet-400">▼</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm pl-4 border-l-2 border-violet-500">
                                    ได้! ระบบรองรับการ Export เป็น <strong className="text-violet-300">CSV</strong> สำหรับใช้ใน Excel/Google Sheets และ <strong className="text-violet-300">PDF</strong> สำหรับพิมพ์หรือแชร์
                                </p>
                            </details>

                            <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-5 cursor-pointer open:bg-white/[0.05] transition-colors">
                                <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                    ต่างจากวิเคราะห์ชื่อฟรีหน้าแรกอย่างไร?
                                    <span className="transition-transform group-open:rotate-180 text-violet-400">▼</span>
                                </summary>
                                <p className="mt-4 text-slate-400 text-sm pl-4 border-l-2 border-violet-500">
                                    <Link href="/" className="text-violet-400 hover:underline">หน้าแรก</Link> วิเคราะห์ทีละ 1 ชื่อ+นามสกุล ฟรี<br />
                                    <strong className="text-violet-300">Bulk Analysis</strong> วิเคราะห์หลายชื่อพร้อมกัน (สูงสุด 1,000 ชื่อ) พร้อมจัดเกรดและเปรียบเทียบ
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Methodology Section — EEAT + AEO */}
                    <section className="mt-16 mb-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300 mb-4">
                            หลักการคำนวณเลขศาสตร์ในชื่อ
                        </h2>
                        <p className="text-center text-slate-400 mb-10 max-w-2xl mx-auto text-sm">
                            NameMongkol ใช้ตำราเลขศาสตร์ไทยโบราณ แบ่งอักษรไทย 44 ตัวเป็น 9 กลุ่มค่า (1-9)
                            แล้วนำค่าแต่ละตัวอักษรมาวิเคราะห์ 3 มิติ เพื่อให้ได้ผลลัพธ์ที่ครบถ้วนและน่าเชื่อถือ
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                                <div className="text-3xl mb-3">🔢</div>
                                <h3 className="font-semibold text-slate-200 mb-2">1. ผลรวมเลขศาสตร์</h3>
                                <p className="text-slate-400 text-sm">
                                    รวมค่าตัวเลขของทุกอักษรในชื่อ แล้วเทียบกับ
                                    <strong className="text-emerald-400"> ตัวเลขมงคล 27 ค่า</strong>
                                    {' '}(เช่น 9, 14, 15, 24, 36, 45, 99)
                                    ชื่อที่ผลรวมตรงถือว่าเป็นมงคลตามตำรา
                                </p>
                            </article>
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                                <div className="text-3xl mb-3">🔗</div>
                                <h3 className="font-semibold text-slate-200 mb-2">2. คู่ตัวเลข (Pair Analysis)</h3>
                                <p className="text-slate-400 text-sm">
                                    จับคู่ค่าอักษรที่อยู่ติดกันเป็นเลข 2 หลัก
                                    เทียบกับ <strong className="text-emerald-400">48 คู่มงคล (🟢)</strong>,
                                    {' '}3 คู่กลาง (🟠) และคู่เตือน (🔴)
                                    — ชื่อเกรด A+ ต้องไม่มีคู่แดงเลย
                                </p>
                            </article>
                            <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                                <div className="text-3xl mb-3">📅</div>
                                <h3 className="font-semibold text-slate-200 mb-2">3. กาลกิณี (วันเกิด)</h3>
                                <p className="text-slate-400 text-sm">
                                    ตรวจว่าชื่อมีอักษร <strong className="text-rose-400">กาลกิณี</strong> ของวันเกิดใดบ้าง
                                    เช่น คนเกิดวันอาทิตย์ ห้ามมี ศ ษ ส ฬ ฮ ห
                                    — ระบบจะบอกว่าชื่อนี้ <strong className="text-emerald-400">ใช้ได้กับวันอะไร</strong>
                                </p>
                            </article>
                        </div>
                    </section>

                    {/* Comparison Section — Competitor Differentiation */}
                    <section className="mt-16 mb-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-300 mb-8">
                            NameMongkol vs เว็บวิเคราะห์ชื่ออื่น
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-slate-400 uppercase border-b border-white/10">
                                        <th className="px-4 py-3">ฟีเจอร์</th>
                                        <th className="px-4 py-3 text-center text-amber-400">NameMongkol</th>
                                        <th className="px-4 py-3 text-center text-slate-500">เว็บทั่วไป</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">วิเคราะห์หลายชื่อพร้อมกัน (สูงสุด 1,000)</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">จัดเกรดอัตโนมัติ (A+/A/B/C)</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">วิเคราะห์คู่เลข 🟢🟠🔴</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">ตรวจกาลกิณี 7 วัน</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-slate-500">บางเว็บ</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">Export CSV / PDF</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">เรียงลำดับตามความมงคล</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-3 text-slate-300">วิเคราะห์เชิงลึก 4 ศาสตร์ (Premium)</td>
                                        <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                                        <td className="px-4 py-3 text-center text-rose-400">❌</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Auspicious Numbers Section — AEO Direct Answer */}
                    <section className="mt-16 mb-12 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-fuchsia-300 mb-4">
                            ผลรวมเลขศาสตร์ชื่อเท่าไหร่ถือว่ามงคล?
                        </h2>
                        <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto text-sm">
                            ตามตำราเลขศาสตร์ไทยโบราณ ผลรวมตัวเลขของชื่อที่ถือว่าเป็นมงคล มีทั้งหมด 27 ค่า ดังนี้
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {[9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65, 90, 91, 92, 95, 99].map(num => (
                                <span key={num} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold">
                                    {num}
                                </span>
                            ))}
                        </div>
                        <p className="text-center text-slate-500 text-xs">
                            ชื่อที่มีผลรวมตรงกับเลขมงคลด้านบน + ไม่มีคู่เลขแดง (🔴) = ได้เกรด A ขึ้นไป
                        </p>
                    </section>

                    {/* Internal Links */}
                    <section className="mt-16 mb-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-slate-300 mb-8">
                            บริการอื่นๆ ที่เกี่ยวข้อง
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link
                                href="/"
                                className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/25 hover:bg-white/[0.05] transition-all"
                            >
                                <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">
                                    🔮 วิเคราะห์ชื่อ-นามสกุล (ฟรี)
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    วิเคราะห์ชื่อ+นามสกุลทีละคู่ ดูคะแนนรวม เกรด และคำทำนายตามหลักเลขศาสตร์ ฟรีไม่จำกัด
                                </p>
                            </Link>
                            <Link
                                href="/search"
                                className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/25 hover:bg-white/[0.05] transition-all"
                            >
                                <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">
                                    🔍 ค้นหาชื่อมงคล
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    ค้นหาชื่อมงคลกว่า 5,000 ชื่อ กรองตามวันเกิด เพศ และผลรวมตัวเลขที่ต้องการ
                                </p>
                            </Link>
                            <Link
                                href="/premium-analysis"
                                className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                            >
                                <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                                    💎 วิเคราะห์ชื่อขั้นสูง (Premium)
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    วิเคราะห์เชิงลึกด้วย AI รวมถึงอายตนะ เงาอำนาจ และ Wallpaper มงคลสำหรับมือถือ
                                </p>
                            </Link>
                            <Link
                                href="/phone-analysis"
                                className="group block bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-500/25 hover:bg-white/[0.05] transition-all"
                            >
                                <h3 className="font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">
                                    📱 เช็คเบอร์มงคลกราฟพลังงาน 6 ด้าน
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    วิเคราะห์คู่เลข ผลรวม และเกรด A-F เพื่อเช็คว่าเบอร์นี้ส่งเสริมหรือควรเปลี่ยน
                                </p>
                            </Link>
                        </div>
                    </section>

                    {/* ==================== End SEO Content Sections ==================== */}
                </div>
            </main>
            {/* Detail Modal */}
            {selectedResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden my-auto">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setSelectedResult(null)}
                                className="bg-black/10 hover:bg-black/20 text-slate-600 rounded-full p-2 transition-colors"
                            >
                                <XCircle className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <NameAnalysisDetailCard
                                firstName={selectedResult.name.split(' ')[0]}
                                lastName={selectedResult.name.split(' ').slice(1).join(' ') || ''}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
