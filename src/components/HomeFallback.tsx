import React from 'react';
import { HeroBanner } from '@/components/HeroBanner';
import { RefreshCw, Sparkles } from 'lucide-react';

type HomeFallbackProps = {
    heroHeadingLevel?: 'h1' | 'h2';
};

export const HomeFallback = ({ heroHeadingLevel = 'h1' }: HomeFallbackProps) => {
    return (
        <div className="w-full max-w-lg animate-fade-in-up">
            <HeroBanner headingLevel={heroHeadingLevel} />

            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-[#ddddf0]">
                <div className="space-y-5 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a3e] mb-2 ml-1">วันเกิด</label>
                        <div className="relative">
                            <div className="w-full bg-[#f8f8fc] border border-[#ddddf0] rounded-xl px-4 py-3 text-base sm:text-lg h-[54px] flex items-center text-[#5a5a82]">
                                วันอาทิตย์ (กลางวัน)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a3e] mb-2 ml-1">ชื่อจริง</label>
                            <div className="w-full bg-[#f8f8fc] border border-[#ddddf0] rounded-xl px-4 py-3 text-base sm:text-lg h-[54px]"></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a3e] mb-2 ml-1">นามสกุล</label>
                            <div className="w-full bg-[#f8f8fc] border border-[#ddddf0] rounded-xl px-4 py-3 text-base sm:text-lg h-[54px]"></div>
                        </div>
                    </div>

                    <div className="w-full rounded-xl py-3.5 sm:py-4 font-semibold text-base sm:text-lg bg-[#ddddf0] text-[#5a5a82] flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" /> วิเคราะห์ดวงชะตา
                    </div>
                </div>
            </div>
        </div>
    );
};
