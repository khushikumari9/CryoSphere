import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X, LogOut } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-cryos.png";
import { useSession, useTheme } from "@/lib/portal-state";

const links = [
  { to: "/", label: "Home" },
  { to: "/feed", label: "Field Feed" },
  { to: "/data", label: "Live Data" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/education", label: "Education" },
  { to: "/community", label: "Community" },
] as const;

export function NavBar() {
  const { theme, toggle } = useTheme();
  const { session, setLoginOpen, signOut } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass mx-auto mt-3 flex w-[min(1200px,94vw)] items-center justify-between rounded-2xl px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="CryoSphere Portal logo" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-base font-bold tracking-tight sm:text-lg">
            Cryo<span className="text-gradient">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle colour theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-secondary/60 text-foreground transition-transform hover:scale-105"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {session ? (
            <button
              onClick={signOut}
              className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:flex"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-brand glow rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Log in
            </button>
          )}

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="glass mx-auto mt-2 flex w-[min(1200px,94vw)] flex-col gap-1 rounded-2xl p-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
