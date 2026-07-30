import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news.functions";

const KEY = "aurum:news:favorites";

function read(): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NewsItem[]) : [];
  } catch {
    return [];
  }
}

export function useFavoriteNews() {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);

  useEffect(() => {
    setFavorites(read());
  }, []);

  const persist = (next: NewsItem[]) => {
    setFavorites(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return {
    favorites,
    isFavorite: (url: string) => favorites.some((f) => f.url === url),
    toggle: (item: NewsItem) => {
      const exists = favorites.some((f) => f.url === item.url);
      persist(exists ? favorites.filter((f) => f.url !== item.url) : [item, ...favorites]);
    },
  };
}
