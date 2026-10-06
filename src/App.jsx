import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { About, Skills, Projects, Contact, Footer } from "./components/Sections";
import { Experience, Certifications, DataCloud } from "./components/Career";

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    } catch {}
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  return (
    <>
      <Navbar dark={dark} toggleDark={() => setDark(!dark)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <DataCloud />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
