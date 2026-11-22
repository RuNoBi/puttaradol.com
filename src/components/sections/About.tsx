import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { education } from "@/content/experience";
import { profile, stats } from "@/content/profile";

const facts = [
  ["Name", `${profile.fullName} (${profile.nickname})`],
  ["Study", `${education.field}, ${education.school}`],
  ["Year", `${education.note} · ${education.period}`],
  ["Focus", profile.focus],
  ["Based in", "Bangkok, Thailand"],
] as const;

export function About() {
  return (
    <Section id="about">
      <SectionHeader index="02" label="About" title={<>Hi, I&apos;m {profile.nickname}.</>} />

      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-14">
        <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <p data-reveal className="text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.3] font-medium tracking-[-0.025em]">
            I&apos;m a data engineering student who enjoys turning messy, scattered data into something people can trust
            and use.
          </p>
          <p data-reveal className="max-w-[56ch] text-lg leading-relaxed text-muted">
            At UBE Group I built an ELT platform that brought data retrieval down from about ten minutes to a few
            seconds. At CP Axtra I learnt the cloud side with Databricks, PySpark and Azure.
          </p>
        </Reveal>

        <Reveal as="dl" className="col-span-12 self-start border-t border-line lg:col-span-5 lg:col-start-8">
          {facts.map(([k, v]) => (
            <div key={k} data-reveal className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-4">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="mt-20 grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-10 md:mt-28 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} data-reveal className="flex flex-col gap-3 border-t border-line pt-5">
            <CountUp
              value={s.value}
              className="tnum text-[clamp(2rem,3.6vw,3.25rem)] leading-none font-medium tracking-[-0.04em]"
            />
            <span className="text-sm text-muted">{s.label}</span>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
