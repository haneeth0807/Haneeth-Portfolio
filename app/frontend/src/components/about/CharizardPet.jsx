import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Adjust to your actual sprite dimensions ─────────────────────────────────
const W = 390;
const H = 390;
// ─────────────────────────────────────────────────────────────────────────────

const ZONE_H = 480;

// scale: visual multiplier to normalise character size across animations.
// Walk = 1.0 (baseline). Tune fly/idle/flamethrower until they match.
const ACTIONS = [
  { key: "fly",          src: "/img/charizard/fly.webm",          weight: 40, moves: true,  diagonal: true,  yMin: 0.0, yMax: 0.8,  speed: 50,  stay: [5000, 7500],   scale: 1.3  },
  { key: "walk",         src: "/img/charizard/walk.webm",         weight: 22, moves: true,  diagonal: false, yMin: 0.5, yMax: 1.0,  speed: 20,  stay: [5000, 7500],   scale: 1.0  },
  { key: "idle",         src: "/img/charizard/idle.webm",         weight: 18, moves: false, diagonal: false, yMin: 0.0, yMax: 0.9,  speed: 0,   stay: [6000, 10000],  scale: 0.8  },
  { key: "flamethrower", src: "/img/charizard/flamethrower.webm", weight: 12, moves: false, diagonal: false, yMin: 0.0, yMax: 0.8,  speed: 0,   stay: [6000, 9000],   scale: 1.0  },
  { key: "sleep",        src: "/img/charizard/sleep.webm",        weight:  8, moves: false, diagonal: false, yMin: 0.4, yMax: 1.0,  speed: 0,   stay: [10000, 18000], scale: 1.0  },
];

// Emoji shown in the speech bubble per action
const BUBBLES = {
  fly:          "🔥",
  walk:         "👋",
  idle:         "😊",
  flamethrower: "💥",
  sleep:        "💤",
};

const TOTAL = ACTIONS.reduce((s, a) => s + a.weight, 0);
const rand  = (lo, hi) => lo + Math.random() * (hi - lo);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick  = () => {
  let r = Math.random() * TOTAL;
  for (const a of ACTIONS) { r -= a.weight; if (r <= 0) return a; }
  return ACTIONS[0];
};

const SpeechBubble = ({ emoji }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.4, y: 8 }}
    animate={{ opacity: 1, scale: 1,   y: 0 }}
    exit={{    opacity: 0, scale: 0.4, y: 8 }}
    transition={{ type: "spring", stiffness: 420, damping: 18 }}
    className="absolute pointer-events-none select-none"
    style={{ bottom: "calc(100% + 10px)", left: "50%", x: "-50%", zIndex: 30 }}
  >
    <div
      className="relative rounded-2xl px-4 py-2 text-3xl shadow-lg"
      style={{ background: "rgb(var(--c-fg))", whiteSpace: "nowrap" }}
    >
      {emoji}
      {/* triangle tail */}
      <span
        className="absolute left-1/2 top-full -translate-x-1/2"
        style={{
          width: 0, height: 0,
          borderLeft:   "8px solid transparent",
          borderRight:  "8px solid transparent",
          borderTop:    "8px solid rgb(var(--c-fg))",
        }}
      />
    </div>
  </motion.div>
);

export const CharizardPet = () => {
  const wrapRef  = useRef(null);
  const posRef   = useRef(null);
  const timerRef = useRef(null);

  const [action,  setAction]  = useState(ACTIONS[0]);
  const [pos,     setPos]     = useState({ x: -400, y: 0 });
  const [moveDur, setMoveDur] = useState(0.5);
  const [facing,  setFacing]  = useState(1);
  const [hovered, setHovered] = useState(false);

  const tick = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const maxX = wrap.offsetWidth - W;
    const maxY = wrap.offsetHeight - H;
    if (maxX <= 0 || maxY <= 0) { timerRef.current = setTimeout(tick, 400); return; }

    if (!posRef.current) {
      const sx = clamp(rand(maxX * 0.2, maxX * 0.8), 0, maxX);
      const sy = clamp(rand(maxY * 0.3, maxY * 0.7), 0, maxY);
      posRef.current = { x: sx, y: sy };
      setPos({ x: sx, y: sy });
    }

    const a   = pick();
    const cur = posRef.current;
    let tx    = cur.x;
    let ty    = cur.y;
    let dur   = 1.0;

    if (a.moves) {
      tx = clamp(rand(0, maxX), 0, maxX);
      if (a.diagonal) {
        ty = clamp(rand(a.yMin * maxY, a.yMax * maxY), 0, maxY);
      }
      const dist = a.diagonal ? Math.hypot(tx - cur.x, ty - cur.y) : Math.abs(tx - cur.x);
      dur = Math.max(1.0, dist / a.speed);
      if (Math.abs(tx - cur.x) > 8) setFacing(tx > cur.x ? 1 : -1);
    } else {
      ty  = clamp(rand(a.yMin * maxY, a.yMax * maxY), 0, maxY);
      dur = 1.2;
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
      className="relative w-full select-none pointer-events-none overflow-hidden"
      style={{ height: ZONE_H }}
      aria-hidden
    >
      <motion.div
        className="absolute z-10"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ duration: moveDur, ease: "easeInOut" }}
      >
        {/* W x H wrapper — holds both bubble and sprite so bubble isn't flipped */}
        <div className="relative" style={{ width: W, height: H }}>

          {/* Speech bubble — sits above the sprite, unaffected by facing flip */}
          <AnimatePresence>
            {hovered && <SpeechBubble key={action.key} emoji={BUBBLES[action.key]} />}
          </AnimatePresence>

          {/* Flip container for left/right direction */}
          <div
            style={{ width: W, height: H, transform: `scaleX(${facing})`, transformOrigin: "center", pointerEvents: "auto" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative" style={{ width: W, height: H }}>
              <AnimatePresence mode="sync">
                <motion.video
                  key={action.key}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "linear" }}
                  style={{
                    width: W,
                    height: H,
                    background: "transparent",
                    display: "block",
                    objectFit: "contain",
                    transform: `scale(${action.scale})`,
                    transformOrigin: "center",
                  }}
                >
                  <source src={action.src} type="video/webm" />
                </motion.video>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
