import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const Cursor = () => {
  const [enabled] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 32 });
  const sy = useSpring(y, { stiffness: 350, damping: 32 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => setHover(!!e.target.closest?.("a, button, [data-cursor]"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-[90] pointer-events-none mix-blend-difference"
    >
      <motion.div
        animate={{ scale: hover ? 1.9 : 1, opacity: hover ? 1 : 0.7 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="-ml-5 -mt-5 w-10 h-10 rounded-full border border-[#fdf0d5] bg-[#fdf0d5]/10"
      />
    </motion.div>
  );
};
