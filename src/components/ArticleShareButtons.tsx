'use client';

import React, { useState } from 'react';
import { Facebook, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';

interface ArticleShareButtonsProps {
    title: string;
    slug: string;
}

export const ArticleShareButtons: React.FC<ArticleShareButtonsProps> = ({ title, slug }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = (platform: 'facebook' | 'line' | 'copy') => {
        const url = `${window.location.origin}/articles/${slug}`;
        const text = `อ่านบทความ "${title}" ที่ NameMongkol`;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'line':
                window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text + '\n' + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
                break;
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => handleShare('facebook')}
                className="p-2.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors"
                title="แชร์ไป Facebook"
            >
                <Facebook size={20} />
            </button>
            <button
                onClick={() => handleShare('line')}
                className="p-2.5 rounded-full bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#06C755] transition-colors"
                title="แชร์ไป LINE"
            >
                <MessageCircle size={20} />
            </button>
            <button
                onClick={() => handleShare('copy')}
                className={`p-2.5 rounded-full transition-colors ${copied
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700'
                    }`}
                title="คัดลอกลิงก์"
            >
                {copied ? <Check size={20} /> : <LinkIcon size={20} />}
            </button>
        </div>
    );
};
