import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "@/context/theme";

const NeuralSphere = lazy(() => import("@/components/home/NeuralSphere"));

const DESKTOP = "(min-width: 1024px)";

const useIsDesktop = () => {
  const [ok, setOk] = useState(() => window.matchMedia(DESKTOP).matches);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const on = (e) => setOk(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return ok;
};

export const HeroMark = () => {
  const { theme } = useTheme();
  const desktop = useIsDesktop();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 60, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), { stiffness: 60, damping: 16 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="hidden lg:block absolute right-[3%] top-1/2 -translate-y-1/2 w-[30vw] max-w-[440px] aspect-square pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full"
        style={{ perspective: 1200 }}
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="absolute inset-0">
          <div className="absolute inset-0 rounded-full border border-line/40 spin-slow" style={{ transform: "translateZ(-60px)" }}>
            <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-accent" />
          </div>
          <div className="absolute inset-[12%] rounded-full border border-dashed border-fg/20 spin-slower" style={{ transform: "translateZ(-20px)" }} />
          <div className="absolute inset-[22%] rounded-full bg-accent/10 blur-3xl" style={{ transform: "translateZ(-80px)" }} />
          <span className="absolute bottom-[6%] left-[8%] font-mono text-[10px] tracking-[0.3em] uppercase text-dim" style={{ transform: "translateZ(40px)" }}>
            12.97° N · 77.59° E
          </span>
        </motion.div>
        {desktop && (
          <Suspense fallback={null}>
            <NeuralSphere theme={theme} />
          </Suspense>
        )}
      </motion.div>
    </div>
  );
};
