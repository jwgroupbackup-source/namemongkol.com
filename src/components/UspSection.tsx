import React from 'react';
import { Search, Layers, Activity } from 'lucide-react';

export const UspSection = () => {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-16 relative z-10">
            <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    จุดเด่นของการตั้งชื่อมงคล กับ NameMongkol
                </h2>
                <p className="text-slate-400 max-w-[65ch] mx-auto text-base sm:text-lg leading-relaxed">
                    เช็คชื่อตัวเองหรือตั้งชื่อลูกใหม่ได้อย่างแม่นยำและใช้งานฟรี ผสาน 4 ศาสตร์หลักของไทยไว้ในหน้าเดียว ช่วยให้คุณได้ชื่อมงคลที่ดีที่สุด
                </p>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 pb-2 sm:gap-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0 md:snap-none">
                {/* USP 1 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Search size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        วิเคราะห์เจาะลึกคู่เลขมงคล
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        ไม่ใช่แค่ดูผลรวม แต่เราถอดรหัส <strong>&quot;ทุกคู่ตัวเลข&quot;</strong> ในชื่อ-นามสกุล เพื่อหาจุดเด่นและแนวทางแก้ไขก่อนตัดสินใจเปลี่ยนชื่อจริง
                    </p>
                </div>

                {/* USP 2 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Layers size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        ผสาน 4 ศาสตร์สำคัญ
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        วิเคราะห์ครบมิติด้วย <strong>เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 และนิรันดร์ศาสตร์</strong> ดูง่าย ครบจบในหน้าจอเดียว
                    </p>
                </div>

                {/* USP 3 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Activity size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        ถอดรหัสลึกถึงพลังเงา
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        เช็กชื่อฟรีเบื้องต้น พร้อมตัวเลือกปลดล็อกดู <strong>&quot;พลังเงา&quot;</strong> และคำทำนายพรีเมียม เพื่อกรองชื่อที่ดีที่สุดสำหรับคุณ
                    </p>
                </div>
            </div>
        </section>
    );
};
