import { toast } from "sonner";
import { Mail, MapPin, Github, Linkedin, Instagram, ArrowUpRight, Copy } from "lucide-react";
import { Page } from "@/components/Page";
import { PageTitle, Reveal } from "@/components/motion";
import { GlowCard, Eyebrow } from "@/components/ui-kit";
import { ContactForm } from "@/components/contact/ContactForm";
import { SOCIALS } from "@/data/content";

const LINKS = [
  { name: "GitHub", handle: "@haneeth0807", href: SOCIALS.github, Icon: Github, id: "github" },
  { name: "LinkedIn", handle: "haneeth-raja", href: SOCIALS.linkedin, Icon: Linkedin, id: "linkedin" },
  { name: "Instagram", handle: "@haneeth_0807", href: SOCIALS.instagram, Icon: Instagram, id: "instagram" },
];

const IconBox = ({ Icon }) => (
  <span className="w-16 h-16 shrink-0 grid place-items-center rounded-2xl border border-line/60 bg-card/70 text-fg transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
    <Icon className="w-7 h-7" />
  </span>
);

const copyEmail = () => {
  navigator.clipboard?.writeText(SOCIALS.email).then(() => toast.success("Email copied to clipboard"), () => toast(SOCIALS.email));
};

const Info = () => (
  <div className="space-y-6">
    <Reveal>
      <button data-testid="contact-email-copy" onClick={copyEmail} className="group flex items-center gap-5 text-left">
        <IconBox Icon={Mail} />
        <span>
          <span className="block text-xl text-dim">Gmail</span>
          <span className="flex items-center gap-2 text-lg text-fg">{SOCIALS.email}<Copy className="w-4 h-4 opacity-0 transition-opacity duration-300 group-hover:opacity-70" /></span>
        </span>
      </button>
    </Reveal>
    <Reveal delay={0.08}>
      <div data-testid="contact-location" className="group flex items-center gap-5">
        <IconBox Icon={MapPin} />
        <span>
          <span className="block text-xl text-dim">Location</span>
          <span className="block text-lg text-fg">Bengaluru, India</span>
        </span>
      </div>
    </Reveal>
  </div>
);

const Socials = () => (
  <div className="space-y-5">
    {LINKS.map(({ name, handle, href, Icon, id }, i) => (
      <Reveal key={id} delay={i * 0.08}>
        <a href={href} target="_blank" rel="noreferrer" data-testid={`social-link-${id}`}>
          <GlowCard className="lift group flex items-center gap-5 p-5 md:p-6">
            <Icon className="w-10 h-10 text-fg transition-transform duration-500 group-hover:scale-110" />
            <span className="flex-1">
              <span className="block text-2xl text-fg">{name}</span>
              <span className="block text-dim">{handle}</span>
            </span>
            <ArrowUpRight className="w-6 h-6 text-fg opacity-40 transition-[opacity,transform] duration-500 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </GlowCard>
        </a>
      </Reveal>
    ))}
  </div>
);

export default function Contact() {
  return (
    <Page testId="contact-page">
      <section className="container-x text-center">
        <Reveal delay={0.5}><p className="font-body font-bold text-2xl md:text-3xl text-fg mb-4">Get In Touch!</p></Reveal>
        <PageTitle testId="contact-title" lines={["Let's Build Something", "Together!"]} delay={0.7} />
        <Reveal delay={1.1} className="mt-8 text-lg md:text-xl text-ink">
          Whether you have a project in mind, a question, or just want to connect — I'd love to hear from you.
        </Reveal>
      </section>
      <section className="container-x max-w-[1040px] mt-24 space-y-20">
        <Info />
        <div>
          <Reveal><Eyebrow className="mb-2">Socials</Eyebrow><h2 className="text-2xl md:text-3xl text-fg mb-6">Connect with me..</h2></Reveal>
          <Socials />
        </div>
        <div>
          <Reveal><Eyebrow className="mb-2">Inbox</Eyebrow><h2 className="text-2xl md:text-3xl text-fg mb-6">Send me a message..</h2></Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </section>
    </Page>
  );
}
