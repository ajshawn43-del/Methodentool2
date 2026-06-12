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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Zurück</span>
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {pdfPages && (
            <a
              href={`/innoprojektpp.pdf#page=${pdfPages.split('-')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>

            <span className={`rounded-full px-3 py-1 text-sm ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                liked
                  ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{likes}</span>
            </button>

            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <MessageCircle size={20} />
              <span>{comments.length} Kommentare</span>
            </div>
          </div>

          <div className="mb-6 flex gap-6 border-b border-gray-200 pb-6 text-sm text-gray-600 dark:border-slate-800 dark:text-slate-400">
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
            <p className="text-gray-700 dark:text-slate-300">{description}</p>
          </div>

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <div className="flex items-start gap-2">
              <Target
                size={20}
                className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-300"
              />

              <div>
                <h3 className="mb-1 font-semibold text-blue-900 dark:text-blue-200">Ziel</h3>
                <p className="text-sm text-blue-800 dark:text-blue-100">{goal}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Vorgehensweise
            </h3>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tips.length > 0 && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-500/30 dark:bg-yellow-500/10">
              <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-200">Tipps</h3>

              <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-100">
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
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
              <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-200">Beispiele</h3>

              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded bg-white p-3 text-sm text-blue-900 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <p>{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Ansprechpartner</h3>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                <User size={24} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{contactPerson.name}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">{contactPerson.role}</p>
              </div>

              <a
                href={`mailto:${contactPerson.email}`}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Mail size={16} />
                <span>Kontakt</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-slate-800">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Kommentare ({comments.length})
            </h3>

            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schreibe einen Kommentar..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:ring-white"
                rows={3}
              />

              <button
                onClick={handleAddComment}
                className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Kommentar hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                      <User size={16} />
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.username}
                        </p>

                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          {new Date(comment.timestamp).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-slate-300">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-slate-500">
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
