import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 28, className = "", as = "div", ...rest }) => {
  const C = motion[as];
  return (
    <C
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </C>
  );
};

export const MaskLine = ({ children, delay = 0, className = "", inView = false }) => {
  const trigger = inView
    ? { whileInView: { y: "0%", rotate: 0 }, viewport: { once: true, margin: "-40px" } }
    : { animate: { y: "0%", rotate: 0 } };
  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}>
      <motion.span
        className="block origin-top-left"
        initial={{ y: "115%", rotate: 4 }}
        {...trigger}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const PageTitle = ({ lines, className = "", delay = 0.6, testId }) => (
  <h1
    data-testid={testId}
    className={`font-display font-bold text-fg tracking-tight leading-[1.04] text-4xl sm:text-5xl lg:text-6xl ${className}`}
  >
    {lines.map((l, i) => (
      <MaskLine key={i} delay={delay + i * 0.12}>{l}</MaskLine>
    ))}
  </h1>
);
