import Link from "next/link";
import { ArrowLeft } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80dvh] max-w-[1600px] flex-col justify-end px-[var(--gutter)] pt-32 pb-16">
      <h1 className="text-[clamp(5rem,22vw,20rem)] leading-[0.8] font-extralight tracking-[-0.06em]">404</h1>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
        <p className="text-xl text-muted">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
        >
          <ArrowLeft />
          Back home
        </Link>
      </div>
    </section>
  );
}
