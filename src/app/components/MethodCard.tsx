import type { MouseEvent } from 'react';
import { Clock, Users, Heart, Pin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLikes } from '../hooks/useSupabase';

interface MethodCardProps {
  id: string;
  title: string;
  category: string;
  duration: string;
  participants: string;
  description: string;
  imageUrl: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onClick: () => void;
}

export function MethodCard({
  id,
  title,
  category,
  duration,
  participants,
  description,
  imageUrl,
  isPinned,
  onTogglePin,
  onClick,
}: MethodCardProps) {
  const { likes } = useLikes(id);

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      Ideenfindung: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      Problemanalyse: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      Entscheidungsfindung: 'bg-green-500/20 text-green-300 border border-green-500/30',
      Teamarbeit: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      Planung: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      Kommunikation: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
      Selbstmanagement: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      Erwartungsmanagement: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
      Konfliktlösung: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      'Stakeholder Management': 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    };

    return colors[cat] || 'bg-slate-700 text-slate-200 border border-slate-600';
  };

  const handlePinClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTogglePin();
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-slate-900 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 ${
        isPinned
          ? 'border-2 border-white shadow-lg ring-2 ring-white/10'
          : 'border border-slate-800'
      }`}
    >
      {isPinned && (
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center gap-1 bg-white px-3 py-1 text-xs text-slate-950">
          <Pin size={12} fill="currentColor" />
          <span>Angepinnt</span>
        </div>
      )}

      <div className={`relative h-64 w-full bg-white ${isPinned ? 'mt-6' : ''}`}>
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="h-full w-full object-contain p-4"
        />

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs ${getCategoryColor(
            category
          )}`}
        >
          {category}
        </span>

        <button
          onClick={handlePinClick}
          className={`absolute left-3 top-3 rounded-full p-2 transition-colors ${
            isPinned
              ? 'bg-white text-slate-950'
              : 'bg-slate-950/80 text-slate-200 hover:bg-slate-950'
          }`}
          title={isPinned ? 'Von Dashboard entfernen' : 'Zu Dashboard hinzufügen'}
        >
          <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>

        <p className="mb-4 line-clamp-2 text-sm text-slate-400">{description}</p>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{participants}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <Heart size={16} />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
