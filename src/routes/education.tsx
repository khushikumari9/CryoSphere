import { createFileRoute } from "@tanstack/react-router";
import { Download, FlaskConical, GraduationCap, Play, Snowflake, Waves } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education Resources — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Interactive polar learning modules, downloadable curriculum guides and a STEM careers in polar research showcase.",
      },
      { property: "og:title", content: "Education Resources — CryoSphere" },
      {
        property: "og:description",
        content:
          "Learning modules, curriculum guides and polar STEM career profiles for students and educators.",
      },
    ],
  }),
  component: EducationPage,
});

const modules = [
  {
    icon: Snowflake,
    title: "Reading an ice core",
    level: "Ages 11–14",
    minutes: 25,
    body: "Count annual layers, spot volcanic markers and date a core segment yourself.",
  },
  {
    icon: Waves,
    title: "Why sea ice matters",
    level: "Ages 14–16",
    minutes: 30,
    body: "Build the albedo feedback loop step by step with live satellite extent data.",
  },
  {
    icon: FlaskConical,
    title: "Ocean salinity lab",
    level: "Ages 14–18",
    minutes: 40,
    body: "Run a virtual CTD cast and interpret a Weddell Sea temperature-salinity diagram.",
  },
  {
    icon: GraduationCap,
    title: "Penguin colony census",
    level: "Ages 9–12",
    minutes: 20,
    body: "Use aerial imagery to count a colony and estimate population change.",
  },
  {
    icon: Snowflake,
    title: "Permafrost in a jar",
    level: "Ages 11–14",
    minutes: 35,
    body: "A classroom experiment on thaw, carbon release and ground stability.",
  },
  {
    icon: Waves,
    title: "Mapping a traverse",
    level: "Ages 16–18",
    minutes: 45,
    body: "Plan a Dome C traverse with fuel, crevasse risk and weather windows.",
  },
];

const guides = [
  { title: "Polar science curriculum guide — Primary", pages: 48 },
  { title: "Polar science curriculum guide — Secondary", pages: 96 },
  { title: "Fieldwork safety & ethics for classrooms", pages: 22 },
  { title: "Data literacy with real station telemetry", pages: 34 },
];

const careers = [
  {
    role: "Glaciologist",
    path: "Physics or geoscience degree, then ice-sheet modelling or field drilling.",
  },
  {
    role: "Polar ecologist",
    path: "Biology background with statistics; seasonal field seasons on the ice.",
  },
  {
    role: "Station engineer",
    path: "Mechanical or electrical training; keeps power, water and instruments alive.",
  },
  {
    role: "Science communicator",
    path: "Journalism or science writing plus a season embedded with a research team.",
  },
  {
    role: "Remote-sensing analyst",
    path: "Coding and satellite data skills; maps change without leaving the lab.",
  },
  {
    role: "Polar policy adviser",
    path: "Law or international relations, working on treaty and conservation frameworks.",
  },
];

function EducationPage() {
  const [openModule, setOpenModule] = useState<string | null>(null);

  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Education centre</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Interactive modules, classroom-ready curriculum guides and career routes into polar
        research — for students and educators alike.
      </p>

      <h2 className="mt-10 text-2xl font-bold sm:text-3xl">Interactive learning modules</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ icon: Icon, title, level, minutes, body }) => {
          const open = openModule === title;
          return (
            <button
              key={title}
              onClick={() => setOpenModule(open ? null : title)}
              aria-expanded={open}
              className={`glass shimmer-border rounded-3xl p-6 text-left transition-transform hover:scale-[1.02] ${
                open ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="bg-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {level} · {minutes} min
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                <Play className="h-4 w-4 text-accent" /> {open ? "Selected" : "Start module"}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-12 text-2xl font-bold sm:text-3xl">Downloadable curriculum guides</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {guides.map((g) => (
          <div key={g.title} className="glass flex items-center gap-4 rounded-2xl p-5">
            <Download className="h-5 w-5 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{g.title}</p>
              <p className="text-xs text-muted-foreground">PDF · {g.pages} pages</p>
            </div>
            <span className="ml-auto rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
              Download
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold sm:text-3xl">STEM careers in polar research</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((c) => (
          <div key={c.role} className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold">{c.role}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
