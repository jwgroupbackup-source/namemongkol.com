import Link from 'next/link';
import { ClipboardList, ChevronRight, Users, Zap } from 'lucide-react';

interface BulkAnalysisUpsellProps {
    /** ชื่อที่เพิ่งวิเคราะห์ เพื่อสร้าง personalized copy */
    currentName?: string;
}

export const BulkAnalysisUpsell: React.FC<BulkAnalysisUpsellProps> = ({ currentName }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-[#ddddf0] bg-white shadow-sm p-5">

            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {/* Glow */}
            <div className="absolute top-[-40%] right-[-10%] w-64 h-64 rounded-full bg-indigo-50 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">

                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <ClipboardList className="w-6 h-6 text-white" />
                </div>

                {/* Copy */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a1a3e] text-sm sm:text-base leading-snug">
                        {currentName
                            ? <>มีชื่ออื่นนอกจาก <span className="text-indigo-600">{currentName}</span> ให้เปรียบเทียบไหม?</>
                            : 'วิเคราะห์หลายชื่อพร้อมกันได้ในคลิกเดียว'}
                    </p>
                    <p className="mt-1 text-[11px] sm:text-xs text-[#5a5a82]">
                        ฟีเจอร์นี้ต้องเข้าสู่ระบบและใช้เครดิตก่อนเริ่มวิเคราะห์
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-[#8e8eaa]">
                            <Zap className="w-3 h-3 text-indigo-500" />
                            สูงสุด 1,000 ชื่อ
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-[#8e8eaa]">
                            <Users className="w-3 h-3 text-violet-500" />
                            จัดเกรด A+ A B C อัตโนมัติ
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href="/name-analysis"
                    data-track="home.bulk_cta.click"
                    className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-sm rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                >
                    วิเคราะห์หลายชื่อ
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
