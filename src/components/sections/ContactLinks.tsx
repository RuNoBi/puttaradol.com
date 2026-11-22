"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "@/components/ui/icons";
import { profile } from "@/content/profile";

type Item = { label: string; value: string; href: string; external?: boolean; copy?: string };

const items: Item[] = [
  ...(profile.links.email
    ? [{ label: "Email", value: profile.links.email, href: `mailto:${profile.links.email}`, copy: profile.links.email }]
    : []),
  { label: "LinkedIn", value: "in/puttaradol", href: profile.links.linkedin, external: true },
  { label: "Instagram", value: "@run_ptrd", href: profile.links.instagram, external: true },
  { label: "GitHub", value: "RuNoBi", href: profile.links.github, external: true },
  { label: "Résumé", value: "View & download", href: "/resume" },
];

/** Big contact rows. Email copies to the clipboard (with a toast). */
export function ContactLinks() {
  const [copied, setCopied] = useState(false);

  return (
    <>
      <ul className="border-t border-line">
        {items.map((it) => {
          const content = (
            <>
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              <span className="relative col-span-4 text-label uppercase text-muted transition-colors duration-500 group-hover:text-bg md:col-span-3">
                {it.label}
              </span>
              <span className="relative col-span-7 text-[clamp(1.4rem,3vw,2.5rem)] leading-none font-medium tracking-[-0.04em] transition-colors duration-500 group-hover:text-bg md:col-span-8">
                {it.value}
              </span>
              <span className="relative col-span-1 flex justify-end transition-colors duration-500 group-hover:text-bg">
                <ArrowUpRight className="size-5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              </span>
            </>
          );
          const cls =
            "group relative grid grid-cols-12 items-center gap-x-4 md:gap-x-6 overflow-hidden border-b border-line px-1 py-5 md:px-3 md:py-7";
          return (
            <li key={it.label} data-reveal>
              {it.copy ? (
                <a
                  href={it.href}
                  className={cls}
                  onClick={(e) => {
                    if (!navigator.clipboard) return;
                    e.preventDefault();
                    navigator.clipboard.writeText(it.copy!).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    });
                  }}
                >
                  {content}
                </a>
              ) : it.external ? (
                <a href={it.href} target="_blank" rel="noreferrer" className={cls}>
                  {content}
                </a>
              ) : (
                <Link href={it.href} className={cls}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg"
          >
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
