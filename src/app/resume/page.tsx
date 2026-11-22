import type { Metadata } from "next";
import { PrintButton } from "@/app/resume/PrintButton";
import { certifications, education, experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { categories, stack } from "@/content/stack";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.fullName} — ${profile.role}.`,
  alternates: { canonical: "/resume" },
};

const site = profile.siteUrl.replace("https://", "");

/** One-page résumé generated from the same content as the site. Print → PDF. */
export default function Resume() {
  return (
    <div className="resume mx-auto max-w-[1440px] px-[var(--gutter)] pt-28 pb-20 md:pt-36">
      <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-label uppercase text-muted">Résumé — always in sync with this site</p>
        <PrintButton />
      </div>

      <article className="resume-sheet mx-auto max-w-[860px] rounded-3xl border border-line bg-surface/80 p-8 md:p-14">
        <header className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[2.5rem] leading-none font-semibold tracking-[-0.045em]">{profile.fullName}</h1>
            <p className="mt-3 text-lg text-muted">
              {profile.role} · {education.field}, {education.school}
            </p>
          </div>
          <ul className="flex flex-col gap-1 text-sm text-muted md:text-right">
            <li>{profile.location.replace(", TH", ", Thailand")}</li>
            {profile.links.email && <li>{profile.links.email}</li>}
            <li>{site}</li>
            <li>linkedin.com/in/puttaradol</li>
            <li>github.com/RuNoBi</li>
          </ul>
        </header>

        <Block title="Summary">
          <p className="leading-relaxed">
            {profile.summary} I focus on {profile.focus.replaceAll(" · ", ", ")}.
          </p>
        </Block>

        <Block title="Experience">
          <div className="flex flex-col gap-8">
            {experience.map((r) => (
              <div key={r.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {r.title} — {r.company}
                  </h3>
                  <span className="tnum text-sm text-muted">{r.period}</span>
                </div>
                <p className="text-sm text-muted">
                  {r.location} · {r.type}
                </p>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[0.95rem] leading-relaxed marker:text-muted">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Projects">
          <div className="flex flex-col gap-5">
            {projects.map((p) => (
              <div key={p.slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="text-sm text-muted">{p.context}</span>
                </div>
                <p className="mt-1 text-[0.95rem] leading-relaxed">{p.short}</p>
                <p className="mt-1 text-sm text-muted">{p.stack.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold">{education.school}</h3>
            <span className="tnum text-sm text-muted">{education.period}</span>
          </div>
          <p className="text-[0.95rem]">
            {education.degree}, {education.field}
          </p>
        </Block>

        <Block title="Skills">
          <dl className="grid gap-2 text-[0.95rem]">
            {categories.map((c) => (
              <div key={c} className="grid grid-cols-[11rem_1fr] gap-4">
                <dt className="text-muted">{c}</dt>
                <dd>
                  {stack
                    .filter((s) => s.category === c)
                    .map((s) => s.name)
                    .join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Certificates" last>
          <ul className="flex flex-col gap-1.5 text-[0.95rem]">
            {certifications.map((c) => (
              <li key={c.name} className="flex flex-wrap justify-between gap-2">
                <span>
                  {c.name} — <span className="text-muted">{c.issuer}</span>
                </span>
                <span className="tnum text-sm text-muted">{c.date}</span>
              </li>
            ))}
          </ul>
        </Block>
      </article>
    </div>
  );
}

function Block({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={`grid gap-4 py-8 md:grid-cols-[9rem_1fr] md:gap-8 ${last ? "" : "border-b border-line"}`}>
      <h2 className="text-label uppercase text-muted">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
