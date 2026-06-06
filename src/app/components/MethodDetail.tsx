import { X, Clock, Users, Target, ArrowLeft, FileText, Heart, MessageCircle, Mail, User } from 'lucide-react';
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
  onClose
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Zurück</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {pdfPages && (
            <a
              href={`/innoprojektpp.pdf#page=${pdfPages.split('-')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FileText size={20} />
              <span>Methode in PDF öffnen</span>
            </a>
          )}
        </div>

        <div className="relative w-full bg-gray-50 py-8">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-96 object-contain px-8"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <span className={`text-sm px-3 py-1 rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                liked
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={20} />
              <span>{comments.length} Kommentare</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
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
            <p className="text-gray-700">{description}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <Target size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Ziel</h3>
                <p className="text-blue-800 text-sm">{goal}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4">Vorgehensweise</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tips.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Tipps</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Beispiele</h3>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div key={index} className="bg-white rounded p-3 text-sm text-blue-900">
                    <p>{example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Ansprechpartner</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                <User size={24} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{contactPerson.name}</p>
                <p className="text-sm text-gray-600">{contactPerson.role}</p>
              </div>
              <a
                href={`mailto:${contactPerson.email}`}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Mail size={16} />
                <span>Kontakt</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold mb-4">Kommentare ({comments.length})</h3>

            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schreibe einen Kommentar..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Kommentar hinzufügen
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{comment.username}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Noch keine Kommentare vorhanden.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
