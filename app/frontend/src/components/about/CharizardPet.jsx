import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Adjust to your actual GIF pixel dimensions ──────────────────────────────
const W = 160;
const H = 160;
// ─────────────────────────────────────────────────────────────────────────────

const ACTIONS = [
  // diagonal:true  → fly can move on both axes
  // diagonal:false → walk moves horizontally only (ty stays locked)
  { key: "fly",          src: "/img/charizard/fly.gif",          weight: 40, moves: true,  diagonal: true,  yMin: 0.05, yMax: 0.55, speed: 80,  stay: [3000, 6500] },
  { key: "walk",         src: "/img/charizard/walk.gif",         weight: 22, moves: true,  diagonal: false, yMin: 0.60, yMax: 0.92, speed: 32,  stay: [3000, 5500] },
  { key: "idle",         src: "/img/charizard/idle.gif",         weight: 18, moves: false, diagonal: false, yMin: 0.20, yMax: 0.80, speed: 0,   stay: [4000, 8000] },
  { key: "flamethrower", src: "/img/charizard/flamethrower.gif", weight: 12, moves: false, diagonal: false, yMin: 0.10, yMax: 0.60, speed: 0,   stay: [4000, 7000] },
  { key: "sleep",        src: "/img/charizard/sleep.gif",        weight:  8, moves: false, diagonal: false, yMin: 0.65, yMax: 0.95, speed: 0,   stay: [8000, 16000] },
];

const TOTAL = ACTIONS.reduce((s, a) => s + a.weight, 0);
const rand  = (lo, hi) => lo + Math.random() * (hi - lo);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick  = () => {
  let r = Math.random() * TOTAL;
  for (const a of ACTIONS) { r -= a.weight; if (r <= 0) return a; }
  return ACTIONS[0];
};

export const CharizardPet = () => {
  const posRef   = useRef(null);
  const timerRef = useRef(null);

  const [action,  setAction]  = useState(ACTIONS[0]);
  const [pos,     setPos]     = useState({ x: -400, y: 0 }); // off-screen until first tick
  const [moveDur, setMoveDur] = useState(0.5);
  const [facing,  setFacing]  = useState(1); // 1 = right, -1 = left

  const tick = useCallback(() => {
    const maxX = window.innerWidth  - W;
    const maxY = window.innerHeight - H;
    if (maxX <= 0 || maxY <= 0) { timerRef.current = setTimeout(tick, 400); return; }

    // Place at a sane starting position on the very first tick
    if (!posRef.current) {
      const sx = clamp(rand(maxX * 0.2, maxX * 0.8), 0, maxX);
      const sy = clamp(rand(maxY * 0.2, maxY * 0.6), 0, maxY);
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
        // Fly: can change both axes
        ty = clamp(rand(a.yMin * maxY, a.yMax * maxY), 0, maxY);
      }
      // Walk: ty stays exactly the same — purely horizontal movement

      const dist = a.diagonal
        ? Math.hypot(tx - cur.x, ty - cur.y)
        : Math.abs(tx - cur.x);
      dur = Math.max(1.0, dist / a.speed);

      if (Math.abs(tx - cur.x) > 8) setFacing(tx > cur.x ? 1 : -1);
    } else {
      // Non-moving actions: gently drift to the action's preferred Y band
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
    // fixed inset-0: overlays the entire page, only rendered on About route
    // z-[45]: above page content (z-10) but below navbar (z-50)
    <div className="fixed inset-0 z-[45] pointer-events-none" aria-hidden>
      <motion.div
        className="absolute"
        animate={{ x: pos.x, y: pos.y }}
        transition={{ duration: moveDur, ease: "easeInOut" }}
      >
        {/* Separate div for the horizontal flip so it doesn't interfere with position animation */}
        <div style={{ width: W, height: H, transform: `scaleX(${facing})`, transformOrigin: "center" }}>
          {/* Relative container lets both GIFs stack in the same spot during the crossfade */}
          <div className="relative" style={{ width: W, height: H }}>
            <AnimatePresence mode="sync">
              <motion.img
                key={action.key}
                src={action.src}
                alt=""
                width={W}
                height={H}
                draggable={false}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                style={{
                  imageRendering: "pixelated",
                  background: "transparent",
                  display: "block",
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
