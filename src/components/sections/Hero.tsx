import type { CSSProperties } from "react";
import { AsciiPortrait } from "@/components/ascii/AsciiPortrait";
import { LocalTime } from "@/components/layout/LocalTime";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitName } from "@/components/motion/SplitName";
import { profile } from "@/content/profile";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-dvh max-w-[1440px] flex-col px-[var(--gutter)] pt-24 pb-5"
    >
      {/* Intro copy */}
      <div className="relative z-10 flex flex-col gap-8 md:max-w-[min(46%,40rem)] md:pt-6">
        <p
          className="rise inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm"
          style={delay(0)}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {profile.status}
        </p>
        <div className="flex flex-col gap-5">
          <p
            className="rise text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance"
            style={delay(1)}
          >
            {profile.role}
            <span className="text-muted"> — {profile.headline}</span>
          </p>
          <p className="rise max-w-[46ch] text-[1.05rem] leading-relaxed text-muted" style={delay(2)}>
            {profile.summary}
          </p>
        </div>
        <div className="rise flex flex-wrap gap-3" style={delay(3)}>
          <Magnetic>
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-text px-5 py-3 text-sm font-medium text-bg"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
              <span className="relative">View projects</span>
              <span aria-hidden className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-3 text-sm font-medium transition-colors duration-300 hover:border-muted"
            >
              Résumé
            </a>
          </Magnetic>
        </div>
      </div>

      {/* ASCII portrait — in flow on mobile, pinned right and behind the name on desktop */}
      <figure className="mx-auto mt-12 w-full max-w-[380px] md:absolute md:top-20 md:right-[var(--gutter)] md:mt-0 md:h-[calc(100dvh-9.5rem)] md:w-auto md:max-w-[50vw]">
        <figcaption className="mb-3 text-right text-sm text-muted">
          <span className="hidden sm:inline">Hover over the portrait ↓</span>
          <span className="sm:hidden">Drag over the portrait ↓</span>
        </figcaption>
        <AsciiPortrait
          src="/images/portrait.png"
          alt={`ASCII portrait of ${profile.name}`}
          className="md:h-[calc(100%-1.75rem)] md:w-auto"
        />
      </figure>

      {/* Name — overlaps the faded bottom of the portrait */}
      <SplitName
        text={profile.name}
        className="relative z-10 -ml-[0.05em] mt-10 text-[clamp(3.5rem,16.4vw,15rem)] leading-[0.86] font-semibold tracking-[-0.06em] text-text select-none md:mt-auto"
      />

      {/* Meta bar */}
      <div
        className="rise relative z-10 mt-5 flex justify-between border-t border-line pt-4 text-sm text-muted"
        style={delay(5)}
      >
        <span>
          {profile.location} · <LocalTime timeZone={profile.timezone} />
        </span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
