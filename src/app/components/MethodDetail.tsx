import {
  X,
  Clock,
  Users,
  Target,
  ArrowLeft,
  FileText,
  Heart,
  MessageCircle,
  Mail,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLikes, useComments } from '../hooks/useSupabase';

interface Step {
  title: string;
  description: string;
}

interface ContactPerson {
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

interface MethodDetailProps {
  id: string;
  title: string;
  category: string;
  duration: string;
  participants: string;
  description: string;
  goal: string;
  steps: Step[];
  tips: string[];
  pdfPages?: string;
  imageUrl: string;
  contactPerson: ContactPerson;
  examples?: string[];
  onClose: () => void;
}

export function MethodDetail({
  id,
  title,
  category,
  duration,
  participants,
  description,
  goal,
  steps,
  tips,
  pdfPages,
  imageUrl,
  contactPerson,
  examples,
  onClose,
}: MethodDetailProps) {
  const [newComment, setNewComment] = useState('');
  const { likes, liked, toggleLike } = useLikes(id);
  const { comments, addComment } = useComments(id);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950 p-6">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Zurück</span>
            </button>

            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {pdfPages && (
            <a
              href={`/innoprojektpp.pdf#page=${pdfPages.split('-')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-slate-950 transition-colors hover:bg-slate-200"
            >
              <FileText size={20} />
              <span>Methode in PDF öffnen</span>
            </a>
          )}
        </div>

        <div className="relative w-full bg-white py-8">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-auto max-h-96 w-full object-contain px-8"
          />
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>

            <span className={`rounded-full px-3 py-1 text-sm ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                liked
                  ? 'border-red-500/40 bg-red-500/20 text-red-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{likes}</span>
            </button>

            <div className="flex items-center gap-2 text-slate-400">
              <MessageCircle size={20} />
              <span>{comments.length} Kommentare</span>
            </div>
          </div>

          <div className="mb-6 flex gap-6 border-b border-slate-800 pb-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{participants}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-slate-300">{description}</p>
          </div>

          <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="flex items-start gap-2">
              <Target size={20} className="mt-0.5 flex-shrink-0 text-blue-300" />

              <div>
                <h3 className="mb-1 font-semibold text-blue-200">Ziel</h3>
                <p className="text-sm text-blue-100">{goal}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Vorgehensweise</h3>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-950">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="mb-1 font-medium text-white">{step.title}</h4>
                    <p className="text-sm text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tips.length > 0 && (
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <h3 className="mb-2 font-semibold text-yellow-200">Tipps</h3>

              <ul className="space-y-1 text-sm text-yellow-100">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {examples && examples.length > 0 && (
            <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
              <h3 className="mb-3 font-semibold text-blue-200">Beispiele</h3>

              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div key={index} className="rounded bg-slate-900 p-3 text-sm text-slate-200">
                    <p>{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
            <h3 className="mb-3 font-semibold text-white">Ansprechpartner</h3>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <User size={24} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-white">{contactPerson.name}</p>
                <p className="text-sm text-slate-400">{contactPerson.role}</p>
              </div>

              <a
                href={`mailto:${contactPerson.email}`}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
              >
                <Mail size={16} />
                <span>Kontakt</span>
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="mb-4 font-semibold text-white">Kommentare ({comments.length})</h3>

            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schreibe einen Kommentar..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                rows={3}
              />

              <button
                onClick={handleAddComment}
                className="mt-2 rounded-lg bg-white px-4 py-2 text-slate-950 transition-colors hover:bg-slate-200"
              >
                Kommentar hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg bg-slate-900 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                      <User size={16} />
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{comment.username}</p>

                        <p className="text-xs text-slate-500">
                          {new Date(comment.timestamp).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <p className="text-sm text-slate-300">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  Noch keine Kommentare vorhanden.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
