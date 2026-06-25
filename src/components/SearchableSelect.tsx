import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[] | string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    searchPlaceholder?: string;
    variant?: 'dark' | 'light';
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
    disabled = false,
    searchPlaceholder = 'Type to search...',
    variant = 'dark',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Convert options to standard format
    const formattedOptions: Option[] = React.useMemo(() => {
        return options.map(opt =>
            typeof opt === 'string' ? { value: opt, label: opt } : opt
        );
    }, [options]);

    // Find selected label for display
    const selectedOption = formattedOptions.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : '';

    // Filter options based on search term
    const filteredOptions = formattedOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const isLight = variant === 'light';

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div
                onClick={() => {
                    if (disabled) return;
                    const nextOpen = !isOpen;
                    setIsOpen(nextOpen);
                    if (nextOpen) {
                        setSearchTerm('');
                    }
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all
                    ${isLight
                        ? 'border-pink-100/90 bg-white/80 text-[#1a1a3e] shadow-[0_10px_24px_rgba(201,147,58,0.05)]'
                        : 'border-slate-700/80 bg-slate-900/90 shadow-inner'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : isLight ? 'hover:border-pink-300 hover:bg-white' : 'hover:border-amber-500/40 hover:bg-slate-900'}
                    ${isOpen ? isLight ? 'border-pink-300 ring-2 ring-pink-200/50 bg-white' : 'border-amber-500/60 ring-2 ring-amber-500/10 bg-slate-900' : ''}
                `}
            >
                <span className={`${!displayValue ? isLight ? 'text-slate-400' : 'text-slate-500' : isLight ? 'text-[#1a1a3e]' : 'text-white'}`}>
                    {displayValue || placeholder}
                </span>
                <ChevronDown size={16} className={`${isLight ? 'text-pink-400' : 'text-slate-500'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className={`absolute z-50 w-full mt-2 overflow-hidden rounded-xl border shadow-2xl animate-in fade-in zoom-in-95 duration-100 ${isLight ? 'border-pink-100 bg-white shadow-pink-200/30' : 'border-slate-800 bg-slate-950 shadow-slate-950/40'}`}>
                    <div className={`p-2 border-b ${isLight ? 'border-pink-100' : 'border-slate-800'}`}>
                        <div className="relative">
                            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-pink-300' : 'text-slate-500'}`} />
                            <input
                                type="text"
                                className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${isLight ? 'bg-pink-50/60 text-[#1a1a3e] placeholder:text-slate-400 focus:ring-pink-300/60' : 'bg-slate-900 text-white placeholder:text-slate-500 focus:ring-amber-500/30'}`}
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                        ${opt.value === value
                                            ? isLight ? 'bg-pink-50 text-pink-600 font-medium' : 'bg-amber-500/10 text-amber-500 font-medium'
                                            : isLight ? 'text-slate-600 hover:bg-amber-50/70 hover:text-[#1a1a3e]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <span>{opt.label}</span>
                                    {opt.value === value && <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-pink-500' : 'bg-amber-500'}`} />}
                                </div>
                            ))
                        ) : (
                            <div className={`px-4 py-8 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                                ไม่พบข้อมูล
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
