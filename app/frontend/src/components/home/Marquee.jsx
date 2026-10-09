import { Fragment } from "react";
import { MARQUEE } from "@/data/content";

const Star = () => (
  <svg viewBox="0 0 24 24" className="w-[0.55em] h-[0.55em] text-accent shrink-0" fill="currentColor" aria-hidden>
    <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
  </svg>
);

const Row = () => (
  <div className="flex items-center gap-10 pr-10 shrink-0">
    {MARQUEE.map((w, i) => (
      <Fragment key={w}>
        <span className={i % 2 ? "text-outline" : "text-fg"}>{w}</span>
        <Star />
      </Fragment>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="marquee-wrap relative my-16 md:my-24 -rotate-[1.5deg] border-y border-line/40 bg-card/30 backdrop-blur-sm py-6 md:py-8 overflow-hidden">
    <div className="marquee-track flex w-max font-display font-bold uppercase text-3xl sm:text-5xl lg:text-6xl leading-none whitespace-nowrap">
      <Row />
      <Row />
    </div>
  </section>
);
