import { createFileRoute } from "@tanstack/react-router";

import { GlobeWidget } from "@/components/GlobeWidget";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Interactive Globe — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Spin an interactive 3D globe, click any point and search precise polar coordinates against research stations.",
      },
      { property: "og:title", content: "Interactive Globe — CryoSphere" },
      {
        property: "og:description",
        content: "Search precise polar coordinates on an interactive rotating globe.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Globe explorer</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        A live orthographic projection of both poles with station markers, drag-to-spin control and
        decimal-degree search.
      </p>
      <div className="mt-9">
        <GlobeWidget />
      </div>
    </div>
  );
}
