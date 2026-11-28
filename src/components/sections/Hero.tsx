import type { CSSProperties } from "react";
import Link from "next/link";
import { AsciiPortrait } from "@/components/ascii/AsciiPortrait";
import { LocalTime } from "@/components/layout/LocalTime";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitName } from "@/components/motion/SplitName";
import { TextRoll } from "@/components/motion/TextRoll";
import { HeroScroll } from "@/components/sections/HeroScroll";
import { ArrowRight } from "@/components/ui/icons";
import { profile } from "@/content/profile";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  return (
    <HeroScroll>
      <section
        id="hero"
        className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col px-[var(--gutter)] pt-28 pb-6"
      >
        {/* Intro copy */}
        <div data-hero-copy className="relative z-10 flex flex-col gap-9 md:max-w-[min(46%,38rem)] md:pt-4">
          <div className="rise flex flex-wrap items-center gap-x-6 gap-y-3" style={delay(0)}>
            <p className="eyebrow">{profile.role} — Bangkok</p>
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_20%,transparent)]" />
              {profile.availability.label} · {profile.availability.period}
            </p>
          </div>

          <h2
            className="rise text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.06] font-light tracking-[-0.04em] text-balance"
            style={delay(1)}
          >
            I build pipelines that turn scattered data into{" "}
            <span className="text-muted">something people can actually use.</span>
          </h2>

          <p className="rise max-w-[44ch] text-[1.05rem] leading-relaxed text-muted" style={delay(2)}>
            {profile.summary}
          </p>

          <div className="rise flex flex-wrap gap-3" style={delay(3)}>
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-text py-3.5 pr-4 pl-6 text-sm text-bg transition-colors duration-500 hover:bg-accent"
              >
                <TextRoll>View the work</TextRoll>
                <span className="flex size-6 items-center justify-center rounded-full bg-bg/15">
                  <ArrowRight className="size-3" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href="/resume"
                className="group inline-flex items-center rounded-full border border-text/20 px-6 py-3.5 text-sm transition-colors duration-500 hover:border-accent"
              >
                <TextRoll>Résumé</TextRoll>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* ASCII portrait */}
        <figure
          data-hero-portrait
          className="mx-auto mt-14 w-full max-w-[380px] md:absolute md:top-24 md:right-[var(--gutter)] md:mt-0 md:h-[calc(100dvh-10rem)] md:w-auto md:max-w-[50vw]"
        >
          <figcaption className="mb-3 text-right text-label tracking-[0.22em] text-muted uppercase">
            <span className="hidden sm:inline">Hover to bring out the colour</span>
            <span className="sm:hidden">Drag to bring out the colour</span>
          </figcaption>
          <div className="relative md:h-[calc(100%-1.75rem)]">
            <AsciiPortrait
              src="/images/portrait-hd.webp"
              alt={`Portrait of ${profile.fullName}`}
              className="relative md:h-full md:w-auto"
            />
          </div>
        </figure>

        {/* Name — thin, wide, overlapping the faded bottom of the portrait */}
        <div data-hero-name className="relative z-10 mt-12 md:mt-auto">
          <SplitName
            text={profile.name}
            className="-ml-[0.04em] text-[clamp(3rem,14.4vw,14rem)] leading-[0.8] font-light tracking-[-0.045em] uppercase select-none"
          />
        </div>

        {/* Meta */}
        <div data-hero-meta className="relative z-10 mt-6">
          <div
            className="rise flex items-center gap-6 text-label tracking-[0.22em] text-muted uppercase"
            style={delay(5)}
          >
            <span className="tnum">
              {profile.location} · <LocalTime timeZone={profile.timezone} />
            </span>
            <span className="h-px flex-1 bg-line" />
            <span>Scroll</span>
          </div>
        </div>
      </section>
    </HeroScroll>
  );
}
