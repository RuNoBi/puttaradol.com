"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * While this block fills most of the viewport the whole page cross-fades to
 * the dark "showroom" palette (html.is-dark → CSS variables in globals.css).
 */
export function DarkZone({ children, id }: { children: ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => html.classList.toggle("is-dark", self.isActive),
      });
      return () => {
        st.kill();
        html.classList.remove("is-dark");
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} id={id} className="scroll-mt-0">
      {children}
    </div>
  );
}
