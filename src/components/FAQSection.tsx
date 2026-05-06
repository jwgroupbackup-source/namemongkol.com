import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export const FAQSection = () => {
    const { t } = useLanguage();

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm mb-4">
                        <HelpCircle size={16} />
                        <span>{t('sections.faq.badge')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t('sections.faq.title')}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {t('sections.faq.description')}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <FAQItem
                        question={t('sections.faq.q1')}
                        answer={t('sections.faq.a1')}
                    />
                    <FAQItem
                        question={t('sections.faq.q2')}
                        answer={t('sections.faq.a2')}
                    />
                    <FAQItem
                        question={t('sections.faq.q3')}
                        answer={t('sections.faq.a3')}
                    />
                    <FAQItem
                        question={t('sections.faq.q4')}
                        answer={t('sections.faq.a4')}
                    />
                    <FAQItem
                        question={t('sections.faq.q5')}
                        answer={t('sections.faq.a5')}
                    />
                    <FAQItem
                        question={t('sections.faq.q6')}
                        answer={t('sections.faq.a6')}
                    />
                    <FAQItem
                        question={t('sections.faq.q7')}
                        answer={t('sections.faq.a7')}
                    />
                    <FAQItem
                        question={t('sections.faq.q8')}
                        answer={t('sections.faq.a8')}
                    />
                    <FAQItem
                        question={t('sections.faq.q9')}
                        answer={t('sections.faq.a9')}
                    />
                </div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </section>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    return (
        <details className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 open:bg-slate-800/60 open:border-slate-700">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-slate-200 font-medium md:text-lg select-none">
                {question}
                <ChevronDown className="w-5 h-5 text-slate-500 transition-transform duration-300 group-open:rotate-180 group-open:text-amber-400" />
            </summary>
            <div className="px-5 pb-5 text-slate-400 leading-relaxed animate-fade-in text-sm md:text-base border-t border-dashed border-white/5 pt-3 mt-1">
                {answer}
            </div>
        </details>
    );
};
