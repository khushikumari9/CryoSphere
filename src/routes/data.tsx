import { createFileRoute } from "@tanstack/react-router";

import { DataDashboard } from "@/components/DataDashboard";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Live Data Dashboard — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Real-time polar station telemetry: air temperature, wind speed, sea ice extent and ocean salinity.",
      },
      { property: "og:title", content: "Live Data Dashboard — CryoSphere" },
      {
        property: "og:description",
        content: "Real-time polar telemetry: temperature, wind, sea ice extent and salinity.",
      },
    ],
  }),
  component: DataPage,
});

function DataPage() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Live data</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        A continuously updating view of the instruments across the network.
      </p>
      <div className="mt-9">
        <DataDashboard />
      </div>
    </div>
  );
}
