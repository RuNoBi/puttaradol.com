import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ArrowLeft, ArrowUpRight, GitHub } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { getProject, projects } from "@/content/projects";

// Unknown slugs fall through to notFound() below (dynamicParams isn't
// available with cacheComponents).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.overview,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.short, type: "article" },
  };
}

export default function Page({ params }: PageProps<"/work/[slug]">) {
  // Params are read inside Suspense so client navigations stay instant.
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}

async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-[1600px] px-[var(--gutter)] pt-28 md:pt-36">
      {/* Header */}
      <Link href="/#work" className="group mb-14 inline-flex items-center gap-2 text-sm text-muted hover:text-text">
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
        All work
      </Link>

      <div className="mb-6 flex items-center gap-3 text-label tracking-[0.22em] uppercase text-muted">
        <span className="tnum text-accent">Case 0{index + 1}</span>
        <span>{p.kind}</span>
      </div>
      <SplitHeading
        as="h1"
        immediate
        delay={0.1}
        className="max-w-[16ch] text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.92] font-light tracking-[-0.05em]"
      >
        {p.title}
      </SplitHeading>
      <p className="mt-8 max-w-[44ch] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug text-muted">{p.short}</p>

      {/* Meta */}
      <Reveal className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {[
          ["Role", p.role],
          ["Context", p.context],
          ["Period", p.period],
          ["Key result", `${p.metric.value} ${p.metric.label}`],
        ].map(([k, v]) => (
          <div key={k} data-reveal className="flex flex-col gap-2 bg-bg p-5">
            <span className="text-label tracking-[0.22em] uppercase text-muted">{k}</span>
            <span className="text-[0.95rem]">{v}</span>
          </div>
        ))}
      </Reveal>

      {/* Results */}
      <Reveal className="mt-24 grid grid-cols-1 gap-10 md:mt-32 md:grid-cols-3">
        {p.results.map((r) => (
          <div key={r.label} data-reveal className="border-t border-line pt-5">
            <p className="tnum text-[clamp(2rem,4vw,3.5rem)] leading-none font-extralight tracking-[-0.05em] text-accent">
              {r.value}
            </p>
            <p className="mt-3 text-muted">{r.label}</p>
          </div>
        ))}
      </Reveal>

      {/* Story */}
      <div className="mt-28 flex flex-col gap-20 md:mt-40">
        {[
          ["Overview", p.overview],
          ["The problem", p.problem],
        ].map(([label, text]) => (
          <Reveal key={label} className="grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-4">
            <h2 data-reveal className="col-span-12 text-label tracking-[0.22em] uppercase text-muted md:col-span-3">
              {label}
            </h2>
            <p
              data-reveal
              className="col-span-12 max-w-[38ch] text-[clamp(1.4rem,2.6vw,2.3rem)] leading-[1.2] font-light tracking-[-0.03em] md:col-span-9"
            >
              {text}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Architecture */}
      <section className="mt-28 md:mt-40">
        <div className="mb-10 flex items-center justify-between border-t border-line pt-4 text-label tracking-[0.22em] uppercase text-muted">
          <span>Architecture</span>
          <span>data flow →</span>
        </div>
        <Reveal stagger={0.1} className="rounded-[2rem] border border-line bg-surface/60 p-6 md:p-10">
          <ArchitectureDiagram stages={p.architecture} />
        </Reveal>
      </section>

      {/* What I built */}
      <section className="mt-28 grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-8 md:mt-40">
        <h2 className="col-span-12 text-label tracking-[0.22em] uppercase text-muted md:col-span-3">What I built</h2>
        <Reveal as="ol" className="col-span-12 border-t border-line md:col-span-9">
          {p.built.map((b, i) => (
            <li key={b} data-reveal className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6 md:text-lg">
              <span className="tnum text-sm text-muted md:text-base">0{i + 1}</span>
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Stack + links */}
      <section className="mt-28 grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-8 md:mt-40">
        <h2 className="col-span-12 text-label tracking-[0.22em] uppercase text-muted md:col-span-3">Stack</h2>
        <div className="col-span-12 flex flex-col gap-10 md:col-span-9">
          <div className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          {p.repo && (
            <div className="flex flex-col gap-4">
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-3 rounded-full border border-line px-5 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <GitHub />
                View repository
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              {p.repoNote && <p className="max-w-[60ch] text-sm leading-relaxed text-muted">{p.repoNote}</p>}
            </div>
          )}
        </div>
      </section>

      {/* Next */}
      <Link href={`/work/${next.slug}`} className="group mt-32 mb-16 block border-t border-line pt-6 md:mt-48">
        <span className="text-label tracking-[0.22em] uppercase text-muted">Next case</span>
        <span className="mt-6 flex items-end justify-between gap-6">
          <span className="text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.92] font-light tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent">
            {next.title}
          </span>
          <span className="mb-2 flex size-14 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg md:size-20">
            <ArrowUpRight className="size-5 md:size-6" />
          </span>
        </span>
      </Link>
    </article>
  );
}
