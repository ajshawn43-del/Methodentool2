// Kostenloser automatischer Keyword-Generator für Methoden
// Extrahiert wichtige Begriffe aus Titel, Beschreibung, Ziel und Schritten

const GERMAN_STOPWORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem',
  'und', 'oder', 'aber', 'für', 'mit', 'von', 'zu', 'im', 'am', 'um', 'an', 'auf',
  'aus', 'bei', 'nach', 'über', 'unter', 'durch', 'bis', 'gegen', 'ohne', 'seit',
  'ist', 'sind', 'wird', 'werden', 'wurde', 'haben', 'hat', 'hatte', 'sein', 'war',
  'können', 'kann', 'soll', 'sollte', 'muss', 'darf', 'als', 'wie', 'wenn', 'dass',
  'dies', 'diese', 'dieser', 'dieses', 'jede', 'jeder', 'alle', 'sich', 'dabei',
  'hier', 'dort', 'auch', 'noch', 'schon', 'sehr', 'mehr', 'alle', 'viele',
  'hilft', 'dabei', 'unterstützt', 'ermöglicht', 'macht', 'zeigt', 'bietet'
]);

interface MethodData {
  title: string;
  description: string;
  goal?: string;
  steps?: string;
  category: string;
}

/**
 * Generiert automatisch Keywords aus den Methodendaten
 * @param methodData - Die Methodendaten (Titel, Beschreibung, etc.)
 * @returns Array von generierten Keywords (8-15 Begriffe)
 */
export function generateKeywords(methodData: MethodData): string[] {
  const allText = [
    methodData.title,
    methodData.description,
    methodData.goal || '',
    methodData.steps || '',
    methodData.category
  ].join(' ');

  // Text in Wörter aufteilen und bereinigen
  const words = allText
    .toLowerCase()
    .replace(/[^\wäöüß\s-]/g, ' ') // Sonderzeichen entfernen
    .split(/\s+/)
    .filter(word =>
      word.length > 3 && // Mindestens 4 Buchstaben
      !GERMAN_STOPWORDS.has(word) && // Keine Stopwörter
      !/^\d+$/.test(word) // Keine reinen Zahlen
    );

  // Wörter zählen (Häufigkeit)
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Nach Häufigkeit sortieren und Top-Keywords auswählen
  const sortedWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1]) // Nach Häufigkeit sortieren
    .map(([word]) => word);

  // Kategorie immer als erstes Keyword
  const keywords = [methodData.category];

  // Top-Wörter hinzufügen (vermeidet Duplikate)
  sortedWords.forEach(word => {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    if (!keywords.includes(capitalizedWord) && keywords.length < 12) {
      keywords.push(capitalizedWord);
    }
  });

  // Spezielle Begriffe aus Titel mit höherer Priorität
  const titleWords = methodData.title
    .split(/\s+/)
    .filter(word => word.length > 3 && !GERMAN_STOPWORDS.has(word.toLowerCase()));

  titleWords.forEach(word => {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    if (!keywords.includes(capitalizedWord) && keywords.length < 15) {
      keywords.splice(1, 0, capitalizedWord); // An zweiter Position einfügen
    }
  });

  // Mindestens 5 Keywords sicherstellen
  if (keywords.length < 5) {
    const fallbackKeywords = ['Methode', 'Team', 'Zusammenarbeit', 'Prozess'];
    fallbackKeywords.forEach(word => {
      if (!keywords.includes(word) && keywords.length < 5) {
        keywords.push(word);
      }
    });
  }

  return keywords.slice(0, 15); // Maximal 15 Keywords
}

/**
 * Generiert Keywords als kommagetrennte String (für Input-Feld)
 */
export function generateKeywordsString(methodData: MethodData): string {
  return generateKeywords(methodData).join(', ');
}
