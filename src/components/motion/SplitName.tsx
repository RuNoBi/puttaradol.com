"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { onIntroDone } from "@/lib/intro";

gsap.registerPlugin(useGSAP, SplitText);

type Props = { text: string; className?: string };

/**
 * Big display name. Letters rise out of a mask after the intro, and each
 * letter "rolls" (out the top, back in from below) when hovered.
 */
export function SplitName({ text, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      const split = SplitText.create(el, { type: "chars", mask: "chars", aria: "auto" });
      const chars = split.chars as HTMLElement[];
      gsap.set(chars, { yPercent: 115, rotate: 7, transformOrigin: "0% 100%" });
      gsap.set(el, { autoAlpha: 1 });

      const stopWaiting = onIntroDone(() =>
        gsap.to(chars, {
          yPercent: 0,
          rotate: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.045,
          delay: 0.2,
        }),
      );

      const cleanups = chars.map((c) => {
        const roll = () => {
          if (gsap.isTweening(c)) return;
          gsap
            .timeline()
            .to(c, { yPercent: -115, duration: 0.28, ease: "power3.in" })
            .set(c, { yPercent: 115 })
            .to(c, { yPercent: 0, duration: 0.7, ease: "expo.out" });
        };
        c.addEventListener("pointerenter", roll);
        return () => c.removeEventListener("pointerenter", roll);
      });

      return () => {
        stopWaiting();
        cleanups.forEach((fn) => fn());
        split.revert();
      };
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={`split-pending ${className ?? ""}`}>
      {text}
    </h1>
  );
}
