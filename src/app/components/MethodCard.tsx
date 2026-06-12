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
      Ideenfindung: 'bg-blue-600 text-white',
      Problemanalyse: 'bg-purple-600 text-white',
      Entscheidungsfindung: 'bg-green-600 text-white',
      Teamarbeit: 'bg-orange-600 text-white',
      Planung: 'bg-pink-600 text-white',
      Kommunikation: 'bg-cyan-600 text-white',
      Selbstmanagement: 'bg-indigo-600 text-white',
      Erwartungsmanagement: 'bg-teal-600 text-white',
      Konfliktlösung: 'bg-rose-600 text-white',
      'Stakeholder Management': 'bg-amber-600 text-white',
    };

    return colors[cat] || 'bg-gray-700 text-white';
  };

  const handlePinClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTogglePin();
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-white transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:hover:shadow-2xl dark:hover:shadow-black/40 ${
        isPinned
          ? 'border-2 border-gray-400 shadow-md dark:border-slate-500 dark:shadow-black/30'
          : 'border border-gray-200 dark:border-slate-800'
      }`}
    >
      {isPinned && (
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center gap-1 bg-gray-900 px-3 py-1 text-xs text-white dark:bg-slate-800 dark:text-slate-200">
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
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs shadow-sm ${getCategoryColor(
            category
          )}`}
        >
          {category}
        </span>

        <button
          onClick={handlePinClick}
          className={`absolute left-3 top-3 rounded-full p-2 transition-colors ${
            isPinned
              ? 'bg-gray-900 text-white dark:bg-slate-800 dark:text-white'
              : 'bg-white/95 text-gray-700 hover:bg-white dark:bg-slate-950/85 dark:text-slate-200 dark:hover:bg-slate-950'
          }`}
          title={isPinned ? 'Von Dashboard entfernen' : 'Zu Dashboard hinzufügen'}
        >
          <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-slate-400">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
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

          <div className="flex items-center gap-1 text-gray-400 dark:text-slate-500">
            <Heart size={16} />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
