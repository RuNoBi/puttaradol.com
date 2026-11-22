import { LocalTime } from "@/components/layout/LocalTime";
import { profile } from "@/content/profile";

/** Footer with a full-width wordmark, cropped at the bottom edge. */
export function Footer() {
  return (
    <footer className="site-footer relative mx-auto max-w-[1600px] overflow-hidden px-[var(--gutter)] pt-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 text-label tracking-[0.22em] text-muted uppercase">
        <span>© 2026 {profile.fullName}</span>
        <span className="tnum">
          Bangkok · <LocalTime timeZone={profile.timezone} />
        </span>
        <span className="hidden h-px flex-1 bg-line md:block" />
        <a href="#top" className="transition-colors hover:text-accent">
          Back to top ↑
        </a>
      </div>
      <p
        aria-hidden
        className="mt-10 -mb-[0.22em] text-center text-[16.2vw] leading-[0.8] font-extralight tracking-[-0.055em] whitespace-nowrap uppercase select-none 2xl:text-[15.5rem]"
      >
        {profile.name}
      </p>
    </footer>
  );
}
