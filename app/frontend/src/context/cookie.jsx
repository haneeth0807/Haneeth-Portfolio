import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CookieCtx = createContext({
  holding: false,
  grab: () => {},
  drop: () => {},
  charliePosRef: { current: null },
  onFed: () => {},
  setOnFed: () => {},
});

export const useCookie = () => useContext(CookieCtx);

const COOKIE_SIZE = 52;

const CursorCookie = ({ onDrop }) => {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - COOKIE_SIZE / 2}px, ${e.clientY - COOKIE_SIZE / 2}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return createPortal(
    <div
      ref={ref}
      onClick={onDrop}
      className="fixed top-0 left-0 z-[100] pointer-events-auto cursor-grab"
      style={{ width: COOKIE_SIZE, height: COOKIE_SIZE }}
    >
      <img
        src="/img/cookie.png"
        alt="cookie"
        width={COOKIE_SIZE}
        height={COOKIE_SIZE}
        draggable={false}
        className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-pulse"
        style={{ imageRendering: "auto" }}
      />
    </div>,
    document.body
  );
};

export const CookieProvider = ({ children }) => {
  const [holding, setHolding] = useState(false);
  const charliePosRef = useRef(null);
  const onFedRef = useRef(null);

  const grab = useCallback(() => setHolding(true), []);
  const drop = useCallback(() => setHolding(false), []);
  const setOnFed = useCallback((fn) => { onFedRef.current = fn; }, []);

  const handleDrop = useCallback(() => {
    if (!charliePosRef.current) { setHolding(false); return; }
    setHolding(false);
    if (onFedRef.current) onFedRef.current();
  }, []);

  return (
    <CookieCtx.Provider value={{ holding, grab, drop, charliePosRef, onFed: handleDrop, setOnFed }}>
      {children}
      {holding && <CursorCookie onDrop={handleDrop} />}
    </CookieCtx.Provider>
  );
};
