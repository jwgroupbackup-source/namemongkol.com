import type { ReactNode } from 'react';

type BackgroundComponentsProps = {
    children?: ReactNode;
    className?: string;
};

/**
 * White Tech Premium background.
 * Base: warm white-lavender (#f8f8fc).
 * Glows: pale lavender at top, soft gold warmth at bottom-right.
 * Pattern: very subtle sacred-geometry SVG at 2.5% opacity — adds spiritual
 * depth without visual noise. Invisible at glance, felt subconsciously.
 */
export const Component = ({ children, className = '' }: BackgroundComponentsProps) => {
    return (
        <div
            className={`min-h-screen w-full relative ${className}`}
            style={{ backgroundColor: '#f8f8fc' }}
        >
            {/* Lavender haze — top center */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 80% 55% at 50% -5%, rgba(155,142,196,0.13) 0%, transparent 65%),
                        radial-gradient(ellipse 55% 40% at 95% 100%, rgba(201,147,58,0.07) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 30% at 5% 80%, rgba(155,142,196,0.06) 0%, transparent 55%)
                    `,
                }}
            />

            {/* Sacred geometry pattern — opacity 0.025, purely decorative */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                style={{ opacity: 0.025 }}
            >
                <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'absolute', inset: 0 }}
                >
                    <defs>
                        <pattern id="wtp-sacred" x="0" y="0" width="320" height="320" patternUnits="userSpaceOnUse">
                            {/* Outer circle */}
                            <circle cx="160" cy="160" r="120" fill="none" stroke="#5a3a8a" strokeWidth="0.8" />
                            {/* Inner circle */}
                            <circle cx="160" cy="160" r="80" fill="none" stroke="#5a3a8a" strokeWidth="0.6" />
                            {/* Innermost circle */}
                            <circle cx="160" cy="160" r="40" fill="none" stroke="#c9933a" strokeWidth="0.5" />
                            {/* 6-point star */}
                            <polygon
                                points="160,52 178,120 248,102 212,160 248,218 178,200 160,268 142,200 72,218 108,160 72,102 142,120"
                                fill="none"
                                stroke="#5a3a8a"
                                strokeWidth="0.5"
                            />
                            {/* Cross lines */}
                            <line x1="160" y1="40" x2="160" y2="280" stroke="#5a3a8a" strokeWidth="0.3" />
                            <line x1="40" y1="160" x2="280" y2="160" stroke="#5a3a8a" strokeWidth="0.3" />
                            <line x1="74" y1="74" x2="246" y2="246" stroke="#5a3a8a" strokeWidth="0.25" />
                            <line x1="246" y1="74" x2="74" y2="246" stroke="#5a3a8a" strokeWidth="0.25" />
                            {/* Dot accents */}
                            <circle cx="160" cy="40" r="2" fill="#c9933a" />
                            <circle cx="160" cy="280" r="2" fill="#c9933a" />
                            <circle cx="40" cy="160" r="2" fill="#c9933a" />
                            <circle cx="280" cy="160" r="2" fill="#c9933a" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wtp-sacred)" />
                </svg>
            </div>

            {children}
        </div>
    );
};

export const SoftYellowGlowBackground = Component;

export default Component;
