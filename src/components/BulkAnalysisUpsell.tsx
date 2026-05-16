import Link from 'next/link';
import { ClipboardList, ChevronRight, Users, Zap } from 'lucide-react';

interface BulkAnalysisUpsellProps {
    /** ชื่อที่เพิ่งวิเคราะห์ เพื่อสร้าง personalized copy */
    currentName?: string;
}

export const BulkAnalysisUpsell: React.FC<BulkAnalysisUpsellProps> = ({ currentName }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-indigo-500/25 bg-gradient-to-br from-indigo-950/60 via-violet-950/40 to-slate-900/60 backdrop-blur-xl shadow-xl shadow-indigo-900/20 p-5">

            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {/* Glow */}
            <div className="absolute top-[-40%] right-[-10%] w-64 h-64 rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">

                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <ClipboardList className="w-6 h-6 text-white" />
                </div>

                {/* Copy */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm sm:text-base leading-snug">
                        {currentName
                            ? <>มีชื่ออื่นนอกจาก <span className="text-indigo-300">{currentName}</span> ให้เปรียบเทียบไหม?</>
                            : 'วิเคราะห์หลายชื่อพร้อมกันได้ในคลิกเดียว'}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Zap className="w-3 h-3 text-indigo-400" />
                            สูงสุด 1,000 ชื่อ
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Users className="w-3 h-3 text-violet-400" />
                            จัดเกรด A+ A B C อัตโนมัติ
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/name-analysis"
                    className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                >
                    วิเคราะห์หลายชื่อ
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
