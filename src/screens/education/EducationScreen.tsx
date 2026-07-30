import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Quote,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Section } from "@/components/common/Section";
import { MetricTile } from "@/components/common/MetricTile";
import { SearchField } from "@/components/common/SearchField";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { ProgressBar } from "@/components/common/Progress";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import { stagger } from "@/animations/motion";
import { GLOSSARY, INVESTORS, MATERIALS, QUIZ, TRACKS, type Level } from "@/data/education";

type Tab = "trilhas" | "glossario" | "quiz" | "mestres";

const levelTone: Record<Level, string> = {
  Iniciante: "bg-success/12 text-success",
  Intermediário: "bg-accent text-accent-foreground",
  Avançado: "bg-warning/15 text-warning-foreground",
};

export function EducationScreen() {
  const [tab, setTab] = useState<Tab>("trilhas");
  const [trackQuery, setTrackQuery] = useState("");
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const tracks = useMemo(() => {
    const q = trackQuery.trim().toLowerCase();
    if (!q) return TRACKS;
    return TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.topics.some((topic) => topic.toLowerCase().includes(q)),
    );
  }, [trackQuery]);

  const terms = useMemo(() => {
    const q = glossaryQuery.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
    );
  }, [glossaryQuery]);

  const started = TRACKS.filter((t) => t.progress > 0).length;
  const avgProgress = Math.round(TRACKS.reduce((s, t) => s + t.progress, 0) / TRACKS.length);
  const correct = QUIZ.filter((q) => answers[q.id] === q.answer).length;

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Universidade Financeira"
        title="Educação"
        subtitle="Trilhas, glossário, quiz e os maiores investidores."
      />

      <div className="mt-5 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <MetricTile label="Trilhas" value={String(TRACKS.length)} icon={BookOpen} style={stagger(0)} />
          <MetricTile label="Iniciadas" value={String(started)} icon={GraduationCap} tone="primary" style={stagger(1)} />
          <MetricTile label="Progresso" value={`${avgProgress}%`} icon={Award} style={stagger(2)} />
        </div>

        <SegmentedControl
          options={[
            { value: "trilhas", label: "Trilhas" },
            { value: "glossario", label: "Glossário" },
            { value: "quiz", label: "Quiz" },
            { value: "mestres", label: "Mestres" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* Trilhas --------------------------------------------------------- */}
        {tab === "trilhas" && (
          <div className="space-y-4">
            <SearchField
              value={trackQuery}
              onChange={setTrackQuery}
              placeholder="Buscar trilha ou tema"
            />
            {tracks.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="Nenhuma trilha encontrada"
                description="Tente outro termo, como “FIIs”, “Tesouro” ou “aposentadoria”."
              />
            ) : (
              <div className="space-y-3">
                {tracks.map((track, i) => (
                  <article
                    key={track.id}
                    className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4"
                    style={stagger(i, 40)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-foreground">{track.title}</h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                          levelTone[track.level],
                        )}
                      >
                        {track.level}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {track.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {track.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3">
                      <ProgressBar
                        value={track.progress}
                        label={`${track.lessons} aulas · ${track.minutes} min`}
                        hint={`${track.progress}%`}
                      />
                    </div>
                    {track.videos && track.videos.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {track.videos.map((video) => (
                          <a
                            key={video.url}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press flex items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-muted p-2.5"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-semibold text-foreground">
                                {video.title}
                              </span>
                              <span className="block text-[0.65rem] text-muted-foreground">
                                YouTube · {video.channel}
                              </span>
                            </span>
                            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            <Section title="Materiais oficiais" description="Sempre com link para a fonte original">
              <div className="space-y-2">
                {MATERIALS.map((material, i) => (
                  <a
                    key={material.url}
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card press animate-[rise_0.5s_var(--ease-premium)_both] flex items-center justify-between gap-3 p-3.5"
                    style={stagger(i, 40)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{material.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {material.kind} · {material.source}
                      </p>
                    </div>
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </a>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Glossário ------------------------------------------------------- */}
        {tab === "glossario" && (
          <div className="space-y-4">
            <SearchField
              value={glossaryQuery}
              onChange={setGlossaryQuery}
              placeholder="Buscar termo (CDI, P/VP, valuation…)"
            />
            {terms.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Termo não encontrado"
                description="Ainda não temos esse verbete no glossário."
              />
            ) : (
              <div className="space-y-2">
                {terms.map((term, i) => (
                  <div
                    key={term.term}
                    className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4"
                    style={stagger(i, 35)}
                  >
                    <p className="text-sm font-semibold text-foreground">{term.term}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {term.definition}
                    </p>
                    <p className="mt-2 rounded-[var(--radius-lg)] bg-muted p-2.5 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Exemplo: </span>
                      {term.example}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz ------------------------------------------------------------ */}
        {tab === "quiz" && (
          <div className="space-y-4">
            <div className="surface-card p-4">
              <ProgressBar
                value={(correct / QUIZ.length) * 100}
                label="Acertos"
                hint={`${correct}/${QUIZ.length}`}
              />
            </div>
            {QUIZ.map((question, i) => {
              const answered = answers[question.id] !== undefined;
              return (
                <div
                  key={question.id}
                  className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4"
                  style={stagger(i, 45)}
                >
                  <p className="text-sm font-semibold text-foreground">{question.question}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, index) => {
                      const chosen = answers[question.id] === index;
                      const isRight = index === question.answer;
                      return (
                        <button
                          key={option}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [question.id]: index }))
                          }
                          className={cn(
                            "press flex w-full items-center gap-2 rounded-[var(--radius-lg)] border p-3 text-left text-xs font-medium transition-colors duration-300",
                            answered && isRight
                              ? "border-success bg-success/10 text-foreground"
                              : chosen
                                ? "border-destructive bg-destructive/10 text-foreground"
                                : "border-border bg-card text-muted-foreground",
                          )}
                        >
                          {answered && isRight && (
                            <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
                          )}
                          {answered && chosen && !isRight && (
                            <XCircle className="size-4 shrink-0 text-destructive" aria-hidden />
                          )}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Mestres ---------------------------------------------------------- */}
        {tab === "mestres" && (
          <div className="space-y-3">
            {INVESTORS.map((investor, i) => (
              <article
                key={investor.name}
                className="surface-card animate-[rise_0.5s_var(--ease-premium)_both] p-4"
                style={stagger(i, 40)}
              >
                <h3 className="text-sm font-semibold text-foreground">{investor.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{investor.bio}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Filosofia: </span>
                  {investor.philosophy}
                </p>
                <blockquote className="mt-3 flex gap-2 rounded-[var(--radius-lg)] bg-muted p-3">
                  <Quote className="size-3.5 shrink-0 text-primary" aria-hidden />
                  <p className="text-xs italic leading-relaxed text-foreground">{investor.quote}</p>
                </blockquote>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">
                  Leitura: {investor.books.join(", ")}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="pb-2 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          Conteúdo educacional. Nenhum material protegido por direitos autorais é hospedado no app —
          os links levam sempre à fonte original.
        </p>
      </div>
    </AppShell>
  );
}
