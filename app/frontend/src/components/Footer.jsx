import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getLenis } from "@/lib/lenis";
import { Reveal } from "@/components/motion";

export const Footer = () => (
  <footer data-testid="site-footer" className="relative mt-24 overflow-hidden">
    <div className="container-x">
      <Reveal className="border-t border-line/30 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-fg">
          <Logo className="w-10 h-10" />
          <span className="text-sm text-ink">@HaneethRaja, 2026. All Rights Reserved</span>
        </div>
        <span className="text-sm text-ink">Portfolio. Crafted with intention.</span>
        <button
          data-testid="back-to-top-button"
          onClick={() => getLenis()?.scrollTo(0, { duration: 1.6 })}
          className="group self-start md:self-auto flex items-center gap-2 text-sm text-fg"
        >
          Back to top
          <span className="w-9 h-9 grid place-items-center rounded-full border border-fg/60 transition-transform duration-500 group-hover:-translate-y-1">
            <ArrowUp className="w-4 h-4" />
          </span>
        </button>
      </Reveal>
    </div>
    <div aria-hidden className="select-none pointer-events-none mt-10 -mb-[2vw] text-center font-display font-black leading-none text-[8.2vw] text-outline opacity-40 whitespace-nowrap">
      HANEETH RAJA
    </div>
  </footer>
);
