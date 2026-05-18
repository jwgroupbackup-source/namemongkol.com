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
import { WelcomeOffer } from '@/components/WelcomeOffer';
import { InlineSignupCTA } from '@/components/InlineSignupCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import type { WallpaperShowcaseStat } from '@/components/WallpaperShowcase';
import type { ArticleSectionItem } from '@/components/ArticleSection';

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
const UspSection = dynamic(() => import('@/components/UspSection').then(mod => mod.UspSection));
const ComparisonSection = dynamic(() => import('@/components/ComparisonSection').then(mod => mod.ComparisonSection));
const BirthdayThaksaSection = dynamic(() => import('@/components/BirthdayThaksaSection').then(mod => mod.BirthdayThaksaSection));
const TrustStrip = dynamic(() => import('@/components/TrustStrip').then(mod => mod.TrustStrip));
const PrivacyStrip = dynamic(() => import('@/components/PrivacyStrip').then(mod => mod.PrivacyStrip));
const HowItWorksSection = dynamic(() => import('@/components/HowItWorksSection').then(mod => mod.HowItWorksSection));
const BulkAnalysisUpsell = dynamic(() => import('@/components/BulkAnalysisUpsell').then(mod => mod.BulkAnalysisUpsell));
const BulkAnalysisBanner = dynamic(() => import('@/components/BulkAnalysisBanner').then(mod => mod.BulkAnalysisBanner));

type ClientHomeProps = {
    heroHeadingLevel?: 'h1' | 'h2';
};

type HomeSectionsData = {
    wallpapers: WallpaperShowcaseStat[];
    articles: ArticleSectionItem[];
};

type HomeSectionsApiResponse = {
    success: boolean;
    data: HomeSectionsData;
};

type WindowWithIdleCallback = Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
};

type DeferredSectionProps = {
    children: React.ReactNode;
    minHeightClassName?: string;
    rootMargin?: string;
    preloadDelayMs?: number;
    intrinsicSize?: string;
};

function DeferredSection({
    children,
    minHeightClassName = 'min-h-[280px]',
    rootMargin = '1200px 0px',
    preloadDelayMs = 0,
    intrinsicSize = '800px',
}: DeferredSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isVisible) return;

        const windowWithIdle = window as WindowWithIdleCallback;
        let timeoutId: number | null = null;
        let idleId: number | null = null;

        const reveal = () => {
            setIsVisible(true);
        };

        timeoutId = window.setTimeout(() => {
            if (windowWithIdle.requestIdleCallback) {
                idleId = windowWithIdle.requestIdleCallback(reveal, { timeout: 900 });
            } else {
                reveal();
            }
        }, preloadDelayMs);

        return () => {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            if (idleId !== null && windowWithIdle.cancelIdleCallback) {
                windowWithIdle.cancelIdleCallback(idleId);
            }
        };
    }, [isVisible, preloadDelayMs]);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [isVisible, rootMargin]);

    return (
        <div
            ref={sectionRef}
            className={minHeightClassName}
            style={{ contentVisibility: 'auto', containIntrinsicSize: intrinsicSize }}
        >
            {isVisible ? children : null}
        </div>
    );
}

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
    const [homeSectionsData, setHomeSectionsData] = useState<HomeSectionsData>({
        wallpapers: [],
        articles: [],
    });
    const [homeSectionsLoading, setHomeSectionsLoading] = useState(false);
    const didInitFromParams = useRef(false);
    const didFetchHomeSections = useRef(false);
    const analysisRequestIdRef = useRef(0);

    const fetchHomeSections = useCallback(async () => {
        setHomeSectionsLoading(true);
        try {
            const response = await fetch('/api/public/home-sections', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) return;

            const json = (await response.json()) as HomeSectionsApiResponse;
            if (!json.success || !json.data) return;

            setHomeSectionsData({
                wallpapers: json.data.wallpapers ?? [],
                articles: json.data.articles ?? [],
            });
        } catch {
            // Use local defaults from each section when fetch fails.
        } finally {
            setHomeSectionsLoading(false);
        }
    }, []);

    const performAnalysis = useCallback(async (inputName: string, inputSurname: string, inputDay: string) => {
        if (!inputName.trim()) return;

        const requestId = ++analysisRequestIdRef.current;
        setLoading(true);

        const nirunPromise = checkNirunName(inputName).catch(() => false);

        const nameScore = calculateScore(inputName);
        const surnameScore = calculateScore(inputSurname);
        const totalScore = nameScore + surnameScore;

        const namePairs = analyzePairs(inputName);
        const surnamePairs = analyzePairs(inputSurname);
        const cleanName = inputName.replace(/\s/g, '');
        const cleanSurname = inputSurname.replace(/\s/g, '');

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
            isNirun: false,
        };

        if (requestId !== analysisRequestIdRef.current) return;

        setResult(newResult);
        setLoading(false);

        void nirunPromise.then((isNirun) => {
            if (requestId !== analysisRequestIdRef.current) return;

            setResult((prev) => {
                if (!prev) return prev;
                if (prev.name !== inputName || prev.surname !== inputSurname) return prev;
                if (prev.isNirun === isNirun) return prev;
                return { ...prev, isNirun };
            });
        });

        // Auto-save to Supabase
        void saveAnalysisResult({
                name: inputName,
                surname: inputSurname,
                day: inputDay,
                nameScore,
                surnameScore,
                totalScore
            }).catch((error) => {
                console.error('Failed to auto-save:', error);
            });
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

    useEffect(() => {
        if (result || didFetchHomeSections.current) return;
        didFetchHomeSections.current = true;

        const windowWithIdle = window as WindowWithIdleCallback;
        let timeoutId: number | null = null;
        let idleId: number | null = null;

        const run = () => {
            void fetchHomeSections();
        };

        if (windowWithIdle.requestIdleCallback) {
            idleId = windowWithIdle.requestIdleCallback(run, { timeout: 1200 });
        } else {
            timeoutId = window.setTimeout(run, 450);
        }

        return () => {
            if (idleId !== null && windowWithIdle.cancelIdleCallback) {
                windowWithIdle.cancelIdleCallback(idleId);
            }
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [fetchHomeSections, result]);

    const handleAnalyzeClick = useCallback(() => {
        performAnalysis(name, surname, day);
    }, [performAnalysis, name, surname, day]);

    const resetForm = useCallback(() => {
        setResult(null);
        setName('');
        setSurname('');
        window.history.pushState({}, '', '/');
    }, []);

    useEffect(() => {
        const handleReset = () => {
            resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('resetHomeForm', handleReset);
        return () => window.removeEventListener('resetHomeForm', handleReset);
    }, [resetForm]);

    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen overflow-hidden font-sans text-slate-100 selection:bg-amber-500 selection:text-white">
            <main className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-12 xl:px-16 pt-14 md:pt-28 pb-24 md:pb-28 flex flex-col items-center min-h-[80vh]">

                {!result ? (
                    <div className="w-full max-w-2xl flex flex-col items-center">
                        {/* HeroBanner: no delay — renders immediately for LCP */}
                        <div className="w-full">
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
                    <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-5 sm:gap-6 md:gap-8">
                        <div className="flex justify-start">
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" /> {t('home.backHome')}
                            </button>
                        </div>

                        {/* Summary first on mobile */}
                        <ResultHeader result={result} />

                        {/* Main score first */}
                        <div className={`grid grid-cols-1 ${result.surname ? 'sm:grid-cols-2' : 'max-w-xl mx-auto'} gap-3 sm:gap-4`}>
                            {result.surname && <ResultTotalScoreCard result={result} />}
                            <PairAnalysisCard namePairs={result.namePairs} surnamePairs={result.surnamePairs} />
                        </div>

                        {/* ตารางถอดรหัสเลขศาสตร์ */}
                        <NumerologyDecodeTable
                            name={result.name}
                            surname={result.surname}
                            nameScore={result.nameScore}
                            surnameScore={result.surnameScore}
                            totalScore={result.totalScore}
                        />

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
                    <DeferredSection minHeightClassName="min-h-[640px]" preloadDelayMs={250} intrinsicSize="640px">
                        <WallpaperShowcase stats={homeSectionsData.wallpapers} />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[360px]" preloadDelayMs={500} intrinsicSize="360px">
                        <BulkAnalysisBanner />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[360px]" preloadDelayMs={750} intrinsicSize="360px">
                        <UspSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[360px]" preloadDelayMs={1000} intrinsicSize="360px">
                        <HowItWorksSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[420px]" preloadDelayMs={1250} intrinsicSize="420px">
                        <ComparisonSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[900px]" preloadDelayMs={1500} intrinsicSize="900px">
                        <HomeSeoContent />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[520px]" preloadDelayMs={1750} intrinsicSize="520px">
                        <BirthdayThaksaSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[520px]" preloadDelayMs={2000} intrinsicSize="520px">
                        <KnowledgeSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[360px]" preloadDelayMs={2250} intrinsicSize="360px">
                        <TestimonialSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[360px]" preloadDelayMs={2500} intrinsicSize="360px">
                        <FAQSection />
                    </DeferredSection>
                    <DeferredSection minHeightClassName="min-h-[560px]" preloadDelayMs={2750} intrinsicSize="560px">
                        <ArticleSection
                            articles={homeSectionsData.articles}
                            loading={homeSectionsLoading}
                        />
                    </DeferredSection>
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
