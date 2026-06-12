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

  // Load custom methods from backend
  useEffect(() => {
    loadCustomMethods();
  }, []);

  const loadCustomMethods = async () => {
    try {
      const response = await fetch(`${API_BASE}/methods`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();

      // Lade auch lokale Methoden
      const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');

      // Kombiniere Backend- und lokale Methoden (ohne Duplikate)
      const backendMethods = data.methods || [];
      const allCustomMethods = [...backendMethods, ...localMethods];

      setCustomMethods(allCustomMethods);
    } catch (error) {
      // Backend nicht verfügbar - lade nur lokale Methoden
      const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
      setCustomMethods(localMethods);
    }
  };

  // Combine static and custom methods
  const allMethods = [...staticMethods, ...customMethods];

  const categories = ['Alle', ...Array.from(new Set(allMethods.map(m => m.category)))];

  const filteredMethods = useMemo(() => {
    const filtered = allMethods.filter(method => {
      const searchLower = searchTerm.toLowerCase();
      // SUCHFUNKTION: Sucht in Titel, Beschreibung, Kategorie UND Keywords
      // Um Methoden besser auffindbar zu machen, Keywords in src/app/data/methods.ts erweitern
      const matchesSearch = method.title.toLowerCase().includes(searchLower) ||
                           method.description.toLowerCase().includes(searchLower) ||
                           method.category.toLowerCase().includes(searchLower) ||
                           method.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
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

  const selectedMethodData = allMethods.find(m => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-gray-900" />
              <h1 className="text-2xl font-bold">Methoden-Werkzeugkasten</h1>
            </div>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Upload size={20} />
              <span>Methode hochladen</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Methode suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showPinnedOnly
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pin size={20} fill={showPinnedOnly ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Gepinnt ({pinnedMethods.length})</span>
              <span className="sm:hidden">{pinnedMethods.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredMethods.length} {filteredMethods.length === 1 ? 'Methode' : 'Methoden'} gefunden
          </p>
          {pinnedMethods.length > 0 && !showPinnedOnly && (
            <p className="text-sm text-gray-500">
              {pinnedMethods.length} davon angepinnt
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMethods.map(method => (
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Keine Methoden gefunden.</p>
            <p className="text-gray-400 text-sm mt-2">Versuchen Sie einen anderen Suchbegriff oder Filter.</p>
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
