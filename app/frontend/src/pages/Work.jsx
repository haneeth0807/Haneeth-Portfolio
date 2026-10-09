import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Download, ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import { Page } from "@/components/Page";
import { PageTitle, Reveal, EASE } from "@/components/motion";
import { GlowCard, SectionTitle, Tag, Counter } from "@/components/ui-kit";
import { STATS, EXPERIENCE, EDUCATION, SKILLS } from "@/data/content";

const Skills = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {SKILLS.map((s, i) => (
      <motion.span
        key={s}
        data-testid={`skill-pill-${i}`}
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
        whileHover={{ y: -4 }}
        className="text-center rounded-full border border-line/70 bg-pill/60 px-4 py-3 text-ink transition-colors duration-300 hover:bg-fg hover:text-canvas hover:border-fg"
      >
        {s}
      </motion.span>
    ))}
  </div>
);

const Intro = () => (
  <section className="container-x">
    <PageTitle testId="work-title" className="text-center" lines={["My Professional Journey..."]} />
    <Reveal delay={0.9} className="mt-10 max-w-4xl mx-auto text-center text-lg md:text-xl text-ink leading-relaxed">
      As mentioned earlier, I am a person who believes in being a jack of all trades. So, over the past three years as a CSE student, I have gained over 25+ certifications from top companies and international universities; been active in IEEE and student leadership roles; participated in hackathons, events, conferences; became an IBM certified AI developer and dabbled in a bit of content creation. I have a bit of a thirst to learn all things tech has to offer, so you will find me learning the most random stuff.
    </Reveal>
    <Reveal delay={1} className="mt-10 max-w-4xl mx-auto text-lg md:text-xl text-ink">
      <p>I'm currently looking for opportunities where I can:</p>
      <ul className="mt-3 space-y-1.5">
        {["Learn fast", "Contribute meaningfully", "Ask a lot of \u201cwhy\u201d questions without being annoying"].map((t) => (
          <li key={t} className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-accent" />{t}</li>
        ))}
      </ul>
      <p className="mt-3">I'm especially interested in roles where thinking clearly matters as much as, or more, than writing code.</p>
    </Reveal>
    <Reveal delay={1.1} className="mt-12 flex justify-center">
      <a href="/resume.pdf" download="Haneeth_Raja_Resume.pdf" data-testid="resume-download-button" className="group inline-flex items-center gap-3 rounded-xl bg-fg px-10 py-4 text-canvas font-semibold text-lg transition-transform duration-300 hover:scale-[1.03] active:scale-95">
        <Download className="w-5 h-5 transition-transform duration-500 group-hover:translate-y-0.5" /> Download Resume
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </Reveal>
  </section>
);

const Stats = () => (
  <Reveal>
    <GlowCard data-testid="quick-stats-card" className="p-8 md:p-12">
      <h3 className="text-center text-3xl text-fg font-semibold">Quick Stats</h3>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {STATS.map((s, i) => (
          <div key={s.label} data-testid={`stat-${i}`}>
            <p className="font-display font-bold text-5xl lg:text-6xl text-fg h-[1.1em] flex items-center">
              {s.value === null ? <InfinityIcon className="w-14 h-14" strokeWidth={2.5} /> : <Counter to={s.value} suffix={s.suffix} />}
            </p>
            <p className="mt-2 text-lg text-ink max-w-[220px]">{s.label}</p>
          </div>
        ))}
      </div>
    </GlowCard>
  </Reveal>
);

const TimelineCard = ({ title, org, date, desc, tags, testId, i }) => (
  <Reveal delay={i * 0.08} className="relative pl-10 md:pl-16">
    <span className="absolute left-[7px] md:left-[23px] top-8 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
    <GlowCard data-testid={testId} className="lift p-6 md:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
        <h3 className="text-xl md:text-2xl text-fg font-semibold">{title}</h3>
        <span className="font-mono text-xs text-dim sm:pt-2 whitespace-nowrap">{date}</span>
      </div>
      <p className="text-dim">@{org}</p>
      <p className="mt-3 text-ink/85">→ {desc}</p>
      {tags && <div className="mt-4 flex flex-wrap gap-2">{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
    </GlowCard>
  </Reveal>
);

const Timeline = ({ items, prefix }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  return (
    <div ref={ref} className="relative space-y-6">
      <div className="absolute left-3 md:left-7 top-2 bottom-2 w-px bg-line/30" />
      <motion.div style={{ scaleY: scrollYProgress }} className="absolute left-3 md:left-7 top-2 bottom-2 w-px bg-accent origin-top" />
      {items.map((e, i) => (
        <TimelineCard key={i} i={i} testId={`${prefix}-card-${i}`} title={e.role || e.degree} org={e.org} date={e.date} desc={e.desc || e.note} tags={e.tags} />
      ))}
    </div>
  );
};

export default function Work() {
  return (
    <Page testId="work-page">
      <Intro />
      <section className="container-x mt-28">
        <SectionTitle>Summary</SectionTitle>
        <Reveal>
          <GlowCard data-testid="summary-card" className="p-8 md:p-10 text-center text-lg md:text-xl text-ink leading-relaxed">
            Experienced in developing AI-driven applications, computer vision systems, and full-stack solutions. Passionate about AI research, Artificial General Intelligence, and Computational Neuroscience. With strong analytical, leadership, and teamwork skills gained through academic projects, certifications, and extracurricular pursuits. Committed to continuous learning and creating impactful solutions at the intersection of innovation and real-world application.
          </GlowCard>
        </Reveal>
      </section>
      <section className="container-x mt-10"><Stats /></section>
      <section className="container-x mt-28"><SectionTitle sub="Just a small summary of my technical skills, what I am into and what I do.">My Expertise</SectionTitle><Skills /></section>
      <section className="container-x mt-28"><SectionTitle>Work Experience</SectionTitle><Timeline items={EXPERIENCE} prefix="experience" /></section>
      <section className="container-x mt-28"><SectionTitle>Education</SectionTitle><Timeline items={EDUCATION} prefix="education" /></section>
    </Page>
  );
}
