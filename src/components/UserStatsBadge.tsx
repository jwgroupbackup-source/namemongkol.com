import { Users } from 'lucide-react';

export default function UserStatsBadge({ users = 12000, label = 'มีผู้ค้นหาแล้ว' }: { users?: number; label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium shadow-sm">
      <Users className="w-4 h-4 text-blue-400" />
      <span>{label}</span>
      <span className="font-bold text-slate-200">{users.toLocaleString()}</span>
      <span className="text-slate-400">คน</span>
    </div>
  );
}
