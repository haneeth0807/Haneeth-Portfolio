import { ArrowUpRight } from "lucide-react";
import { Reveal, MaskLine } from "@/components/motion";
import { GlowCard } from "@/components/ui-kit";
import { CURRENT_PROJECTS } from "@/data/content";

export const NowProjects = () => (
  <section data-testid="now-projects-section" className="container-x py-16">
    <h2 className="font-body font-bold text-fg tracking-tight text-3xl sm:text-4xl lg:text-5xl text-center">
      <MaskLine inView>Here's a glimpse into what I am upto right now...</MaskLine>
    </h2>
    <Reveal className="mt-14 mb-8">
      <p className="text-xl md:text-2xl text-fg">A few projects that I am currently working on →</p>
      <p className="mt-1 text-md text-dim">(I am most definitely 100% no cap pinky promise not the type of person to start 20 things at once and barely get any progress done in each of them. Trust)</p>
    </Reveal>
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {CURRENT_PROJECTS.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.12}>
          <GlowCard data-testid={`current-project-card-${i}`} className="lift group h-full">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#06263c]">
              <img src={p.img} alt="" className="w-full h-full object-cover grayscale contrast-125 opacity-50 mix-blend-luminosity transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041a2a] via-[#06304a]/40 to-[#0b5a8a]/30 mix-blend-multiply" />
              <span className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-[#fdf0d5] text-[#06090d] opacity-0 -translate-y-2 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
            <div className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{p.type}</p>
              <h3 className="mt-2 text-2xl font-semibold text-fg">{p.title}</h3>
              <p className="mt-1 text-dim">{p.desc}</p>
            </div>
          </GlowCard>
        </Reveal>
      ))}
    </div>
  </section>
);
