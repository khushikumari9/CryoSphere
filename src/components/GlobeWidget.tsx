import { Crosshair, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Station = { name: string; lat: number; lon: number };

const stations: Station[] = [
  { name: "Halley VI", lat: -75.6, lon: -26.2 },
  { name: "McMurdo", lat: -77.85, lon: 166.67 },
  { name: "Concordia", lat: -75.1, lon: 123.35 },
  { name: "Ny-Ålesund", lat: 78.92, lon: 11.93 },
  { name: "Summit Camp", lat: 72.58, lon: -38.46 },
  { name: "Alert", lat: 82.5, lon: -62.35 },
];

const RAD = Math.PI / 180;

/** Interactive orthographic globe on canvas: drag to spin, click to read coordinates. */
export function GlobeWidget() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rot = useRef({ lon: 0, lat: -20 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const spin = useRef(true);

  const [target, setTarget] = useState({ lat: -75.6, lon: -26.2 });
  const [latInput, setLatInput] = useState("-75.6");
  const [lonInput, setLonInput] = useState("-26.2");
  const [nearest, setNearest] = useState<Station>(stations[0]!);

  const computeNearest = useCallback((lat: number, lon: number) => {
    let best = stations[0]!;
    let bestD = Infinity;
    for (const s of stations) {
      const d = Math.hypot(s.lat - lat, ((s.lon - lon + 540) % 360) - 180);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  }, []);

  useEffect(() => setNearest(computeNearest(target.lat, target.lon)), [target, computeNearest]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const style = () => getComputedStyle(document.documentElement);

    const project = (lat: number, lon: number, r: number, cx: number, cy: number) => {
      const l0 = rot.current.lon * RAD;
      const p0 = rot.current.lat * RAD;
      const p = lat * RAD;
      const l = lon * RAD - l0;
      const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      return {
        x: cx + r * Math.cos(p) * Math.sin(l),
        y: cy - r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)),
        visible: cosc > 0,
      };
    };

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.42;
      const cs = style();
      const primary = cs.getPropertyValue("--primary").trim() || "#4aa";
      const accent = cs.getPropertyValue("--aurora").trim() || "#3d9";
      const fg = cs.getPropertyValue("--foreground").trim() || "#fff";

      // sphere
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
      grad.addColorStop(0, primary);
      grad.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = primary;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // graticule
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = 1;
      ctx.strokeStyle = fg;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, r, cx, cy);
          if (!p.visible) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lat, lon, r, cx, cy);
          if (!p.visible) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // polar ice caps
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = accent;
      for (const capLat of [-90, 90]) {
        for (let ring = 0; ring < 12; ring++) {
          const lat = capLat + (capLat < 0 ? 1 : -1) * ring * 1.4;
          for (let lon = -180; lon < 180; lon += 6) {
            const p = project(lat, lon, r, cx, cy);
            if (!p.visible) continue;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      // stations
      for (const s of stations) {
        const p = project(s.lat, s.lon, r, cx, cy);
        if (!p.visible) continue;
        ctx.fillStyle = fg;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.65;
        ctx.font = "11px sans-serif";
        ctx.fillText(s.name, p.x + 7, p.y + 3);
      }
      ctx.globalAlpha = 1;

      // target marker
      const t = project(target.lat, target.lon, r, cx, cy);
      if (t.visible) {
        const pulse = 4 + 2.5 * (1 + Math.sin(Date.now() / 320));
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (spin.current) rot.current.lon = (rot.current.lon + 0.12) % 360;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drag.current = { x: e.clientX, y: e.clientY };
    spin.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = drag.current;
    if (!d) return;
    rot.current.lon = (rot.current.lon - (e.clientX - d.x) * 0.5) % 360;
    rot.current.lat = Math.max(-85, Math.min(85, rot.current.lat + (e.clientY - d.y) * 0.4));
    drag.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    drag.current = null;
    spin.current = true;
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const size = rect.width;
    const r = size * 0.42;
    const x = (e.clientX - rect.left - size / 2) / r;
    const y = -(e.clientY - rect.top - size / 2) / r;
    const rho = Math.hypot(x, y);
    if (rho > 1) return;
    const c = Math.asin(rho);
    const p0 = rot.current.lat * RAD;
    const lat =
      Math.asin(Math.cos(c) * Math.sin(p0) + (rho ? (y * Math.sin(c) * Math.cos(p0)) / rho : 0)) /
      RAD;
    const lon =
      rot.current.lon +
      Math.atan2(
        x * Math.sin(c),
        rho * Math.cos(c) * Math.cos(p0) - y * Math.sin(c) * Math.sin(p0),
      ) /
        RAD;
    const norm = ((((lon + 180) % 360) + 360) % 360) - 180;
    setTarget({ lat: +lat.toFixed(2), lon: +norm.toFixed(2) });
    setLatInput(lat.toFixed(2));
    setLonInput(norm.toFixed(2));
  };

  return (
    <div className="glass shimmer-border grid gap-6 rounded-3xl p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        className="aspect-square w-full cursor-grab touch-none rounded-2xl active:cursor-grabbing"
        aria-label="Interactive globe: drag to rotate, click to select coordinates"
      />

      <div className="flex flex-col justify-center gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Coordinate search
          </p>
          <h3 className="mt-2 text-2xl font-bold">Pin any point on the cryosphere</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Spin the globe, tap a point, or type precise decimal degrees to lock a survey target.
          </p>
        </div>

        <form
          className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            const lat = Math.max(-90, Math.min(90, Number(latInput) || 0));
            const lon = Math.max(-180, Math.min(180, Number(lonInput) || 0));
            setTarget({ lat, lon });
            rot.current.lon = lon;
            rot.current.lat = lat / 2;
          }}
        >
          <label className="text-xs font-medium text-muted-foreground">
            Latitude
            <input
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Longitude
            <input
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="bg-brand mt-auto grid h-[42px] w-full place-items-center rounded-xl px-4 text-sm font-semibold text-primary-foreground sm:w-auto"
            aria-label="Search coordinates"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="glass grid gap-3 rounded-2xl p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Selected target</p>
            <p className="font-display text-lg font-bold">
              {Math.abs(target.lat).toFixed(2)}° {target.lat < 0 ? "S" : "N"},{" "}
              {Math.abs(target.lon).toFixed(2)}° {target.lon < 0 ? "W" : "E"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nearest station</p>
            <p className="flex items-center gap-1.5 font-display text-lg font-bold">
              <Crosshair className="h-4 w-4 text-accent" />
              {nearest.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {stations.map((s) => (
            <button
              key={s.name}
              onClick={() => {
                setTarget({ lat: s.lat, lon: s.lon });
                setLatInput(String(s.lat));
                setLonInput(String(s.lon));
                rot.current.lon = s.lon;
                rot.current.lat = s.lat / 2;
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
