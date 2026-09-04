import { createFileRoute } from "@tanstack/react-router";
import { Camera, MessagesSquare, NotebookPen } from "lucide-react";
import { useState } from "react";

import icecore from "@/assets/feed-icecore.jpg";
import station from "@/assets/feed-station.jpg";
import vessel from "@/assets/feed-vessel.jpg";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Hub — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "A discussion forum for artist-scientist collaborations, field researcher blogs and a citizen science photo gallery.",
      },
      { property: "og:title", content: "Community Hub — CryoSphere" },
      {
        property: "og:description",
        content: "Forum, field stories and a citizen science gallery for the polar community.",
      },
    ],
  }),
  component: CommunityPage,
});

const threads = [
  {
    title: "Sonifying 40 years of sea-ice extent — looking for a composer",
    author: "Dr. Ana Petrova",
    replies: 34,
    tag: "Artist × Scientist",
  },
  {
    title: "Printmaking residency at a coastal station: what worked",
    author: "Iris Malmgren",
    replies: 21,
    tag: "Residency",
  },
  {
    title: "Open call: illustrators for a plain-language ice sheet brief",
    author: "Comms desk",
    replies: 12,
    tag: "Open call",
  },
  {
    title: "Ethics of representing Indigenous Arctic knowledge in art",
    author: "Nuka Olsen",
    replies: 57,
    tag: "Discussion",
  },
];

const posts = [
  {
    title: "Three weeks on the Brunt: living with a rift",
    author: "Halley VI crew",
    date: "28 Aug 2026",
    excerpt:
      "The shelf groans at night. We log it, then go back to sleep — here is what the seismometers actually saw.",
  },
  {
    title: "Transect 14, and the anomaly that would not go away",
    author: "RV Polar Meridian",
    date: "12 Aug 2026",
    excerpt:
      "Six nautical miles between casts, and a salinity signal that followed us for four hundred kilometres.",
  },
  {
    title: "Core 312, and the winter that left a mark",
    author: "Dr. Ana Petrova",
    date: "02 Aug 2026",
    excerpt:
      "Forty-one centimetres of bubble-rich firn, and a volcanic layer that lines up with 1987.",
  },
];

const gallery = [
  { src: station, caption: "Midnight sun over the shelf — submitted by M. Lindqvist" },
  { src: vessel, caption: "First-year ice breaking astern — submitted by S. Rahman" },
  { src: icecore, caption: "Firn detail under raking light — submitted by C. Ibarra" },
];

function CommunityPage() {
  const [tab, setTab] = useState<"forum" | "blog" | "gallery">("forum");

  const tabs = [
    { id: "forum" as const, label: "Forum", icon: MessagesSquare },
    { id: "blog" as const, label: "Field stories", icon: NotebookPen },
    { id: "gallery" as const, label: "Citizen gallery", icon: Camera },
  ];

  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Community hub</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Where artists, researchers and volunteers meet — collaborations, field stories and photographs
        from people watching the poles.
      </p>

      <div className="glass mt-8 inline-flex flex-wrap gap-1 rounded-full p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === id ? "bg-brand text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "forum" && (
        <div className="mt-6 grid gap-3">
          {threads.map((t) => (
            <article key={t.title} className="glass rounded-2xl p-5">
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                {t.tag}
              </span>
              <h2 className="mt-3 text-lg font-semibold">{t.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.author} · {t.replies} replies
              </p>
            </article>
          ))}
        </div>
      )}

      {tab === "blog" && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="glass shimmer-border rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{p.date}</p>
              <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.author}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "gallery" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g) => (
            <figure key={g.caption} className="glass overflow-hidden rounded-3xl">
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="p-4 text-sm text-muted-foreground">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
