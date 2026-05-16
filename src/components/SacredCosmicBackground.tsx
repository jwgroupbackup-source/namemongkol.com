import React from 'react';

const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const constellationNodes = [
    { x: 218, y: 214, r: 3.2 },
    { x: 284, y: 260, r: 2.6 },
    { x: 336, y: 194, r: 2.2 },
    { x: 448, y: 176, r: 2.8 },
    { x: 520, y: 236, r: 3.4 },
    { x: 690, y: 170, r: 2.4 },
    { x: 810, y: 226, r: 2.8 },
    { x: 892, y: 192, r: 2.1 },
    { x: 988, y: 318, r: 3.6 },
    { x: 910, y: 420, r: 2.4 },
    { x: 1050, y: 534, r: 2.9 },
    { x: 898, y: 612, r: 2.3 },
    { x: 958, y: 758, r: 3.1 },
    { x: 788, y: 914, r: 2.5 },
    { x: 650, y: 1010, r: 3.8 },
    { x: 484, y: 922, r: 2.7 },
    { x: 348, y: 982, r: 2.4 },
    { x: 210, y: 856, r: 3.3 },
    { x: 176, y: 676, r: 2.5 },
    { x: 122, y: 448, r: 3.0 },
];

const yantraPlacements = [
    { x: 178, y: 202, rotate: -18, scale: 0.92 },
    { x: 1026, y: 228, rotate: 20, scale: 0.88 },
    { x: 190, y: 1004, rotate: 16, scale: 1.0 },
    { x: 1014, y: 1006, rotate: -14, scale: 0.95 },
];

const sacredBands = [
    'นะ โม พุท ธา ยะ  •  สัม สัม วิ สา เท ภะ คะ  •  อิ ระ ชา คะ ตะ ระ สา',
    'มหา จักร พรรดิ  •  นะ ชา ลี ติ  •  นะ มะ พะ ทะ',
    'ป้อง กัน ภัย  •  เสริม สิริ มงคล  •  เมตตา มหา นิยม',
];

function roundSvgCoordinate(value: number, precision = 3) {
    return Number(value.toFixed(precision));
}

const zodiacPositions = zodiacSymbols.map((symbol, index) => {
    const angle = ((index * 30) - 90) * (Math.PI / 180);
    const x = roundSvgCoordinate(600 + Math.cos(angle) * 408);
    const y = roundSvgCoordinate(600 + Math.sin(angle) * 408);

    return {
        symbol,
        x,
        y,
        rotate: (index * 30) + 90,
    };
});

const radialTicks = Array.from({ length: 48 }, (_, index) => ({
    angle: index * 7.5,
    long: index % 4 === 0,
}));

function ringPath(radius: number) {
    return `M 600,${600 - radius} a ${radius},${radius} 0 1,1 0,${radius * 2} a ${radius},${radius} 0 1,1 0,-${radius * 2}`;
}

function YantraGlyph({ x, y, rotate, scale }: { x: number; y: number; rotate: number; scale: number }) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity="0.42">
            <circle r="76" fill="none" stroke="rgba(233, 198, 127, 0.32)" strokeWidth="1.5" />
            <circle r="54" fill="none" stroke="rgba(233, 198, 127, 0.22)" strokeWidth="1" strokeDasharray="3 8" />
            <path d="M -68 0 L 0 -68 L 68 0 L 0 68 Z" fill="none" stroke="rgba(233, 198, 127, 0.24)" strokeWidth="1.2" />
            <path d="M -44 -44 L 44 -44 L 44 44 L -44 44 Z" fill="none" stroke="rgba(242, 220, 170, 0.16)" strokeWidth="1.2" />
            <path d="M 0 -56 L 48 28 L -48 28 Z" fill="none" stroke="rgba(242, 220, 170, 0.18)" strokeWidth="1.2" />
            <path d="M 0 56 L 48 -28 L -48 -28 Z" fill="none" stroke="rgba(233, 198, 127, 0.2)" strokeWidth="1.2" />
            <circle r="12" fill="rgba(242, 220, 170, 0.08)" stroke="rgba(242, 220, 170, 0.3)" strokeWidth="1" />
            <path d="M -76 0 H 76 M 0 -76 V 76" stroke="rgba(233, 198, 127, 0.16)" strokeWidth="1" strokeDasharray="4 10" />
        </g>
    );
}

export function SacredCosmicBackground({ className = '' }: { className?: string }) {
    return (
        <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`.trim()} aria-hidden="true" style={{ contain: 'layout style paint' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,53,142,0.26),transparent_34%),linear-gradient(180deg,#040610_0%,#080b16_38%,#05070f_100%)]" />
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_18%_22%,rgba(225,184,99,0.09),transparent_16%),radial-gradient(circle_at_76%_18%,rgba(114,72,185,0.20),transparent_20%),radial-gradient(circle_at_84%_66%,rgba(225,184,99,0.10),transparent_18%),radial-gradient(circle_at_16%_78%,rgba(82,56,157,0.16),transparent_20%)]" />
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#f7e0aa_0.7px,transparent_0.9px)] [background-size:120px_120px]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff6d5_1px,transparent_1.5px)] [background-size:180px_180px] [background-position:30px_40px]" />

            <div className="absolute left-1/2 lg:left-[calc(50%_+_180px)] top-[32%] lg:top-[41%] h-[40rem] w-[40rem] lg:h-[38rem] lg:w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,210,133,0.22)_0%,rgba(241,187,72,0.10)_22%,rgba(86,52,163,0.16)_48%,transparent_72%)] blur-3xl animate-cosmic-pulse" />
            <div className="absolute left-[12%] top-[18%] h-64 w-[18rem] rotate-[18deg] rounded-full bg-gradient-to-r from-transparent via-amber-200/14 to-transparent blur-3xl animate-cosmic-drift" />
            <div className="absolute right-[12%] top-[18%] h-64 w-[18rem] -rotate-[18deg] rounded-full bg-gradient-to-r from-transparent via-amber-100/14 to-transparent blur-3xl animate-cosmic-drift-slow" />
            <div className="absolute left-[20%] bottom-[14%] h-52 w-[14rem] rotate-[20deg] rounded-full bg-gradient-to-r from-transparent via-yellow-100/8 to-transparent blur-3xl animate-cosmic-drift-slow" />
            <div className="absolute right-[20%] bottom-[14%] h-52 w-[14rem] -rotate-[20deg] rounded-full bg-gradient-to-r from-transparent via-amber-200/8 to-transparent blur-3xl animate-cosmic-drift" />

            <div className="absolute left-1/2 lg:left-[calc(50%_+_180px)] top-[32%] lg:top-[41%] h-[min(78vw,58rem)] w-[min(78vw,58rem)] lg:h-[min(74vw,60rem)] lg:w-[min(74vw,60rem)] -translate-x-1/2 -translate-y-1/2 opacity-[0.92] mix-blend-screen" style={{ contentVisibility: 'auto', containIntrinsicSize: '900px 900px' }}>
                <svg viewBox="0 0 1200 1200" className="h-full w-full animate-cosmic-drift-slow" fill="none" aria-hidden="true">
                    <defs>
                        <radialGradient id="wheelCoreGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(248,224,171,0.32)" />
                            <stop offset="32%" stopColor="rgba(219,178,93,0.16)" />
                            <stop offset="72%" stopColor="rgba(98,61,170,0.12)" />
                            <stop offset="100%" stopColor="rgba(6,10,24,0)" />
                        </radialGradient>
                        <linearGradient id="wheelStroke" x1="0" y1="0" x2="1200" y2="1200">
                            <stop offset="0%" stopColor="rgba(245,225,186,0.78)" />
                            <stop offset="45%" stopColor="rgba(206,164,84,0.44)" />
                            <stop offset="100%" stopColor="rgba(124,89,183,0.26)" />
                        </linearGradient>
                        <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <path id="sacredRingOuter" d={ringPath(456)} />
                        <path id="sacredRingMiddle" d={ringPath(338)} />
                        <path id="sacredRingInner" d={ringPath(252)} />
                    </defs>

                    <circle cx="600" cy="600" r="520" fill="url(#wheelCoreGlow)" opacity="0.54" />
                    <circle cx="600" cy="600" r="484" stroke="rgba(248,224,171,0.08)" strokeWidth="1" />
                    <circle cx="600" cy="600" r="462" stroke="url(#wheelStroke)" strokeWidth="2.4" filter="url(#goldGlow)" />
                    <circle cx="600" cy="600" r="420" stroke="rgba(240,210,150,0.34)" strokeWidth="1.6" />
                    <circle cx="600" cy="600" r="370" stroke="rgba(214,177,106,0.22)" strokeWidth="1" strokeDasharray="3 9" />
                    <circle cx="600" cy="600" r="324" stroke="rgba(240,210,150,0.24)" strokeWidth="1.2" />
                    <circle cx="600" cy="600" r="268" stroke="rgba(214,177,106,0.18)" strokeWidth="1" strokeDasharray="2 7" />
                    <circle cx="600" cy="600" r="198" stroke="rgba(240,210,150,0.2)" strokeWidth="1.1" />
                    <circle cx="600" cy="600" r="136" stroke="rgba(214,177,106,0.22)" strokeWidth="1.1" />

                    {radialTicks.map((tick) => {
                        const angle = tick.angle * (Math.PI / 180);
                        const inner = tick.long ? 284 : 306;
                        const outer = tick.long ? 454 : 432;
                        const x1 = roundSvgCoordinate(600 + Math.cos(angle) * inner);
                        const y1 = roundSvgCoordinate(600 + Math.sin(angle) * inner);
                        const x2 = roundSvgCoordinate(600 + Math.cos(angle) * outer);
                        const y2 = roundSvgCoordinate(600 + Math.sin(angle) * outer);

                        return (
                            <line
                                key={`tick-${tick.angle}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={tick.long ? 'rgba(245,225,186,0.34)' : 'rgba(214,177,106,0.18)'}
                                strokeWidth={tick.long ? 1.4 : 1}
                            />
                        );
                    })}

                    {zodiacPositions.map((position, index) => (
                        <g key={position.symbol} transform={`translate(${position.x} ${position.y}) rotate(${position.rotate})`}>
                            <circle cx="0" cy="0" r="28" fill="rgba(14,18,35,0.48)" stroke="rgba(245,225,186,0.22)" strokeWidth="1.2" />
                            <text
                                x="0"
                                y="2"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="rgba(248,224,171,0.92)"
                                fontSize="28"
                                fontFamily="Georgia, serif"
                                filter="url(#goldGlow)"
                            >
                                {position.symbol}
                            </text>
                            <text
                                x="0"
                                y="56"
                                textAnchor="middle"
                                fill="rgba(245,225,186,0.42)"
                                fontSize="10"
                                letterSpacing="5"
                                fontFamily="Georgia, serif"
                            >
                                {String(index + 1).padStart(2, '0')}
                            </text>
                        </g>
                    ))}

                    {Array.from({ length: 12 }).map((_, index) => {
                        const angle = ((index * 30) - 90) * (Math.PI / 180);
                        const x = roundSvgCoordinate(600 + Math.cos(angle) * 456);
                        const y = roundSvgCoordinate(600 + Math.sin(angle) * 456);

                        return (
                            <line
                                key={`segment-${index}`}
                                x1="600"
                                y1="600"
                                x2={x}
                                y2={y}
                                stroke="rgba(245,225,186,0.16)"
                                strokeWidth="1.2"
                            />
                        );
                    })}

                    <text fill="rgba(245,225,186,0.32)" fontSize="16" letterSpacing="4" fontFamily="serif">
                        <textPath href="#sacredRingOuter" startOffset="8%">{`${sacredBands[0]}   ${sacredBands[0]}   ${sacredBands[0]}`}</textPath>
                    </text>
                    <text fill="rgba(214,177,106,0.24)" fontSize="14" letterSpacing="6" fontFamily="serif">
                        <textPath href="#sacredRingMiddle" startOffset="22%">{`${sacredBands[1]}   ${sacredBands[1]}   ${sacredBands[1]}   ${sacredBands[1]}`}</textPath>
                    </text>
                    <text fill="rgba(245,225,186,0.18)" fontSize="12" letterSpacing="5" fontFamily="serif">
                        <textPath href="#sacredRingInner" startOffset="41%">{`${sacredBands[2]}   ${sacredBands[2]}   ${sacredBands[2]}`}</textPath>
                    </text>

                    <g opacity="0.72" filter="url(#goldGlow)">
                        <path d="M 600 382 L 704 516 L 866 548 L 752 654 L 780 820 L 600 742 L 420 820 L 448 654 L 334 548 L 496 516 Z" fill="none" stroke="rgba(245,225,186,0.26)" strokeWidth="1.6" />
                        <path d="M 600 428 L 700 508 L 772 600 L 700 692 L 600 772 L 500 692 L 428 600 L 500 508 Z" fill="none" stroke="rgba(214,177,106,0.24)" strokeWidth="1.4" />
                        <path d="M 600 458 L 732 684 L 468 684 Z" fill="none" stroke="rgba(245,225,186,0.3)" strokeWidth="1.5" />
                        <path d="M 600 742 L 732 516 L 468 516 Z" fill="none" stroke="rgba(214,177,106,0.26)" strokeWidth="1.5" />
                        <circle cx="600" cy="600" r="56" fill="rgba(248,224,171,0.06)" stroke="rgba(245,225,186,0.38)" strokeWidth="1.3" />
                        <circle cx="600" cy="600" r="22" fill="rgba(248,224,171,0.16)" stroke="rgba(245,225,186,0.42)" strokeWidth="1.2" />
                    </g>

                    {yantraPlacements.map((placement, index) => (
                        <YantraGlyph key={`yantra-${index}`} {...placement} />
                    ))}

                    {constellationNodes.map((node, index) => (
                        <g key={`star-${index}`}>
                            <circle cx={node.x} cy={node.y} r={node.r * 3} fill="rgba(248,224,171,0.08)" />
                            <circle cx={node.x} cy={node.y} r={node.r} fill="rgba(255,244,216,0.92)" />
                        </g>
                    ))}

                    <path d="M 216 214 C 304 238, 372 154, 450 176 S 596 286, 690 170 S 824 234, 986 318" stroke="rgba(245,225,186,0.15)" strokeWidth="1.1" strokeDasharray="4 10" />
                    <path d="M 122 448 C 220 552, 156 694, 210 856 S 378 982, 650 1010 S 896 866, 1050 534" stroke="rgba(214,177,106,0.13)" strokeWidth="1.1" strokeDasharray="4 10" />
                </svg>
            </div>

            <div className="sacred-script absolute left-[3%] top-[22%] hidden text-[10px] tracking-[0.7em] text-amber-100/16 xl:block animate-cosmic-drift" style={{ writingMode: 'vertical-rl' }}>
                นะ โม พุท ธา ยะ • อิ ระ ชา คะ ตะ ระ สา • นะ ชา ลี ติ
            </div>
            <div className="sacred-script absolute right-[3%] top-[22%] hidden text-[10px] tracking-[0.7em] text-amber-100/16 xl:block animate-cosmic-drift-slow" style={{ writingMode: 'vertical-rl' }}>
                สัม สัม วิ สา เท ภะ คะ • มหา จักร พรรดิ • ป้อง กัน ภัย
            </div>
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#04060f] via-[#04060f]/65 to-transparent" />
        </div>
    );
}