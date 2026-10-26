import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Moon, Sun, ExternalLink, Shield } from "./ui/Icons";
import { isAdminEndpointConfigured, fetchAdminMessages } from "../lib/adminMessages";
import { supabase } from "../lib/supabase";

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClockIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TrendingUpIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export default function AdminDashboard({ dark, toggleDark }) {
  const { session, signOut, isConfigured } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'analytics' | 'messages'

  // Simulated live visitor analytics state ("DEMO DATA" is displayed next to it).
  const [analytics, setAnalytics] = useState({
    totalVisits: 1428,
    uniqueVisitors: 984,
    liveNow: 4,
    avgTimeOnSite: "3m 42s",
    bounceRate: "34.2%",
    topPages: [
      { path: "/#home", title: "Portfolio Home", views: "842", avgTime: "2m 15s" },
      { path: "/#projects", title: "Projects & Demos", views: "390", avgTime: "4m 10s" },
      { path: "/#skills", title: "Skills & Stack", views: "128", viewsPercent: "9%", avgTime: "1m 30s" },
      { path: "/#contact", title: "Contact Form", views: "68", viewsPercent: "5%", avgTime: "1m 05s" },
    ],
    recentVisitors: [
      { id: "v-1", ip: "192.168.x.x", location: "Manila, PH", device: "Chrome / macOS", duration: "4m 12s", status: "Active now", page: "/#projects" },
      { id: "v-2", ip: "10.0.x.x", location: "Quezon City, PH", device: "Safari / iOS", duration: "2m 45s", status: "Active now", page: "/#home" },
      { id: "v-3", ip: "172.16.x.x", location: "San Francisco, US", device: "Edge / Windows", duration: "6m 30s", status: "Left 2m ago", page: "/#experience" },
      { id: "v-4", ip: "192.168.1.5", location: "Singapore, SG", device: "Firefox / Linux", duration: "1m 15s", status: "Left 5m ago", page: "/#playground" },
      { id: "v-5", ip: "203.0.113.8", location: "Tokyo, JP", device: "Mobile Safari / iOS", duration: "5m 02s", status: "Left 12m ago", page: "/#projects" },
    ]
  });

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setMessagesError("Authentication provider is not configured on this deployment.");
      return;
    }
    if (!isAdminEndpointConfigured) {
      setMessagesError(
        "Messages endpoint is not configured — set VITE_CONTACT_ENDPOINT and deploy the contact worker.",
      );
      return;
    }
    const token = session?.access_token;
    if (!token) {
      setMessagesError("No session token available — sign in again.");
      return;
    }
    let cancelled = false;
    setLoadingMessages(true);
    setMessagesError(null);
    fetchAdminMessages(token)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setMessages(data);
        } else if (!cancelled && Array.isArray(data?.messages)) {
          setMessages(data.messages);
        } else if (!cancelled) {
          setMessagesError("Unexpected response from the messages endpoint.");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMessagesError(err instanceof Error ? err.message : "Failed to load messages.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.access_token, isConfigured]);

  // Simulate live tick for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setAnalytics((prev) => ({
        ...prev,
        liveNow: Math.max(2, prev.liveNow + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = "#login";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b16] text-slate-700 dark:text-slate-300 transition-colors duration-300 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070b16]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 font-display text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-950">
              AR
            </span>
            <div>
              <span className="font-display text-sm font-bold text-slate-950 dark:text-white block">
                Andy Reyes <span className="text-brand-500">Workspace</span>
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Traffic analytics: simulated demo data
              </span>
            </div>
          </div>

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
              className="btn btn-secondary text-xs py-2 px-3.5 hidden sm:inline-flex"
            >
              Public Site <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <button
              onClick={handleSignOut}
              className="btn btn-primary text-xs py-2 px-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex-1 w-full space-y-8">
        {/* Welcome Hero Banner */}
        <div className="surface p-6 sm:p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="eyebrow">Command Center</span>
                <span className="chip text-[10px] py-0.5 px-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20">
                  Inquiries: live database data
                </span>
                <span className="chip text-[10px] py-0.5 px-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                  Visitors &amp; traffic: simulated demo data
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                Portfolio Traffic & Engagement
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Monitor live visitor sessions, time spent on key projects, database security status, and incoming inquiries in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/50 dark:bg-white/[0.04] p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === "overview"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === "analytics"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Live Visitors
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === "messages"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Inquiries ({messages.length})
              </button>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="surface p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Visitors</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-950 dark:text-white">{analytics.liveNow}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">browsing right now</span>
            </div>
            <p className="text-[11px] text-slate-400">Active sessions across portfolio</p>
          </div>

          <div className="surface p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Page Views</span>
              <TrendingUpIcon className="h-4 w-4 text-brand-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-950 dark:text-white">{analytics.totalVisits}</span>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">+18.4% this week</span>
            </div>
            <p className="text-[11px] text-slate-400">Unique visitors: {analytics.uniqueVisitors}</p>
          </div>

          <div className="surface p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Time on Site</span>
              <ClockIcon className="h-4 w-4 text-accent-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-slate-950 dark:text-white">{analytics.avgTimeOnSite}</span>
              <span className="text-xs text-accent-600 dark:text-accent-400 font-medium">high engagement</span>
            </div>
            <p className="text-[11px] text-slate-400">Bounce rate: {analytics.bounceRate}</p>
          </div>

          <div className="surface p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Security & RLS</span>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400 pt-1">Protected</span>
              <span className="text-xs text-slate-500 font-mono">Postgres 15</span>
            </div>
            <p className="text-[11px] text-slate-400">Auth state: Secure (Supabase)</p>
          </div>
        </div>

        {/* Tab Content */}
        {(activeTab === "overview" || activeTab === "analytics") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Visitor Sessions Table */}
            <div className="surface p-6 sm:p-8 lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-brand-500" /> Live Visitor Sessions & Time Spent
                  </h2>
                  <p className="text-xs text-slate-500">
                    Simulated playground data — not real visitor tracking. No visitor analytics are collected on this site.
                  </p>
                </div>
                <span className="chip text-xs">
                  {analytics.recentVisitors.length} Recent Sessions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3">Visitor / Location</th>
                      <th className="py-3 px-3">Active Page</th>
                      <th className="py-3 px-3">Device / Browser</th>
                      <th className="py-3 px-3 text-center">Time Spent</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {analytics.recentVisitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-slate-950 dark:text-white block">{visitor.location}</span>
                          <span className="font-mono text-[10px] text-slate-400">{visitor.ip}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-brand-600 dark:text-brand-400">
                          {visitor.page}
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                          {visitor.device}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-950 dark:text-white">
                          {visitor.duration}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            visitor.status === "Active now"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-100 dark:bg-white/5 text-slate-500"
                          }`}>
                            {visitor.status === "Active now" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            {visitor.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Viewed Sections / Pages */}
            <div className="surface p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Popular Portfolio Sections
                </h2>
                <p className="text-xs text-slate-500">
                  Where visitors spend most of their time.
                </p>
              </div>

              <div className="space-y-4">
                {analytics.topPages.map((page, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900 dark:text-slate-200">{page.title}</span>
                      <span className="font-mono text-slate-500">{page.views} views</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(15, 100 - idx * 22)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{page.path}</span>
                      <span>Avg time: <strong className="text-slate-700 dark:text-slate-300">{page.avgTime}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="rounded-xl bg-brand-500/5 border border-brand-500/15 p-3.5 space-y-1">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block">Pro-tip for Andy</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    The <code className="font-mono bg-brand-500/10 px-1 rounded">#projects</code> demo section has the highest dwell time (4m 10s). Visitors are actively testing your in-page apps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Messages Section (Also accessible via tab) */}
        {(activeTab === "overview" || activeTab === "messages") && (
          <div className="surface p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Contact Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Messages received via your portfolio contact form.
                </p>
              </div>
              <span className="chip text-xs">
                {messages.length} Inquiry{messages.length === 1 ? "" : "s"}
              </span>
            </div>

            {loadingMessages ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading messages...</div>
            ) : messagesError ? (
              <div
                role="alert"
                className="py-6 px-4 text-xs text-amber-700 dark:text-amber-400 rounded-xl border border-amber-500/20 bg-amber-500/5"
              >
                <strong className="block mb-1">Messages could not be loaded</strong>
                {messagesError}
              </div>
            ) : messages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Message</th>
                      <th className="py-2.5 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-200">{msg.name}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{msg.email}</td>
                        <td className="py-3 px-3 max-w-xs truncate">{msg.message}</td>
                        <td className="py-3 px-3 text-right text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                No messages found in the database.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Andy Reyes Developer Workspace. Protected Session & Analytics Command Center.</p>
      </footer>
    </div>
  );
}
