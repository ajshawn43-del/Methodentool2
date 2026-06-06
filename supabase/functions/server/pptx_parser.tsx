// PPTX Parser for extracting methods from PowerPoint presentations
import { unzip } from "https://deno.land/x/zip@v1.2.5/mod.ts";

export interface ExtractedMethod {
  title: string;
  category: string;
  description: string;
  goal?: string;
  steps?: Array<{ title: string; description: string }>;
  tips?: string[];
  keywords?: string[];
  duration?: string;
  participants?: string;
  imageData?: Uint8Array;
}

const CATEGORIES = [
  'Ideenfindung', 'Problemanalyse', 'Entscheidungsfindung', 'Teamarbeit',
  'Planung', 'Kommunikation', 'Selbstmanagement', 'Erwartungsmanagement',
  'Konfliktlösung', 'Stakeholder Management'
];

const STOPWORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem',
  'und', 'oder', 'aber', 'für', 'mit', 'von', 'zu', 'im', 'am', 'um', 'an', 'auf',
  'aus', 'bei', 'nach', 'über', 'unter', 'durch', 'bis', 'gegen', 'ohne', 'seit',
  'ist', 'sind', 'wird', 'werden', 'wurde', 'haben', 'hat', 'hatte', 'sein', 'war'
]);

// Extract text from XML slide
function extractTextFromXML(xmlContent: string): string[] {
  const texts: string[] = [];
  // Simple regex to extract text content from <a:t> tags
  const textMatches = xmlContent.matchAll(/<a:t[^>]*>([^<]+)<\/a:t>/g);
  for (const match of textMatches) {
    const text = match[1].trim();
    if (text && text.length > 2) {
      texts.push(text);
    }
  }
  return texts;
}

// Generate keywords from text
function generateKeywords(allText: string): string[] {
  const words = allText
    .toLowerCase()
    .replace(/[^\wäöüß\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOPWORDS.has(word));

  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

// Detect category from keywords
function detectCategory(text: string, keywords: string[]): string {
  const lowerText = text.toLowerCase();
  const allTerms = lowerText + ' ' + keywords.join(' ').toLowerCase();

  if (allTerms.includes('idee') || allTerms.includes('kreativ') || allTerms.includes('brainstorm')) {
    return 'Ideenfindung';
  }
  if (allTerms.includes('problem') || allTerms.includes('analyse') || allTerms.includes('ursache')) {
    return 'Problemanalyse';
  }
  if (allTerms.includes('entscheid') || allTerms.includes('wahl') || allTerms.includes('priorit')) {
    return 'Entscheidungsfindung';
  }
  if (allTerms.includes('team') || allTerms.includes('gruppe') || allTerms.includes('zusammen')) {
    return 'Teamarbeit';
  }
  if (allTerms.includes('plan') || allTerms.includes('zeit') || allTerms.includes('projekt')) {
    return 'Planung';
  }
  if (allTerms.includes('kommunikation') || allTerms.includes('gespräch') || allTerms.includes('dialog')) {
    return 'Kommunikation';
  }
  if (allTerms.includes('konflikt') || allTerms.includes('streit') || allTerms.includes('lösung')) {
    return 'Konfliktlösung';
  }
  if (allTerms.includes('stakeholder') || allTerms.includes('beteiligt') || allTerms.includes('akteur')) {
    return 'Stakeholder Management';
  }

  return 'Sonstiges';
}

// Extract steps from bullet points
function extractSteps(texts: string[]): Array<{ title: string; description: string }> {
  const steps: Array<{ title: string; description: string }> = [];

  texts.forEach((text, i) => {
    // Look for numbered steps or bullet points
    if (text.match(/^\d+\./) || text.match(/^[-•]/) || text.length > 20) {
      const cleanText = text.replace(/^(\d+\.|[-•])\s*/, '');
      if (cleanText.length > 5) {
        steps.push({
          title: `Schritt ${steps.length + 1}`,
          description: cleanText
        });
      }
    }
  });

  return steps.slice(0, 8); // Max 8 steps
}

export async function parsePPTX(fileBuffer: Uint8Array): Promise<ExtractedMethod[]> {
  try {
    console.log('📄 PPTX parsing started - file size:', fileBuffer.length);

    // Write to temp file for unzipping
    const tempFile = await Deno.makeTempFile({ suffix: '.pptx' });
    await Deno.writeFile(tempFile, fileBuffer);

    // Unzip PPTX
    const tempDir = await Deno.makeTempDir();
    await unzip(tempFile, tempDir);

    // Read slide files
    const slidesDir = `${tempDir}/ppt/slides`;
    const allTexts: string[] = [];
    let slideCount = 0;
    let firstSlideTitle = '';

    try {
      for await (const entry of Deno.readDir(slidesDir)) {
        if (entry.name.startsWith('slide') && entry.name.endsWith('.xml')) {
          slideCount++;
          const slideContent = await Deno.readTextFile(`${slidesDir}/${entry.name}`);
          const texts = extractTextFromXML(slideContent);

          if (slideCount === 1 && texts.length > 0) {
            firstSlideTitle = texts[0];
          }

          allTexts.push(...texts);
        }
      }
    } catch (e) {
      console.log('Error reading slides:', e);
    }

    console.log(`✅ Extracted ${allTexts.length} text elements from ${slideCount} slides`);

    // Clean up temp files
    await Deno.remove(tempFile);
    await Deno.remove(tempDir, { recursive: true });

    if (allTexts.length === 0) {
      throw new Error('Keine Textinhalte in der PowerPoint gefunden');
    }

    // Generate method data
    const allText = allTexts.join(' ');
    const keywords = generateKeywords(allText);
    const category = detectCategory(allText, keywords);
    const steps = extractSteps(allTexts);

    // Extract title (first slide or first long text)
    const title = firstSlideTitle || allTexts.find(t => t.length > 5 && t.length < 80) || 'Neue Methode';

    // Generate description (first paragraph or combine first texts)
    const description = allTexts
      .filter(t => t.length > 30)
      .slice(0, 2)
      .join(' ')
      .slice(0, 300) || allText.slice(0, 200);

    // Extract tips (short sentences)
    const tips = allTexts
      .filter(t => t.length > 15 && t.length < 100)
      .filter(t => !steps.some(s => s.description === t))
      .slice(0, 5);

    const method: ExtractedMethod = {
      title: title.slice(0, 100),
      category,
      description,
      goal: `Ziel: ${description.split('.')[0]}.`,
      steps,
      tips,
      keywords,
      duration: '30-60 Min',
      participants: '4-8 Personen'
    };

    console.log('✅ Method extracted:', method.title);
    return [method];

  } catch (error) {
    console.error('❌ Error parsing PPTX:', error);
    throw new Error(`PPTX-Analyse fehlgeschlagen: ${error.message}`);
  }
}

export function validateMethod(method: ExtractedMethod): boolean {
  return !!(method.title && method.description && method.category);
}
