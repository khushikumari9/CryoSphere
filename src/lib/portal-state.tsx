import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ---------------- theme ---------------- */

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("cryos-theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("cryos-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={useMemo(() => ({ theme, toggle }), [theme, toggle])}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/* ---------------- session ---------------- */

export const ROLES = [
  "Student",
  "Teacher",
  "Scientist",
  "Researcher",
  "Science Communicator",
  "Policy Maker",
  "Other",
] as const;

export type Role = (typeof ROLES)[number];

type Session = { email: string; role: Role | null } | null;

const SessionContext = createContext<{
  session: Session;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  setRole: (r: Role) => void;
}>({
  session: null,
  loginOpen: false,
  setLoginOpen: () => {},
  signIn: () => {},
  signOut: () => {},
  setRole: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("cryos-session");
    if (raw) {
      try {
        setSession(JSON.parse(raw) as Session);
      } catch {
        /* ignore malformed */
      }
    }
  }, []);

  const persist = useCallback((next: Session) => {
    setSession(next);
    if (next) window.localStorage.setItem("cryos-session", JSON.stringify(next));
    else window.localStorage.removeItem("cryos-session");
  }, []);

  const value = useMemo(
    () => ({
      session,
      loginOpen,
      setLoginOpen,
      signIn: (email: string) => {
        persist({ email, role: null });
        setLoginOpen(false);
      },
      signOut: () => persist(null),
      setRole: (role: Role) => persist(session ? { ...session, role } : { email: "", role }),
    }),
    [session, loginOpen, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
