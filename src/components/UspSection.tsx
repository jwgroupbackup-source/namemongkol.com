import React from 'react';
import { Search, Layers, Activity } from 'lucide-react';

export const UspSection = () => {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-16 relative z-10">
            <div className="text-center mb-10 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    ทำไมต้องวิเคราะห์ชื่อกับ NameMongkol?
                </h2>
                <p className="text-slate-400 max-w-[65ch] mx-auto text-base sm:text-lg leading-relaxed">
                    เริ่มเช็กชื่อของตัวเองหรือหาชื่อมงคลให้ลูกได้ฟรีทันที แล้วค่อยต่อยอดด้วยข้อมูลเชิงลึกที่แม่นยำกว่า จากการผสาน 4 ศาสตร์หลักไว้ใน flow เดียว
                </p>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 pb-2 sm:gap-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0 md:snap-none">
                {/* USP 1 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Search size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        Micro-Analysis (คู่เลขมงคล)
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        ไม่ใช่แค่ดูผลรวม แต่เราถอดรหัส <strong>&quot;ทุกคู่ตัวเลข&quot;</strong> ในชื่อและนามสกุล เพื่อค้นหาจุดดี จุดเสี่ยง และแนวทางปรับใช้ก่อนตัดสินใจเปลี่ยนชื่อจริง
                    </p>
                </div>

                {/* USP 2 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Layers size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        Multi-Dimensional Logic
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        รวม <strong>เลขศาสตร์ + ทักษาปกรณ์ + อายตนะ 6 + นิรันดร์ศาสตร์</strong> เพื่อให้ทั้งคนเช็กชื่อเดิมและคนตั้งชื่อลูกเห็นภาพครบในหน้าจอเดียว
                    </p>
                </div>

                {/* USP 3 */}
                <div className="w-[86%] shrink-0 snap-start bg-white/5 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group md:w-auto md:shrink md:snap-none backdrop-blur-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                        <Activity size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight group-hover:text-amber-400 transition-colors">
                        Visual Data & Shadow Power
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                        เริ่มจากผลฟรีที่อ่านง่ายก่อน แล้วค่อยปลดล็อก <strong>&quot;พลังเงา&quot;</strong> และคำทำนายเชิงลึกเมื่อคุณต้องการบันทึกผลหรือเทียบหลายชื่อแบบจริงจัง
                    </p>
                </div>
            </div>
        </section>
    );
};
