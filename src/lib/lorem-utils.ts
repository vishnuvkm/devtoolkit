export type LoremUnit = "paragraphs" | "sentences" | "words";
export type LoremFormat = "plain" | "html" | "markdown";

export interface LoremOptions {
  unit: LoremUnit;
  count: number; // 1–20 for paragraphs/sentences, 1–500 for words
  format: LoremFormat;
  startWithLorem: boolean;
}

// Classic Lorem Ipsum word pool
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
  "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
  "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit",
  "anim", "id", "est", "laborum", "perspiciatis", "unde", "omnis",
  "iste", "natus", "error", "accusantium", "doloremque", "laudantium",
  "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae",
  "dicta", "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur",
  "odit", "fugit", "consequuntur", "magni", "dolores", "ratione",
  "sequi", "nesciunt", "neque", "porro", "quisquam", "quod", "numquam",
];

const CLASSIC_START =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** Seeded-enough random from a position (deterministic for consistent output) */
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
  return ((_seed >>> 0) / 0xffffffff);
}

function resetSeed() {
  _seed = 42;
}

function pickWord(): string {
  return LOREM_WORDS[Math.floor(seededRandom() * LOREM_WORDS.length)];
}

function generateSentence(wordCount: number = 0): string {
  const len = wordCount > 0 ? wordCount : 6 + Math.floor(seededRandom() * 12); // 6–17 words
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pickWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentenceCount: number = 0): string {
  const count = sentenceCount > 0 ? sentenceCount : 3 + Math.floor(seededRandom() * 5); // 3–7 sentences
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) sentences.push(generateSentence());
  return sentences.join(" ");
}

export function generateLorem(options: LoremOptions): string {
  resetSeed();
  const { unit, count, format, startWithLorem } = options;

  let paragraphs: string[] = [];

  if (unit === "words") {
    const words: string[] = [];
    for (let i = 0; i < count; i++) words.push(pickWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    const raw = words.join(" ") + ".";
    paragraphs = [startWithLorem ? CLASSIC_START + " " + raw : raw];
  } else if (unit === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) sentences.push(generateSentence());
    if (startWithLorem) sentences[0] = CLASSIC_START;
    paragraphs = [sentences.join(" ")];
  } else {
    // paragraphs
    for (let i = 0; i < count; i++) paragraphs.push(generateParagraph());
    if (startWithLorem && paragraphs.length > 0) {
      paragraphs[0] = CLASSIC_START + " " + paragraphs[0];
    }
  }

  switch (format) {
    case "html":
      return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
    case "markdown":
      return paragraphs.join("\n\n");
    default:
      return paragraphs.join("\n\n");
  }
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function charCount(text: string): number {
  return text.length;
}
