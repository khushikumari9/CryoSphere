import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Ship, Thermometer, Users } from "lucide-react";
import { useState } from "react";

import { GlobeWidget } from "@/components/GlobeWidget";

export const Route = createFileRoute("/expeditions")({
  head: () => ({
    meta: [
      { title: "Expeditions — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Spin the interactive polar globe, search coordinates and browse active expedition routes, crews and conditions.",
      },
      { property: "og:title", content: "Expeditions — CryoSphere" },
      {
        property: "og:description",
        content: "An interactive polar globe plus active expedition routes, crews and conditions.",
      },
    ],
  }),
  component: ExpeditionsPage,
});

const expeditions = [
  {
    id: "e1",
    name: "Brunt Shelf Rift Watch",
    region: "Antarctica · Brunt Ice Shelf",
    window: "Nov 2026 – Feb 2027",
    crew: 18,
    temp: "−24 °C",
    focus: "Rift propagation, GPS arrays, radar sounding",
  },
  {
    id: "e2",
    name: "Weddell Deep Transect",
    region: "Antarctica · Weddell Sea",
    window: "Dec 2026 – Mar 2027",
    crew: 42,
    temp: "−6 °C",
    focus: "CTD casts, bottom-water formation, moorings",
  },
  {
    id: "e3",
    name: "Dome C Traverse 12",
    region: "Antarctica · East Plateau",
    window: "Jan – Feb 2027",
    crew: 9,
    temp: "−41 °C",
    focus: "Ice coring, firn density, layer chronology",
  },
  {
    id: "e4",
    name: "Svalbard Permafrost Line",
    region: "Arctic · Svalbard",
    window: "Jun – Sep 2026",
    crew: 12,
    temp: "+3 °C",
    focus: "Borehole thermistors, thaw depth, carbon flux",
  },
];

function ExpeditionsPage() {
  const [selected, setSelected] = useState(expeditions[0]!.id);
  const active = expeditions.find((e) => e.id === selected)!;

  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Expeditions</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Drag the globe or type decimal degrees to locate a survey point, then open an expedition for
        its route, crew and conditions.
      </p>

      <div className="mt-9">
        <GlobeWidget />
      </div>

      <h2 className="mt-12 text-2xl font-bold sm:text-3xl">Active campaigns</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-3">
          {expeditions.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelected(e.id)}
              aria-pressed={e.id === selected}
              className={`glass rounded-2xl p-5 text-left transition-transform hover:scale-[1.01] ${
                e.id === selected ? "ring-2 ring-accent" : ""
              }`}
            >
              <p className="text-sm font-semibold">{e.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.region}</p>
            </button>
          ))}
        </div>

        <div className="glass shimmer-border rounded-3xl p-7">
          <h3 className="text-xl font-bold">{active.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{active.region}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> Window
              </dt>
              <dd className="mt-1 text-sm font-semibold">{active.window}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Crew
              </dt>
              <dd className="mt-1 text-sm font-semibold">{active.crew}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                <Thermometer className="h-3.5 w-3.5" /> Mean temp
              </dt>
              <dd className="mt-1 text-sm font-semibold">{active.temp}</dd>
            </div>
          </dl>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Ship className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {active.focus}
          </p>
        </div>
      </div>
    </div>
  );
}
