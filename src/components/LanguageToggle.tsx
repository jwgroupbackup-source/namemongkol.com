"use client";

import React, { useState, useRef, useEffect } from "react";
import { supportedLanguages, SupportedLanguage } from "@/i18n/dictionaries";
import { useLanguage } from "./LanguageProvider";
import { ChevronDown, Globe } from "lucide-react";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleChange = (lang: SupportedLanguage) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0f172a] border border-[#1e293b] hover:bg-[#1e293b] hover:border-amber-500/30 transition-all duration-200 shadow-sm group"
                aria-label="Select Language"
                aria-expanded={isOpen}
            >
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {language.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-amber-400 transition-colors hidden sm:block">
                    {currentLang.label}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-white/95 dark:bg-[#0f172a]/95 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-1.5 flex flex-col gap-0.5">
                        {supportedLanguages.map(({ code, label }) => {
                            const isActive = code === language;
                            return (
                                <button
                                    key={code}
                                    onClick={() => handleChange(code)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-500" : "bg-transparent"}`} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
