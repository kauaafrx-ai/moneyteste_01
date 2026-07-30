import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Heart, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NEWS_CATEGORIES } from "@/constants/news";
import { searchNews, type NewsItem } from "@/lib/news.functions";
import { cn } from "@/lib/utils";
import { useFavoriteNews } from "@/hooks/useFavoriteNews";
import { openAiChat } from "@/components/ai/floatingAiBus";

export function NewsScreen() {
  const [activeCat, setActiveCat] = useState(NEWS_CATEGORIES[0]);
  const [customQuery, setCustomQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggle, isFavorite } = useFavoriteNews();

  const fetchNews = useServerFn(searchNews);
  const query = searchTerm || activeCat.query;

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["news", query],
    queryFn: () => fetchNews({ data: { query, limit: 12 } }),
    staleTime: 5 * 60_000,
    enabled: !showFavorites,
  });

  const items = showFavorites ? favorites : (data?.items ?? []);

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Central de Notícias"
        title="Notícias financeiras"
        subtitle="Resumos com fonte oficial. Sem cópia integral — sempre redirecionamos."
        actions={
          <Button
            size="icon"
            variant="outline"
            aria-label="Atualizar"
            onClick={() => refetch()}
            disabled={isFetching || showFavorites}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
          </Button>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowFavorites(false);
          setSearchTerm(customQuery.trim());
        }}
        className="mt-4 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Buscar: Petrobras, Bitcoin, Selic…"
            className="pl-9"
          />
          {searchTerm && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => { setSearchTerm(""); setCustomQuery(""); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant={showFavorites ? "default" : "outline"}
          size="icon"
          aria-label="Favoritas"
          onClick={() => setShowFavorites((s) => !s)}
        >
          <Heart className={cn("size-4", showFavorites && "fill-current")} aria-hidden />
        </Button>
      </form>

      {!showFavorites && (
        <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {NEWS_CATEGORIES.map((c) => {
            const active = c.id === activeCat.id && !searchTerm;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => { setActiveCat(c); setSearchTerm(""); setCustomQuery(""); }}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="mr-1">{c.emoji}</span>{c.label}
              </button>
            );
          })}
        </div>
      )}

      <section className="mt-4 space-y-3 pb-6">
        {showFavorites && favorites.length === 0 && (
          <EmptyState message="Nenhuma notícia salva ainda. Toque no coração para salvar." />
        )}
        {!showFavorites && error && (
          <EmptyState message="Não foi possível carregar as notícias agora. Tente novamente." />
        )}
        {!showFavorites && isLoading && Array.from({ length: 5 }).map((_, i) => <NewsCardSkeleton key={i} />)}
        {items.map((item) => (
          <NewsCard
            key={item.url}
            item={item}
            favorite={isFavorite(item.url)}
            onToggleFavorite={() => toggle(item)}
            onExplain={() =>
              openAiChat({
                userText: `Explique a notícia: "${item.title}"`,
                systemContext: `Notícia para explicar (não recomende comprar/vender):\nTítulo: ${item.title}\nResumo: ${item.description ?? ""}\nFonte: ${item.source ?? item.url}\nURL: ${item.url}`,
              })
            }
          />
        ))}
      </section>
    </AppShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-2xl)] border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-5 w-full" />
      <Skeleton className="mt-1 h-5 w-4/5" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-3/4" />
    </div>
  );
}

function NewsCard({
  item,
  favorite,
  onToggleFavorite,
  onExplain,
}: {
  item: NewsItem;
  favorite: boolean;
  onToggleFavorite: () => void;
  onExplain: () => void;
}) {
  const dateStr = useMemo(() => {
    if (!item.publishedAt) return null;
    try {
      const d = new Date(item.publishedAt);
      if (Number.isNaN(d.getTime())) return item.publishedAt;
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    } catch { return null; }
  }, [item.publishedAt]);

  return (
    <article className="rounded-[var(--radius-2xl)] border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
        <span className="truncate">{item.source ?? "Fonte"}</span>
        {dateStr && <span>{dateStr}</span>}
      </div>
      <div className="mt-1.5 flex gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[0.95rem] font-semibold leading-snug text-foreground">{item.title}</h3>
          {item.description && (
            <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="size-16 shrink-0 rounded-[var(--radius-lg)] object-cover"
          />
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="press inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Ler na fonte <ExternalLink className="size-3.5" aria-hidden />
        </a>
        <button
          type="button"
          onClick={onExplain}
          className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
        >
          <Sparkles className="size-3.5" aria-hidden /> Explicar com IA
        </button>
        <button
          type="button"
          aria-label={favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          onClick={onToggleFavorite}
          className="press ml-auto inline-flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-accent"
        >
          <Heart className={cn("size-4", favorite && "fill-primary text-primary")} aria-hidden />
        </button>
      </div>
    </article>
  );
}
