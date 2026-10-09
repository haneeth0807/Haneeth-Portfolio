import { Fragment, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/content";

const Star = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 text-accent shrink-0" fill="currentColor" aria-hidden>
    <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
  </svg>
);

const Cross = () => (
  <svg viewBox="0 0 16 16" className="w-3 h-3 text-dim shrink-0" fill="currentColor" aria-hidden>
    <path d="M7 0h2v7h7v2H9v7H7V9H0V7h7Z" />
  </svg>
);

const Diamond = () => (
  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-fg/40 shrink-0" fill="currentColor" aria-hidden>
    <path d="M12 0l12 12-12 12L0 12z" />
  </svg>
);

const SEPS = [Star, Cross, Diamond];

const PhotoRow = ({ photos, reverse, speed }) => {
  const doubled = [...photos, ...photos];
  const trackRef = useRef(null);

  // After images load, confirm the row is wide enough to loop correctly.
  // If not (happens on SPA navigation before images paint), force a CSS
  // animation restart by briefly removing then re-applying the animation.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const restart = () => {
      track.style.animation = "none";
      // Trigger a reflow so the browser registers the removal
      void track.offsetWidth;
      track.style.animation = `${reverse ? "photo-marquee-rev" : "photo-marquee"} ${speed} linear infinite`;
    };
    const images = Array.from(track.querySelectorAll("img"));
    const pending = images.filter((img) => !img.complete);
    if (pending.length === 0) {
      restart();
    } else {
      let loaded = 0;
      const onLoad = () => { if (++loaded === pending.length) restart(); };
      pending.forEach((img) => img.addEventListener("load", onLoad, { once: true }));
      return () => pending.forEach((img) => img.removeEventListener("load", onLoad));
    }
  }, [reverse, speed]);

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center gap-5 w-max"
        style={{
          animation: `${reverse ? "photo-marquee-rev" : "photo-marquee"} ${speed} linear infinite`,
        }}
      >
        {doubled.map((src, i) => {
          const Sep = SEPS[i % SEPS.length];
          return (
            <Fragment key={i}>
              <div className="relative h-44 md:h-56 shrink-0 rounded-2xl overflow-hidden border border-line/40 group cursor-pointer">
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="h-full w-auto block transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-colors duration-500" />
              </div>
              <Sep />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const PhotoGallery = () => {
  const third = Math.ceil(GALLERY.length / 3);
  const rows = [
    GALLERY.slice(0, third),
    GALLERY.slice(third, third * 2),
    GALLERY.slice(third * 2),
  ];

  // `tick` flips once after the page-transition curtain lifts (~950ms).
  // Changing the key on each PhotoRow forces a clean remount so the
  // animation starts with the final rendered width, not the pre-paint width.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setTick(1), 950);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="-rotate-[1deg] border-y border-line/30 bg-card/20 backdrop-blur-sm py-7 space-y-5 overflow-hidden">
      <PhotoRow key={`r0-${tick}`} photos={rows[0]} reverse={false} speed="38s" />
      <PhotoRow key={`r1-${tick}`} photos={rows[1]} reverse={true}  speed="30s" />
      <PhotoRow key={`r2-${tick}`} photos={rows[2]} reverse={false} speed="44s" />
    </div>
  );
};
