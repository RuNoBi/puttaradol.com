"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate immediately instead of on scroll. */
  immediate?: boolean;
  delay?: number;
};

/** Heading whose lines slide up out of a mask when it enters the viewport. */
export function SplitHeading({ children, as: Tag = "h2", className, immediate, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) return;
      let tween: gsap.core.Tween | undefined;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          tween?.kill();
          // Give each line mask room for descenders on tight line-heights.
          self.masks.forEach((m) => {
            (m as HTMLElement).style.paddingBottom = "0.14em";
            (m as HTMLElement).style.marginBottom = "-0.14em";
          });
          tween = gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.09,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          });
          return tween;
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
