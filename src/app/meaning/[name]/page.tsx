
import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Metadata } from 'next';
import { calculateScore } from '@/utils/calculateScore';
import { getPrediction } from '@/utils/getPrediction';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { siteUrl } from '@/lib/seo';

type Props = {
    params: Promise<{ name: string }>;
};

function decodeName(name: string): string {
    try {
        return decodeURIComponent(name);
    } catch {
        return name;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { name } = await params;
    const decodedName = decodeName(name);
    const score = calculateScore(decodedName);
    const prediction = getPrediction(score);

    return {
        title: `ความหมายชื่อ ${decodedName} ดีไหม? เช็คความหมายและเลขศาสตร์ - NameMongkol`,
        description: `วิเคราะห์ชื่อ "${decodedName}" ตามหลักเลขศาสตร์ ได้ผลรวม ${score} หมายถึง ${prediction.desc.substring(0, 100)}... เช็คชื่อมงคล ฟรี`,
        keywords: [`ความหมายชื่อ ${decodedName}`, 'วิเคราะห์ชื่อ', 'เลขศาสตร์', 'ชื่อมงคล', `ชื่อ ${decodedName}`, 'ผลรวมชื่อ', 'ตั้งชื่อลูก'],
        alternates: { canonical: `${siteUrl.replace(/\/$/, '')}/meaning/${encodeURIComponent(decodedName)}` },
        openGraph: {
            title: `ความหมายชื่อ "${decodedName}" ผลรวม ${score} - ดีหรือไม่?`,
            description: `วิเคราะห์ชื่อ ${decodedName} ตามหลักเลขศาสตร์ ได้ผลรวม ${score} ระดับ: ${prediction.level} | ${prediction.desc.substring(0, 80)}...`,
            url: `${siteUrl}/meaning/${encodeURIComponent(decodedName)}`,
            siteName: 'NameMongkol',
            locale: 'th_TH',
            type: 'article',
            images: [`${siteUrl}/api/og?variant=analysis&name=${encodeURIComponent(decodedName)}&score=${score}&subtitle=${encodeURIComponent(`ผลรวมเลขศาสตร์: ${score} | ${prediction.level}`)}`],
        },
        twitter: {
            card: 'summary_large_image',
            title: `ความหมายชื่อ "${decodedName}" ผลรวม ${score}`,
            description: `วิเคราะห์ชื่อ ${decodedName} ตามหลักเลขศาสตร์ ได้ผลรวม ${score} ระดับ: ${prediction.level}`,
            images: [`${siteUrl}/api/og?variant=analysis&name=${encodeURIComponent(decodedName)}&score=${score}`],
        },
    };
}

export default async function MeaningPage({ params }: Props) {
    const { name } = await params;
    const decodedName = decodeName(name);
    const score = calculateScore(decodedName);
    const prediction = getPrediction(score);

    // JSON-LD Schema for SEO/AEO/GEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/meaning/${encodeURIComponent(decodedName)}#webpage`,
                'url': `${siteUrl}/meaning/${encodeURIComponent(decodedName)}`,
                'name': `ความหมายชื่อ ${decodedName} - วิเคราะห์เลขศาสตร์`,
                'description': `วิเคราะห์ชื่อ ${decodedName} ได้ผลรวมเลขศาสตร์ ${score} ระดับ: ${prediction.level}`,
                'isPartOf': { '@id': `${siteUrl}/#website` },
                'inLanguage': 'th-TH',
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'วิเคราะห์ชื่อมงคล',
                        'item': siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'ความหมายชื่อ',
                        'item': `${siteUrl}/meaning`,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': decodedName,
                        'item': `${siteUrl}/meaning/${encodeURIComponent(decodedName)}`,
                    },
                ],
            },
            {
                '@type': 'DefinedTerm',
                'name': decodedName,
                'description': prediction.desc,
                'inDefinedTermSet': {
                    '@type': 'DefinedTermSet',
                    'name': 'พจนานุกรมชื่อมงคล NameMongkol',
                },
            },
        ],
    };

    return (
        <>
            <Script
                id="meaning-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
                {/* Background Decor (Simplified from Layout) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
                </div>

                <main className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-6 md:pt-32 pb-28 flex flex-col items-center">

                    {/* Header Section */}
                    <div className="text-center mb-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">พจนานุกรมชื่อมงคล</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4">
                            ความหมายชื่อ <span className="text-amber-400">&quot;{decodedName}&quot;</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            วิเคราะห์พลังของชื่อตามหลักเลขศาสตร์และดวงดาว
                        </p>
                    </div>

                    {/* Result Card */}
                    <div className="w-full bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl mb-10 animate-fade-in">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-white/5 pb-8">
                            <div className="text-center md:text-left">
                                <span className="text-sm text-slate-400 block mb-1">ผลรวมเลขศาสตร์</span>
                                <span className="text-6xl font-black text-white tracking-tight">{score}</span>
                            </div>
                            <div className="flex-1">
                                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3 ${prediction.level === 'ดีมาก' ? 'bg-emerald-500/20 text-emerald-300' :
                                    prediction.level === 'ดี' ? 'bg-green-500/20 text-green-300' :
                                        prediction.level === 'ปานกลาง' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-red-500/20 text-red-300'
                                    }`}>
                                    เกรด: {prediction.level}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">คำทำนาย</h2>
                                <p className="text-slate-300 leading-relaxed">
                                    {prediction.desc}
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-900/20 border border-amber-500/20 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
                            <div className="p-3 bg-amber-500/10 rounded-full shrink-0">
                                <Sparkles className="w-6 h-6 text-amber-400" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-amber-100 mb-1">วิเคราะห์ชื่อมงคลแบบละเอียด?</h3>
                                <p className="text-amber-200/60 text-sm">
                                    เช็กความหมายนามสกุล ผลรวมคู่ และทักษาปกรณ์ (กาลกิณี) ด้วยระบบ <Link href="/" className="text-amber-400 hover:underline">วิเคราะห์ชื่อมงคล</Link> ครบ 4 ศาสตร์
                                </p>
                            </div>
                            <Link
                                href={`/?name=${encodeURIComponent(decodedName)}`}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap"
                            >
                                วิเคราะห์ชื่อมงคล <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Internal Links / Breadcrumbs-ish */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <Link href="/" className="hover:text-white transition-colors">วิเคราะห์ชื่อมงคล</Link>
                        <span>•</span>
                        <Link href="/articles" className="hover:text-white transition-colors">บทความ</Link>
                        <span>•</span>
                        <Link href="/search" className="hover:text-white transition-colors">ค้นหาชื่อมงคล</Link>
                        <span>•</span>
                        <Link href="/name-analysis" className="hover:text-white transition-colors">เช็คชื่อหลายชื่อพร้อมกัน</Link>
                    </div>

                </main>
            </div>
        </>
    );
}
