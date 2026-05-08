'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { saveAnalysisResult } from '@/services/analysisService';
import { checkNirunName } from '@/app/actions/checkNirunName';
import { InputForm } from '@/components/InputForm';
import { ResultHeader } from '@/components/ResultHeader';
import { ResultTotalScoreCard } from '@/components/ResultTotalScoreCard';
import { PairAnalysisCard } from '@/components/PairAnalysisCard';
import { ThaksaTable } from '@/components/ThaksaTable';
import { ShadowPowerCard } from '@/components/ShadowPowerCard';
import { PredictionCard } from '@/components/PredictionCard';
import { PremiumBlurOverlay } from '@/components/PremiumBlurOverlay';
import { ShareButton } from '@/components/ShareButton';
import { BeforeAfterComparison } from '@/components/BeforeAfterComparison';
import { calculateScore } from '@/utils/calculateScore';
import { analyzePairs } from '@/utils/analyzePairs';
import { analyzeThaksa } from '@/utils/analyzeThaksa';
import { getPrediction } from '@/utils/getPrediction';
import { calculateAyatana } from '@/utils/ayatana';
import { calculateGrade } from '@/utils/gradeResult';
import { AnalysisResult } from '@/types';
import { HeroBanner } from '@/components/HeroBanner';
import { HomeFallback } from '@/components/HomeFallback';
import { NumerologyDecodeTable } from '@/components/NumerologyDecodeTable';
import { useLanguage } from '@/components/LanguageProvider';

// Dynamic Imports for heavy components below the fold or conditional
const WallpaperShowcase = dynamic(() => import('@/components/WallpaperShowcase').then(mod => mod.WallpaperShowcase), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/50 rounded-2xl" />
});
const WallpaperUpsell = dynamic(() => import('@/components/WallpaperUpsell').then(mod => mod.WallpaperUpsell));
const KnowledgeSection = dynamic(() => import('@/components/KnowledgeSection').then(mod => mod.KnowledgeSection));
const ArticleSection = dynamic(() => import('@/components/ArticleSection').then(mod => mod.ArticleSection));
const FAQSection = dynamic(() => import('@/components/FAQSection').then(mod => mod.FAQSection));
const HomeSeoContent = dynamic(() => import('@/components/HomeSeoContent').then(mod => mod.HomeSeoContent));
const TestimonialSection = dynamic(() => import('@/components/TestimonialSection').then(mod => mod.TestimonialSection));
const WelcomeOffer = dynamic(() => import('@/components/WelcomeOffer').then(mod => mod.WelcomeOffer), { ssr: false });
const UspSection = dynamic(() => import('@/components/UspSection').then(mod => mod.UspSection));
const ComparisonSection = dynamic(() => import('@/components/ComparisonSection').then(mod => mod.ComparisonSection));
const BirthdayThaksaSection = dynamic(() => import('@/components/BirthdayThaksaSection').then(mod => mod.BirthdayThaksaSection));
const TrustStrip = dynamic(() => import('@/components/TrustStrip').then(mod => mod.TrustStrip));
const PrivacyStrip = dynamic(() => import('@/components/PrivacyStrip').then(mod => mod.PrivacyStrip));
const HowItWorksSection = dynamic(() => import('@/components/HowItWorksSection').then(mod => mod.HowItWorksSection));
const InlineSignupCTA = dynamic(() => import('@/components/InlineSignupCTA').then(mod => mod.InlineSignupCTA), { ssr: false });
const SaveResultCTA = dynamic(() => import('@/components/SaveResultCTA').then(mod => mod.SaveResultCTA), { ssr: false });
const BulkAnalysisUpsell = dynamic(() => import('@/components/BulkAnalysisUpsell').then(mod => mod.BulkAnalysisUpsell));
const BulkAnalysisBanner = dynamic(() => import('@/components/BulkAnalysisBanner').then(mod => mod.BulkAnalysisBanner));

type ClientHomeProps = {
    heroHeadingLevel?: 'h1' | 'h2';
};

function HomeContent({ heroHeadingLevel = 'h1' }: ClientHomeProps) {
    const searchParams = useSearchParams();
    const initialName = searchParams.get('name') ?? '';
    const initialSurname = searchParams.get('surname') ?? '';
    const initialDay = searchParams.get('day') ?? 'sunday';

    const [name, setName] = useState(initialName);
    const [surname, setSurname] = useState(initialSurname);
    const [day, setDay] = useState(initialDay);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
    const didInitFromParams = useRef(false);

    const performAnalysis = useCallback(async (inputName: string, inputSurname: string, inputDay: string) => {
        if (!inputName.trim()) return;

        setLoading(true);

        const nameScore = calculateScore(inputName);
        const surnameScore = calculateScore(inputSurname);
        const totalScore = nameScore + surnameScore;

        const namePairs = analyzePairs(inputName);
        const surnamePairs = analyzePairs(inputSurname);
        const cleanName = inputName.replace(/\s/g, '');
        const cleanSurname = inputSurname.replace(/\s/g, '');

        // Parallel execution for server check and local calculations
        const [isNirun] = await Promise.all([
            checkNirunName(inputName),
            // Artificial delay to minimalize flicker if needed
            new Promise(resolve => setTimeout(resolve, 300))
        ]);

        // Get predictions
        const namePrediction = getPrediction(nameScore);
        const surnamePrediction = getPrediction(surnameScore);
        const totalPrediction = getPrediction(totalScore);

        const newResult = {
            name: inputName,
            surname: inputSurname,
            nameScore,
            surnameScore,
            totalScore,
            namePairs,
            surnamePairs,
            namePrediction,
            surnamePrediction,
            prediction: totalPrediction,
            thaksa: analyzeThaksa(cleanName, inputDay, cleanSurname),
            ayatana: calculateAyatana(totalScore),
            nameGrade: calculateGrade(nameScore, namePairs),
            surnameGrade: (surnamePairs.length > 0 && surnamePairs.every(p => p.grade === 'good')) ? 'A+' : calculateGrade(surnameScore, surnamePairs),
            grade: calculateGrade(totalScore, [...namePairs, ...surnamePairs]),
            isNirun: isNirun
        };

        setResult(newResult);
        setLoading(false);

        // Auto-save to Supabase
        try {
            await saveAnalysisResult({
                name: inputName,
                surname: inputSurname,
                day: inputDay,
                nameScore,
                surnameScore,
                totalScore
            });
        } catch (error) {
            console.error('Failed to auto-save:', error);
        }
    }, []);

    // Handle URL params on first mount
    useEffect(() => {
        if (didInitFromParams.current) return;
        didInitFromParams.current = true;

        if (initialName) {
            // Defer execution to avoid synchronous state update warning
            setTimeout(() => {
                performAnalysis(initialName, initialSurname, initialDay);
            }, 0);
        }
    }, [performAnalysis, initialName, initialSurname, initialDay]);

    const handleAnalyzeClick = () => {
        performAnalysis(name, surname, day);
    };

    const resetForm = () => {
        setResult(null);
        setName('');
        setSurname('');
        window.history.pushState({}, '', '/');
    };

    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen overflow-hidden font-sans text-slate-100 selection:bg-amber-500 selection:text-white">
            <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-16 md:pt-28 pb-6 md:pb-28 flex flex-col items-center min-h-[80vh]">

                {!result ? (
                    <div className="w-full max-w-2xl flex flex-col items-center">
                        {/* HeroBanner decoupled for LCP - No fade-in delay */}
                        <div className="w-full animate-fade-in">
                            <HeroBanner headingLevel={heroHeadingLevel} />
                        </div>
                        <InputForm
                            name={name}
                            surname={surname}
                            day={day}
                            onNameChange={setName}
                            onSurnameChange={setSurname}
                            onDayChange={setDay}
                            onAnalyze={handleAnalyzeClick}
                            loading={loading}
                        />
                        <PrivacyStrip />
                        <TrustStrip />
                        <InlineSignupCTA />
                    </div>
                ) : (
                    <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-6">
                        <div className="flex justify-start">
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" /> {t('home.backHome')}
                            </button>
                        </div>

                        {/* Row 1: ผลรวมชื่อ + ผลรวมนามสกุล (2 cols) */}
                        <ResultHeader result={result} />

                        {/* ตารางถอดรหัสเลขศาสตร์ */}
                        <NumerologyDecodeTable
                            name={result.name}
                            surname={result.surname}
                            nameScore={result.nameScore}
                            surnameScore={result.surnameScore}
                            totalScore={result.totalScore}
                        />

                        {/* ผลรวมชื่อ-สกุล + วิเคราะห์คู่ตัวเลข — side by side always */}
                        <div className={`grid grid-cols-1 ${result.surname ? 'sm:grid-cols-2' : 'max-w-xl mx-auto'} gap-3 sm:gap-4`}>
                            {result.surname && <ResultTotalScoreCard result={result} />}
                            <PairAnalysisCard namePairs={result.namePairs} surnamePairs={result.surnamePairs} />
                        </div>

                        {/* Upsell: วิเคราะห์หลายชื่อ */}
                        <BulkAnalysisUpsell currentName={result.name} />

                        {/* Premium Section */}
                        <PremiumBlurOverlay
                            isLocked={!isPremiumUnlocked}
                            creditCost={10}
                            featureName="พลังเงา & คำทำนายเชิงลึก"
                            onUnlock={() => setIsPremiumUnlocked(true)}
                        >
                            <ShadowPowerCard name={result.name} surname={result.surname} />
                            <div className="mt-6">
                                <PredictionCard prediction={result.prediction} />
                            </div>
                        </PremiumBlurOverlay>

                        {/* Details */}
                        {result.thaksa && <ThaksaTable thaksa={result.thaksa} day={day} />}

                        {/* Before & After Comparison - Value Proposition */}
                        <BeforeAfterComparison
                            currentScore={result.totalScore}
                            currentGrade={result.grade}
                            currentLevel={result.prediction.level}
                        />

                        <div className="mt-4">
                            <WallpaperUpsell result={result} day={day} />
                        </div>

                        <div className="mt-4">
                            <ShareButton result={result} day={day} />
                        </div>

                        <SaveResultCTA />
                    </div>
                )}
            </main>

            {!result && (
                <>
                    <WallpaperShowcase />
                    <BulkAnalysisBanner />
                    <UspSection />
                    <HowItWorksSection />
                    <ComparisonSection />
                    <HomeSeoContent />
                    <BirthdayThaksaSection />
                    <KnowledgeSection />
                    <TestimonialSection />
                    <FAQSection />
                    <ArticleSection />
                </>
            )}

            {/* Footer */}
            <footer className="relative z-10 w-full px-4 py-6 text-center text-sm text-amber-100/45">
                <p>{t('home.footer')}</p>
            </footer>
        </div>
    );
}

export default function ClientHome({ heroHeadingLevel = 'h1' }: ClientHomeProps) {
    return (
        <Suspense fallback={<HomeFallback heroHeadingLevel={heroHeadingLevel} />}>
            <HomeContent heroHeadingLevel={heroHeadingLevel} />
            <WelcomeOffer />
        </Suspense>
    );
}
