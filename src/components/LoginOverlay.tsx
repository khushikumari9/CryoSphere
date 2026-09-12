import { Snowflake, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useSession } from "@/lib/portal-state";

export function LoginOverlay() {
  const {
    loginOpen,
    setLoginOpen,
    signIn,
    signUp,
    resendVerification,
    signInWithGoogle,
  } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);

  useEffect(() => {
    if (!loginOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLoginOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, setLoginOpen]);

  if (!loginOpen) return null;

  const authError = (errorMessage: string) => {
    const normalized = errorMessage.toLowerCase();
    if (normalized.includes("invalid login")) return "The email or password is incorrect.";
    if (normalized.includes("already registered")) return "This email is already registered.";
    if (normalized.includes("email not confirmed")) return "Please verify your email before logging in.";
    if (normalized.includes("rate limit")) return "Too many attempts. Please wait and try again.";
    return "Authentication failed. Please check your details and try again.";
  };

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
        <h2 className="mt-5 text-2xl font-bold">
          {verificationPending ? "Check your email" : mode === "login" ? "Enter the portal" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {verificationPending
            ? "Please verify your email before logging in."
            : "Sign in to unlock role-tailored polar datasets, expeditions and dashboards."}
        </p>

        {verificationPending ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              We sent a verification link to <strong className="text-foreground">{email}</strong>.
            </p>
            {message && <p className="text-sm text-accent">{message}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError("");
                const resendError = await resendVerification(email);
                setMessage(resendError ? "" : "Verification email resent.");
                if (resendError) setError(authError(resendError.message));
                setLoading(false);
              }}
              className="bg-brand glow w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
            >
              {loading ? "Sending…" : "Resend verification email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setVerificationPending(false);
                setMode("login");
                setMessage("");
                setError("");
              }}
              className="w-full text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Return to login
            </button>
          </div>
        ) : (
        <>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {message && <p className="mt-4 text-sm text-accent">{message}</p>}
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setMessage("");
            if (mode === "signup" && password !== confirmPassword) {
              setError("Passwords do not match.");
              return;
            }
            setLoading(true);
            const result =
              mode === "login"
                ? { error: await signIn(email.trim(), password), needsVerification: false }
                : await signUp(email.trim(), password);
            if (result.error) setError(authError(result.error.message));
            else if (mode === "signup" && result.needsVerification) setVerificationPending(true);
            setLoading(false);
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
          {mode === "signup" && (
            <label className="block text-sm font-medium">
              Confirm Password
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand glow w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        {mode === "login" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setError("");
                setLoading(true);
                const oauthError = await signInWithGoogle();
                if (oauthError) {
                  setError(authError(oauthError.message));
                  setLoading(false);
                }
              }}
              className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-70"
            >
              Continue with Google
            </button>
          </>
        )}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setMessage("");
            }}
            className="font-semibold text-accent hover:underline"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
