import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlowCard, Eyebrow } from "@/components/ui-kit";
import { Reveal, EASE } from "@/components/motion";
import { STORY } from "@/data/content";

const ArrowBtn = ({ onClick, children, testId, label }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    aria-label={label}
    className="w-12 h-12 shrink-0 grid place-items-center rounded-full border-2 border-fg/80 text-fg transition-[background-color,color,transform] duration-300 hover:bg-fg hover:text-canvas active:scale-90"
  >
    {children}
  </button>
);

export const StoryCarousel = () => {
  const [[idx, dir], setState] = useState([1, 0]);
  const go = (d) => setState(([i]) => [(i + d + STORY.length) % STORY.length, d]);
  const next = STORY[(idx + 1) % STORY.length];
  const cur = STORY[idx];

  return (
    <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_auto_minmax(0,1fr)_auto] gap-5 items-center">
        <GlowCard data-testid="story-preview-card" className="hidden lg:flex h-[320px] p-6 flex-col text-center cursor-pointer" onClick={() => go(1)}>
          <Eyebrow>Up next</Eyebrow>
          <p className="mt-3 text-lg text-fg">{next.title}</p>
          <p className="mt-2 text-sm text-dim">{next.preview}</p>
        </GlowCard>
        <div className="hidden lg:block"><ArrowBtn onClick={() => go(-1)} testId="story-prev-button" label="Previous"><ChevronLeft /></ArrowBtn></div>
        <GlowCard data-testid="story-main-card" className="h-[450px] p-8 md:p-10 pb-16 md:pb-16 relative overflow-x-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: dir >= 0 ? 60 : -60, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir >= 0 ? -60 : 60, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-center h-full flex flex-col"
            >
              <span className="font-mono text-xs text-accent shrink-0">0{idx + 1} / 0{STORY.length}</span>
              <h3 className="mt-3 font-display font-bold text-2xl md:text-3xl text-fg shrink-0">{cur.title}</h3>
              <div className="mt-4 max-w-xl mx-auto space-y-4 text-lg text-dim overflow-y-auto overscroll-contain flex-1 pr-2">
                {[].concat(cur.text).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
            {STORY.map((s, i) => (
              <button key={s.title} data-testid={`story-dot-${i}`} aria-label={s.title} onClick={() => setState([i, i > idx ? 1 : -1])} className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === idx ? "w-8 bg-fg" : "w-3 bg-fg/30"}`} />
            ))}
          </div>
        </GlowCard>
        <div className="flex lg:block justify-center gap-4">
          <span className="lg:hidden"><ArrowBtn onClick={() => go(-1)} testId="story-prev-button-mobile" label="Previous"><ChevronLeft /></ArrowBtn></span>
          <ArrowBtn onClick={() => go(1)} testId="story-next-button" label="Next"><ChevronRight /></ArrowBtn>
        </div>
      </div>
    </Reveal>
  );
};
