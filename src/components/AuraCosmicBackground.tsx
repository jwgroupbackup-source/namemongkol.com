
import React from 'react';
const EdgeConstellation = ({ className }: { className: string }) => (
    <svg
        className={className}
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
    >
        <g opacity="0.34">
            <path d="M32 306L98 256L164 278L232 206L296 228L358 176" stroke="rgba(180,200,255,0.22)" strokeWidth="0.8" />
            <path d="M58 146L126 122L182 164L248 142L316 170" stroke="rgba(180,200,255,0.18)" strokeWidth="0.7" />
            <path d="M102 334L156 306L206 336L248 302" stroke="rgba(160,180,240,0.16)" strokeWidth="0.7" />
            <path d="M44 206L82 188L116 208" stroke="rgba(180,200,255,0.14)" strokeWidth="0.6" />
        </g>
        <g fill="rgba(210,225,255,0.6)">
            <circle cx="32" cy="306" r="1.3" />
            <circle cx="98" cy="256" r="1.5" />
            <circle cx="164" cy="278" r="1.1" />
            <circle cx="232" cy="206" r="1.3" />
            <circle cx="296" cy="228" r="1.1" />
            <circle cx="358" cy="176" r="1.3" />
            <circle cx="58" cy="146" r="1.0" />
            <circle cx="126" cy="122" r="1.2" />
            <circle cx="182" cy="164" r="1.0" />
            <circle cx="248" cy="142" r="1.2" />
            <circle cx="316" cy="170" r="1.1" />
            <circle cx="102" cy="334" r="1.2" />
            <circle cx="156" cy="306" r="1.0" />
            <circle cx="206" cy="336" r="1.2" />
            <circle cx="248" cy="302" r="1.0" />
        </g>
    </svg>
);

const CornerOrbital = ({ className }: { className: string }) => (
    <svg
        className={className}
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
    >
        {/* Concentric circle arcs - astrological chart style */}
        <circle cx="480" cy="220" r="320" stroke="rgba(180,200,255,0.12)" strokeWidth="0.8" />
        <circle cx="480" cy="220" r="260" stroke="rgba(200,210,255,0.1)" strokeWidth="0.7" />
        <circle cx="480" cy="220" r="200" stroke="rgba(160,190,255,0.09)" strokeWidth="0.7" />
        <circle cx="480" cy="220" r="142" stroke="rgba(200,210,255,0.08)" strokeWidth="0.6" />
        <circle cx="480" cy="220" r="88" stroke="rgba(180,200,255,0.07)" strokeWidth="0.6" />
        {/* Radial lines from center */}
        <line x1="480" y1="220" x2="160" y2="220" stroke="rgba(180,200,255,0.07)" strokeWidth="0.6" />
        <line x1="480" y1="220" x2="700" y2="220" stroke="rgba(180,200,255,0.07)" strokeWidth="0.6" />
        <line x1="480" y1="220" x2="480" y2="540" stroke="rgba(180,200,255,0.06)" strokeWidth="0.6" />
        <line x1="480" y1="220" x2="254" y2="446" stroke="rgba(180,200,255,0.06)" strokeWidth="0.5" />
        <line x1="480" y1="220" x2="254" y2="-6" stroke="rgba(180,200,255,0.05)" strokeWidth="0.5" />
        <line x1="480" y1="220" x2="706" y2="446" stroke="rgba(180,200,255,0.05)" strokeWidth="0.5" />
        {/* Connecting constellation lines */}
        <path d="M320 120L380 180L440 160L520 200L560 300L500 360" stroke="rgba(200,210,255,0.1)" strokeWidth="0.7" />
        <path d="M240 280L310 250L380 280L430 340" stroke="rgba(180,200,255,0.08)" strokeWidth="0.6" />
        <path d="M520 80L560 140L600 120L640 180" stroke="rgba(200,210,255,0.09)" strokeWidth="0.6" />
        {/* Star dots at intersections */}
        <g fill="rgba(220,230,255,0.6)">
            <circle cx="320" cy="120" r="1.8" />
            <circle cx="380" cy="180" r="2" />
            <circle cx="440" cy="160" r="1.6" />
            <circle cx="520" cy="200" r="2.2" />
            <circle cx="560" cy="300" r="1.8" />
            <circle cx="500" cy="360" r="1.6" />
            <circle cx="240" cy="280" r="1.5" />
            <circle cx="310" cy="250" r="1.7" />
            <circle cx="380" cy="280" r="1.4" />
            <circle cx="430" cy="340" r="1.6" />
            <circle cx="520" cy="80" r="1.4" />
            <circle cx="560" cy="140" r="1.8" />
            <circle cx="600" cy="120" r="1.5" />
            <circle cx="640" cy="180" r="1.7" />
        </g>
    </svg>
);

const BottomRightAstralGrid = ({ className }: { className: string }) => (
    <svg
        className={className}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
    >
        {/* Partial concentric arcs visible at bottom-right corner */}
        <circle cx="500" cy="500" r="400" stroke="rgba(180,200,255,0.1)" strokeWidth="0.8" />
        <circle cx="500" cy="500" r="320" stroke="rgba(180,200,255,0.08)" strokeWidth="0.7" />
        <circle cx="500" cy="500" r="240" stroke="rgba(200,210,255,0.07)" strokeWidth="0.7" />
        <circle cx="500" cy="500" r="160" stroke="rgba(180,200,255,0.06)" strokeWidth="0.6" />
        {/* Radial lines */}
        <line x1="500" y1="500" x2="100" y2="500" stroke="rgba(180,200,255,0.06)" strokeWidth="0.5" />
        <line x1="500" y1="500" x2="500" y2="100" stroke="rgba(180,200,255,0.06)" strokeWidth="0.5" />
        <line x1="500" y1="500" x2="216" y2="216" stroke="rgba(180,200,255,0.05)" strokeWidth="0.5" />
        <line x1="500" y1="500" x2="216" y2="600" stroke="rgba(180,200,255,0.04)" strokeWidth="0.5" />
        {/* Small constellation paths */}
        <path d="M280 380L340 340L400 360L460 310" stroke="rgba(200,210,255,0.08)" strokeWidth="0.6" />
        <path d="M360 240L420 280L480 250" stroke="rgba(180,200,255,0.07)" strokeWidth="0.5" />
        {/* Dots */}
        <g fill="rgba(220,230,255,0.5)">
            <circle cx="280" cy="380" r="1.4" />
            <circle cx="340" cy="340" r="1.6" />
            <circle cx="400" cy="360" r="1.3" />
            <circle cx="460" cy="310" r="1.5" />
            <circle cx="360" cy="240" r="1.3" />
            <circle cx="420" cy="280" r="1.5" />
            <circle cx="480" cy="250" r="1.3" />
        </g>
    </svg>
);

const LowerLeftConstellation = ({ className }: { className: string }) => (
    <svg
        className={className}
        viewBox="0 0 360 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
    >
        <g opacity="0.36">
            <path d="M18 212L76 180L120 196L172 148L214 170L258 130" stroke="rgba(180,200,255,0.16)" strokeWidth="0.7" />
            <path d="M96 242L138 214L186 232L228 204" stroke="rgba(160,180,240,0.12)" strokeWidth="0.6" />
            <path d="M202 92L238 76L276 96L320 62" stroke="rgba(180,190,240,0.12)" strokeWidth="0.6" />
        </g>
        <g fill="rgba(210,225,255,0.55)">
            <circle cx="18" cy="212" r="1.4" />
            <circle cx="76" cy="180" r="1.6" />
            <circle cx="120" cy="196" r="1.1" />
            <circle cx="172" cy="148" r="1.5" />
            <circle cx="214" cy="170" r="1.1" />
            <circle cx="258" cy="130" r="1.4" />
            <circle cx="96" cy="242" r="1.2" />
            <circle cx="138" cy="214" r="1.0" />
            <circle cx="186" cy="232" r="1.1" />
            <circle cx="228" cy="204" r="1.0" />
            <circle cx="202" cy="92" r="1.0" />
            <circle cx="238" cy="76" r="1.1" />
            <circle cx="276" cy="96" r="0.9" />
            <circle cx="320" cy="62" r="1.3" />
        </g>
    </svg>
);

export function AuraCosmicBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 aura-space-base" />
            <div className="absolute inset-0 aura-starfield" />
            <div className="absolute inset-0 aura-stargrain" />
            <div className="aura-milky-cloud" />
            <div className="aura-warm-nebula" />

            <div className="aura-nebula aura-nebula-1" />
            <div className="aura-nebula aura-nebula-2" />
            <div className="aura-nebula aura-nebula-3" />
            <div className="aura-nebula aura-nebula-4" />
            <div className="aura-nebula aura-nebula-5" />
            <div className="aura-focus-glow" />

            <EdgeConstellation className="aura-constellation aura-constellation-left" />
            <EdgeConstellation className="aura-constellation aura-constellation-right" />
            <LowerLeftConstellation className="aura-constellation-lower-left" />
            <CornerOrbital className="aura-orbital-sigil" />
            <BottomRightAstralGrid className="aura-astral-grid" />

            <div className="absolute inset-0 aura-vignette" />
        </div>
    );
}
