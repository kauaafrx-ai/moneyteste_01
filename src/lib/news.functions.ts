import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const SearchInput = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(20).default(10),
  tbs: z.enum(["qdr:h", "qdr:d", "qdr:w", "qdr:m", "qdr:y"]).optional(),
});

export type NewsItem = {
  url: string;
  title: string;
  description?: string;
  source?: string;
  publishedAt?: string;
  imageUrl?: string;
};

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export const searchNews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }): Promise<{ items: NewsItem[] }> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    if (!lovableKey || !firecrawlKey) {
      throw new Error("Chaves de API ausentes (LOVABLE_API_KEY / FIRECRAWL_API_KEY).");
    }
    const response = await fetch(`${GATEWAY}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": firecrawlKey,
      },
      body: JSON.stringify({
        query: data.query,
        limit: data.limit,
        lang: "pt",
        country: "br",
        sources: ["news", "web"],
        ...(data.tbs ? { tbs: data.tbs } : {}),
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Firecrawl search failed [${response.status}]: ${text}`);
      throw new Error(`Falha ao buscar notícias (${response.status}).`);
    }
    const json = (await response.json()) as {
      success?: boolean;
      data?: {
        web?: Array<{ url: string; title: string; description?: string; date?: string }>;
        news?: Array<{
          url: string;
          title: string;
          snippet?: string;
          description?: string;
          date?: string;
          imageUrl?: string;
        }>;
      };
    };
    const results = [...(json.data?.news ?? []), ...(json.data?.web ?? [])] as Array<{
      url: string;
      title: string;
      description?: string;
      snippet?: string;
      date?: string;
      imageUrl?: string;
    }>;
    const seen = new Set<string>();
    const items: NewsItem[] = [];
    for (const r of results) {
      if (!r.url || seen.has(r.url)) continue;
      seen.add(r.url);
      items.push({
        url: r.url,
        title: r.title,
        description: (r.description ?? r.snippet)?.replace(/[#*|]/g, "").slice(0, 240),
        source: hostFromUrl(r.url),
        publishedAt: r.date,
        imageUrl: r.imageUrl,
      });
    }
    return { items };
  });
