import { Star } from 'lucide-react';

export default function ReviewBadge({ rating = 4.8, count = 512 }: { rating?: number; count?: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium shadow-sm">
      <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" />
      <span>{rating.toFixed(1)}</span>
      <span className="text-slate-600">/ 5</span>
      <span className="mx-1 text-slate-500">•</span>
      <span className="text-slate-700">{count.toLocaleString()} รีวิว</span>
    </div>
  );
}
