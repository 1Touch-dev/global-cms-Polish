const GT_URL = "https://translate.googleapis.com/translate_a/single";
const NATIVE = "pl";
const MAX_CHUNK_CHARS = 1500;
const CHUNK_CONCURRENCY = 2;
const BATCH_CONCURRENCY = 3;
const MAX_ATTEMPTS = 3;
const MAX_CACHE_ENTRIES = 800;

const successCache = new Map<string, string>();

function cacheKey(text: string, targetLang: string, sourceLang: string): string {
  return `${sourceLang}>${targetLang}:${text}`;
}

function cacheGet(key: string): string | undefined {
  return successCache.get(key);
}

function cacheSet(key: string, value: string) {
  if (successCache.size >= MAX_CACHE_ENTRIES) {
    const first = successCache.keys().next().value;
    if (first) successCache.delete(first);
  }
  successCache.set(key, value);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseGooglePayload(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return "";
  return (data[0] as [string, string][])
    .map(([chunk]) => chunk ?? "")
    .join("");
}

function protectMarkup(text: string): { text: string; restore: (t: string) => string } {
  if (!/https?:\/\/|!\[[^\]]*\]\(/.test(text)) {
    return { text, restore: (t) => t };
  }
  const tokens: string[] = [];
  const replaced = text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, (match) => {
      const idx = tokens.length;
      tokens.push(match);
      return `IMGPLACEHOLDER${idx}END`;
    })
    .replace(/https?:\/\/[^\s)"']+/g, (match) => {
      const idx = tokens.length;
      tokens.push(match);
      return `URLPLACEHOLDER${idx}END`;
    });
  return {
    text: replaced,
    restore: (translated: string) =>
      translated.replace(/(?:IMG|URL)PLACEHOLDER(\d+)END/g, (_, i) => tokens[Number(i)] ?? ""),
  };
}

function splitIntoChunks(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";
  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length <= maxLen) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (para.length <= maxLen) {
      current = para;
    } else {
      for (let i = 0; i < para.length; i += maxLen) chunks.push(para.slice(i, i + maxLen));
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateViaMyMemory(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string | null> {
  if (text.length > 400) return null;
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `${sourceLang === "auto" ? NATIVE : sourceLang}|${targetLang}`);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { responseData?: { translatedText?: string } };
    return json.responseData?.translatedText?.trim() || null;
  } catch {
    return null;
  }
}

async function translateChunk(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  if (!text?.trim()) return text;
  const key = cacheKey(text, targetLang, sourceLang);
  const cached = cacheGet(key);
  if (cached) return cached;

  const body = new URLSearchParams({ client: "gtx", sl: sourceLang, tl: targetLang, dt: "t", q: text });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(GT_URL, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "Mozilla/5.0",
        },
        body: body.toString(),
      });
      if (res.status === 429 || res.status === 503) {
        await sleep(500 * attempt * attempt);
        continue;
      }
      if (!res.ok) break;
      const translated = parseGooglePayload(await res.json());
      if (!translated) break;
      cacheSet(key, translated);
      return translated;
    } catch {
      if (attempt === MAX_ATTEMPTS) break;
      await sleep(400 * attempt);
    }
  }

  const fallback = await translateViaMyMemory(text, targetLang, sourceLang);
  if (fallback) {
    cacheSet(key, fallback);
    return fallback;
  }
  return text;
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = NATIVE
): Promise<string> {
  if (!text?.trim()) return text;
  if (targetLang === sourceLang || targetLang === NATIVE) return text;

  const { text: protectedText, restore } = protectMarkup(text);
  if (protectedText.length <= MAX_CHUNK_CHARS) {
    return restore(await translateChunk(protectedText, targetLang, sourceLang));
  }

  const chunks = splitIntoChunks(protectedText, MAX_CHUNK_CHARS);
  const translated: string[] = [];
  for (let i = 0; i < chunks.length; i += CHUNK_CONCURRENCY) {
    const batch = chunks.slice(i, i + CHUNK_CONCURRENCY);
    translated.push(
      ...(await Promise.all(batch.map((c) => translateChunk(c, targetLang, sourceLang))))
    );
  }
  return restore(translated.join("\n\n"));
}

export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang = NATIVE
): Promise<string[]> {
  if (targetLang === sourceLang || targetLang === NATIVE) return texts;
  const results: string[] = [];
  for (let i = 0; i < texts.length; i += BATCH_CONCURRENCY) {
    const chunk = texts.slice(i, i + BATCH_CONCURRENCY);
    results.push(
      ...(await Promise.all(chunk.map((t) => translateText(t, targetLang, sourceLang))))
    );
  }
  return results;
}

export async function translateBannerHtml(
  html: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  if (!html?.trim() || fromLang === toLang || toLang === NATIVE) return html;
  const textNodes: string[] = [];
  const template = html.replace(/>([^<]+)</g, (match, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || /^[\d\s.,!?:;/%\\-–—()[\]"']+$/.test(trimmed)) return match;
    const idx = textNodes.length;
    textNodes.push(trimmed);
    return `>__T${idx}__<`;
  });
  if (textNodes.length === 0) return html;
  const translated = await translateBatch(textNodes, toLang, fromLang);
  return template.replace(/__T(\d+)__/g, (_, i) => translated[Number(i)]?.trim() || textNodes[Number(i)]);
}
