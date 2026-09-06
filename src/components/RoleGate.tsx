import { BadgeCheck, Compass, GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { ROLES, VERIFIED_ROLES, useSession, type Role } from "@/lib/portal-state";

const meta: Record<Role, { icon: LucideIcon; blurb: string }> = {
  Admin: { icon: ShieldCheck, blurb: "Review and approve everything scientists upload." },
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

export function RoleGate() {
  const { session, setRole, verify } = useSession();
  const [idNumber, setIdNumber] = useState("");
  const [institution,ExitInstitution] = useState("");
  const [checking, setChecking] = useState(false);

  if (!session) return null;
  const needsRole = !session.role;
  const needsVerify =
    !!session.role && VERIFIED_ROLES.includes(session.role) && !session.verified;
  if (!needsRole && !needsVerify) return null;

  return (
    <div
      className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-background/80 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your role"
    >
      {needsRole ? (
        <div className="w-[min(1000px,96vw)] py-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Signed in as {session.email}
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold sm:text-4xl">
            Who is exploring today?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
            Admins and scientists verify their institutional ID; students and everyone else go
            straight in.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role) => {
              const { icon: Icon, blurb } = meta[role];
              return (
                <button
                  key={role}
                  onClick={() => setRole(role)}
                  className="glass shimmer-border group hover:glow rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="bg-brand grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{role}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>
                  <span className="mt-4 inline-block text-xs font-semibold text-accent">
                    {VERIFIED_ROLES.includes(role) ? "ID check required →" : "Continue →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-strong shimmer-border w-[min(460px,94vw)] rounded-3xl p-7">
          <div className="bg-brand grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-bold">Verify your {session.role} access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your institutional ID and organisation. Verification is simulated in this demo.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setChecking(true);
              window.setTimeout(() => {
                setChecking(false);
                verify();
              }, 1200);
            }}
          >
            <label className="block text-sm font-medium">
              Institutional ID
              <input
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. NCPOR-4821"
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm font-medium">
              Institution
              <input
                required
                value={institution}
                onChange={(e) => ExitInstitution(e.target.value)}
                placeholder="Polar research centre"
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <button
              type="submit"
              disabled={checking}
              className="bg-brand glow w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              {checking ? "Verifying credentials…" : "Verify and continue"}
            </button>
          </form>
          <button
            onClick={() => setRole("Other")}
            className="mt-4 w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Choose a different role
          </button>
        </div>
      )}
    </div>
  );
}
