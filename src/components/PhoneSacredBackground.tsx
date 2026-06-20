'use client';

import React from 'react';
import Image from 'next/image';

// ─── Asset config ───────────────────────────────────────────────────────────
// Drop the generated background image at:
//   public/images/phone-analysis/sacred-bg.webp  (or .jpg / .png)
// Then set ASSET_PATH to the path below and SHOW_ASSET to true.
// When SHOW_ASSET is false, the CSS/SVG procedural background renders instead.
// ─────────────────────────────────────────────────────────────────────────────
const SHOW_ASSET = false;
const ASSET_PATH = '/images/phone-analysis/sacred-bg.webp';

const yantraRings = [
    { size: 720, opacity: '0.18' },
    { size: 560, opacity: '0.16' },
    { size: 410, opacity: '0.14' },
    { size: 280, opacity: '0.12' },
];

const yantraGlyphs = [
    { x: 17, y: 22, rotate: -8 },
    { x: 26, y: 68, rotate: 4 },
    { x: 52, y: 18, rotate: -4 },
    { x: 70, y: 62, rotate: 6 },
    { x: 83, y: 28, rotate: 10 },
];

const gemstoneTokens = [
    {
        className: 'left-[8%] top-[18%] h-16 w-12 rotate-[-18deg] bg-[linear-gradient(145deg,rgba(149,214,255,0.88),rgba(34,92,180,0.92)_42%,rgba(2,18,51,0.96))] shadow-[0_0_30px_rgba(72,154,255,0.22)]',
    },
    {
        className: 'right-[17%] top-[26%] h-20 w-14 rotate-[22deg] bg-[linear-gradient(145deg,rgba(255,244,186,0.88),rgba(168,129,46,0.94)_48%,rgba(41,27,9,0.98))] shadow-[0_0_32px_rgba(244,196,82,0.18)]',
    },
    {
        className: 'left-[22%] bottom-[16%] h-14 w-10 rotate-[14deg] bg-[linear-gradient(145deg,rgba(162,222,255,0.86),rgba(27,81,154,0.9)_42%,rgba(3,18,44,0.96))] shadow-[0_0_26px_rgba(81,162,255,0.18)]',
    },
    {
        className: 'right-[8%] bottom-[22%] h-16 w-12 rotate-[-14deg] bg-[linear-gradient(145deg,rgba(245,223,158,0.86),rgba(171,120,35,0.94)_42%,rgba(55,36,10,0.98))] shadow-[0_0_28px_rgba(241,186,65,0.16)]',
    },
];

export const PhoneSacredBackground = () => {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">

            {/* ── Base light tone ─────────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-[#f8f8fc]" />

            {/* ── Generated raster asset layer (enable once image is ready) ── */}
            {SHOW_ASSET && (
                <>
                    <Image
                        src={ASSET_PATH}
                        alt=""
                        role="presentation"
                        aria-hidden="true"
                        fill
                        priority
                        sizes="100vw"
                        quality={90}
                        className="object-cover object-center opacity-92"
                        style={{ objectPosition: '54% 50%' }}
                    />
                    {/* Sidebar negative-space fade: keeps left side readable */}
                    <div className="absolute inset-y-0 left-0 w-[46%] bg-[linear-gradient(90deg,rgba(248,248,252,0.95),rgba(248,248,252,0.6)_64%,transparent)]" />
                    {/* Top/bottom vignette */}
                    <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(248,248,252,0.9),transparent)]" />
                    <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(248,248,252,0.95),transparent)]" />
                </>
            )}

            {/* ── Procedural CSS/SVG background (shown when SHOW_ASSET = false) ── */}
            {!SHOW_ASSET && (
                <>
                    {/* Marble surface + noise */}
                    <div className="phone-sacred-surface absolute inset-0" />
                    <div className="phone-sacred-noise absolute inset-0 opacity-55" />

                    {/* Edge gradients */}
                    <div className="absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,rgba(248,248,252,0.9),rgba(248,248,252,0.5)_62%,transparent)]" />
                    <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(248,248,252,0.9),rgba(248,248,252,0.5)_54%,transparent)]" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(248,248,252,0.95),transparent)]" />
                    <div className="absolute left-1/2 top-[10%] h-[24rem] w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.4)_42%,transparent_78%)] blur-3xl" />

                    {/* Central blue-gold vortex */}
                    <div className="phone-vortex absolute left-1/2 top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[34rem] sm:w-[34rem] lg:h-[40rem] lg:w-[40rem]">
                        <div className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle,rgba(255,232,164,0.62)_0%,rgba(104,196,255,0.38)_18%,rgba(15,106,166,0.16)_38%,rgba(4,23,44,0.04)_60%,transparent_72%)] blur-md" />
                        <div className="absolute inset-[5%] rounded-full bg-[conic-gradient(from_140deg,rgba(18,78,140,0.02),rgba(103,191,255,0.32),rgba(255,209,92,0.28),rgba(10,55,112,0.10),rgba(18,78,140,0.02))] blur-[2px] animate-spin-slow" />
                        <div className="absolute inset-[17%] rounded-full bg-[conic-gradient(from_240deg,rgba(17,61,112,0.02),rgba(72,179,255,0.22),rgba(255,188,67,0.34),rgba(15,85,152,0.12),rgba(17,61,112,0.02))] blur-sm [animation-duration:14s] animate-spin-slow" />
                        <div className="absolute inset-[24%] rounded-full border border-amber-200/14" />
                        <div className="absolute inset-[31%] rounded-full bg-[radial-gradient(circle,rgba(255,247,214,0.72)_0%,rgba(255,207,88,0.56)_18%,rgba(73,180,255,0.34)_48%,rgba(8,31,60,0.10)_72%,transparent_100%)] shadow-[0_0_42px_rgba(247,191,67,0.14),0_0_72px_rgba(83,174,255,0.10)]" />
                        <div className="absolute inset-[37%] rounded-full bg-[radial-gradient(circle,rgba(255,250,231,0.68)_0%,rgba(255,220,118,0.52)_35%,rgba(107,202,255,0.22)_70%,transparent_100%)] blur-sm" />
                    </div>

                    {/* Yantra rings + sacred geometry */}
                    <div className="absolute left-1/2 top-[38%] h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 sm:h-[46rem] sm:w-[46rem] lg:h-[52rem] lg:w-[52rem]">
                        <svg viewBox="0 0 100 100" className="h-full w-full opacity-42">
                            <defs>
                                <radialGradient id="yantraGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(255,214,122,0.34)" />
                                    <stop offset="60%" stopColor="rgba(92,182,255,0.10)" />
                                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                </radialGradient>
                            </defs>
                            <circle cx="50" cy="50" r="48" fill="url(#yantraGlow)" />
                            {yantraRings.map((ring) => (
                                <circle
                                    key={ring.size}
                                    cx="50"
                                    cy="50"
                                    r={ring.size / 16}
                                    fill="none"
                                    stroke={`rgba(210, 177, 103, ${ring.opacity})`}
                                    strokeWidth="0.18"
                                    strokeDasharray="1.1 1.8"
                                />
                            ))}
                            <polygon points="50,9 61,31 86,34 68,51 72,77 50,65 28,77 32,51 14,34 39,31" fill="none" stroke="rgba(213,184,118,0.16)" strokeWidth="0.22" />
                            <polygon points="50,19 58,36 77,38 64,51 67,69 50,60 33,69 36,51 23,38 42,36" fill="none" stroke="rgba(91,181,248,0.14)" strokeWidth="0.22" />
                            <path d="M 50 14 L 50 86 M 14 50 L 86 50 M 24 24 L 76 76 M 76 24 L 24 76" stroke="rgba(220,188,124,0.12)" strokeWidth="0.18" />
                            <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,224,145,0.3)" strokeWidth="0.28" />
                            <circle cx="50" cy="50" r="4" fill="none" stroke="rgba(117,197,255,0.24)" strokeWidth="0.24" />
                            {[12, 24, 36, 48, 60, 72, 84].map((offset) => (
                                <g key={offset}>
                                    <circle cx={offset} cy="14" r="0.45" fill="rgba(244,219,159,0.42)" />
                                    <circle cx={offset} cy="86" r="0.45" fill="rgba(244,219,159,0.28)" />
                                    <circle cx="14" cy={offset} r="0.45" fill="rgba(244,219,159,0.28)" />
                                    <circle cx="86" cy={offset} r="0.45" fill="rgba(244,219,159,0.42)" />
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Sacred glyphs */}
                    <div className="absolute inset-0 opacity-26">
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                            {yantraGlyphs.map((glyph) => (
                                <g key={`${glyph.x}-${glyph.y}`} transform={`translate(${glyph.x} ${glyph.y}) rotate(${glyph.rotate})`}>
                                    <path d="M 0 0 C 1.8 -2.4 4.6 -2.6 6.1 -0.3 C 7.2 1.7 7 4.3 5.3 6.1 C 3.7 7.9 0.8 8.5 -1 7 C -2.7 5.6 -2.5 3.2 -0.7 1.7 C 0.9 0.4 3.6 0.4 5.2 1.6" fill="none" stroke="rgba(213,185,122,0.24)" strokeWidth="0.22" strokeLinecap="round" />
                                    <path d="M 2.8 9.2 C 4 11.2 4.2 13.1 3.2 14.7 C 2.2 16.3 0.1 17 -1.8 16" fill="none" stroke="rgba(213,185,122,0.18)" strokeWidth="0.18" strokeLinecap="round" />
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Zodiac star map */}
                    <div className="absolute right-[-8%] top-[6%] h-[22rem] w-[22rem] opacity-48 sm:h-[26rem] sm:w-[26rem] lg:right-[2%] lg:top-[7%] lg:h-[28rem] lg:w-[28rem]">
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                            <g fill="none" stroke="rgba(224,184,96,0.24)" strokeWidth="0.28" strokeLinecap="round">
                                <circle cx="50" cy="50" r="34" />
                                <circle cx="50" cy="50" r="23" stroke="rgba(224,184,96,0.16)" />
                                <path d="M 50 16 L 50 84 M 16 50 L 84 50 M 27 27 L 73 73 M 73 27 L 27 73" />
                                <path d="M 22 38 C 30 34 38 34 46 38 M 54 38 C 62 34 70 34 78 38 M 24 64 C 32 60 40 60 48 64 M 52 64 C 60 60 68 60 76 64" stroke="rgba(224,184,96,0.14)" />
                            </g>
                            {[18, 28, 39, 50, 61, 72, 82].map((value, index) => (
                                <circle key={value} cx={value} cy={index % 2 === 0 ? 22 : 78} r="0.85" fill="rgba(244,219,159,0.64)" />
                            ))}
                            <path d="M 22 22 L 38 36 L 56 32 L 70 44 L 80 38" fill="none" stroke="rgba(255,226,154,0.18)" strokeWidth="0.28" />
                            <path d="M 24 72 L 42 62 L 59 66 L 74 54" fill="none" stroke="rgba(255,226,154,0.16)" strokeWidth="0.28" />
                        </svg>
                    </div>

                    {/* Kanok corner motifs */}
                    <div className="absolute inset-0 opacity-22">
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                            <path d="M 0 0 C 7 2 9 8 11 15 C 12 20 16 22 20 24 C 14 24 10 26 8 31 C 6 35 5 40 0 43" fill="none" stroke="rgba(217,178,95,0.22)" strokeWidth="0.32" />
                            <path d="M 100 0 C 93 2 91 8 89 15 C 88 20 84 22 80 24 C 86 24 90 26 92 31 C 94 35 95 40 100 43" fill="none" stroke="rgba(217,178,95,0.22)" strokeWidth="0.32" />
                            <path d="M 0 100 C 7 98 9 92 11 85 C 12 80 16 78 20 76 C 14 76 10 74 8 69 C 6 65 5 60 0 57" fill="none" stroke="rgba(217,178,95,0.18)" strokeWidth="0.32" />
                            <path d="M 100 100 C 93 98 91 92 89 85 C 88 80 84 78 80 76 C 86 76 90 74 92 69 C 94 65 95 60 100 57" fill="none" stroke="rgba(217,178,95,0.18)" strokeWidth="0.32" />
                        </svg>
                    </div>

                    {/* Gemstone tokens */}
                    {gemstoneTokens.map((token) => (
                        <div key={token.className} className={`absolute ${token.className} clip-gemstone opacity-35`} />
                    ))}

                    {/* Vignette overlays */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(248,248,252,0.2)_28%,rgba(248,248,252,0.6)_58%,rgba(248,248,252,0.9)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,248,252,0.8)_0%,rgba(248,248,252,0.4)_28%,rgba(248,248,252,0.1)_50%,rgba(248,248,252,0.4)_72%,rgba(248,248,252,0.8)_100%)]" />
                </>
            )}
        </div>
    );
};