import type { ReactNode } from "react";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = {
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  /** Kept for older call sites; no longer shown. */
  index?: string;
};

/** "— LABEL" eyebrow, then a large light heading that reveals line by line. */
export function SectionHeader({ label, title, aside }: Props) {
  return (
    <header className="mb-14 grid grid-cols-12 gap-x-4 gap-y-8 md:mb-20 md:gap-x-6">
      <p className="eyebrow col-span-12">{label}</p>
      <SplitHeading className="col-span-12 text-[clamp(2.4rem,5.6vw,5.5rem)] leading-[0.98] font-light tracking-[-0.045em] text-balance md:col-span-9">
        {title}
      </SplitHeading>
      {aside && <div className="col-span-12 self-end text-sm text-muted md:col-span-3 md:text-right">{aside}</div>}
    </header>
  );
}
