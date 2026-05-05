'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, ChevronLeft, ChevronRight, Save, X, User, Mail, Facebook } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { calculateEffectiveCredits } from '@/utils/credits';

interface UserProfile {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    provider?: string;
    credits: number;
    welcome_credits?: number | null;
    welcome_credits_granted_at?: string | null;
    role: string;
    tier?: 'free' | 'pro' | 'vvip' | string | null;
    created_at?: string;
}

type MemberTier = 'free' | 'pro' | 'vvip';
const MEMBER_TIERS: MemberTier[] = ['free', 'pro', 'vvip'];

function normalizeTier(tier?: string | null): MemberTier {
    const normalized = (tier || '').toLowerCase();
    return MEMBER_TIERS.includes(normalized as MemberTier) ? (normalized as MemberTier) : 'free';
}

export default function AdminUsersPage() {
    // ... (state code unchanged)

    const renderProviderBadge = (provider?: string) => {
        const p = (provider || 'email').toLowerCase();
        if (p.includes('google')) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 w-fit">
                    {/* Fake Google Icon using G text or Globe if preferred */}
                    <span className="text-white">G</span>
                    <span>Google</span>
                </div>
            );
        }
        if (p.includes('facebook')) {
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1877F2]/20 text-[#1877F2] text-xs font-bold border border-[#1877F2]/30 w-fit">
                    <Facebook size={14} />
                    <span>Facebook</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 w-fit">
                <Mail size={14} />
                <span>Email</span>
            </div>
        );
    };

    // ... (fetchUsers and effects unchanged)
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<'all' | MemberTier>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editCredits, setEditCredits] = useState(0);
    const [editRole, setEditRole] = useState('user');
    const [editTier, setEditTier] = useState<MemberTier>('free');
    const [saving, setSaving] = useState(false);

    const fetchUsers = useCallback(async () => {
        const Swal = (await import('sweetalert2')).default;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search
            });
            if (tierFilter !== 'all') {
                query.set('tier', tierFilter);
            }
            const res = await fetch(`/api/admin/users?${query}`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setTotalPages(Math.ceil((data.total || 0) / 20));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, search, tierFilter]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [fetchUsers]);

    const handleEdit = (user: UserProfile) => {
        setEditingUser(user);
        setEditCredits(user.credits ?? 0);
        setEditRole(user.role || 'user');
        setEditTier(normalizeTier(user.tier));
    };

    const handleSave = async () => {
        if (!editingUser) return;
        const Swal = (await import('sweetalert2')).default;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({
                    id: editingUser.id,
                    credits: parseInt(editCredits.toString()),
                    role: editRole,
                    tier: editTier
                })
            });
            const data = await res.json();
            if (data.success) {
                setUsers(users.map(u => u.id === editingUser.id ? data.user : u));
                setEditingUser(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'User data and membership tier have been updated.',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User className="text-emerald-500" />
                            จัดการผู้ใช้งาน
                        </h1>
                        <p className="text-slate-400 text-sm">ดูแลบัญชีและเครดิตสมาชิก</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="ค้นหา (ID / ชื่อ / อีเมล)..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <select
                            value={tierFilter}
                            onChange={(e) => {
                                const nextFilter = e.target.value as 'all' | MemberTier;
                                setTierFilter(nextFilter);
                                setPage(1);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all min-w-[160px]"
                        >
                            <option value="all">ทุกระดับสมาชิก</option>
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="vvip">VVIP</option>
                        </select>
                    </div>
                </header>

                {/* Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Provider</th>
                                    <th className="px-6 py-4 text-center">Registered</th>
                                    <th className="px-6 py-4 text-center">Member Tier</th>
                                    <th className="px-6 py-4 text-center">Role</th>
                                    <th className="px-6 py-4 text-center">Credits</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin h-6 w-6 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
                                            </div>
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            ไม่พบข้อมูลผู้ใช้งาน
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-white font-bold text-base">
                                                        {user.first_name || user.last_name
                                                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                            : 'No Display Name'}
                                                    </span>
                                                    {user.email && (
                                                        <span className="text-sm text-emerald-400/80 font-medium">
                                                            {user.email}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-600 font-mono mt-1" title={user.id}>
                                                        ID: {user.id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderProviderBadge(user.provider)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-300 font-medium">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })
                                                            : '-'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-600">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleTimeString('th-TH', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(() => {
                                                    const tier = normalizeTier(user.tier);
                                                    const tierClassName = tier === 'vvip'
                                                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                                        : tier === 'pro'
                                                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                                                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/50';

                                                    return (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${tierClassName}`}>
                                                            {tier}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    : 'bg-slate-700/50 text-slate-400'
                                                    }`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-emerald-400 font-bold">{calculateEffectiveCredits(user).toLocaleString()}</span>
                                                    {(user.welcome_credits ?? 0) > 0 && (
                                                        <span className="text-[10px] text-amber-400/70">
                                                            (+{user.welcome_credits} welcome)
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center px-6 py-4 bg-slate-800/20 border-t border-slate-700/50 text-sm">
                        <span className="text-slate-500">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                        <button
                            onClick={() => setEditingUser(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">แก้ไขข้อมูลผู้ใช้</h3>

                        <div className="space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                                <p className="text-slate-400 text-sm">User ID</p>
                                <p className="text-slate-200 font-mono text-xs mt-1 break-all">{editingUser.id}</p>
                            </div>

                            {/* Credit Summary (read-only) */}
                            <div className="bg-slate-800/50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">เครดิตรวม (ใช้งานได้)</span>
                                    <span className="text-emerald-400 font-bold text-lg">
                                        {calculateEffectiveCredits(editingUser).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-slate-700/50 pt-2">
                                    <span className="text-slate-500">เครดิตที่ซื้อ/เติม</span>
                                    <span className="text-slate-300">{(editingUser.credits ?? 0).toLocaleString()}</span>
                                </div>
                                {(editingUser.welcome_credits ?? 0) > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Welcome เครดิต</span>
                                        <span className="text-amber-400">{(editingUser.welcome_credits ?? 0).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">เครดิตที่ซื้อ/เติม (Purchased Credits)</label>
                                <input
                                    type="number"
                                    value={editCredits}
                                    onChange={(e) => setEditCredits(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Welcome เครดิตจะคำนวณอัตโนมัติ ไม่ต้องรวมในช่องนี้</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">ระดับสมาชิก (Member Tier)</label>
                                <select
                                    value={editTier}
                                    onChange={(e) => setEditTier(normalizeTier(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="vvip">VVIP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">บทบาท (Role)</label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} /> บันทึกข้อมูล
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
