import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, stack } from "@/content/stack";

/** Skills: a slow ticker of every tool, then the same tools grouped to scan. */
export function Stack() {
  const names = stack.map((s) => s.name);
  return (
    <>
      <div aria-hidden className="overflow-hidden border-y border-line py-7">
        <div className="marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {names.map((n) => (
                <span
                  key={`${copy}-${n}`}
                  className="flex items-center gap-10 pr-10 text-[clamp(2rem,4.5vw,4rem)] leading-none font-extralight tracking-[-0.04em] whitespace-nowrap"
                >
                  {n}
                  <span className="text-[0.4em] text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Section id="stack">
        <SectionHeader label="06 — Skills" title="Tools I've used in real work." />

        <Reveal className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c} data-reveal className="flex flex-col gap-5 border-t border-line pt-5">
              <h3 className="text-label tracking-[0.22em] text-muted uppercase">{c}</h3>
              <ul className="flex flex-col">
                {stack
                  .filter((s) => s.category === c)
                  .map((s) => (
                    <li
                      key={s.name}
                      className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2.5 last:border-b-0"
                    >
                      <span className="text-lg font-light tracking-[-0.02em]">{s.name}</span>
                      <span className="text-right text-xs text-muted">{s.usedIn.join(" · ")}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
