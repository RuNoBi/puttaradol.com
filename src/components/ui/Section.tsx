import type { ReactNode } from "react";

/** Standard page section: max width, gutters and vertical rhythm. */
export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto max-w-[1600px] scroll-mt-20 px-[var(--gutter)] py-20 md:py-28 ${className ?? ""}`}>
      {children}
    </section>
  );
}
