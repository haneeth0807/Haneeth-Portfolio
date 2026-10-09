import { ArrowUpRight } from "lucide-react";
import { Page } from "@/components/Page";
import { PageTitle, Reveal } from "@/components/motion";
import { GlowCard, Tag } from "@/components/ui-kit";
import { PROJECTS, SOCIALS } from "@/data/content";

const ProjectCard = ({ p, i }) => (
  <Reveal>
    <GlowCard data-testid={`project-card-${i}`} className="lift group p-7 md:p-10">
      <span aria-hidden className="absolute -right-2 -bottom-6 font-display font-black text-[7rem] md:text-[9rem] leading-none text-outline opacity-10 transition-[opacity,transform] duration-700 group-hover:opacity-30 group-hover:-translate-y-2">
        0{i + 1}
      </span>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <h2 className="text-2xl md:text-3xl text-fg font-semibold">{p.title}</h2>
        <a href={SOCIALS.github} target="_blank" rel="noreferrer" data-testid={`project-github-link-${i}`} className="inline-flex items-center gap-1 text-dim hover:text-fg transition-colors duration-300 link-u whitespace-nowrap">
          Github Link <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
      <p className="mt-3 max-w-3xl text-lg text-dim">{p.desc}</p>
      <div className="mt-6 grid md:grid-cols-2 gap-6 md:gap-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">The Problem</p>
          <p className="mt-2 text-lg text-ink/85">{p.problem}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">The Outcome</p>
          <p className="mt-2 text-lg text-ink/85">{p.outcome}</p>
        </div>
      </div>
      <div className="relative mt-8 flex flex-wrap gap-3">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </GlowCard>
  </Reveal>
);

export default function Projects() {
  return (
    <Page testId="projects-page">
      <section className="container-x text-center">
        <PageTitle testId="projects-title" lines={["Projects that demonstrate", "thinking..."]} />
        <Reveal delay={1} className="mt-10 max-w-4xl mx-auto space-y-6 text-lg md:text-xl text-ink leading-relaxed">
          <p>Rather than doing a project for the sake of doing them. Each project of mine represents a journey from problem to solution. It may be for a hackathon or a class group project or I may just have come across a nice problem statement but I always try to document the thinking behind my work.</p>
          <p>Nowadays, with Vibe coding applications, Agents and AI IDEs, making any project is a matter of minutes. Sure, you can make use of the technologies available to you, but in order to actually learn and take something out of the process, I believe it is important to document the process and understand each step happening. That is why, with all my projects, I like to include a notebook with all the iterations, changes, thought processes, problems faced and how they were solved, etc, in my own words.</p>
          <p className="font-display font-bold text-fg text-xl md:text-2xl leading-snug pt-2">This way, the real takeaway isn't the final product, but the thinking that made it possible.</p>
        </Reveal>
      </section>
      <section className="container-x mt-24 space-y-8 max-w-[1100px]">
        {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
      </section>
    </Page>
  );
}
