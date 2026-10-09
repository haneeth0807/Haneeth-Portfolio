import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Reveal } from "@/components/motion";

export const GlowCard = ({ children, className = "", ...rest }) => {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={onMove} className={`glow-card ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const Tag = ({ children, ...rest }) => (
  <span
    className="inline-flex items-center rounded-full border border-line/70 bg-pill/60 px-3.5 py-1 text-[15px] text-ink transition-colors duration-300 hover:bg-fg hover:text-canvas hover:border-fg"
    {...rest}
  >
    {children}
  </span>
);

export const SectionTitle = ({ children, sub, testId }) => (
  <Reveal className="mb-8 md:mb-10">
    <h2 data-testid={testId} className="group flex items-center gap-2 font-body font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-fg">
      {children}
      <motion.span initial={{ x: -8, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
        <ArrowRight className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
      </motion.span>
    </h2>
    {sub && <p className="mt-2 max-w-2xl text-base md:text-lg text-dim">{sub}</p>}
  </Reveal>
);

export const Eyebrow = ({ children, className = "" }) => (
  <p className={`font-mono text-[11px] uppercase tracking-[0.25em] text-accent ${className}`}>{children}</p>
);

export const Counter = ({ to, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (x) => setVal(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
};