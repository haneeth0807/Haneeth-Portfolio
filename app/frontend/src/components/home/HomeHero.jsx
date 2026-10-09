import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { MaskLine, EASE } from "@/components/motion";
import { Eyebrow } from "@/components/ui-kit";
import { HeroMark } from "@/components/home/HeroMark";

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export const HomeHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} data-testid="home-hero" className="relative min-h-[86vh] flex items-center">
      <HeroMark />
      <motion.div style={{ y, opacity }} className="container-x relative">
        <motion.div {...fade(0.5)}>
          <Eyebrow className="mb-6">Portfolio — Vol. 01 / Bengaluru, IN</Eyebrow>
        </motion.div>
        <h1 className="font-display font-bold text-fg tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
          <MaskLine delay={0.7}>
            <span className="text-outline">Hey There!!</span> <span className="text-fg/85">Welcome to</span>
          </MaskLine>
          <MaskLine delay={0.84}>this small little space</MaskLine>
          <MaskLine delay={0.98}>I call mine.</MaskLine>
        </h1>
        <motion.div {...fade(1.3)} className="mt-8 max-w-xl space-y-2 text-base md:text-lg text-ink leading-relaxed">
          <p>My name is Haneeth Raja. Just a random Comp Sci student who loves all things tech.</p>
          <p className="text-dim">This is yet another landing page in the wide web, but one that talks about my story, takes you through my professional journey and contains parts of me.</p>
        </motion.div>
        <motion.div {...fade(1.45)} className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/work" data-testid="hero-view-work-button" className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-canvas font-semibold transition-transform duration-300 hover:scale-[1.04] active:scale-95">
            View My Work <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link to="/contact" data-testid="hero-get-in-touch-button" className="inline-flex items-center rounded-full border-2 border-fg px-6 py-2.5 text-fg font-semibold transition-colors duration-300 hover:bg-fg hover:text-canvas">
            Get In Touch
          </Link>
        </motion.div>
        <motion.div {...fade(1.7)} className="mt-16 flex items-center gap-2 text-sm text-dim">
          Scroll down to explore
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ArrowDown className="w-4 h-4" />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
};