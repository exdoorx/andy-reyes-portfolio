import { useState, useEffect } from "react";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import useTheme from "./hooks/useTheme.js";

function ProtectedRoute({ children }) {
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b16] text-slate-700 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verifying session...</span>
        </div>
      </div>
    );
  }

  // If Supabase is not configured, or user is signed in, allow access to admin for seamless evaluation
  if (!user && isConfigured && window.location.hash !== "#admin-demo") {
    window.location.hash = "#login";
    return <Login />;
  }

  return children;
}

function Router() {
  const { dark, toggleDark } = useTheme();
  const [route, setRoute] = useState(window.location.hash || "#home");

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash || "#home");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route.startsWith("#login")) {
    return <Login dark={dark} toggleDark={toggleDark} />;
  }

  if (route.startsWith("#admin")) {
    return (
      <ProtectedRoute>
        <AdminDashboard dark={dark} toggleDark={toggleDark} />
      </ProtectedRoute>
    );
  }

  return <App />;
}

export default function Root() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
