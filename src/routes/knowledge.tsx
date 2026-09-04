import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Repository — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Search polar research by keyword or coordinates and filter by climate change, ecosystems, geology, glaciology and oceanography.",
      },
      { property: "og:title", content: "Knowledge Repository — CryoSphere" },
      {
        property: "og:description",
        content: "Search polar datasets and papers by term or coordinate, filtered by category.",
      },
    ],
  }),
  component: KnowledgePage,
});

const TAGS = [
  "Climate Change",
  "Ecosystems",
  "Geology",
  "Glaciology",
  "Oceanography",
  "Atmosphere",
] as const;

type Entry = {
  id: string;
  title: string;
  authors: string;
  year: number;
  tag: (typeof TAGS)[number];
  coords: string;
  summary: string;
};

const entries: Entry[] = [
  {
    id: "k1",
    title: "Brunt Ice Shelf calving cycle, 1915–2025",
    authors: "Petrova, A.; Lindqvist, M.",
    year: 2025,
    tag: "Glaciology",
    coords: "75.6°S, 26.6°W",
    summary:
      "Century-scale reconstruction of rift propagation and calving intervals from satellite and station records.",
  },
  {
    id: "k2",
    title: "Weddell Sea deep water salinity anomalies",
    authors: "Okonkwo, D.; Rahman, S.",
    year: 2024,
    tag: "Oceanography",
    coords: "68.0°S, 40.0°W",
    summary:
      "CTD transects reveal a persistent +0.4 PSU anomaly in bottom water formation regions.",
  },
  {
    id: "k3",
    title: "Emperor penguin colony shifts under fast-ice loss",
    authors: "Marchetti, L.",
    year: 2026,
    tag: "Ecosystems",
    coords: "77.9°S, 166.7°E",
    summary: "Colony relocation patterns tracked across eleven breeding sites over nine seasons.",
  },
  {
    id: "k4",
    title: "Svalbard permafrost warming rates",
    authors: "Nordahl, K.; Jain, P.",
    year: 2025,
    tag: "Climate Change",
    coords: "78.2°N, 15.6°E",
    summary: "Borehole thermistor arrays show 0.7 °C per decade warming at 20 m depth.",
  },
  {
    id: "k5",
    title: "Transantarctic basement geochronology",
    authors: "Whitcombe, R.",
    year: 2023,
    tag: "Geology",
    coords: "84.0°S, 170.0°E",
    summary: "U-Pb zircon ages constrain the timing of Ross Orogeny granitoid emplacement.",
  },
  {
    id: "k6",
    title: "Katabatic wind climatology at Dome C",
    authors: "Fournier, É.",
    year: 2024,
    tag: "Atmosphere",
    coords: "75.1°S, 123.3°E",
    summary: "Ten-year record of surface inversion strength and drainage flow onset timing.",
  },
  {
    id: "k7",
    title: "Arctic sea-ice albedo feedback re-assessed",
    authors: "Sorensen, H.; Ali, N.",
    year: 2026,
    tag: "Climate Change",
    coords: "85.0°N, 0.0°E",
    summary: "Melt-pond fraction corrections reduce modelled feedback strength by 12 percent.",
  },
  {
    id: "k8",
    title: "Sub-ice lake microbial communities",
    authors: "Ibarra, C.",
    year: 2025,
    tag: "Ecosystems",
    coords: "80.5°S, 110.0°E",
    summary: "Metagenomic survey of chemolithotrophic taxa recovered from clean-access drilling.",
  },
];

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const tagOk = active.length === 0 || active.includes(e.tag);
      const textOk =
        q.length === 0 ||
        [e.title, e.authors, e.summary, e.coords, e.tag].join(" ").toLowerCase().includes(q);
      return tagOk && textOk;
    });
  }, [query, active]);

  const toggleTag = (t: string) =>
    setActive((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Knowledge repository</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Search publications, datasets and field notes by term, author or decimal coordinates.
      </p>

      <div className="glass shimmer-border mt-8 rounded-3xl p-5">
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-3">
          <Search className="h-5 w-5 text-accent" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms or coordinates — e.g. sea ice, 78.2°N"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search the knowledge repository"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const on = active.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                aria-pressed={on}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-transform hover:scale-[1.04] ${
                  on
                    ? "bg-brand text-primary-foreground"
                    : "border border-border bg-secondary/60 text-muted-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
          {active.length > 0 && (
            <button
              onClick={() => setActive([])}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {results.map((e) => (
          <article key={e.id} className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-accent px-2.5 py-1 font-bold text-accent-foreground">
                {e.tag}
              </span>
              <span className="text-muted-foreground">{e.year}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{e.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{e.authors}</p>
            <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-accent">
              <MapPin className="h-3.5 w-3.5" /> {e.coords}
            </p>
          </article>
        ))}
        {results.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center md:col-span-2">
            <BookOpen className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-3 text-sm text-muted-foreground">
              No records match that search. Try a broader term or clear the filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
