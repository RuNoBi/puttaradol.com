import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { stats } from "@/content/profile";

/** Key numbers as a quiet metrics board — each tile reads like a dashboard metric. */
export function Metrics() {
  return (
    <Section id="specs">
      <SectionHeader label="02 — By the numbers" title="Measured, not claimed." />

      <Reveal stagger={0.1} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} data-reveal className="group relative flex min-h-60 flex-col justify-between gap-10 bg-bg p-6 md:p-8">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="tnum tracking-[0.04em]">{s.key}</span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_color-mix(in_srgb,var(--accent)_45%,transparent)]" />
                measured
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <CountUp
                value={s.value}
                className="tnum text-[clamp(2.6rem,4.6vw,4.5rem)] leading-[0.9] font-extralight tracking-[-0.05em]"
              />
              <span className="text-[0.95rem] text-text/85">{s.label}</span>
              <span className="text-xs text-muted">{s.detail}</span>
            </div>
            {/* Signal line that fills on hover */}
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-lux group-hover:scale-x-100" />
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
