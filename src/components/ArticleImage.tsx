'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

interface ArticleImageProps {
    src?: string;
    alt: string;
    priority?: boolean;
    className?: string;
    objectFit?: 'cover' | 'contain';
    objectPosition?: string;
    sizes?: string;
    variant?: 'card' | 'related' | 'detail' | 'wide';
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ 
    src, 
    alt, 
    priority = false, 
    className,
    objectFit = 'cover',
    objectPosition = 'center',
    sizes,
    variant = 'card',
}) => {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const hasError = Boolean(src && failedSrc === src);

    if (!src || hasError) {
        return (
            <div 
                className={`w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 relative overflow-hidden transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
                role="img"
                aria-label={alt || 'ไม่พบรูปภาพ'}
            >
                <BookOpen size={32} className="opacity-50" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
        );
    }

    // Determine if external URL
    const isExternal = src.startsWith('http');

    const objectFitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';
    const resolvedSizes = sizes ?? {
        card: '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw',
        related: '(max-width: 768px) 92vw, 30vw',
        detail: '(max-width: 768px) 92vw, 768px',
        wide: '(max-width: 768px) 96vw, (max-width: 1200px) 92vw, 1040px',
    }[variant];
    const quality = variant === 'detail' || variant === 'wide' ? 85 : 75;

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className={`${objectFitClass} transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
            style={{ objectPosition }}
            sizes={resolvedSizes}
            onError={() => setFailedSrc(src)}
            unoptimized={isExternal}
            quality={quality}
        />
    );
};
