import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pipeline } from "@/content/profile";

/** "Process" — five ruled rows; a gold line sweeps under the row you hover. */
export function Pipeline() {
  return (
    <Section id="process">
      <SectionHeader label="04 — Process" title="From raw data to something useful, in five steps." />

      <Reveal as="ol" stagger={0.08} className="border-t border-line">
        {pipeline.map((s, i) => (
          <li
            key={s.id}
            data-reveal
            className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-b border-line py-8 md:gap-x-6 md:py-10"
          >
            <span className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-lux group-hover:scale-x-100" />
            <span className="tnum col-span-2 text-[clamp(1.5rem,2.4vw,2.25rem)] font-extralight text-accent md:col-span-1">
              0{i + 1}
            </span>
            <h3 className="col-span-10 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-none font-light tracking-[-0.04em] transition-transform duration-700 ease-lux group-hover:translate-x-2 md:col-span-3">
              {s.title}
            </h3>
            <p className="col-span-12 max-w-[46ch] leading-relaxed text-muted md:col-span-5">{s.text}</p>
            <p className="col-span-12 text-sm md:col-span-3 md:text-right">{s.tools.join(" · ")}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
