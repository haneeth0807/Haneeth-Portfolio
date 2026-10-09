import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const opts = [
    { id: "light", Icon: Sun },
    { id: "dark", Icon: Moon },
  ];
  return (
    <button
      data-testid="theme-toggle-button"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-1 rounded-full border-2 border-fg/90 bg-canvas/50 backdrop-blur-xl p-1"
    >
      {opts.map(({ id, Icon }) => (
        <span key={id} className="relative w-8 h-8 grid place-items-center">
          {theme === id && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 rounded-full bg-fg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className={`relative w-4 h-4 transition-colors duration-300 ${theme === id ? "text-canvas" : "text-fg/70"}`} />
        </span>
      ))}
    </button>
  );
};
