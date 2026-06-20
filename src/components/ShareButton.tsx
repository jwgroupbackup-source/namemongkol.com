'use client';

import React, { useState } from 'react';
import { Share2, Facebook, MessageCircle, Link as LinkIcon, Check, Image as ImageIcon, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti'; // dynamic imported
import dynamic from 'next/dynamic';
import { AnalysisResult } from '@/types';
const ImageGeneratorModal = dynamic(() => import('./ImageGeneratorModal').then(mod => mod.ImageGeneratorModal), {
    ssr: false
});
const CustomWallpaperGenerator = dynamic(() => import('./CustomWallpaperGenerator').then(mod => mod.CustomWallpaperGenerator), {
    ssr: false
});

interface ShareButtonProps {
    result?: AnalysisResult | null;
    day?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ result, day }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showWallpaperModal, setShowWallpaperModal] = useState(false);

    const toggleShare = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            triggerConfetti();
        }
    };

    const triggerConfetti = async () => {
        const confetti = (await import('canvas-confetti')).default;

        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    const handleShare = (platform: 'facebook' | 'line' | 'copy' | 'image' | 'wallpaper') => {
        // Construct URL with query parameters
        let url = window.location.href;

        if (result && day) {
            const params = new URLSearchParams();
            params.set('name', result.name);
            params.set('surname', result.surname);
            params.set('day', day);
            url = `${window.location.origin}?${params.toString()}`;
        }

        const text = result
            ? `วิเคราะห์ชื่อมงคล: ${result.name} ${result.surname} - ผลรวม ${result.totalScore} ความหมาย: ${result.prediction?.desc}`
            : 'วิเคราะห์ชื่อมงคลกับ NameMongkol';

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
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
            case 'image':
                setIsOpen(false);
                setShowImageModal(true);
                break;
            case 'wallpaper':
                setIsOpen(false);
                setShowWallpaperModal(true);
                break;
        }
    };

    const menuItems = [
        { id: 'wallpaper', icon: Smartphone, color: 'bg-gradient-to-r from-purple-500 to-pink-500', label: 'วอลเปเปอร์ส่วนตัว' },
        { id: 'image', icon: ImageIcon, color: 'bg-gradient-to-r from-amber-500 to-amber-600', label: 'Save as Image' },
        { id: 'facebook', icon: Facebook, color: 'bg-[#1877F2]', label: 'Facebook' },
        { id: 'line', icon: MessageCircle, color: 'bg-[#06C755]', label: 'Line' },
        { id: 'copy', icon: copied ? Check : LinkIcon, color: 'bg-slate-600', label: copied ? 'Copied!' : 'Copy Link' },
    ];

    return (
        <>
            <div className="relative flex items-center justify-center">
                <AnimatePresence>
                    {isOpen && (
                        <div className="absolute bottom-full mb-4 flex flex-col gap-3 items-center">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                    onClick={() => handleShare(item.id as 'facebook' | 'line' | 'copy' | 'image' | 'wallpaper')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white shadow-lg backdrop-blur-md ${item.color} hover:brightness-110 transition-all active:scale-95 whitespace-nowrap`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleShare}
                    className={`
                    relative z-10 w-full py-3 px-6 rounded-xl 
                    flex items-center justify-center gap-2 
                    font-medium shadow-sm
                    transition-all duration-300
                    ${isOpen
                            ? 'bg-amber-500 text-white'
                            : 'bg-white hover:bg-[#f8f8fc] border border-[#ddddf0] text-[#1a1a3e]'
                        }
                `}
                >
                    <Share2 className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    <span>{isOpen ? 'ปิดเมนู' : 'แบ่งปันผลลัพธ์'}</span>
                </motion.button>
            </div>

            {result && showImageModal && (
                <ImageGeneratorModal
                    isOpen={showImageModal}
                    onClose={() => setShowImageModal(false)}
                    result={result}
                />
            )}
            
            {result && showWallpaperModal && day && (
                <CustomWallpaperGenerator
                    isOpen={showWallpaperModal}
                    onClose={() => setShowWallpaperModal(false)}
                    name={result.name}
                    surname={result.surname}
                    totalScore={result.totalScore}
                    grade={result.grade}
                    day={day}
                />
            )}
        </>
    );
};
