import { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

export const Backdrop = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 60);
      my.set((e.clientY / window.innerHeight - 0.5) * 60);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div style={{ y: y1, x: sx }} className="absolute -top-[25%] -right-[15%] w-[75vw] h-[75vw] rounded-full glow-a" />
      <motion.div style={{ y: y2, x: sy }} className="absolute top-[35%] -left-[25%] w-[65vw] h-[65vw] rounded-full glow-b" />
      <div className="absolute inset-0 grid-lines" />
      <div className="absolute inset-0 grain" />
    </div>
  );
};