import { useState, useId } from "react";
import { useAuth } from "./AuthContext";
import { sanitizeHashRedirect } from "../../lib/redirect";
import { Moon, Sun, ArrowRight, Shield } from "../../components/ui/Icons";

function EyeIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function Login({ dark, toggleDark }) {
  const { signIn, resetPassword, isConfigured } = useAuth();
  const [view, setView] = useState("login"); // 'login' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const emailId = useId();
  const passwordId = useId();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      if (!isConfigured) {
        // No demo credentials on any build. Never simulate an authenticated state.
        throw new Error(
          "Admin sign-in is unavailable because the authentication provider is not configured on this deployment.",
        );
      }

      await signIn(email.trim(), password);
      // Success redirect — sanitized to a local hash; user-supplied values can never
      // point to an external origin or a javascript:/data: URI (open-redirect defense).
      const urlParams = new URLSearchParams(window.location.search);
      window.location.hash = sanitizeHashRedirect(urlParams.get("redirect"));
    } catch (err) {
      // Generic message only: avoids account enumeration and never echoes raw
      // provider errors (which can confirm whether an email exists).
      const knownSafe =
        err instanceof Error &&
        (err.message.includes("sign-in is unavailable") ||
          err.message.includes("fill in"));
      setError(
        knownSafe && err.message
          ? err.message
          : "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      if (!isConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setSuccess("Demo mode: If this email exists, a password reset link has been dispatched.");
        return;
      }

      await resetPassword(email.trim());
      setSuccess("Password reset email sent! Please check your inbox for instructions.");
    } catch (err) {
      // Generic failure text — never echo provider diagnostics on an auth workflow.
      setError("Unable to process the password reset request right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-50 dark:bg-[#070b16] text-slate-700 dark:text-slate-300 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-60" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label="Andy Reyes — return to home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-display text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-950">
            AR
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-slate-950 dark:text-white">
            andy<span className="text-brand-500">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleDark}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={dark}
            className="icon-button"
          >
            {dark ? <Sun /> : <Moon />}
          </button>
          <a
            href="#home"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Return to Portfolio <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md surface p-6 sm:p-8 shadow-xl dark:shadow-2xl dark:shadow-black/40 border border-slate-200/80 dark:border-white/10 modal-panel">
          {!isConfigured && (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
              <Shield className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <span className="font-semibold block">Supabase credentials needed</span>
                Set <code className="font-mono bg-amber-500/15 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_URL</code> and <code className="font-mono bg-amber-500/15 px-1 py-0.5 rounded text-[11px]">VITE_SUPABASE_PUBLISHABLE_KEY</code> in your environment.
              </div>
            </div>
          )}

          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4 border border-brand-500/20">
              <LockIcon className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {view === "login" ? "Welcome back." : "Reset password"}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {view === "login"
                ? "Sign in to access your private workspace."
                : "Enter your email address to receive recovery instructions."}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            >
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              {success}
            </div>
          )}

          {view === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <label htmlFor={emailId} className="field-label">
                  Email address
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andy@example.com"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={passwordId} className="field-label !mb-0">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-field pr-11"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2 py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
              <div>
                <label htmlFor={emailId} className="field-label">
                  Email address
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andy@example.com"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <p>© {new Date().getFullYear()} Andy Reyes. Private Developer Workspace.</p>
      </footer>
    </div>
  );
}
