import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import type { AuthError, Session as SupabaseSession, User } from "@supabase/supabase-js";

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
  "Admin",
  "Researcher & Scientist",
  "Student or Teacher",
  "Other",
] as const;

export type Role = (typeof ROLES)[number];

/** Roles that must pass institutional ID verification. */
export const VERIFIED_ROLES: Role[] = ["Admin", "Researcher & Scientist"];

export type Session = {
  email: string;
  emailVerified: boolean;
  provider: string;
  role: Role | null;
  /** true once the role no longer needs verification (or it passed). */
  verified: boolean;
} | null;

const SessionContext = createContext<{
  session: Session;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; needsVerification: boolean }>;
  resendVerification: (email: string) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  setRole: (r: Role) => void;
  verify: () => void;
}>({
  session: null,
  loginOpen: false,
  setLoginOpen: () => {},
  signIn: async () => null,
  signUp: async () => ({ error: null, needsVerification: false }),
  resendVerification: async () => null,
  signInWithGoogle: async () => null,
  signOut: async () => null,
  setRole: () => {},
  verify: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const sessionRef = useRef<Session>(null);
  sessionRef.current = session;

  const fromUser = useCallback((user: User): Session | null => {
    if (!user.email || !user.email_confirmed_at) return null;
    const current = sessionRef.current;
    return {
      email: user.email,
      emailVerified: true,
      provider: user.app_metadata.provider ?? user.identities?.[0]?.provider ?? "email",
      role: current?.email === user.email ? current.role : null,
      verified: current?.email === user.email ? current.verified : false,
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const next = data.session?.user ? fromUser(data.session.user) : null;
      setSession(next);
      if (data.session && !next) void supabase.auth.signOut();
    });

    const { data } = supabase.auth.onAuthStateChange((_event, authSession) => {
      const next = authSession?.user ? fromUser(authSession.user) : null;
      setSession(next);
      if (authSession && !next) {
        window.setTimeout(() => void supabase.auth.signOut(), 0);
      }
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [fromUser]);

  const value = useMemo(
    () => ({
      session,
      loginOpen,
      setLoginOpen,
      signIn: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) setLoginOpen(false);
        return error;
      },
      signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) return { error, needsVerification: false };
        if (data.session) await supabase.auth.signOut();
        return { error: null, needsVerification: true };
      },
      resendVerification: async (email: string) => {
        const { error } = await supabase.auth.resend({ type: "signup", email });
        return error;
      },
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        return error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) setSession(null);
        return error;
      },
      setRole: (role: Role) =>
        setSession((current) =>
          current ? { ...current, role, verified: !VERIFIED_ROLES.includes(role) } : current,
        ),
      verify: () => setSession((current) => (current ? { ...current, verified: true } : null)),
    }),
    [session, loginOpen],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
