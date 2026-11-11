import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCookie } from "@/context/cookie";

const W = 390;
const H = 390;
const ZONE_H = 480;

const COOKIE_ACTION = {
  key: "cookie", src: "/img/charizard/cookie.webm", weight: 0, moves: false,
  diagonal: false, yMin: 0, yMax: 1, speed: 0, stay: [10000, 10000], scale: 1.0,
};

const ACTIONS = [
  { key: "fly",          src: "/img/charizard/fly.webm",          weight: 40, moves: true,  diagonal: true,  yMin: 0.0, yMax: 0.8,  speed: 50,  stay: [5000, 7500],   scale: 1.3  },
  { key: "walk",         src: "/img/charizard/walk.webm",         weight: 22, moves: true,  diagonal: false, yMin: 0.5, yMax: 1.0,  speed: 20,  stay: [5000, 7500],   scale: 1.0  },
  { key: "idle",         src: "/img/charizard/idle.webm",         weight: 18, moves: false, diagonal: false, yMin: 0.0, yMax: 0.9,  speed: 0,   stay: [6000, 10000],  scale: 0.85 },
  { key: "flamethrower", src: "/img/charizard/flamethrower.webm", weight: 12, moves: false, diagonal: false, yMin: 0.0, yMax: 0.8,  speed: 0,   stay: [6000, 9000],   scale: 1.0  },
  { key: "sleep",        src: "/img/charizard/sleep.webm",        weight:  8, moves: false, diagonal: false, yMin: 0.4, yMax: 1.0,  speed: 0,   stay: [10000, 18000], scale: 1.0  },
];

const BUBBLES = {
  fly:          "🔥",
  walk:         "👋",
  idle:         "😊",
  flamethrower: "💥",
  sleep:        "💤",
  cookie:       "🍪",
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
    style={{ top: "8px", left: "50%", x: "-50%", zIndex: 30 }}
  >
    <div
      className="relative rounded-2xl px-4 py-2 text-3xl shadow-lg"
      style={{ background: "rgb(var(--c-fg))", whiteSpace: "nowrap" }}
    >
      {emoji}
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
  const wrapRef   = useRef(null);
  const spriteRef = useRef(null);
  const posRef    = useRef(null);
  const timerRef  = useRef(null);
  const eatingRef = useRef(false);

  const [action,  setAction]  = useState(ACTIONS[0]);
  const [pos,     setPos]     = useState({ x: -400, y: 0 });
  const [moveDur, setMoveDur] = useState(0.5);
  const [facing,  setFacing]  = useState(1);
  const [hovered, setHovered] = useState(false);

  const { holding, charliePosRef, setOnFed } = useCookie();

  // Keep charliePosRef in sync so cookie context knows where Charlie is
  useEffect(() => {
    const update = () => {
      if (spriteRef.current) {
        charliePosRef.current = spriteRef.current.getBoundingClientRect();
      }
      animId = requestAnimationFrame(update);
    };
    let animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [charliePosRef]);

  const tick = useCallback(() => {
    if (eatingRef.current) return;
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

  // Register the "fed" callback — must be after tick is defined
  useEffect(() => {
    setOnFed(() => {
      eatingRef.current = true;
      clearTimeout(timerRef.current);
      setAction(COOKIE_ACTION);
      setHovered(true);
      timerRef.current = setTimeout(() => {
        eatingRef.current = false;
        setHovered(false);
        tick();
      }, COOKIE_ACTION.stay[0]);
    });
  }, [setOnFed, tick]);

  // When holding a cookie, make Charlie glow/pulse to hint you should bring it to him
  const holdingHighlight = holding && !eatingRef.current;

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
        <div ref={spriteRef} className="relative" style={{ width: W, height: H }}>
          <AnimatePresence>
            {(hovered || eatingRef.current) && (
              <SpeechBubble key={action.key} emoji={BUBBLES[action.key] || "😊"} />
            )}
          </AnimatePresence>

          <div
            style={{
              width: W, height: H,
              transform: `scaleX(${facing})`,
              transformOrigin: "center",
              pointerEvents: "auto",
              filter: holdingHighlight ? "drop-shadow(0 0 20px rgba(255, 180, 50, 0.7))" : "none",
              transition: "filter 0.3s ease",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { if (!eatingRef.current) setHovered(false); }}
          >
            <div className="relative" style={{ width: W, height: H }}>
              <AnimatePresence mode="sync">
                <motion.video
                  key={action.key}
                  autoPlay
                  loop={action.key !== "cookie"}
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
