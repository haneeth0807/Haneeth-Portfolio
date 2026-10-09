import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useInView } from "framer-motion";
import { API } from "@/lib/lenis";
import { Reveal } from "@/components/motion";
import { GlowCard } from "@/components/ui-kit";
import { SOCIALS } from "@/data/content";

const LEVELS = ["bg-line/15", "bg-accent/35", "bg-accent/55", "bg-accent/80", "bg-accent"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toWeeks = (days) => {
  if (!days.length) return [];
  const pad = new Date(days[0].date + "T00:00:00").getDay();
  const cells = [...Array(pad).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

const monthLabel = (week, prev) => {
  const d = week.find(Boolean);
  const p = prev?.find(Boolean);
  if (!d) return "";
  const m = new Date(d.date + "T00:00:00").getMonth();
  return !p || new Date(p.date + "T00:00:00").getMonth() !== m ? MONTHS[m] : "";
};

const Grid = ({ weeks }) => (
  <div className="flex gap-[3px]">
    <div className="flex flex-col gap-[3px] pr-2 pt-5 text-[10px] text-dim">
      {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => <span key={i} className="h-[11px] leading-[11px]">{d}</span>)}
    </div>
    {weeks.map((w, wi) => (
      <div key={wi} className="flex flex-col gap-[3px]">
        <span className="h-4 mb-1 text-[10px] text-dim whitespace-nowrap">{monthLabel(w, weeks[wi - 1])}</span>
        {Array.from({ length: 7 }).map((_, di) => {
          const c = w[di];
          return (
            <span
              key={di}
              title={c ? `${c.count} contributions on ${c.date}` : ""}
              style={{ animationDelay: `${wi * 14 + di * 8}ms` }}
              className={`gh-cell w-[11px] h-[11px] rounded-[3px] ${c ? LEVELS[c.level] : "bg-transparent"}`}
            />
          );
        })}
      </div>
    ))}
  </div>
);

export const GithubGraph = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    axios.get(`${API}/github/contributions`).then((r) => setData(r.data)).catch(() => setError(true));
  }, []);

  const weeks = useMemo(() => toWeeks(data?.contributions || []), [data]);

  return (
    <section className="container-x py-16">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <Reveal className="w-full lg:w-auto max-w-full">
          <GlowCard data-testid="github-contribution-graph" className="p-5 md:p-7">
            <div className="flex items-center justify-between mb-4 gap-4">
              <a href={SOCIALS.github} target="_blank" rel="noreferrer" data-testid="github-profile-link" className="font-mono text-xs uppercase tracking-[0.2em] text-accent link-u">
                github.com/haneeth0807
              </a>
              <span data-testid="github-total" className="text-sm text-ink">
                {data ? `${data.total} contributions in the last year` : error ? "Couldn't load activity" : "Loading activity..."}
              </span>
            </div>
            <div ref={ref} data-lenis-prevent className={`overflow-x-auto pb-2 ${inView && data ? "gh-live" : ""}`}>
              {data ? <Grid weeks={weeks} /> : <div className="h-[118px] w-[680px] max-w-full rounded-lg bg-line/10 animate-pulse" />}
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-dim">
              Less {LEVELS.map((l) => <span key={l} className={`w-[11px] h-[11px] rounded-[3px] ${l}`} />)} More
            </div>
          </GlowCard>
        </Reveal>
        <Reveal delay={0.2} className="lg:max-w-[150px] text-sm text-dim italic -rotate-2">
          *PS, I know this is kinda embarrassing. Don't judge :(
        </Reveal>
      </div>
    </section>
  );
};
