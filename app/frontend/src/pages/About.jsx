import { Mic, PenLine, ArrowUpRight } from "lucide-react";
import { Page } from "@/components/Page";
import { PageTitle, Reveal } from "@/components/motion";
import { GlowCard, SectionTitle } from "@/components/ui-kit";
import { StoryCarousel } from "@/components/about/StoryCarousel";
import { PhotoGallery } from "@/components/about/PhotoGallery";
import { NowSection } from "@/components/about/NowSection";
import { CharizardPet } from "@/components/about/CharizardPet";
import { MeMap } from "@/components/about/MeMap";
import { PHILOSOPHY, SIDE_PROJECTS } from "@/data/content";

const Intro = () => (
  <section className="container-x text-center">
    <PageTitle testId="about-title" lines={["Here's a glimpse into", "my life..."]} />
    <Reveal delay={1} className="mt-10 max-w-4xl mx-auto space-y-5 text-lg md:text-xl text-ink leading-relaxed">
      <p>When I was first thinking about what to include in this section, I couldn't really decide on what to say and what not to say. It was really quiet a challenge trying to make a nice structure in which to include all the things I originally wanted to write, and writing this page in general felt like I was taking an HR interview of myself.</p>
      <p>But to truly get my point across, I wanted to not just talk about my life story and my technical know-how. I wanted to talk about my philosophy as a person, what drives me and also a few of my hobbies because why not.</p>
      <p className="text-fg">Anyways, I tried my best, so here goes →</p>
    </Reveal>
  </section>
);

const Philosophy = () => (
  <div className="grid sm:grid-cols-2 gap-6">
    {PHILOSOPHY.map((p, i) => (
      <Reveal key={p.title} delay={(i % 2) * 0.1}>
        <GlowCard data-testid={`philosophy-card-${i}`} className="lift group p-6 md:p-7 min-h-[150px] h-full">
          <span className="absolute top-5 right-6 font-display font-bold text-4xl text-outline opacity-30 transition-opacity duration-500 group-hover:opacity-80">0{i + 1}</span>
          <h3 className="text-xl md:text-2xl text-fg font-semibold pr-14">{p.title}</h3>
          <p className="text-dim">@haneeth0807</p>
          <p className="mt-4 text-ink/80 max-h-0 opacity-0 overflow-hidden transition-[max-height,opacity] duration-500 group-hover:max-h-24 group-hover:opacity-100">{p.note}</p>
        </GlowCard>
      </Reveal>
    ))}
  </div>
);

const SideProjects = () => (
  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
    {SIDE_PROJECTS.map((p, i) => {
      const Icon = p.kind === "podcast" ? Mic : PenLine;
      return (
        <Reveal key={p.title} delay={i * 0.12}>
          <GlowCard data-testid={`side-project-card-${p.kind}`} className="lift h-full min-h-[420px] p-8 md:p-10 flex flex-col items-center text-center">
            <span className="w-14 h-14 grid place-items-center rounded-2xl border border-line/60 bg-pill/60 text-fg"><Icon className="w-6 h-6" /></span>
            <h3 className="mt-5 text-2xl font-semibold text-fg">{p.title}</h3>
            <p className="mt-4 text-dim leading-relaxed">{p.text}</p>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noreferrer" data-testid={`side-project-cta-${p.kind}`} className="mt-auto pt-8 inline-flex items-center gap-2 text-fg font-semibold hover:text-accent transition-colors duration-300">
                {p.cta} <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <span data-testid={`side-project-cta-${p.kind}`} className="mt-auto pt-8 inline-flex items-center gap-2 text-fg font-semibold text-dim">
                {p.cta} <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </GlowCard>
        </Reveal>
      );
    })}
  </div>
);

export default function About() {
  return (
    <Page testId="about-page">
      <Intro />
      <section className="container-x mt-28"><SectionTitle testId="my-story-title">My Story</SectionTitle><StoryCarousel /></section>
      <section className="container-x mt-28"><SectionTitle sub="Some of the core values by which I function..">My Philosophy</SectionTitle><Philosophy /></section>
      <section className="container-x mt-28"><SectionTitle sub="A map of the things, people and places that shaped who I am. Click around.">What Makes Me, ME</SectionTitle><MeMap /></section>
      <section className="container-x mt-28"><SectionTitle sub={"Really just a bunch of things I had started as a spur of a moment thing, but I still like to cope by calling them “projects”. They are kinda cool ig, so check them out if you feel upto it."}>My Side Projects</SectionTitle><SideProjects /></section>
      <section className="container-x mt-28"><SectionTitle sub="A snapshot of what I'm up to — updated every now and then.">Me Right Now</SectionTitle><NowSection /></section>
      <div className="mt-20"><CharizardPet /></div>
      <section className="container-x mt-4"><SectionTitle sub="A gallery of moments worth keeping.">A Glimpse Into My World</SectionTitle></section>
      <div className="mt-10 mb-16"><PhotoGallery /></div>
    </Page>
  );
}
