import { useEffect, useRef, useState } from "react";

// Fades and slides children in once they enter the viewport.
export default function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const Tag = as;


  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (shown) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${shown ? "show" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
