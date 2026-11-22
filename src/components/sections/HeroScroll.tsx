"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Cinematic exit for the hero: as you scroll away the copy drifts up and
 * fades, the name rises faster, and the portrait eases back — like the
 * opening shot on a car maker's site.
 */
export function HeroScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to("[data-hero-copy]", { yPercent: -35, opacity: 0, duration: 0.6 }, 0)
          .to("[data-hero-portrait]", { scale: 0.86, yPercent: 8, opacity: 0.15, transformOrigin: "50% 30%" }, 0)
          .to("[data-hero-name]", { yPercent: -60 }, 0)
          .to("[data-hero-meta]", { opacity: 0, duration: 0.3 }, 0);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
