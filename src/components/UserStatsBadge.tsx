import { Users } from 'lucide-react';

export default function UserStatsBadge({ users = 12000, label = 'มีผู้ค้นหาแล้ว' }: { users?: number; label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/80 px-3 py-1 text-sm font-medium text-[#1a1a3e] shadow-sm">
      <Users className="h-4 w-4 text-emerald-700" />
      <span className="text-emerald-800">{label}</span>
      <span className="font-black tabular-nums text-[#1a1a3e]">{users.toLocaleString()}</span>
      <span className="font-semibold text-[#5a5a82]">คน</span>
    </div>
  );
}
