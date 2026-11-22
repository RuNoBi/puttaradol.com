"use client";

import { useEffect, useRef, useState } from "react";
import { onIntroDone } from "@/lib/intro";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * ASCII rendering of a transparent portrait. Hovering (or dragging on touch)
 * gradually reveals the photo's real colours; they fade back when you leave.
 * Three.js is loaded lazily so it never blocks the first paint.
 */
export function AsciiPortrait({ src, alt, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let handle: { dispose: () => void } | undefined;
    let stopWaiting = () => {};

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = getComputedStyle(document.body).fontFamily;

    import("./asciiRenderer")
      .then(({ createAsciiPortrait }) =>
        createAsciiPortrait(canvas, { src, fontFamily, reducedMotion }),
      )
      .then((h) => {
        if (disposed) return h.dispose();
        handle = h;
        setState("ready");
        stopWaiting = onIntroDone(() => h.play());
      })
      .catch((err) => {
        console.warn("ASCII portrait fell back to image:", err);
        if (!disposed) setState("fallback");
      });

    return () => {
      disposed = true;
      stopWaiting();
      handle?.dispose();
    };
  }, [src]);

  return (
    <div className={`relative aspect-[354/472] w-full cursor-crosshair ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className={`absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-700 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />
      {state === "fallback" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain grayscale" />
      )}
    </div>
  );
}
