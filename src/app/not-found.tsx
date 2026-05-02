import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'ไม่พบหน้าที่ต้องการ (404)',
    description: 'ไม่พบหน้าที่คุณกำลังค้นหา กรุณากลับไปหน้าหลักเพื่อวิเคราะห์ชื่อมงคล',
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative z-10">
            
            {/* Background glowing effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="text-center max-w-lg bg-slate-900/40 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-3xl shadow-2xl relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl rotate-12">
                    <span className="text-4xl">🔭</span>
                </div>
                
                <h1 className="text-7xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 bg-clip-text text-transparent mb-2 mt-4">
                    404
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    ไม่พบหน้าที่ต้องการ
                </h2>
                
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full mx-auto mb-6"></div>
                
                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                    หน้าที่คุณกำลังค้นหาอาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่แล้วในจักรวาลนี้
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
                    >
                        <span>🏠</span> กลับหน้าหลัก
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all"
                    >
                        <span>🔍</span> ค้นหาชื่อมงคล
                    </Link>
                </div>
            </div>
        </div>
    );
}
