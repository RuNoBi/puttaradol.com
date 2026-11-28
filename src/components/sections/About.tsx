import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { education } from "@/content/experience";
import { profile } from "@/content/profile";

const facts = [
  ["Name", `${profile.fullName} (${profile.nickname})`],
  ["Study", `${education.field}`],
  ["University", `${education.school} · ${education.note}`],
  ["Focus", profile.focus],
  ["Based in", "Bangkok, Thailand"],
] as const;

export function About() {
  return (
    <Section id="about">
      <SectionHeader label="03 — About" title={<>Hi, I&apos;m {profile.nickname}.</>} />

      <div className="grid grid-cols-12 gap-x-4 gap-y-16 md:gap-x-6">
        <Reveal className="col-span-12 flex flex-col gap-8 lg:col-span-6">
          <p data-reveal className="text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.25] font-light tracking-[-0.03em]">
            I&apos;m a data engineering student who enjoys turning messy, scattered data into something people can
            trust and use.
          </p>
          <p data-reveal className="max-w-[54ch] text-lg leading-relaxed text-muted">
            At UBE Group I built an ELT platform that brought data retrieval down from about ten minutes to a few
            seconds. At CP Axtra I learnt the cloud side with Databricks, PySpark and Azure.
          </p>
        </Reveal>

        <Reveal as="dl" className="col-span-12 self-start border-t border-line lg:col-span-5 lg:col-start-8">
          {facts.map(([k, v]) => (
            <div key={k} data-reveal className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-5">
              <dt className="pt-0.5 text-label tracking-[0.22em] text-muted uppercase">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
