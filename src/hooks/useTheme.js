import { useEffect, useState } from "react";

function getInitialTheme() {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}

export default function useTheme() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Private mode can block storage; the site still works.
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", dark ? "#070b16" : "#f8fafc");
  }, [dark]);

  return { dark, toggleDark: () => setDark((value) => !value) };
}
