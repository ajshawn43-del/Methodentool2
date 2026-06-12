import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Filter, Pin, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MethodCard } from '../components/MethodCard';
import { MethodDetail } from '../components/MethodDetail';
import { methods as staticMethods } from '../data/methods';
import { usePins } from '../hooks/useSupabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-aac39e77`;

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [customMethods, setCustomMethods] = useState<any[]>([]);

  const { pinnedMethods, togglePin } = usePins();

  useEffect(() => {
    loadCustomMethods();
  }, []);

  const loadCustomMethods = async () => {
    try {
      const response = await fetch(`${API_BASE}/methods`, {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
      const backendMethods = data.methods || [];

      setCustomMethods([...backendMethods, ...localMethods]);
    } catch (error) {
      const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
      setCustomMethods(localMethods);
    }
  };

  const allMethods = [...staticMethods, ...customMethods];
  const categories = ['Alle', ...Array.from(new Set(allMethods.map((m) => m.category)))];

  const filteredMethods = useMemo(() => {
    const filtered = allMethods.filter((method) => {
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        method.title.toLowerCase().includes(searchLower) ||
        method.description.toLowerCase().includes(searchLower) ||
        method.category.toLowerCase().includes(searchLower) ||
        method.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchLower));

      const matchesCategory = selectedCategory === 'Alle' || method.category === selectedCategory;
      const matchesPinned = !showPinnedOnly || pinnedMethods.includes(method.id);

      return matchesSearch && matchesCategory && matchesPinned;
    });

    return filtered.sort((a, b) => {
      const aIsPinned = pinnedMethods.includes(a.id);
      const bIsPinned = pinnedMethods.includes(b.id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      return a.title.localeCompare(b.title);
    });
  }, [searchTerm, selectedCategory, showPinnedOnly, pinnedMethods, allMethods]);

  const selectedMethodData = allMethods.find((m) => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-gray-900 dark:text-white" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Methoden-Werkzeugkasten
              </h1>
            </div>

            <Link
              to="/upload"
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Upload size={20} />
              <span>Methode hochladen</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Methode suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400 dark:focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600 dark:text-slate-300" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                showPinnedOnly
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Pin size={20} fill={showPinnedOnly ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Gepinnt ({pinnedMethods.length})</span>
              <span className="sm:hidden">{pinnedMethods.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-slate-400">
            {filteredMethods.length} {filteredMethods.length === 1 ? 'Methode' : 'Methoden'} gefunden
          </p>

          {pinnedMethods.length > 0 && !showPinnedOnly && (
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {pinnedMethods.length} davon angepinnt
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMethods.map((method) => (
            <MethodCard
              key={method.id}
              id={method.id}
              title={method.title}
              category={method.category}
              duration={method.duration}
              participants={method.participants}
              description={method.description}
              imageUrl={method.imageUrl}
              isPinned={pinnedMethods.includes(method.id)}
              onTogglePin={() => togglePin(method.id)}
              onClick={() => setSelectedMethod(method.id)}
            />
          ))}
        </div>

        {filteredMethods.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500 dark:text-slate-400">Keine Methoden gefunden.</p>
            <p className="mt-2 text-sm text-gray-400 dark:text-slate-500">
              Versuchen Sie einen anderen Suchbegriff oder Filter.
            </p>
          </div>
        )}
      </main>

      {selectedMethodData && (
        <MethodDetail
          {...selectedMethodData}
          onClose={() => setSelectedMethod(null)}
        />
      )}
    </div>
  );
}
