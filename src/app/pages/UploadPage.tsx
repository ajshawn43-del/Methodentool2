import { useState } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Plus,
  Sparkles,
} from 'lucide-react';
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
    examples: '',
  });

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white';

  const labelClass = 'mb-1 block text-sm font-medium text-slate-300';

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
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error(
          'Backend nicht verfügbar. Bitte deployen Sie zuerst die Supabase Edge Function.'
        );
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
      category: methodData.category,
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
      keywords: methodData.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      steps: methodData.steps
        .split('\n')
        .filter(Boolean)
        .map((step, i) => ({
          title: `Schritt ${i + 1}`,
          description: step.trim(),
        })),
      tips: methodData.tips
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      examples: methodData.examples
        .split('\n')
        .map((e) => e.trim())
        .filter(Boolean),
      imageUrl: '/grafik-1.png',
      pdfUrl: uploadedPdfUrl,
      contactPerson: {
        name: 'Ansprechpartner',
        role: 'Methodenexperte',
        email: 'kontakt@beispiel.de',
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE}/methods`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMethod),
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        const localMethods = JSON.parse(localStorage.getItem('customMethods') || '[]');
        localMethods.push(newMethod);
        localStorage.setItem('customMethods', JSON.stringify(localMethods));

        alert(
          '✅ Methode lokal gespeichert!\n\n⚠️ Backend nicht verfügbar - die Methode wurde nur lokal gespeichert.'
        );
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

      alert(
        '✅ Methode lokal gespeichert!\n\n⚠️ Fehler beim Backend-Upload - die Methode wurde nur lokal gespeichert.'
      );
      navigate('/');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Zurück zum Werkzeugkasten</span>
          </Link>

          <h1 className="text-2xl font-bold text-white">Neue Methode hinzufügen</h1>

          <p className="mt-2 text-slate-400">
            Erstellen Sie eine neue Methode für Ihren Werkzeugkasten.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-sm">
          <div className="rounded-lg border-2 border-dashed border-slate-700 p-12 text-center">
            <Upload className="mx-auto mb-4 text-slate-400" size={48} />

            <h3 className="mb-2 text-lg font-semibold text-white">PDF hochladen</h3>

            <p className="mb-6 text-slate-400">
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-6 py-3 text-slate-950 transition-colors hover:bg-slate-200"
            >
              <FileText size={20} />
              <span>PDF auswählen</span>
            </label>

            {file && (
              <div className="mt-4 text-sm text-slate-400">
                Ausgewählt: <span className="font-medium text-white">{file.name}</span>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-green-700 bg-green-950 p-4">
              <CheckCircle className="flex-shrink-0 text-green-400" size={20} />

              <div className="text-sm text-green-200">
                <p className="font-medium">PDF erfolgreich hochgeladen.</p>
                <p>Sie können jetzt unten die Methodendetails manuell eintragen.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-700 bg-red-950 p-4">
              <AlertCircle className="flex-shrink-0 text-red-400" size={20} />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="text-sm text-slate-400 underline hover:text-white"
            >
              {showManualForm ? 'Manuelle Eingabe ausblenden' : 'Methodendetails manuell eingeben'}
            </button>
          </div>

          {showManualForm && (
            <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Methodendetails eingeben</h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Titel *</label>
                  <input
                    type="text"
                    value={methodData.title}
                    onChange={(e) => setMethodData({ ...methodData, title: e.target.value })}
                    className={inputClass}
                    placeholder="z.B. SCAMPER-Methode"
                  />
                </div>

                <div>
                  <label className={labelClass}>Kategorie *</label>
                  <select
                    value={methodData.category}
                    onChange={(e) => setMethodData({ ...methodData, category: e.target.value })}
                    className={inputClass}
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
                  <label className={labelClass}>Beschreibung *</label>
                  <textarea
                    value={methodData.description}
                    onChange={(e) => setMethodData({ ...methodData, description: e.target.value })}
                    className={inputClass}
                    rows={3}
                    placeholder="Kurze Beschreibung der Methode..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Ziel</label>
                  <textarea
                    value={methodData.goal}
                    onChange={(e) => setMethodData({ ...methodData, goal: e.target.value })}
                    className={inputClass}
                    rows={2}
                    placeholder="Was soll mit dieser Methode erreicht werden?"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Dauer</label>
                    <input
                      type="text"
                      value={methodData.duration}
                      onChange={(e) => setMethodData({ ...methodData, duration: e.target.value })}
                      className={inputClass}
                      placeholder="z.B. 30-60 Min"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Teilnehmer</label>
                    <input
                      type="text"
                      value={methodData.participants}
                      onChange={(e) =>
                        setMethodData({ ...methodData, participants: e.target.value })
                      }
                      className={inputClass}
                      placeholder="z.B. 4-8 Personen"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Schritte, ein Schritt pro Zeile</label>
                  <textarea
                    value={methodData.steps}
                    onChange={(e) => setMethodData({ ...methodData, steps: e.target.value })}
                    className={`${inputClass} font-mono text-sm`}
                    rows={5}
                    placeholder={'Problem definieren\nUrsachen sammeln\nLösungen entwickeln'}
                  />
                </div>

                <div>
                  <label className={labelClass}>Tipps, ein Tipp pro Zeile</label>
                  <textarea
                    value={methodData.tips}
                    onChange={(e) => setMethodData({ ...methodData, tips: e.target.value })}
                    className={`${inputClass} font-mono text-sm`}
                    rows={3}
                    placeholder={'Tipp 1\nTipp 2'}
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      Keywords, kommagetrennt
                    </label>

                    <button
                      type="button"
                      onClick={handleGenerateKeywords}
                      disabled={!methodData.title || !methodData.description}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 px-3 py-1 text-xs text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className={inputClass}
                    placeholder="Kreativität, Innovation, Brainstorming"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    💡 Tipp: Klicken Sie auf "Automatisch generieren" oder geben Sie eigene Keywords ein.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Beispiele, ein Beispiel pro Zeile</label>
                  <textarea
                    value={methodData.examples}
                    onChange={(e) => setMethodData({ ...methodData, examples: e.target.value })}
                    className={`${inputClass} font-mono text-sm`}
                    rows={3}
                    placeholder={'Beispiel 1\nBeispiel 2'}
                  />
                </div>

                <button
                  onClick={handleCreateMethod}
                  disabled={uploading || !methodData.title || !methodData.description}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
