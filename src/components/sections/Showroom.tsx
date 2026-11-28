"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TextRoll } from "@/components/motion/TextRoll";
import { ArrowRight } from "@/components/ui/icons";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import type { Project } from "@/content/projects";

/**
 * The work, presented like a car maker's model line-up: the page goes dark,
 * the section pins, and each project slides in on its own screen. Mobile and
 * reduced-motion users get the same panels stacked vertically.
 */
export function Showroom({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set("[data-progress]", { scaleX: self.progress });
              const i = Math.min(projects.length, Math.round(self.progress * projects.length));
              if (counter.current) counter.current.textContent = String(Math.max(1, i)).padStart(2, "0");
            },
          },
        });

        // Inside each panel: the big number drifts and the content rises in.
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelector("[data-ghost]"),
            { xPercent: 18 },
            {
              xPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(panel.querySelectorAll("[data-rise]"), {
            y: 40,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 70%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section data-pin className="relative overflow-hidden lg:h-dvh">
        <div data-track className="flex flex-col lg:h-full lg:w-max lg:flex-row">
          {/* Opening panel */}
          <div className="flex shrink-0 flex-col justify-end px-[var(--gutter)] pt-28 pb-16 lg:h-full lg:w-[58vw] lg:justify-center lg:pb-0">
            <p className="eyebrow mb-10">I — Selected work</p>
            <h2 className="text-[clamp(3rem,8vw,8.5rem)] leading-[0.88] font-light tracking-[-0.05em]">
              The
              <br />
              collection.
            </h2>
            <p className="mt-10 max-w-[34ch] text-lg leading-relaxed text-muted">
              Four projects, one at a time — from a production ELT platform to cloud pipelines and a model that
              predicts SLA breaches.
            </p>
            <p className="mt-12 hidden items-center gap-4 text-label tracking-[0.22em] text-muted uppercase lg:flex">
              Keep scrolling <span className="h-px w-16 bg-accent" />
            </p>
          </div>

          {projects.map((p, i) => (
            <article
              key={p.slug}
              data-panel
              className="relative flex shrink-0 items-center overflow-hidden border-t border-line px-[var(--gutter)] py-20 lg:h-full lg:w-[92vw] lg:border-t-0 lg:border-l lg:py-0"
            >
              {/* Giant outlined model number */}
              <span
                data-ghost
                aria-hidden
                className="tnum pointer-events-none absolute -right-[4vw] -bottom-[6vw] text-[44vw] leading-none font-light tracking-[-0.06em] text-transparent select-none lg:text-[34vw]"
                style={{ WebkitTextStroke: "1px var(--line)" }}
              >
                0{i + 1}
              </span>

              <div className="relative grid w-full grid-cols-12 items-center gap-x-6 gap-y-14">
                <div className="col-span-12 flex flex-col gap-8 lg:col-span-5">
                  <p data-rise className="eyebrow">
                    Model 0{i + 1} — {p.kind}
                  </p>
                  <h3
                    data-rise
                    className="text-[clamp(2.4rem,4.6vw,5rem)] leading-[0.95] font-light tracking-[-0.045em] text-balance"
                  >
                    {p.title}
                  </h3>
                  <p data-rise className="max-w-[44ch] text-[1.05rem] leading-relaxed text-muted">
                    {p.short}
                  </p>

                  {/* Spec sheet */}
                  <dl data-rise className="grid grid-cols-2 border-t border-line">
                    {[
                      ["Context", p.context],
                      ["Period", p.period],
                      ["Stack", p.stack.slice(0, 3).join(" · ")],
                      ["Result", `${p.metric.value} ${p.metric.label}`],
                    ].map(([k, v], j) => (
                      <div key={k} className={`border-b border-line py-4 ${j % 2 ? "pl-5" : "pr-5"}`}>
                        <dt className="mb-1.5 text-label tracking-[0.22em] text-muted uppercase">{k}</dt>
                        <dd className={`text-[0.95rem] ${k === "Result" ? "text-accent" : ""}`}>{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div data-rise>
                    <Link
                      href={`/work/${p.slug}`}
                      className="group inline-flex items-center gap-3 rounded-full border border-text/25 py-3 pr-3 pl-6 text-sm transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-bg"
                    >
                      <TextRoll>Explore the case</TextRoll>
                      <span className="flex size-7 items-center justify-center rounded-full bg-text/10 transition-transform duration-500 ease-lux group-hover:translate-x-1">
                        <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* "Product shot": the architecture under a soft spotlight */}
                <div data-rise className="relative col-span-12 lg:col-span-7">
                  <div
                    aria-hidden
                    className="absolute -inset-[15%] rounded-full opacity-90"
                    style={{
                      background:
                        "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 16%, transparent), transparent)",
                    }}
                  />
                  <div className="relative rounded-[2rem] border border-line bg-surface/60 p-6 md:p-10">
                    <p className="mb-8 text-label tracking-[0.22em] text-muted uppercase">Architecture · data flow</p>
                    <ArchitectureDiagram stages={p.architecture} vertical />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress (desktop) */}
        <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden items-center gap-6 text-label tracking-[0.22em] text-muted uppercase lg:flex">
          <span className="tnum">
            <span ref={counter} className="text-text">
              01
            </span>{" "}
            / 0{projects.length}
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
          <span>Work</span>
        </div>
      </section>
    </div>
  );
}
