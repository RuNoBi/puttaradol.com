"use client";

import { useEffect, useRef, useState } from "react";
import { onIntroDone } from "@/lib/intro";

/** Fixed, full-screen animated background. Loads Three.js lazily. */
export function DataField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let handle: { play: () => void; dispose: () => void } | undefined;
    let stopWaiting = () => {};

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("./dataFieldRenderer")
      .then(({ createDataField }) => {
        if (disposed) return;
        handle = createDataField(canvas, { reducedMotion });
        setReady(true);
        stopWaiting = onIntroDone(() => handle?.play());
      })
      .catch((err) => console.warn("Background disabled:", err));

    return () => {
      disposed = true;
      stopWaiting();
      handle?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 h-full w-full transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
