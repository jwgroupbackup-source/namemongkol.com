'use client';

import React from 'react';
import Image from 'next/image';
import { ImageEnlargeModal } from './ImageEnlargeModal';

export const ComparisonSection = () => {
    const desktopImageSrc = '/images/articles/comparison-mobile.webp';
    const mobileImageSrc = '/images/articles/comparison-mobile.webp';
    const imageAlt = 'ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์ชื่อมงคล ระหว่างเว็บไซต์ทั่วไปกับ NameMongkol';
    const [modalImageSrc, setModalImageSrc] = React.useState<string | null>(null);

    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-600 mb-12">
                ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์
            </h2>

            <figure className="overflow-hidden rounded-2xl border border-[#ddddf0] shadow-xl bg-white">
                <button
                    type="button"
                    onClick={() => setModalImageSrc(mobileImageSrc)}
                    className="block w-full cursor-zoom-in md:hidden"
                    aria-label="คลิกเพื่อดูภาพตารางเปรียบเทียบแบบขยาย"
                >
                    <Image
                        src={mobileImageSrc}
                        alt={imageAlt}
                        width={880}
                        height={1200}
                        className="h-auto w-full object-contain"
                        priority
                    />
                </button>
                <button
                    type="button"
                    onClick={() => setModalImageSrc(desktopImageSrc)}
                    className="hidden w-full cursor-zoom-in md:block"
                    aria-label="คลิกเพื่อดูภาพตารางเปรียบเทียบแบบขยาย"
                >
                    <Image
                        src={desktopImageSrc}
                        alt={imageAlt}
                        width={998}
                        height={484}
                        className="h-auto w-full object-cover"
                        priority
                    />
                </button>
                <figcaption className="border-t border-[#ddddf0] bg-slate-50 px-4 py-3 text-sm text-[#5a5a82] md:px-6">
                    ภาพสรุปความแตกต่างของฟีเจอร์วิเคราะห์ชื่อมงคล ระหว่างเว็บไซต์ทั่วไปและ NameMongkol
                </figcaption>
            </figure>

            <ImageEnlargeModal
                isOpen={Boolean(modalImageSrc)}
                src={modalImageSrc}
                alt={imageAlt}
                onClose={() => setModalImageSrc(null)}
            />
        </section>
    );
};
