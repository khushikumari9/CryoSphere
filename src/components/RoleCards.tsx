import { Check, Compass, GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROLES, useSession, type Role } from "@/lib/portal-state";

const meta: Record<Role, { icon: LucideIcon; blurb: string }> = {
  Admin: { icon: ShieldCheck, blurb: "Manage portal content, users and data streams." },
  "Researcher & Scientist": {
    icon: Microscope,
    blurb: "Raw instrument streams, publications and sample archives.",
  },
  "Student or Teacher": {
    icon: GraduationCap,
    blurb: "Guided lessons, classroom kits and starter datasets.",
  },
  Other: { icon: Compass, blurb: "Explore everything with a general-purpose view." },
};

export function RoleCards() {
  const { session, setRole } = useSession();

  return (
    <section className="mx-auto w-[min(1200px,94vw)] py-10" id="roles">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Signed in as {session?.email}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Choose how you explore</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Your role shapes the feed, the globe layers and the dashboard units.
          </p>
        </div>
        {session?.role && (
          <span className="glass rounded-full px-4 py-2 text-sm font-semibold">
            Active role: {session.role}
          </span>
        )}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((role, i) => {
          const { icon: Icon, blurb } = meta[role];
          const active = session?.role === role;
          return (
            <button
              key={role}
              onClick={() => setRole(role)}
              aria-pressed={active}
              className={`glass shimmer-border group relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1.5 hover:glow ${
                active ? "ring-2 ring-ring" : ""
              } ${i === 6 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="bg-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{role}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>
              <span
                className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${
                  active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {active ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Selected
                  </>
                ) : (
                  "Select role"
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
