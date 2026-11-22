"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plus } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import type { Role } from "@/content/experience";

/** Roles as an accordion log. The latest role starts open. */
export function ExperienceList({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol className="border-t border-line">
      {roles.map((r, i) => {
        const isOpen = open === i;
        const panelId = `role-${i}`;
        return (
          <li key={r.company} data-reveal className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group grid w-full grid-cols-12 items-baseline gap-x-4 md:gap-x-6 gap-y-2 py-8 text-left md:py-10"
            >
              <span className="tnum col-span-12 text-label tracking-[0.22em] text-muted uppercase md:col-span-2">{r.period}</span>
              <span className="col-span-10 flex flex-col gap-1 md:col-span-6">
                <span className="text-[clamp(1.8rem,3.4vw,3.25rem)] leading-[1] font-light tracking-[-0.045em] transition-colors duration-500 group-hover:text-accent">
                  {r.company}
                </span>
                <span className="text-muted">{r.title}</span>
              </span>
              <span className="col-span-12 hidden text-sm text-muted md:col-span-3 md:block">
                {r.location}
                <br />
                {r.type}
              </span>
              <span className="col-span-2 flex justify-end md:col-span-1">
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="flex size-9 items-center justify-center rounded-full border border-line group-hover:border-muted"
                >
                  <Plus />
                </motion.span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6 pb-10">
                    <div className="col-span-12 flex flex-col gap-6 md:col-span-6 md:col-start-3">
                      <p className="text-xl leading-snug font-light tracking-[-0.02em]">{r.summary}</p>
                      <ul className="flex flex-col gap-3">
                        {r.points.map((pt) => (
                          <li key={pt} className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-muted">
                            <span className="text-accent">—</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-12 flex flex-col gap-5 md:col-span-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.tools.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                      {r.project && (
                        <Link
                          href={`/work/${r.project}`}
                          className="group/link inline-flex items-center gap-2 text-sm text-text"
                        >
                          <span className="border-b border-line pb-0.5 transition-colors group-hover/link:border-accent">
                            Read the case study
                          </span>
                          <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
