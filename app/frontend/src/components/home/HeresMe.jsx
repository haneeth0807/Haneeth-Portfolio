import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { TiltPhoto } from "@/components/home/TiltPhoto";

const Arrow = () => (
  <motion.svg viewBox="0 0 80 50" className="w-16 h-10 text-fg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
    <motion.path
      d="M76 6 C 50 4, 26 16, 8 42 M8 42 L 10 26 M8 42 L 24 38"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
    />
  </motion.svg>
);

const L = ({ to, children, id }) => (
  <Link to={to} data-testid={id} className="link-u text-fg font-semibold">{children}</Link>
);

export const HeresMe = () => (
  <section data-testid="heres-me-section" className="container-x py-16 md:py-24">
    <div className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] gap-12 md:gap-16 items-center">
      <Reveal className="relative">
        <div className="flex items-end gap-2 mb-4 md:ml-24">
          <Arrow />
          <span className="font-body font-bold text-2xl md:text-3xl text-fg -rotate-3">Here's me</span>
        </div>
        <TiltPhoto src="/img/haneeth.png" alt="Haneeth Raja" />
      </Reveal>
      <div className="space-y-6 text-lg md:text-xl leading-relaxed text-ink">
        <Reveal>I am a fourth year CSE-DS student from Manipal Institute of Technology, Bengaluru who is currently interning at Archer IRM as a Data Scientist. I am originally from Visakhapatnam, Andhra Pradesh. A beautiful seaside city, but I have lived in plenty of places around and outside India.</Reveal>
        <Reveal delay={0.05}>I did not make this site to be just another boring random tech portfolio with my resume, projects, experience and be done with it.</Reveal>
        <Reveal delay={0.1}>
          <span className="font-display font-bold text-fg text-xl md:text-2xl leading-snug block">
            I wanted this site to be a place that gives you a glimpse into my life, into who I am and what I stand for.
          </span>
        </Reveal>
        <Reveal delay={0.15}>If you want to get to know more about my life, hobbies and my philosophy. Go ahead and visit the page <L to="/about" id="inline-link-about">About Me.</L></Reveal>
        <Reveal delay={0.2}>However, if you are here strictly for work purposes and want to see what I do, you can visit <L to="/work" id="inline-link-work">Work</L> or view my <L to="/projects" id="inline-link-projects">Projects.</L></Reveal>
      </div>
    </div>
  </section>
);
