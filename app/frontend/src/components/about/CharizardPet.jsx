import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Tune these to match your actual GIF dimensions ───────────────────────────
const SPRITE_W = 96;  // px
const SPRITE_H = 96;  // px
// ─────────────────────────────────────────────────────────────────────────────

const ACTIONS = [
  // key            src                                    weight  moves  yMin  yMax  speed(px/s)  stayMs
  { key: "fly",          src: "/img/charizard/fly.gif",          w: 40, moves: true,  yMin: 0.00, yMax: 0.60, speed: 160, stay: [1500, 3000] },
  { key: "walk",         src: "/img/charizard/walk.gif",         w: 22, moves: true,  yMin: 0.65, yMax: 1.00, speed: 65,  stay: [1500, 2500] },
  { key: "idle",         src: "/img/charizard/idle.gif",         w: 18, moves: false, yMin: 0.30, yMax: 0.85, speed: 0,   stay: [2000, 4000] },
  { key: "flamethrower", src: "/img/charizard/flamethrower.gif", w: 12, moves: false, yMin: 0.10, yMax: 0.65, speed: 0,   stay: [2000, 3200] },
  { key: "sleep",        src: "/img/charizard/sleep.gif",        w: 8,  moves: false, yMin: 0.70, yMax: 1.00, speed: 0,   stay: [4000, 8000] },
];

const TOTAL = ACTIONS.reduce((s, a) => s + a.w, 0);
const rand  = (lo, hi) => lo + Math.random() * (hi - lo);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const pick = () => {
  let r = Math.random() * TOTAL;
  for (const a of ACTIONS) { r -= a.w; if (r <= 0) return a; }
  return ACTIONS[0];
};

export const CharizardPet = () => {
  const wrapRef  = useRef(null);
  const posRef   = useRef(null);   // null until first tick
  const timerRef = useRef(null);

  const [action,  setAction]  = useState(ACTIONS[0]);
  const [pos,     setPos]     = useState({ x: -200, y: 0 }); // off-screen until first tick
  const [moveDur, setMoveDur] = useState(0.5);
  const [facing,  setFacing]  = useState(1); // 1 = right, -1 = left (mirrors the sprite)

  const tick = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const maxX = wrap.offsetWidth  - SPRITE_W;
    const maxY = wrap.offsetHeight - SPRITE_H;
    if (maxX <= 0 || maxY <= 0) { timerRef.current = setTimeout(tick, 400); return; }

    // Place at a sensible starting position on first tick
    if (!posRef.current) {
      const sx = clamp(rand(maxX * 0.2, maxX * 0.8), 0, maxX);
      const sy = clamp(rand(maxY * 0.2, maxY * 0.6), 0, maxY);
      posRef.current = { x: sx, y: sy };
      setPos({ x: sx, y: sy });
    }

    const a   = pick();
    const cur = posRef.current;
    let tx    = cur.x;
    let ty    = clamp(rand(a.yMin * maxY, a.yMax * maxY), 0, maxY);
    let dur   = 0.8;

    if (a.moves) {
      tx  = clamp(rand(0, maxX), 0, maxX);
      const dist = Math.hypot(tx - cur.x, ty - cur.y);
      dur = Math.max(0.8, dist / a.speed);
      // Only update facing for meaningful horizontal movement
      if (Math.abs(tx - cur.x) > 8) setFacing(tx > cur.x ? 1 : -1);
    } else {
      // Gentle drift to the new Y band only
      dur = 1.0;
    }

    posRef.current = { x: tx, y: ty };
    setPos({ x: tx, y: ty });
    setMoveDur(dur);
    setAction(a);

    const stayMs = rand(a.stay[0], a.stay[1]);
    timerRef.current = setTimeout(tick, dur * 1000 + stayMs);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(tick, 700);
    return () => clearTimeout(timerRef.current);
  }, [tick]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-64 md:h-80 select-none pointer-events-none overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute z-20"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ duration: moveDur, ease: "easeInOut" }}
      >
        {/* key changes on action switch → forces img remount → GIF restarts cleanly */}
        <img
          key={action.key}
          src={action.src}
          alt=""
          width={SPRITE_W}
          height={SPRITE_H}
          draggable={false}
          style={{
            imageRendering: "pixelated",
            transform: `scaleX(${facing})`,
            transformOrigin: "center",
          }}
        />
      </motion.div>
    </div>
  );
};
