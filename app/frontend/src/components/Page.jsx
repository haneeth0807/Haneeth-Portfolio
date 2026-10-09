import { useEffect } from "react";
import { motion } from "framer-motion";
import { getLenis } from "@/lib/lenis";
import { Logo } from "@/components/Logo";

const CURTAIN_EASE = [0.76, 0, 0.24, 1];
const curtain = {
  initial: { scaleY: 1, transformOrigin: "50% 0%" },
  enter: { scaleY: 0, transformOrigin: "50% 0%", transition: { duration: 0.85, ease: CURTAIN_EASE, delay: 0.15 } },
  exit: { scaleY: 1, transformOrigin: "50% 100%", transition: { duration: 0.55, ease: CURTAIN_EASE } },
};

export const Page = ({ children, testId }) => {
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <motion.div
        variants={curtain}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed inset-0 z-[70] bg-fg pointer-events-none flex items-center justify-center"
      >
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 0.2 } }} exit={{ opacity: 0 }}>
          <Logo className="w-14 h-14 text-canvas" />
        </motion.div>
      </motion.div>
      <motion.main
        data-testid={testId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.3 } }}
        exit={{ opacity: 0, y: -24, transition: { duration: 0.45 } }}
        className="pt-28 md:pt-36 pb-10"
      >
        {children}
      </motion.main>
    </>
  );
};