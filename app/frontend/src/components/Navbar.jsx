import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EASE } from "@/components/motion";

export const NAV = [
  { to: "/", label: "Home", id: "home" },
  { to: "/about", label: "About Me", id: "about" },
  { to: "/work", label: "Work", id: "work" },
  { to: "/projects", label: "Projects", id: "projects" },
  { to: "/contact", label: "Contact Me", id: "contact" },
];

const MobileMenu = ({ open, onClose, pathname }) =>
  createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="mobile-menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[55] bg-canvas flex flex-col justify-center px-8 md:hidden"
        >
          {NAV.map((l, i) => (
            <motion.div key={l.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, ease: EASE, duration: 0.6 }}>
              <Link
                to={l.to}
                onClick={onClose}
                data-testid={`mobile-nav-link-${l.id}`}
                className={`block py-3 font-display font-bold text-4xl ${pathname === l.to ? "text-fg" : "text-dim"}`}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

export const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${scrolled ? "bg-canvas/60 backdrop-blur-xl" : ""}`}
    >
      <div className="relative z-50 flex items-center justify-between px-5 md:px-10 py-4">
        <Link to="/" data-testid="nav-logo" className="group flex items-center gap-3 text-fg">
          <Logo className="w-9 h-9 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
          <span className="font-body font-bold text-xl md:text-2xl uppercase tracking-tight">Haneeth Raja.</span>
        </Link>
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border-2 border-fg/90 bg-canvas/50 backdrop-blur-xl px-1.5 py-1.5">
          {NAV.map((l) => {
            const active = pathname === l.to;
            return (
              <Link key={l.id} to={l.to} data-testid={`nav-link-${l.id}`} className="relative px-4 lg:px-5 py-1.5 text-[15px] font-medium">
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${active ? "text-canvas" : "text-ink hover:text-fg"}`}>{l.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-11 h-11 grid place-items-center rounded-full border-2 border-fg/90 text-fg"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </motion.header>
  );
};