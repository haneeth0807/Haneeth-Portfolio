import { useRef, useEffect } from "react";
import { motion, animate, useInView } from "framer-motion";
import { BookOpen, Headphones, Flame, Lightbulb, Target, Coffee } from "lucide-react";
import { GlowCard, Eyebrow } from "@/components/ui-kit";
import { Reveal, EASE } from "@/components/motion";
import { NOW } from "@/data/content";

// Continuously bobbing icon wrapper — different duration per card for variety
const Float = ({ children, duration = 2.4, distance = 5 }) => (
  <motion.div
    animate={{ y: [0, -distance, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// Flame that flickers and sways
const FlickerFlame = () => (
  <motion.div
    animate={{ scale: [1, 1.12, 0.93, 1.07, 1], rotate: [0, 4, -3, 2, 0] }}
    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    className="hidden sm:block"
  >
    <Flame className="w-14 h-14 text-accent/35 shrink-0" strokeWidth={1.2} />
  </motion.div>
);

// Animated equalizer bars
const SoundBars = () => (
  <div className="flex items-end gap-[3px] h-8 shrink-0">
    {[null, null, null, null, null, null, null].map((_, i) => (
      <span
        key={i}
        className="w-[3px] h-full rounded-full bg-accent"
        style={{
          transformOrigin: "bottom",
          animation: `soundbar ${0.38 + i * 0.09}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.06}s`,
        }}
      />
    ))}
  </div>
);

// Pulsing live dot
const PulseDot = () => (
  <span className="relative flex h-2.5 w-2.5 shrink-0">
    <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
  </span>
);

// Blinking text cursor
const BlinkCursor = () => (
  <span className="inline-block w-[2px] h-[1em] bg-fg/60 ml-0.5 align-text-bottom animate-pulse" />
);

// SVG progress ring — useRef + useInView + animate (same pattern as Counter)
const ProgressRing = ({ pct }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const circleRef = useRef(null);
  const inView = useInView(circleRef, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !circleRef.current) return;
    animate(circleRef.current, { strokeDashoffset: circ * (1 - pct / 100) }, {
      duration: 1.6, ease: EASE, delay: 0.3,
    });
  }, [inView, circ, pct]);

  return (
    <Float duration={3} distance={4}>
      <svg width="40" height="40" className="-rotate-90 shrink-0">
        <circle cx="20" cy="20" r={r} strokeWidth="2.5" className="stroke-line/40 fill-none" />
        <circle
          ref={circleRef}
          cx="20" cy="20" r={r} strokeWidth="2.5"
          className="stroke-accent fill-none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
        />
      </svg>
    </Float>
  );
};

// Strikethrough — scaleX from origin-left on inline-block container
const StrikeThrough = ({ text }) => (
  <span className="relative inline-block">
    {text}
    <motion.span
      className="absolute left-0 top-1/2 h-[1.5px] w-full bg-fg/55 -translate-y-1/2 origin-left"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: EASE, delay: 0.5 }}
    />
  </span>
);

// Spring entrance for hero cards — bouncier than the smooth Reveal
const SpringReveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 36, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", damping: 15, stiffness: 100, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const val = "mt-2 text-lg md:text-xl text-fg font-semibold leading-snug";

export const NowSection = () => (
  <div>
    <div className="mb-6 flex items-center gap-2.5">
      <PulseDot />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
        Last updated — {NOW.updated}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

      {/* Reading */}
      <Reveal className="lg:col-span-3">
        <GlowCard className="lift h-full p-6 md:p-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Currently reading</Eyebrow>
            <Float duration={2.8} distance={5}>
              <BookOpen className="w-5 h-5 text-dim" />
            </Float>
          </div>
          <p className={val}>{NOW.reading}</p>
        </GlowCard>
      </Reveal>

      {/* Listening */}
      <Reveal delay={0.08} className="lg:col-span-3">
        <GlowCard className="lift h-full p-6 md:p-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Currently listening to</Eyebrow>
            <Float duration={1.9} distance={4}>
              <Headphones className="w-5 h-5 text-dim" />
            </Float>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p className={val}>{NOW.listening}</p>
            <SoundBars />
          </div>
        </GlowCard>
      </Reveal>

      {/* Obsessed — hero, spring entrance + flickering flame */}
      <SpringReveal delay={0.06} className="md:col-span-2 lg:col-span-6">
        <GlowCard
          className="lift p-7 md:p-10 flex flex-col sm:flex-row sm:items-center gap-6"
          style={{ background: "linear-gradient(135deg, rgb(var(--c-card) / 0.95) 0%, rgb(var(--c-glow) / 0.3) 100%)" }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <PulseDot />
              <Eyebrow className="!text-accent">Currently obsessed with</Eyebrow>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-fg leading-snug">
              {NOW.obsessed}
            </p>
          </div>
          <FlickerFlame />
        </GlowCard>
      </SpringReveal>

      {/* Learning — ring draws in on scroll */}
      <Reveal delay={0.06} className="lg:col-span-2">
        <GlowCard className="lift h-full p-6 md:p-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Currently learning</Eyebrow>
            <ProgressRing pct={45} />
          </div>
          <p className={val}>{NOW.learning}</p>
        </GlowCard>
      </Reveal>

      {/* Thinking about — blinking cursor */}
      <Reveal delay={0.12} className="lg:col-span-2">
        <GlowCard className="lift h-full p-6 md:p-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Currently thinking about</Eyebrow>
            <Float duration={3.2} distance={7}>
              <Lightbulb className="w-5 h-5 text-dim" />
            </Float>
          </div>
          <p className={val}>{NOW.thinking}<BlinkCursor /></p>
        </GlowCard>
      </Reveal>

      {/* Trying to */}
      <Reveal delay={0.18} className="lg:col-span-2">
        <GlowCard className="lift h-full p-6 md:p-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Eyebrow>Currently trying to</Eyebrow>
            <Float duration={2.2} distance={5}>
              <Target className="w-5 h-5 text-dim" />
            </Float>
          </div>
          <p className={val}>{NOW.trying}</p>
        </GlowCard>
      </Reveal>

      {/* Avoiding — spring entrance + animated strikethrough */}
      <SpringReveal delay={0.1} className="md:col-span-2 lg:col-span-6">
        <GlowCard className="lift p-6 md:p-7 flex items-center gap-6 border-line/20">
          <Float duration={2.6} distance={6}>
            <Coffee className="w-9 h-9 text-dim shrink-0" strokeWidth={1.5} />
          </Float>
          <div>
            <Eyebrow>Currently avoiding</Eyebrow>
            <p className={`${val} mt-1`}><StrikeThrough text={NOW.avoiding} /></p>
          </div>
        </GlowCard>
      </SpringReveal>

    </div>
  </div>
);
