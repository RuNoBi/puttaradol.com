"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay between children marked with `data-reveal`. */
  stagger?: number;
  y?: number;
};

/**
 * Fades + lifts its `[data-reveal]` descendants (or itself, if none) when the
 * block scrolls into view. Runs once.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = 0.08, y = 28 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      const targets = items.length ? items : [el];
      gsap.set(targets, { autoAlpha: 0, y });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
