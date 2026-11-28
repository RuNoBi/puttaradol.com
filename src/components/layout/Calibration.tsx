"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_EVENT, isIntroDone, markIntroDone } from "@/lib/intro";

const TICKS = Array.from({ length: 60 }, (_, i) => i);

/**
 * First-visit intro, styled like a watch being calibrated: the 60 minute
 * ticks draw in, a gold seconds hand makes one sweep while the counter runs
 * to 60, then the dial opens up and the page is revealed. ~2.3s, skippable
 * with a click or key press, shown once per session.
 */
export function Calibration() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || isIntroDone()) {
        setGone(true);
        return;
      }
      gsap.set(el, { display: "flex" }); // stay visible once the class is removed

      const count = el.querySelector<HTMLElement>("[data-count]")!;
      const n = { v: 0 };
      let handingOff = false;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(el.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.06 }, 0)
        .from(el.querySelectorAll("[data-tick]"), { autoAlpha: 0, duration: 0.25, stagger: 0.011, ease: "none" }, 0.05)
        .fromTo("[data-hand]", { rotation: 0 }, { rotation: 360, duration: 1.35, ease: "power2.inOut", svgOrigin: "100 100" }, 0.25)
        .to(
          n,
          {
            v: 60,
            duration: 1.35,
            ease: "power2.inOut",
            onUpdate: () => (count.textContent = String(Math.round(n.v)).padStart(2, "0")),
          },
          0.25,
        )
        .add(() => {
          handingOff = true;
          markIntroDone();
        }, "+=0.05")
        .to("[data-dial]", { scale: 2.6, autoAlpha: 0, duration: 1.0, ease: "expo.in" }, "<")
        .to(el.querySelectorAll("[data-fade]"), { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "<")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "<0.35")
        .add(() => setGone(true));

      const skip = () => !handingOff && tl.progress(1);
      window.addEventListener(INTRO_EVENT, skip);
      el.addEventListener("click", skip);
      window.addEventListener("keydown", skip);
      return () => {
        window.removeEventListener(INTRO_EVENT, skip);
        el.removeEventListener("click", skip);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="boot-loader fixed inset-0 z-[100] cursor-pointer flex-col items-center justify-center bg-bg [clip-path:inset(0%_0%_0%_0%)]"
    >
      <p data-fade className="absolute top-6 left-[var(--gutter)] text-label tracking-[0.32em] uppercase">
        Puttaradol
      </p>
      <p data-fade className="absolute top-6 right-[var(--gutter)] text-label tracking-[0.22em] text-muted uppercase">
        Calibrating
      </p>

      <div data-dial className="relative size-[min(62vw,22rem)]">
        <svg viewBox="0 0 200 200" className="size-full">
          <circle cx="100" cy="100" r="96" fill="none" stroke="var(--line)" strokeWidth="0.4" />
          {TICKS.map((i) => {
            const major = i % 5 === 0;
            return (
              <line
                key={i}
                data-tick
                x1="100"
                y1={major ? 6 : 8}
                x2="100"
                y2={major ? 18 : 13}
                stroke={major ? "var(--text)" : "var(--muted)"}
                strokeWidth={major ? 0.9 : 0.4}
                transform={`rotate(${i * 6} 100 100)`}
              />
            );
          })}
          <g data-hand>
            <line x1="100" y1="114" x2="100" y2="14" stroke="var(--accent)" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="100" cy="100" r="2.6" fill="var(--accent)" />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-16">
          <span data-count className="tnum text-4xl font-extralight tracking-[-0.04em]">
            00
          </span>
          <span className="text-label tracking-[0.22em] text-muted uppercase">Data Engineer</span>
        </div>
      </div>

      <p data-fade className="absolute bottom-6 text-label tracking-[0.22em] text-muted uppercase">
        Click to skip
      </p>
    </div>
  );
}
