export interface TextAnalysis {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  uniqueWords: number;
  topWords: Array<{ word: string; count: number }>;
}

const EMPTY_ANALYSIS: TextAnalysis = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTimeMinutes: 0,
  uniqueWords: 0,
  topWords: [],
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "it", "its",
  "this", "that", "these", "those", "he", "she", "they", "we", "you",
  "i", "me", "him", "her", "us", "them", "my", "your", "his",
  "our", "their", "what", "which", "who", "whom", "how", "when",
  "where", "why", "all", "any", "both", "each", "few", "more",
  "most", "other", "some", "such", "no", "nor", "not", "so", "yet",
  "as", "if", "up", "out", "about", "into", "through", "during",
  "before", "after", "above", "below", "between", "than", "then",
  "there", "here", "just", "also", "now",
]);

export function analyzeText(text: string): TextAnalysis {
  if (!text || text.trim().length === 0) {
    return { ...EMPTY_ANALYSIS, characters: text.length };
  }

  const trimmed = text.trim();

  // Words
  const wordTokens = trimmed.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = wordTokens.length;

  // Characters
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Sentences: compatible version using match
  const sentenceCount = (trimmed.match(/[^.!?]*[.!?]+/g) || [trimmed]).filter(
    (s) => s.trim().length > 0
  ).length;

  // Paragraphs: split on blank lines
  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphCount = Math.max(paragraphs.length, wordCount > 0 ? 1 : 0);

  // Reading time at 200 wpm
  const readingTimeMinutes =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  // Word frequency map (normalised, punctuation stripped)
  const wordFreq = new Map<string, number>();
  for (const token of wordTokens) {
    const clean = token
      .toLowerCase()
      .replace(/[^a-z0-9'-]/g, "")
      .replace(/^['-]+|['-]+$/g, "");
    if (clean.length >= 2) {
      wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
    }
  }

  const uniqueWords = wordFreq.size;

  // Top 5 non-stop-words by frequency
  const topWords = [...wordFreq.entries()]
    .filter(([word]) => !STOP_WORDS.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    words: wordCount,
    characters,
    charactersNoSpaces,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    readingTimeMinutes,
    uniqueWords,
    topWords,
  };
}
