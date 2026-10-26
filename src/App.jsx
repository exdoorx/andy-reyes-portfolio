import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Certifications from "./components/sections/Certifications";
import Brands from "./components/sections/Brands";
import Playground from "./components/sections/Playground";
import Engineering from "./components/sections/Engineering";
import Contact from "./components/sections/Contact";
import useTheme from "./hooks/useTheme";

export default function App() {
  const { dark, toggleDark } = useTheme();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar dark={dark} toggleDark={toggleDark} />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Brands />
        <Playground />
        <Engineering />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
