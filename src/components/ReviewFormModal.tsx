'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Star, Send, Sparkles, MessageCircle, Gift, Briefcase, Image as ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/utils/supabase'; // Import supabase
import { compressImage } from '@/utils/image';

import { ReviewServiceType } from '@/types';
import Image from 'next/image';

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        id: string;
        nickname: string;
        role?: string;
        content: string;
        rating: number;
        tags: string[];
        service_type?: ReviewServiceType;
        images?: string[];
    } | null;
    onSuccess?: () => void;
}

const CATEGORIES = [
    { id: 'การเงิน', label: 'การเงิน 💰' },
    { id: 'การงาน', label: 'การงาน 💼' },
    { id: 'ความรัก', label: 'ความรัก ❤️' },
    { id: 'สุขภาพ', label: 'สุขภาพ 🏥' },
    { id: 'โชคลาภ', label: 'โชคลาภ 🍀' }
];

// Service types for the review - helps with SEO
const SERVICE_TYPES: { id: ReviewServiceType; label: string }[] = [
    { id: 'name-analysis', label: '🔮 วิเคราะห์ชื่อมงคล' },
    { id: 'phone-analysis', label: '📱 วิเคราะห์เบอร์มงคล' },
    { id: 'premium-search', label: '👑 ค้นหาชื่อพรีเมียม' },
    { id: 'premium-analysis', label: '💎 วิเคราะห์แบบพรีเมียม' },
    { id: 'wallpapers', label: '🎨 วอลเปเปอร์มงคล' },
    { id: 'general', label: '📝 ทั่วไป' }
];

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [rating, setRating] = useState(initialData?.rating || 5);
    const [hoverRating, setHoverRating] = useState(0);
    const [serviceType, setServiceType] = useState<ReviewServiceType>(initialData?.service_type || 'general');
    const [formData, setFormData] = useState<{
        nickname: string;
        role: string;
        categories: string[];
        content: string;
    }>({
        nickname: initialData?.nickname || '',
        role: initialData?.role || '',
        categories: initialData?.tags || [],
        content: initialData?.content || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Image Upload State
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || []);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state with initialData when it changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nickname: initialData.nickname,
                    role: initialData.role || '',
                    categories: initialData.tags || [],
                    content: initialData.content
                });
                setRating(initialData.rating);
                setServiceType(initialData.service_type || 'general');
                setPreviewUrls(initialData.images || []);
                setSelectedFiles([]);
            } else {
                // Reset for new entry
                setFormData({
                    nickname: '',
                    role: '',
                    categories: [],
                    content: ''
                });
                setRating(5);
                setServiceType('general');
                setPreviewUrls([]);
                setSelectedFiles([]);
            }
        }
    }, [isOpen, initialData]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = (files: File[]) => {
        const currentCount = selectedFiles.length + (initialData?.images?.length || 0);
        const remainingSlots = 2 - currentCount;

        if (remainingSlots <= 0) {
            alert('อัปโหลดรูปภาพได้สูงสุด 2 รูป');
            return;
        }

        const validFiles = files.slice(0, remainingSlots).filter(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
                return false;
            }
            if (!file.type.startsWith('image/')) {
                alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            // Compress images before adding to state
            Promise.all(validFiles.map(async (file) => {
                try {
                    const compressedBlob = await compressImage(file, 1200, 0.8);
                    // Create a new File object from the compressed Blob to maintain name/type if needed
                    // Use .jpg extension as compression output is jpeg
                    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
                    const compressedFile = new File([compressedBlob], newName, { type: 'image/jpeg' });
                    return compressedFile;
                } catch (error) {
                    console.error('Compression failed for', file.name, error);
                    return file; // Fallback to original if compression fails
                }
            })).then((processedFiles) => {
                setSelectedFiles(prev => [...prev, ...processedFiles]);
                const newPreviews = processedFiles.map(file => URL.createObjectURL(file));
                setPreviewUrls(prev => [...prev, ...newPreviews]);
            });
        }
    };

    const handleRemoveFile = (index: number) => {
        if (initialData?.images && index < initialData.images.length) {
            // Removing a previously uploaded image (not implemented in this simplified version for edit mode)
            // For now, let's just allow removing new files or prevent editing existing images easily without more logic.
            // Assuming this handles mixed preview of existing + new is complex.
            // Simplified: If editing, clearing initialImages is purely visual unless we handle delete logic on backend.
            // Let's just update previewUrls. Real deletion from storage usually happens on "Update" click or user request.
            setPreviewUrls(prev => prev.filter((_, i) => i !== index));
            // Warning: This doesn't remove from DB until save.
        } else {
            // Removing a newly selected file
            const newFileIndex = index - (initialData?.images?.length || 0);
            if (newFileIndex >= 0) {
                const urlToRemove = previewUrls[index];
                URL.revokeObjectURL(urlToRemove); // Cleanup
                setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
                setPreviewUrls(prev => prev.filter((_, i) => i !== index));
            } else {
                // Just remove from preview if it was existing
                setPreviewUrls(prev => prev.filter((_, i) => i !== index));
            }
        }
    };

    // Drag and Drop handlers
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const uploadImages = async (userId: string): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        for (const file of selectedFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('review-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                throw new Error('ไม่สามารถอัปโหลดรูปภาพได้');
            }

            const { data } = supabase.storage
                .from('review-images')
                .getPublicUrl(filePath);

            if (data) {
                uploadedUrls.push(data.publicUrl);
            }
        }
        return uploadedUrls;
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation: Content Length
        if (formData.content.length < 50) {
            // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                icon: 'warning',
                title: 'เนื้อหาสั้นเกินไป',
                text: 'กรุณาเขียนรีวิวอย่างน้อย 50 ตัวอักษร เพื่อแบ่งปันประสบการณ์ที่เป็นประโยชน์',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#f59e0b'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');

            // 1. Upload new images
            const newImageUrls = selectedFiles.length > 0 ? await uploadImages(session.user.id) : [];

            // Combine with existing images (that weren't removed)
            // Note: This logic assumes previewUrls contains valid existing URLs + valid blob URLs.
            // We need to filter out blob URLs from previewUrls to find retained existing images.
            const retainedExistingImages = previewUrls.filter(url => url.startsWith('http') && !url.startsWith('blob:'));
            const finalImages = [...retainedExistingImages, ...newImageUrls];

            // Prepare tags based on categories
            const tags = formData.categories;

            if (initialData?.id) {
                // Update Mode
                const { error } = await supabase
                    .from('reviews')
                    .update({
                        nickname: formData.nickname,
                        role: formData.role,
                        content: formData.content,
                        category: formData.categories[0],
                        rating: rating,
                        tags: tags,
                        service_type: serviceType,
                        images: finalImages
                    })
                    .eq('id', initialData.id);

                if (error) throw error;

                // Show simple success for edit
                // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกการแก้ไขสำเร็จ',
                    background: '#1e293b',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
                onClose();
                if (onSuccess) onSuccess();
                return;

            } else {
                // Insert Mode
                const { data, error } = await supabase.rpc('submit_review', {
                    p_nickname: formData.nickname,
                    p_role: formData.role,
                    p_content: formData.content,
                    p_category: formData.categories[0], // Use first category as primary
                    p_rating: rating,
                    p_tags: tags,
                    p_service_type: serviceType,
                    p_images: finalImages
                });

                if (error) {
                    console.error('RPC Error:', error);
                    throw error;
                }

                if (data && data.success) {
                    setStep('success');
                    if (onSuccess) onSuccess();

                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
                    });
                } else {
                    console.error('Submission failed logic:', data);
                    // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
                    Swal.fire({
                        icon: 'error',
                        title: 'บันทึกไม่สำเร็จ',
                        text: data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }

        } catch (err: unknown) {
            console.error('Error submitting review (Full):', err);
            // -expect-error Temporary type mismatch with external/runtime data.
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: (err instanceof Error ? err.message : 'ไม่สามารถเชื่อต่อกับระบบได้'),
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state after transition
        setTimeout(() => {
            setStep('form');
            setFormData({ nickname: '', role: '', categories: [], content: '' });
            setRating(5);
            setSelectedFiles([]);
            setPreviewUrls([]);
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 transform animate-scale-in overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full z-20"
                >
                    <X size={20} />
                </button>

                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <MessageCircle className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">{initialData ? 'แก้ไขรีวิว' : 'เล่าประสบการณ์ของคุณ'}</h2>
                                <p className="text-slate-400 text-sm">{initialData ? 'แก้ไขข้อมูลรีวิวของคุณ' : 'รับฟรี 50 Credits เมื่อรีวิวได้รับการอนุมัติ'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ชื่อเล่น (ที่ใช้แสดง)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-500 text-sm"
                                        placeholder="เช่น คุณส้ม"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">อาชีพ (ระบุหรือไม่ก็ได้)</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-slate-500 text-sm"
                                        placeholder="เช่น ธุรกิจส่วนตัว"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">เรื่องที่ต้องการรีวิว (เลือกได้สูงสุด 3 ข้อ)</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {CATEGORIES.map(cat => {
                                        const isSelected = formData.categories.includes(cat.id);
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => {
                                                        const current = prev.categories;
                                                        if (current.includes(cat.id)) {
                                                            return { ...prev, categories: current.filter(c => c !== cat.id) };
                                                        }
                                                        if (current.length >= 3) return prev;
                                                        return { ...prev, categories: [...current, cat.id] };
                                                    });
                                                }}
                                                className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium border transition-all ${isSelected
                                                    ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/20'
                                                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Service Type Selector - SEO Enhancement */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 flex items-center gap-2">
                                    <Briefcase size={14} className="text-cyan-400" />
                                    บริการที่ใช้
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {SERVICE_TYPES.map(service => {
                                        const isSelected = serviceType === service.id;
                                        return (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setServiceType(service.id)}
                                                className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium border transition-all text-left ${isSelected
                                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                {service.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ความประทับใจ</label>
                                <textarea
                                    required
                                    rows={4}
                                    minLength={50}
                                    maxLength={1500}
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600 text-sm resize-none ${formData.content.length > 0 && formData.content.length < 50
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-700 focus:border-amber-500'
                                        }`}
                                    placeholder="เล่าความเปลี่ยนแปลงหลังจากเปลี่ยนชื่อ หรือเบอร์มงคล... (อย่างน้อย 50 ตัวอักษร)"
                                />
                                <div className="flex justify-between items-center mt-1.5 px-1">
                                    <span className={`text-[10px] ${formData.content.length > 0 && formData.content.length < 50 ? 'text-red-400' : 'text-slate-500'
                                        }`}>
                                        {formData.content.length < 50 ? `อีก ${50 - formData.content.length} ตัวอักษร` : 'ครบจำนวนแล้ว'}
                                    </span>
                                    <span className={`text-[10px] ${formData.content.length >= 1500 ? 'text-red-400' : 'text-slate-500'
                                        }`}>
                                        {formData.content.length} / 1,500
                                    </span>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1 flex items-center gap-1">
                                    <ImageIcon size={14} className="text-purple-400" />
                                    รูปภาพประกอบ (สูงสุด 2 รูป)
                                </label>

                                <div
                                    className={`border-2 border-dashed rounded-xl p-4 transition-all ${isDragging
                                        ? 'border-amber-500 bg-amber-500/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                        }`}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />

                                    {previewUrls.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-slate-700">
                                                    <Image
                                                        src={url}
                                                        alt="ตัวอย่างรูปภาพรีวิวที่เลือก"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {previewUrls.length < 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex flex-col items-center justify-center aspect-video rounded-lg border border-dashed border-slate-600 hover:border-amber-500 hover:bg-slate-800/50 transition-all group"
                                                >
                                                    <Sparkles size={20} className="text-slate-500 group-hover:text-amber-400 mb-1" />
                                                    <span className="text-xs text-slate-500 group-hover:text-slate-300">เพิ่มรูปภาพ</span>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-center">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                                                <UploadCloud size={20} className="text-slate-400" />
                                            </div>
                                            <p className="text-sm text-slate-300 font-medium">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                                            <p className="text-[10px] text-slate-500 mt-1">ไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="mt-3 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300 font-medium transition-colors border border-white/10"
                                            >
                                                เลือกรูปภาพ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">ให้คะแนนความพึงพอใจ</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={24}
                                                className={`${star <= (hoverRating || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-slate-800 text-slate-700'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || formData.categories.length === 0}
                                className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        กำลังบันทึกข้อมูล...
                                    </>
                                ) : (
                                    <>
                                        ส่งเรื่องราว <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="relative z-10 flex flex-col items-center text-center py-6">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 animate-pulse"></div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3 border-2 border-emerald-200/20 animate-scale-in">
                                <Gift size={40} className="text-white drop-shadow-md" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">ขอบคุณที่ร่วมแบ่งปัน!</h2>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                            เรื่องราวของคุณถูกส่งเรียบร้อยแล้ว <br />
                            ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชม.
                        </p>

                        <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <Sparkles className="text-emerald-400" size={20} />
                            <div className="text-left">
                                <p className="text-xs text-slate-400">เมื่อได้รับการอนุมัติ</p>
                                <p className="text-emerald-400 font-bold">+30 Credits</p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-slate-400 hover:text-white font-medium text-sm underline decoration-slate-600 hover:decoration-white transition-all"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
