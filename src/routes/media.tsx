import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Image as ImageIcon, Radio } from "lucide-react";

import { AiChatWidget } from "@/components/AiChatWidget";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Dissemination — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Press kits, image libraries, plain-language briefs and an AI guide for sharing polar science accurately.",
      },
      { property: "og:title", content: "Media Dissemination — CryoSphere" },
      {
        property: "og:description",
        content: "Press kits, image libraries and an AI guide for communicating polar science.",
      },
    ],
  }),
  component: MediaPage,
});

const kits = [
  {
    icon: ImageIcon,
    title: "Image & footage library",
    body: "Cleared stills and b-roll from station, vessel and traverse operations, with credit lines attached.",
  },
  {
    icon: FileText,
    title: "Plain-language briefs",
    body: "One-page explainers per indicator, reviewed by the originating science team.",
  },
  {
    icon: Radio,
    title: "Interview desk",
    body: "Availability windows for scientists on ice sheets, sea ice, ocean heat and polar policy.",
  },
  {
    icon: Download,
    title: "Data citation pack",
    body: "DOIs, licences and recommended wording for every dataset shown in the dashboard.",
  },
];

function MediaPage() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Media dissemination</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Everything needed to retell polar science faithfully — and a floating AI guide that answers
        questions while you work.
      </p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {kits.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass shimmer-border rounded-3xl p-6">
            <div className="bg-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-8 rounded-3xl p-6">
        <h2 className="text-lg font-semibold">Connect your own AI assistant</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          The floating chat widget in the corner is a styled shell. To wire it to your AI platform,
          use the Insert menu's Embed component on this page and paste your provider's embed code —
          the widget will then answer from your assistant.
        </p>
      </div>

      <AiChatWidget />
    </div>
  );
}
