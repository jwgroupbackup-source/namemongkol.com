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
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ 
    src, 
    alt, 
    priority = false, 
    className,
    objectFit = 'cover',
    objectPosition = 'center',
}) => {
    const [error, setError] = useState(false);

    if (!src || error) {
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

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className={`${objectFitClass} transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
            style={{ objectPosition }}
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 320px"
            onError={() => setError(true)}
            unoptimized={isExternal}
            quality={75}
        />
    );
};

