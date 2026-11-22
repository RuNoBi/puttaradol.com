import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stats } from "@/content/profile";

/** Key numbers presented like a car's performance figures. */
export function Specs() {
  return (
    <Section id="specs">
      <SectionHeader label="Performance" title="The numbers behind the work." />

      <Reveal stagger={0.1} className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            className={`flex min-h-56 flex-col justify-between gap-10 border-b border-line py-8 lg:border-b-0 ${
              i % 2 ? "pl-5 lg:pl-8" : "pr-5 lg:pr-8"
            } ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 ? "border-l" : ""}`}
          >
            <span className="text-label tracking-[0.22em] text-muted uppercase">{s.detail}</span>
            <div className="flex flex-col gap-3">
              <CountUp
                value={s.value}
                className="tnum text-[clamp(2.6rem,5.2vw,5.25rem)] leading-[0.9] font-extralight tracking-[-0.05em]"
              />
              <span className="h-px w-10 bg-accent" />
              <span className="text-[0.95rem] text-muted">{s.label}</span>
            </div>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
