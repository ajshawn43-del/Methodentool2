import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { generateKeywordsString } from '../utils/keywordGenerator';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-aac39e77`;

export function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Manual method input form
  const [showManualForm, setShowManualForm] = useState(false);
  const [methodData, setMethodData] = useState({
    title: '',
    category: 'Problemanalyse',
    description: '',
    goal: '',
    duration: '30-60 Min',
    participants: '4-8 Personen',
    keywords: '',
    steps: '',
    tips: '',
    examples: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setFile(null);
        setError('Bitte wählen Sie nur eine PDF-Datei aus.');
        setUploadSuccess(false);
        setUploadedPdfUrl(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setUploadSuccess(false);
      setUploadedPdfUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Bitte wählen Sie eine PDF-Datei aus.');
      return;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('Bitte wählen Sie nur eine PDF-Datei aus.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: formData
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend nicht verfügbar. Bitte deployen Sie zuerst die Supabase Edge Function.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'PDF-Upload fehlgeschlagen');
      }

      setUploadSuccess(true);
      setUploadedPdfUrl(data.fileUrl || null);

      alert(`✅ PDF erfolgreich hochgeladen!\n\n📄 Datei: ${data.fileName}\n\nDie PDF wurde gespeichert.`);

    } catch (err: any) {
      setError(err.message || 'Fehler beim Hochladen der PDF-Datei.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateKeywords = () => {
    const generatedKeywords = generateKeywordsString({
      title: methodData.title,
      description: methodData.description,
      goal: methodData.goal,
      steps: methodData.steps,
      category: methodData.category
    });

    setMethodData({ ...methodData, keywords: generatedKeywords });
  };

  const handleCreateMethod = async () => {
    if (!methodData.title || !methodData.description) {
      setError('Titel und Beschreibung sind erforderlich.');
      return;
    }

    setUploading(true);
    setError(null);

    const newMethod = {
      id: `method-${Date.now()}`,
      title: methodData.title,
      category: methodData.category,
      description: methodData.description,
      goal: methodData.goal,
      duration: methodData.duration,
      participants: methodData.participants,
      keywords: methodData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      steps: methodData.steps.split('\n').filter(Boolean).map((step, i) => ({
        title: `Schritt ${i + 1}`,
        description: step.trim()
      })),
      tips: methodData.tips.split('\n').map(t => t.trim()).filter(Boolean),
      examples: methodData.examples.split('\n').map(e => e.trim()).filter(Boolean),
      imageUrl: '/grafik-1.png',
      pdfUrl: uploadedPdfUrl,
      contactPerson: {
        name: 'Ansprechpartner',
        role: 'Methodenexperte',
        email: 'kontakt@beispiel.de'
      },
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMethod)
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
        localMethods.push(newMethod);
        localStorage.setItem('customMethods', JSON.stringify(localMethods));

        alert('✅ Methode lokal gespeichert!\n\n⚠️ Backend nicht verfügbar - die Methode wurde nur lokal gespeichert.');
        navigate('/');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Methode konnte nicht erstellt werden');
      }

      alert('✅ Methode erfolgreich hinzugefügt!');
      navigate('/');

    } catch (err: any) {
      const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
      localMethods.push(newMethod);
      localStorage.setItem('customMethods', JSON.stringify(localMethods));

      alert('✅ Methode lokal gespeichert!\n\n⚠️ Fehler beim Backend-Upload - die Methode wurde nur lokal gespeichert.');
      navigate('/');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Zurück zum Werkzeugkasten</span>
          </Link>
          <h1 className="text-2xl font-bold">Neue Methode hinzufügen</h1>
          <p className="text-gray-600 mt-2">
            Erstellen Sie eine neue Methode für Ihren Werkzeugkasten.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">PDF hochladen</h3>
            <p className="text-gray-600 mb-6">
              Laden Sie eine PDF-Datei hoch. Danach können Sie die Methode manuell ergänzen.
            </p>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <FileText size={20} />
              <span>PDF auswählen</span>
            </label>

            {file && (
              <div className="mt-4 text-sm text-gray-600">
                Ausgewählt: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>PDF wird hochgeladen...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>PDF hochladen</span>
                </>
              )}
            </button>
          )}

          {uploadSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <div className="text-green-800 text-sm">
                <p className="font-medium">PDF erfolgreich hochgeladen.</p>
                <p>Sie können jetzt unten die Methodendetails manuell eintragen.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="text-gray-600 hover:text-gray-900 underline text-sm"
            >
              {showManualForm ? 'Manuelle Eingabe ausblenden' : 'Methodendetails manuell eingeben'}
            </button>
          </div>

          {showManualForm && (
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Methodendetails eingeben</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={methodData.title}
                    onChange={(e) => setMethodData({ ...methodData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="z.B. SCAMPER-Methode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorie *
                  </label>
                  <select
                    value={methodData.category}
                    onChange={(e) => setMethodData({ ...methodData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option>Ideenfindung</option>
                    <option>Problemanalyse</option>
                    <option>Entscheidungsfindung</option>
                    <option>Teamarbeit</option>
                    <option>Planung</option>
                    <option>Kommunikation</option>
                    <option>Selbstmanagement</option>
                    <option>Erwartungsmanagement</option>
                    <option>Konfliktlösung</option>
                    <option>Stakeholder Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung *
                  </label>
                  <textarea
                    value={methodData.description}
                    onChange={(e) => setMethodData({ ...methodData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    rows={3}
                    placeholder="Kurze Beschreibung der Methode..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ziel
                  </label>
                  <textarea
                    value={methodData.goal}
                    onChange={(e) => setMethodData({ ...methodData, goal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    rows={2}
                    placeholder="Was soll mit dieser Methode erreicht werden?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dauer
                    </label>
                    <input
                      type="text"
                      value={methodData.duration}
                      onChange={(e) => setMethodData({ ...methodData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="z.B. 30-60 Min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teilnehmer
                    </label>
                    <input
                      type="text"
                      value={methodData.participants}
                      onChange={(e) => setMethodData({ ...methodData, participants: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="z.B. 4-8 Personen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schritte (ein Schritt pro Zeile)
                  </label>
                  <textarea
                    value={methodData.steps}
                    onChange={(e) => setMethodData({ ...methodData, steps: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
                    rows={5}
                    placeholder="Problem definieren&#10;Ursachen sammeln&#10;Lösungen entwickeln"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipps (ein Tipp pro Zeile)
                  </label>
                  <textarea
                    value={methodData.tips}
                    onChange={(e) => setMethodData({ ...methodData, tips: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
                    rows={3}
                    placeholder="Tipp 1&#10;Tipp 2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Keywords (kommagetrennt)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateKeywords}
                      disabled={!methodData.title || !methodData.description}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Keywords automatisch generieren"
                    >
                      <Sparkles size={14} />
                      <span>Automatisch generieren</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={methodData.keywords}
                    onChange={(e) => setMethodData({ ...methodData, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Kreativität, Innovation, Brainstorming"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tipp: Klicken Sie auf "Automatisch generieren" oder geben Sie eigene Keywords ein
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beispiele (ein Beispiel pro Zeile)
                  </label>
                  <textarea
                    value={methodData.examples}
                    onChange={(e) => setMethodData({ ...methodData, examples: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
                    rows={3}
                    placeholder="Beispiel 1&#10;Beispiel 2"
                  />
                </div>

                <button
                  onClick={handleCreateMethod}
                  disabled={uploading || !methodData.title || !methodData.description}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                  <span>{uploading ? 'Wird hinzugefügt...' : 'Methode zum Werkzeugkasten hinzufügen'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
