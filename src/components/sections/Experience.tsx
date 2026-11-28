import { Reveal } from "@/components/motion/Reveal";
import { ExperienceList } from "@/components/sections/ExperienceList";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { certifications, education, experience } from "@/content/experience";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader label="V — Experience" title="Where I've worked." />

      <Reveal stagger={0.12}>
        <ExperienceList roles={experience} />
      </Reveal>

      <Reveal className="mt-20 grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-12">
        <div data-reveal className="col-span-12 flex flex-col gap-5 md:col-span-6">
          <h3 className="text-label tracking-[0.22em] text-muted uppercase">Education</h3>
          <div className="rounded-[1.5rem] border border-line bg-surface/70 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 text-sm text-muted">
              <span>{education.degree}</span>
              <span className="tnum shrink-0">{education.period}</span>
            </div>
            <p className="mt-6 text-3xl leading-tight font-light tracking-[-0.035em]">{education.school}</p>
            <p className="mt-1 text-muted">{education.field}</p>
          </div>
        </div>

        <div data-reveal className="col-span-12 flex flex-col gap-5 md:col-span-6">
          <h3 className="text-label tracking-[0.22em] text-muted uppercase">Certificates</h3>
          <ul className="border-t border-line">
            {certifications.map((c) => (
              <li key={c.name} className="grid grid-cols-[1fr_auto] gap-4 border-b border-line py-5">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted">{c.issuer}</p>
                </div>
                <span className="tnum text-sm text-muted">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
