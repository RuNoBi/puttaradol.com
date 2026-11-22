"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { ArrowUpRight } from "@/components/ui/icons";
import type { Project } from "@/content/projects";

/**
 * Index of projects. On mouse devices a preview card (flow diagram + key
 * metric) follows the cursor over the hovered row.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.4 });

  const current = active === null ? null : projects[active];

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <li key={p.slug} data-reveal>
            <Link
              href={`/work/${p.slug}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              className="group relative grid grid-cols-12 items-baseline gap-x-4 md:gap-x-6 gap-y-3 border-b border-line py-8 transition-colors duration-500 md:py-10"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
              <span className="tnum relative col-span-2 text-label text-muted md:col-span-1">0{i + 1}</span>
              <div className="relative col-span-10 flex flex-col gap-2 md:col-span-5">
                <h3 className="text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.04em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                  {p.title}
                </h3>
                <p className="max-w-[52ch] text-sm text-muted transition-transform delay-[40ms] duration-500 ease-out-expo group-hover:translate-x-3">
                  {p.short}
                </p>
              </div>
              <div className="relative col-span-6 col-start-3 flex flex-col gap-1 text-sm md:col-span-3 md:col-start-auto">
                <span>{p.kind}</span>
                <span className="text-muted">{p.context}</span>
              </div>
              <div className="relative col-span-4 flex items-baseline justify-end gap-3 md:col-span-3">
                <span className="tnum text-right text-sm whitespace-nowrap text-text md:text-base">{p.metric.value}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                  <ArrowUpRight />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview (mouse only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[26rem] md:block"
        style={{ x, y, translateX: "6%", translateY: "-112%" }}
      >
        <AnimatePresence>
          {current && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-[0_24px_60px_-20px_rgba(17,17,17,0.25)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between text-label uppercase text-muted">
                    <span>{current.kind}</span>
                    <span>{current.period}</span>
                  </div>
                  <ArchitectureDiagram stages={current.architecture} compact />
                  <div className="flex items-end justify-between border-t border-line pt-4">
                    <span className="tnum text-3xl font-medium tracking-[-0.04em] text-accent">{current.metric.value}</span>
                    <span className="text-xs text-muted">{current.metric.label}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
