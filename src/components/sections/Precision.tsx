"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/content/profile";

const TICKS = Array.from({ length: 60 }, (_, i) => i);
const ROMAN = ["XII", "III", "VI", "IX"];

/**
 * Desktop: the section pins and a watch dial's seconds hand sweeps one full
 * turn with the scroll. Each quarter lights up one key number on the right.
 * Mobile / reduced motion: the same four numbers as a simple grid.
 */
export function Precision() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-stat]");
        const marks = gsap.utils.toArray<SVGElement>("[data-quarter]");
        gsap.set(items, { autoAlpha: 0, y: 30 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });
        gsap.set(marks[0], { attr: { fill: "var(--accent)" } });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "[data-precision-pin]", start: "top top", end: "+=260%", pin: true, scrub: 0.8 },
        });
        tl.fromTo("[data-sweep]", { rotation: 0 }, { rotation: 360, duration: 4, svgOrigin: "100 100" }, 0);
        tl.to("[data-arc]", { strokeDashoffset: 0, duration: 4 }, 0);
        items.forEach((item, i) => {
          if (i === 0) return;
          const at = i; // quarter i reached at t = i
          tl.to(items[i - 1], { autoAlpha: 0, y: -30, duration: 0.25 }, at - 0.15)
            .to(item, { autoAlpha: 1, y: 0, duration: 0.3 }, at - 0.05)
            .to(marks[i - 1], { attr: { fill: "var(--muted)" }, duration: 0.1 }, at - 0.1)
            .to(marks[i], { attr: { fill: "var(--accent)" }, duration: 0.1 }, at - 0.1);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="specs" className="relative">
      {/* Desktop: pinned dial */}
      <div data-precision-pin className="mx-auto hidden h-dvh max-w-[1600px] items-center px-[var(--gutter)] lg:flex lg:motion-reduce:hidden">
        <div className="grid w-full grid-cols-12 items-center gap-x-6">
          <div className="col-span-6 flex justify-center">
            <svg viewBox="0 0 200 200" className="size-[min(74vh,40vw)]" aria-hidden>
              <circle cx="100" cy="100" r="98" fill="none" stroke="var(--line)" strokeWidth="0.3" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="var(--line)" strokeWidth="0.25" />
              {/* Progress arc */}
              <circle
                data-arc
                cx="100"
                cy="100"
                r="89"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.6"
                strokeDasharray={2 * Math.PI * 89}
                strokeDashoffset={2 * Math.PI * 89}
                transform="rotate(-90 100 100)"
              />
              {TICKS.map((i) => {
                const major = i % 5 === 0;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1={major ? 3 : 4}
                    x2="100"
                    y2={major ? 13 : 8}
                    stroke={major ? "var(--text)" : "var(--muted)"}
                    strokeOpacity={major ? 0.8 : 0.5}
                    strokeWidth={major ? 0.7 : 0.3}
                    transform={`rotate(${i * 6} 100 100)`}
                  />
                );
              })}
              {ROMAN.map((r, i) => (
                <text
                  key={r}
                  data-quarter
                  x={[100, 173, 100, 27][i]}
                  y={[28, 102.3, 176.5, 102.3][i]}
                  textAnchor="middle"
                  fontSize="6.5"
                  letterSpacing="0.8"
                  fill="var(--muted)"
                  style={{ fontWeight: 300 }}
                >
                  {r}
                </text>
              ))}
              <text x="100" y="128" textAnchor="middle" fontSize="4" letterSpacing="1.4" fill="var(--muted)">
                PUTTARADOL
              </text>
              <text x="100" y="134" textAnchor="middle" fontSize="2.6" letterSpacing="1" fill="var(--muted)" opacity="0.7">
                DATA · ENGINEERED
              </text>
              {/* Hands */}
              <line x1="100" y1="100" x2="100" y2="52" stroke="var(--text)" strokeWidth="1.6" strokeLinecap="round" transform="rotate(-50 100 100)" />
              <line x1="100" y1="100" x2="100" y2="34" stroke="var(--text)" strokeWidth="1" strokeLinecap="round" transform="rotate(64 100 100)" />
              <g data-sweep>
                <line x1="100" y1="116" x2="100" y2="16" stroke="var(--accent)" strokeWidth="0.55" strokeLinecap="round" />
                <circle cx="100" cy="100" r="2.4" fill="var(--accent)" />
              </g>
            </svg>
          </div>

          <div className="col-span-5 col-start-8">
            <p className="eyebrow mb-10">II — Precision</p>
            <div className="relative h-[22rem]">
              {stats.map((s) => (
                <div key={s.label} data-stat className="absolute inset-0 flex flex-col justify-center gap-6">
                  <span className="text-label tracking-[0.22em] text-muted uppercase">
                    {s.detail}
                  </span>
                  <span className="tnum text-[clamp(4rem,8vw,8.5rem)] leading-[0.85] font-extralight tracking-[-0.06em]">
                    {s.value}
                  </span>
                  <span className="h-px w-14 bg-accent" />
                  <span className="max-w-[26ch] text-xl font-light tracking-[-0.02em] text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / reduced motion: simple grid */}
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)] py-20 lg:hidden lg:motion-reduce:block">
        <p className="eyebrow mb-10">II — Precision</p>
        <div className="grid grid-cols-2 border-t border-line">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col gap-3 border-b border-line py-7 ${i % 2 ? "border-l pl-5" : "pr-5"}`}>
              <span className="tnum text-[2.6rem] leading-none font-extralight tracking-[-0.05em]">{s.value}</span>
              <span className="h-px w-8 bg-accent" />
              <span className="text-sm text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
