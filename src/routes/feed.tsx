import { createFileRoute } from "@tanstack/react-router";

import { MediaFeed } from "@/components/MediaFeed";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Field Feed — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "An auto-playing feed of dispatches from polar stations, research vessels and ice-core traverses.",
      },
      { property: "og:title", content: "Field Feed — CryoSphere" },
      {
        property: "og:description",
        content: "Auto-playing dispatches from polar stations, vessels and ice-core traverses.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Field feed</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Cards play automatically as they enter view, exactly like a social timeline — mute or like any
        dispatch as you scroll.
      </p>
      <div className="mt-9">
        <MediaFeed />
      </div>
    </div>
  );
}
