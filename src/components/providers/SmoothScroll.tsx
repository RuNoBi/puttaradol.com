"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { isIntroDone, onIntroDone } from "@/lib/intro";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * stay in lock-step. Skipped entirely for reduced-motion users.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -72 },
      autoRaf: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold scrolling while the boot loader is on screen.
    if (!isIntroDone()) lenis.stop();
    const stopWaiting = onIntroDone(() => lenis.start());

    // Layout can shift once fonts and images settle, or when accordions and
    // filters change the page height — keep trigger positions in sync.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    let lastHeight = document.body.scrollHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = window.setTimeout(refresh, 250);
    });
    ro.observe(document.body);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      stopWaiting();
      ro.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
