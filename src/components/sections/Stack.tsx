import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, stack } from "@/content/stack";

/** Skills grouped by category — quick to scan, nothing to click. */
export function Stack() {
  return (
    <Section id="stack">
      <SectionHeader index="05" label="Skills" title="Tools I've used in real work." />

      <Reveal className="grid grid-cols-1 gap-x-4 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c} data-reveal className="flex flex-col gap-4 border-t border-line pt-5">
            <h3 className="text-sm text-muted">{c}</h3>
            <ul className="flex flex-wrap gap-2">
              {stack
                .filter((s) => s.category === c)
                .map((s) => (
                  <li
                    key={s.name}
                    title={`Used in: ${s.usedIn.join(", ")}`}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.95rem]"
                  >
                    {s.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
