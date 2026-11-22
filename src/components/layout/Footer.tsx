import { LocalTime } from "@/components/layout/LocalTime";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="site-footer relative mx-auto max-w-[1440px] px-[var(--gutter)] pb-8">
      <div className="grid grid-cols-2 gap-y-3 border-t border-line pt-5 text-label uppercase text-muted md:grid-cols-4">
        <span>© 2026 {profile.fullName}</span>
        <span className="text-right md:text-left">
          Bangkok — <LocalTime timeZone={profile.timezone} />
        </span>
        <span>Next.js · Three.js · GSAP</span>
        <a href="#top" className="text-right transition-colors hover:text-text">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
