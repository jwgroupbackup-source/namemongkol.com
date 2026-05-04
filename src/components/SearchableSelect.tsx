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
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
    disabled = false,
    searchPlaceholder = 'Type to search...',
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
                className={`w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-all
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-500/30 hover:bg-white/10'}
                    ${isOpen ? 'border-amber-500/50 ring-2 ring-amber-500/10 bg-white/10' : ''}
                `}
            >
                <span className={`${!displayValue ? 'text-slate-500' : 'text-white'}`}>
                    {displayValue || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                className="w-full bg-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
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
                                            ? 'bg-amber-500/10 text-amber-500 font-medium'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <span>{opt.label}</span>
                                    {opt.value === value && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-500 text-xs">
                                ไม่พบข้อมูล
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
