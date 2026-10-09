import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, BookOpen, Clapperboard, MapPin, Users, UtensilsCrossed,
  MessageSquare, Gamepad2, Volleyball, Archive, GraduationCap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { GlowCard } from "@/components/ui-kit";
import { EASE } from "@/components/motion";
import { getLenis } from "@/lib/lenis";
import { ME_MAP } from "@/data/content";

const ICONS = {
  music: Music,
  books: BookOpen,
  movies: Clapperboard,
  places: MapPin,
  people: Users,
  food: UtensilsCrossed,
  yap: MessageSquare,
  gaming: Gamepad2,
  hobbies: Volleyball,
  collect: Archive,
  learn: GraduationCap,
};

const N = ME_MAP.length;
const NODES = ME_MAP.map((_, i) => {
  const angle = (-90 + (i * 360) / N) * (Math.PI / 180);
  const r = i % 2 ? 34 : 42;
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
});

const Constellation = ({ active, onSelect }) => (
  <div className="relative aspect-square w-full">
    <motion.div
      aria-hidden
      className="absolute inset-[14%] rounded-full border border-dashed"
      style={{ borderColor: "rgb(var(--c-line) / 0.35)" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      aria-hidden
      className="absolute inset-[30%] rounded-full border border-dashed"
      style={{ borderColor: "rgb(var(--c-line) / 0.25)" }}
      animate={{ rotate: -360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />

    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden>
      <polygon
        points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke="rgb(var(--c-line) / 0.18)"
        strokeWidth="0.25"
      />
      {NODES.map((n, i) => (
        <line key={i} x1="50" y1="50" x2={n.x} y2={n.y} stroke="rgb(var(--c-line) / 0.22)" strokeWidth="0.25" />
      ))}
      <motion.line
        key={active}
        x1="50" y1="50" x2={NODES[active].x} y2={NODES[active].y}
        stroke="rgb(var(--c-accent))"
        strokeWidth="0.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
    </svg>

    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
      <div className="relative w-20 h-20 grid place-items-center rounded-full bg-fg text-canvas font-display font-bold text-xl">
        ME
      </div>
    </div>

    {ME_MAP.map((c, i) => {
      const Icon = ICONS[c.key];
      const isActive = i === active;
      return (
        <div
          key={c.key}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${NODES[i].x}%`, top: `${NODES[i].y}%` }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.2 + (i % 4) * 0.45, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={c.label}
              aria-pressed={isActive}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: isActive ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`group relative w-12 h-12 grid place-items-center rounded-full border transition-colors duration-300 ${
                isActive
                  ? "bg-accent border-accent text-canvas shadow-[0_0_30px_-4px_rgb(var(--c-accent)/0.7)]"
                  : "bg-card border-line/60 text-ink hover:border-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity duration-300 ${
                  isActive ? "opacity-100 text-accent" : "opacity-0 group-hover:opacity-100 text-dim"
                }`}
              >
                {c.label}
              </span>
            </motion.button>
          </motion.div>
        </div>
      );
    })}
  </div>
);

const Chips = ({ active, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {ME_MAP.map((c, i) => {
      const Icon = ICONS[c.key];
      const isActive = i === active;
      return (
        <button
          key={c.key}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={isActive}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[15px] transition-colors duration-300 ${
            isActive ? "bg-accent border-accent text-canvas" : "bg-pill/60 border-line/70 text-ink"
          }`}
        >
          <Icon className="w-4 h-4" />
          {c.label}
        </button>
      );
    })}
  </div>
);

const Detail = ({ index }) => {
  const c = ME_MAP[index];
  const Icon = ICONS[c.key];
  return (
    <motion.div
      key={c.key}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 text-accent/10"
        initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <Icon className="w-56 h-56" strokeWidth={1} />
      </motion.div>

      <div className="relative">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-line/50" />
          <span>{String(N).padStart(2, "0")}</span>
        </div>

        <h3 className="mt-4 font-display font-bold text-3xl md:text-5xl text-fg leading-tight">{c.label}</h3>
        <p className="mt-3 text-lg md:text-xl text-accent">{c.tagline}</p>

        <div className="mt-6 space-y-4 text-lg text-ink/85 leading-relaxed">
          {c.why.map((p, j) => <p key={j}>{p}</p>)}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {c.items.map((it, j) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 + j * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-line/40 bg-pill/30 p-4 transition-colors duration-300 hover:border-accent/60"
            >
              <p className="text-fg font-semibold">{it.name}</p>
              <p className="mt-1 text-[15px] text-dim">{it.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const MeMap = () => {
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);

  const go = (i) => {
    setActive((i + N) % N);
    const el = panelRef.current;
    if (el && el.getBoundingClientRect().top < 0) getLenis()?.scrollTo(el, { offset: -120 });
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-8 lg:gap-14 items-start">
      <div className="hidden lg:block lg:sticky lg:top-28">
        <Constellation active={active} onSelect={go} />
      </div>
      <div className="lg:hidden">
        <Chips active={active} onSelect={go} />
      </div>

      <div ref={panelRef}>
        <GlowCard className="p-7 md:p-10 min-h-[520px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Detail key={active} index={active} />
            </AnimatePresence>
          </div>

          <div className="relative mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous"
              className="w-11 h-11 grid place-items-center rounded-full border border-line/60 text-fg transition-colors duration-300 hover:bg-fg hover:text-canvas"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {ME_MAP.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={c.label}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-accent" : "w-1.5 bg-line/60 hover:bg-dim"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next"
              className="w-11 h-11 grid place-items-center rounded-full border border-line/60 text-fg transition-colors duration-300 hover:bg-fg hover:text-canvas"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};
