"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { TextRoll } from "@/components/motion/TextRoll";
import { profile } from "@/content/profile";

const items = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Hide when scrolling down, reveal when scrolling up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !menu);
  });

  // Highlight the section in view (home page only).
  useEffect(() => {
    if (!onHome) return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  // Lock scroll while the mobile menu is open.
  const wasOpen = useRef(false);
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (menu) {
      wasOpen.current = true;
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
  }, [menu]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="site-header fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`absolute inset-0 -z-10 border-b transition-colors duration-500 ${
            scrolled && !menu ? "border-line bg-bg/92" : "border-transparent"
          }`}
        />
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-[var(--gutter)] py-4 text-sm">
          <Link
            href="/"
            className="text-[0.8rem] font-normal tracking-[0.32em] uppercase"
            onClick={() => setMenu(false)}
          >
            {profile.name}
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  className={`group relative flex items-center gap-2 text-label tracking-[0.22em] uppercase transition-colors duration-500 ${
                    active === item.id ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <span
                    className={`size-1 rounded-full bg-accent transition-transform duration-500 ease-lux ${
                      active === item.id ? "scale-100" : "scale-0"
                    }`}
                  />
                  <TextRoll>{item.label}</TextRoll>
                </a>
              </li>
            ))}
            <li className="ml-2">
              <Link
                href="/resume"
                className="group inline-flex rounded-full border border-text/20 px-5 py-2.5 text-label tracking-[0.22em] uppercase transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-bg"
              >
                <TextRoll>Résumé</TextRoll>
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="relative flex h-9 w-14 items-center justify-end md:hidden"
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            <span className="text-label tracking-[0.22em] uppercase">{menu ? "Close" : "Menu"}</span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-bg px-[var(--gutter)] pt-24 pb-10 md:hidden"
          >
            <ul className="flex flex-col">
              {[...items, { id: "resume", label: "Résumé" }].map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={item.id === "resume" ? "/resume" : href(item.id)}
                    onClick={() => setMenu(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline justify-between py-4 text-[2.8rem] leading-none font-light tracking-[-0.045em]"
                  >
                    {item.label}
                    <span className="tnum text-label text-muted">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-6 text-sm text-muted">
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
