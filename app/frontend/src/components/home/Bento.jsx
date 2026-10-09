import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Radio, MapPin, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { GlowCard, Eyebrow } from "@/components/ui-kit";

const Clock = () => {
  const fmt = () => new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span data-testid="bento-local-time" className="font-display font-bold text-4xl lg:text-5xl text-fg tabular-nums">{t}</span>;
};

const Tile = ({ icon: Icon, label, children, testId, delay }) => (
  <Reveal delay={delay} className="h-full">
    <GlowCard data-testid={testId} className="lift h-full min-h-[240px] p-7 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <Icon className="w-5 h-5 text-fg/70" />
      </div>
      {children}
    </GlowCard>
  </Reveal>
);

export const Bento = () => (
  <section className="container-x py-12">
    <div className="grid md:grid-cols-3 gap-6 items-stretch">
      <Tile icon={Sparkles} label="Currently learning" testId="bento-learning" delay={0}>
        <div>
          <p className="font-display font-bold text-2xl text-fg leading-tight">Computational Neuroscience</p>
          <p className="mt-2 text-dim">How brains compute — and what that means for building AGI.</p>
        </div>
      </Tile>
      <Tile icon={MapPin} label="Local time · Bengaluru" testId="bento-clock" delay={0.1}>
        <div>
          <Clock />
          <p className="mt-2 text-dim">Probably coding. Or learning the most random stuff.</p>
        </div>
      </Tile>
      <Tile icon={Radio} label="On air" testId="bento-podcast" delay={0.2}>
        <div className="flex items-end gap-1 h-10" aria-hidden>
          {[0, 0.2, 0.4, 0.1, 0.3, 0.5, 0.15].map((d, i) => (
            <span key={i} className="eq-bar w-2 h-full rounded-full bg-accent" style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
        <Link to="/about" data-testid="bento-podcast-link" className="group flex items-center justify-between text-fg">
          <span className="font-display font-bold text-2xl leading-tight">My podcast &amp; blog</span>
          <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </Tile>
    </div>
  </section>
);
