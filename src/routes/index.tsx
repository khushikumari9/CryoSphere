import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  GraduationCap,
  Home as HomeIcon,
  Info,
  Radio,
  Sparkle,
} from "lucide-react";

import hero from "@/assets/hero-aurora.jpg";
import { MediaFeed } from "@/components/MediaFeed";
import { RoleCards } from "@/components/RoleCards";
import { useSession } from "@/lib/portal-state";

const heroNav = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/media", label: "Media", icon: Radio },
  { to: "/knowledge", label: "Knowledge Repository", icon: BookOpen },
  { to: "/education", label: "Education Resources", icon: GraduationCap },
  { to: "/expeditions", label: "Expeditions", icon: Compass },
  { to: "/about", label: "About", icon: Info },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CryoSphere — Polar Science Portal" },
      {
        name: "description",
        content:
          "Explore polar science: live station telemetry, an interactive globe for coordinate search, and field media from Arctic and Antarctic expeditions.",
      },
      { property: "og:title", content: "CryoSphere — Polar Science Portal" },
      {
        property: "og:description",
        content:
          "Live polar telemetry, a 3D coordinate globe and expedition media in one glassmorphic portal.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { session, setLoginOpen } = useSession();

  return (
    <div className="pb-24">
      <section className="mx-auto w-[min(1200px,94vw)] pt-10">
        <div className="glass shimmer-border relative overflow-hidden rounded-[2rem] p-6 sm:p-12">
          <img
            src={hero}
            alt="Aurora australis above an Antarctic research hut"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover opacity-45 dark:opacity-60"
          />
          <div className="relative max-w-2xl">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold">
              <Sparkle className="h-3.5 w-3.5 text-accent" /> Season 2026 field data now streaming
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
              The poles, <span className="text-gradient">rendered legible.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              CryoSphere brings station telemetry, expedition media and polar knowledge into one
              portal — tuned to how you work, whether you teach it, publish it or legislate on it.
            </p>
            <nav className="mt-7 flex flex-wrap gap-3">
              {heroNav.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
                  activeProps={{ className: "bg-brand text-primary-foreground" }}
                  activeOptions={{ exact: to === "/" }}
                >
                  <Icon className="h-4 w-4 text-accent" /> {label}
                </Link>
              ))}
            </nav>
            {!session && (
              <button
                onClick={() => setLoginOpen(true)}
                className="bg-brand glow mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Log in to choose your role
              </button>
            )}
          </div>
        </div>
      </section>

      {session && <RoleCards />}

      <section className="mx-auto w-[min(1200px,94vw)] py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold sm:text-4xl">From the ice, today</h2>
          <Link to="/feed" className="text-sm font-semibold text-accent">
            View full feed →
          </Link>
        </div>
        <div className="mt-6">
          <MediaFeed compact />
        </div>
      </section>
    </div>
  );
}
