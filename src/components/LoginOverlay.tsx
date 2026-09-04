import { Snowflake, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useSession } from "@/lib/portal-state";

export function LoginOverlay() {
  const { loginOpen, setLoginOpen, signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLoginOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, setLoginOpen]);

  if (!loginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to CryoSphere"
    >
      <button
        aria-label="Close sign in"
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={() => setLoginOpen(false)}
      />
      <div className="glass-strong shimmer-border animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-3xl p-7 duration-300">
        <button
          onClick={() => setLoginOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-brand grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground">
          <Snowflake className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Enter the portal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to unlock role-tailored polar datasets, expeditions and dashboards.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) signIn(email.trim());
          }}
        >
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institute.org"
              className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="bg-brand glow w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Continue
          </button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Demo access: any email and password opens the portal on this device.
        </p>
      </div>
    </div>
  );
}
