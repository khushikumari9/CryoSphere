import { createFileRoute } from "@tanstack/react-router";
import { Compass, Handshake, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CryoSphere — Polar Science Portal" },
      {
        name: "description",
        content:
          "Who CryoSphere is for, how our polar data is sourced and verified, and the teams behind the portal.",
      },
      { property: "og:title", content: "About CryoSphere" },
      {
        property: "og:description",
        content: "The mission, data practices and people behind the CryoSphere polar portal.",
      },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: Compass,
    title: "One portal, many readers",
    body: "Students, teachers, scientists, communicators and policy makers each get a view tuned to how they work.",
  },
  {
    icon: ShieldCheck,
    title: "Traceable by default",
    body: "Every figure carries its station, instrument and citation so claims can be checked, not just repeated.",
  },
  {
    icon: Users,
    title: "Built with field teams",
    body: "Station crews and vessel scientists shape what we publish and how quickly it appears.",
  },
  {
    icon: Handshake,
    title: "Open collaboration",
    body: "Artists, educators and citizen scientists work alongside researchers in the community hub.",
  },
];

const facts = [
  { label: "Stations reporting", value: "24" },
  { label: "Seasons archived", value: "11" },
  { label: "Datasets published", value: "180+" },
  { label: "Partner institutes", value: "37" },
];

function AboutPage() {
  return (
    <div className="mx-auto w-[min(1100px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">About CryoSphere</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        CryoSphere is a demonstration polar science portal that gathers station telemetry, expedition
        media, teaching material and research records in one place — designed so a school class and a
        policy adviser can both start from the same page.
      </p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass shimmer-border rounded-3xl p-6">
            <div className="bg-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-8 grid gap-6 rounded-3xl p-7 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label}>
            <p className="text-gradient text-3xl font-bold">{f.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-8 rounded-3xl p-7">
        <h2 className="text-2xl font-bold">A note on the data</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          The telemetry, feed posts and repository records in this portal are illustrative samples
          used to demonstrate the experience. Replace them with your own station feeds and archives
          when you take it live.
        </p>
      </div>
    </div>
  );
}
