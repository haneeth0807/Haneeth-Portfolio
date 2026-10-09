import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const TiltPhoto = ({ src, alt }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <div data-testid="home-photo" data-cursor onMouseMove={onMove} onMouseLeave={reset} style={{ perspective: 1100 }} className="relative w-full max-w-[340px] mx-auto">
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative aspect-[3/4.4]">
        <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/25 blur-3xl" style={{ transform: "translateZ(-80px)" }} />
        <div className="absolute inset-0 rounded-[2rem] border border-fg/30 translate-x-4 translate-y-4" style={{ transform: "translateZ(-30px) translate(16px,16px)" }} />
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-line/60 bg-[#05080c]" style={{ transform: "translateZ(30px)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(72,178,236,0.35),transparent_60%)]" />
          <img src={src} alt={alt} className="relative w-full h-full object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05080c] to-transparent" />
          <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.25em] uppercase text-[#fdf0d5]/80">HR · 2026</span>
        </div>
      </motion.div>
    </div>
  );
};
