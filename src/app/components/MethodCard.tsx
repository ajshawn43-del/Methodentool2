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
  onClick
}: MethodCardProps) {
  const { likes } = useLikes(id);
  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Ideenfindung': 'bg-blue-100 text-blue-700',
      'Problemanalyse': 'bg-purple-100 text-purple-700',
      'Entscheidungsfindung': 'bg-green-100 text-green-700',
      'Teamarbeit': 'bg-orange-100 text-orange-700',
      'Planung': 'bg-pink-100 text-pink-700',
      'Kommunikation': 'bg-cyan-100 text-cyan-700',
      'Selbstmanagement': 'bg-indigo-100 text-indigo-700',
      'Erwartungsmanagement': 'bg-teal-100 text-teal-700',
      'Konfliktlösung': 'bg-rose-100 text-rose-700',
      'Stakeholder Management': 'bg-amber-100 text-amber-700'
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin();
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        isPinned
          ? 'border-2 border-gray-900 shadow-md ring-2 ring-gray-900/10'
          : 'border border-gray-200'
      }`}
    >
      {isPinned && (
        <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white text-xs py-1 px-3 flex items-center justify-center gap-1 z-10">
          <Pin size={12} fill="currentColor" />
          <span>Angepinnt</span>
        </div>
      )}
      <div className={`relative h-64 w-full bg-gray-50 ${isPinned ? 'mt-6' : ''}`}>
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain p-4"
        />
        <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${getCategoryColor(category)}`}>
          {category}
        </span>
        <button
          onClick={handlePinClick}
          className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${
            isPinned
              ? 'bg-gray-900 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
          title={isPinned ? 'Von Dashboard entfernen' : 'Zu Dashboard hinzufügen'}
        >
          <Pin size={16} fill={isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
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
          <div className="flex items-center gap-1 text-gray-400">
            <Heart size={16} />
            <span>{likes}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
