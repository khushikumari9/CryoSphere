import { Activity, Droplets, Snowflake, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { t: string; temp: number; wind: number; ice: number };

const seed: Point[] = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  temp: -28 + Math.sin(i / 3) * 5 + (i % 4) * 0.4,
  wind: 14 + Math.abs(Math.cos(i / 2)) * 12,
  ice: 3.8 + Math.sin(i / 5) * 0.35,
}));

function Metric({
  icon: Icon,
  label,
  value,
  unit,
  delta,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
  unit: string;
  delta: string;
}) {
  return (
    <div className="glass shimmer-border rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="font-display mt-3 text-3xl font-bold">
        {value}
        <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>
      </p>
      <p className="mt-1 text-xs text-accent">{delta}</p>
    </div>
  );
}

export function DataDashboard() {
  const [data, setData] = useState<Point[]>(seed);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((n) => n + 1);
      setData((prev) => {
        const last = prev[prev.length - 1]!;
        const next: Point = {
          t: `+${prev.length - 23}m`,
          temp: +(last.temp + (Math.random() - 0.5) * 1.6).toFixed(1),
          wind: Math.max(2, +(last.wind + (Math.random() - 0.5) * 4).toFixed(1)),
          ice: +(last.ice + (Math.random() - 0.5) * 0.06).toFixed(2),
        };
        return [...prev.slice(1), next];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const latest = data[data.length - 1]!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> Live telemetry · update #{tick}
        </span>
        <span className="text-xs text-muted-foreground">Simulated station stream, refreshed every 3s</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={Thermometer}
          label="Air temperature"
          value={latest.temp.toFixed(1)}
          unit="°C"
          delta="Sensor AWS-04 · 2 m mast"
        />
        <Metric
          icon={Wind}
          label="Wind speed"
          value={latest.wind.toFixed(1)}
          unit="m/s"
          delta="Gust factor 1.4"
        />
        <Metric
          icon={Snowflake}
          label="Sea ice extent"
          value={latest.ice.toFixed(2)}
          unit="M km²"
          delta="Passive microwave composite"
        />
        <Metric icon={Droplets} label="Sea surface salinity" value="34.2" unit="PSU" delta="CTD cast 118" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-accent" /> Temperature trace (24 h)
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} interval={5} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} width={36} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#tempFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-sm font-semibold">Wind speed distribution</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} interval={5} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} width={36} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Bar dataKey="wind" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Sea ice extent anomaly</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} interval={3} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} width={36} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Line type="monotone" dataKey="ice" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
