import type { ReactNode } from "react";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
};

/** `(01) — About` label row, then a large heading that reveals line by line. */
export function SectionHeader({ index, label, title, aside }: Props) {
  return (
    <header className="mb-12 grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6 md:mb-16">
      <div className="col-span-12 flex items-center gap-3 border-t border-line pt-4 text-label font-medium uppercase text-muted">
        <span className="tnum text-accent">{index}</span>
        <span>{label}</span>
      </div>
      <SplitHeading className="col-span-12 text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance md:col-span-9">
        {title}
      </SplitHeading>
      {aside && <div className="col-span-12 self-end text-sm text-muted md:col-span-3 md:text-right">{aside}</div>}
    </header>
  );
}
