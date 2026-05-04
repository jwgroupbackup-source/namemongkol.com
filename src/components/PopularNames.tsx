import { Sparkles, TrendingUp, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PopularNames() {
  const [popular, setPopular] = useState<{ name: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
          const res = await fetch('/api/public/popular-names');
          const json = await res.json();
          if (json.success && json.data) {
              setPopular(json.data);
          }
      } catch (err) {
          console.error('Error fetching popular names:', err);
      } finally {
          setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <section className="mt-8 mb-8 w-full max-w-5xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-sm">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold tracking-wide text-amber-300">สถิติยอดนิยม</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 flex flex-wrap items-center justify-center gap-2">
          10 อันดับชื่อมงคลยอดฮิตประจำสัปดาห์
          <Sparkles className="w-6 h-6 text-amber-400" />
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          อัปเดตรายชื่อมงคลที่มีผู้สนใจมากที่สุด พร้อมผลรวมที่ดีเยี่ยมและสามารถใช้งานได้สำหรับคนเกิดทุกวัน
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <span className="text-slate-400 text-sm animate-pulse tracking-wide">กำลังจัดเตรียมชื่อมงคล...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-5">
          {popular.map((item, index) => (
            <div 
              key={index + item.name} 
              className="group relative flex flex-col justify-between p-2 md:p-5 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl"
            >
              {/* Ranking Badge */}
              <div className={`absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 rounded-bl-lg md:rounded-bl-2xl flex items-center justify-center text-[10px] md:text-sm font-bold border-b border-l border-white/5 z-10 transition-all duration-300 ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-500/50 shadow-[-4px_4px_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'}`}>
                  {index + 1}
              </div>

              <div className="flex flex-col items-center text-center gap-1.5 md:gap-4 pt-3 mt-1 md:mt-0 md:pt-4 pb-1 md:pb-2 z-10 w-full">
                <span className="text-xs md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 group-hover:from-amber-200 group-hover:to-amber-500 transition-all duration-300 leading-tight truncate w-full px-1">
                    {item.name}
                </span>
                
                <div className="inline-flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3.5 py-0.5 md:py-1.5 rounded-full bg-black/40 border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-300 shadow-inner max-w-full">
                  <Star className="w-2 h-2 md:w-3.5 md:h-3.5 text-amber-400 group-hover:fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] transition-all duration-300 flex-shrink-0" />
                  <span className="text-[8px] md:text-xs font-semibold text-amber-300 whitespace-nowrap overflow-hidden text-ellipsis">คะแนน {item.score}</span>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-10 md:-right-10 w-12 h-12 md:w-24 md:h-24 bg-amber-500/10 rounded-full blur-md md:blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
