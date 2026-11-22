import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pipeline } from "@/content/profile";

/** "How I work" — five plain steps, read left to right (top to bottom on mobile). */
export function Pipeline() {
  return (
    <Section id="process">
      <SectionHeader index="03" label="How I work" title="From raw data to something useful, in five steps." />

      <Reveal as="ol" stagger={0.1} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {pipeline.map((s, i) => (
          <li key={s.id} data-reveal className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <span className="tnum flex size-8 items-center justify-center rounded-full bg-text text-sm font-medium text-bg">
              {i + 1}
            </span>
            <h3 className="text-xl font-medium tracking-[-0.02em]">{s.title}</h3>
            <p className="text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
            <p className="mt-auto pt-2 text-sm text-text">{s.tools.join(" · ")}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
