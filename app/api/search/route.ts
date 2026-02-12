import { NextRequest, NextResponse } from "next/server";
import { getAllCategories } from "@/lib/database";

export type SearchResultItem = {
  href: string;
  title: string;
  sectionTitle: string;
  snippet: string | null;
};

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function extractSnippet(
  text: string | null | undefined,
  words: string[],
  maxLength: number = 120
): string | null {
  if (!text || text.length === 0) return null;
  const lower = text.toLowerCase();
  let bestStart = 0;
  let bestScore = 0;
  const chunkSize = maxLength;
  for (let i = 0; i <= Math.max(0, lower.length - chunkSize); i += 20) {
    const chunk = lower.slice(i, i + chunkSize);
    const score = words.filter((w) => chunk.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestStart = i;
    }
  }
  const raw = text.slice(bestStart, bestStart + chunkSize).trim();
  if (raw.length === 0) return null;
  const start = raw.match(/\s/) ? raw.indexOf(" ") + 1 : 0;
  let snippet = (start > 0 ? "…" : "") + raw.slice(start);
  if (bestStart + chunkSize < text.length) snippet += "…";
  return snippet.trim() || null;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length === 0) {
    return NextResponse.json([]);
  }

  const categories = await getAllCategories();
  const words = q
    .split(/\s+/)
    .map((s) => s.toLowerCase())
    .filter((s) => s.length > 0);
  if (words.length === 0) {
    return NextResponse.json([]);
  }

  type Flat = {
    href: string;
    title: string;
    sectionTitle: string;
    titleLower: string;
    descriptionLower: string;
    contentLower: string;
    description: string | null;
    content: string;
  };

  const flat: Flat[] = [];
  for (const category of categories) {
    for (const sec of category.sections || []) {
      for (const article of sec.articles || []) {
        flat.push({
          href: `/${category.section}/${sec.id}/${article.slug}`,
          title: article.title,
          sectionTitle: sec.title,
          titleLower: normalize(article.title),
          descriptionLower: normalize(article.description ?? ""),
          contentLower: normalize(article.content ?? ""),
          description: article.description ?? null,
          content: article.content ?? "",
        });
      }
    }
  }

  const scored = flat
    .map((item) => {
      const inTitle = words.filter((w) => item.titleLower.includes(w)).length;
      const inDesc = words.filter((w) => item.descriptionLower.includes(w)).length;
      const inContent = words.filter((w) => item.contentLower.includes(w)).length;
      const wordsMatched = [...new Set(words.filter((w) =>
        item.titleLower.includes(w) ||
        item.descriptionLower.includes(w) ||
        item.contentLower.includes(w)
      ))].length;
      const totalWords = words.length;
      const allWordsMatch = wordsMatched === totalWords;
      const matchCount = wordsMatched;
      const fieldOrder =
        (inTitle > 0 ? 3 : 0) + (inDesc > 0 ? 2 : 0) + (inContent > 0 ? 1 : 0);
      return {
        item,
        wordsMatched: matchCount,
        allWordsMatch,
        fieldOrder,
        inTitle,
        inDesc,
        inContent,
      };
    })
    .filter((s) => s.wordsMatched > 0);

  scored.sort((a, b) => {
    if (a.allWordsMatch !== b.allWordsMatch) return a.allWordsMatch ? -1 : 1;
    if (a.wordsMatched !== b.wordsMatched) return b.wordsMatched - a.wordsMatched;
    return b.fieldOrder - a.fieldOrder;
  });

  const results: SearchResultItem[] = scored.slice(0, 15).map(({ item }) => ({
    href: item.href,
    title: item.title,
    sectionTitle: item.sectionTitle,
    snippet:
      extractSnippet(item.description, words) ??
      extractSnippet(item.content, words),
  }));

  return NextResponse.json(results);
}
