"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Counts the leading integer of `value` up from 0 when scrolled into view
 * ("700K+" → 0K+ … 700K+). Non-numeric values render as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\d+)(.*)$/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !match || prefersReducedMotion()) return;
      const target = Number(match[1]);
      const suffix = match[2];
      const n = { v: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(n, {
        v: target,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => (el.textContent = `${Math.round(n.v)}${suffix}`),
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
