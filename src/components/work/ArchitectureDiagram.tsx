import { Fragment } from "react";
import type { DiagramStage } from "@/content/projects";

type Props = { stages: DiagramStage[]; compact?: boolean; vertical?: boolean };

/**
 * Data-flow diagram built from content: stage columns joined by connectors
 * with a looping data packet. Horizontal on wide screens, vertical on mobile
 * (always horizontal when compact).
 */
export function ArchitectureDiagram({ stages, compact, vertical }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-0">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && <span className="flow-x relative h-px min-w-4 flex-1 bg-line" style={{ "--d": `${i * 0.35}s` } as React.CSSProperties} />}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="rounded-md border border-line bg-bg px-2 py-1 text-[0.68rem] whitespace-nowrap text-text">
                {s.nodes[0].name}
              </span>
              <span className="text-[0.6rem] tracking-[0.08em] text-muted uppercase">{s.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }

  if (vertical) {
    return (
      <ol className="flex flex-col">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && (
              <li aria-hidden className="grid grid-cols-[6.5rem_1fr] gap-4 sm:grid-cols-[8rem_1fr]">
                <span />
                <span
                  className="flow-y relative ml-5 h-7 w-px bg-line"
                  style={{ "--d": `${i * 0.4}s` } as React.CSSProperties}
                />
              </li>
            )}
            <li className="grid grid-cols-[6.5rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr]">
              <span className="text-label tracking-[0.18em] text-muted uppercase">
                <span className="tnum text-accent">0{i + 1}</span> {s.label}
              </span>
              <span className="flex flex-wrap gap-2">
                {s.nodes.map((n) => (
                  <span
                    key={n.name}
                    className="inline-flex items-baseline gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[0.95rem]"
                  >
                    {n.name}
                    {n.note && <span className="hidden text-xs text-muted sm:inline">{n.note}</span>}
                  </span>
                ))}
              </span>
            </li>
          </Fragment>
        ))}
      </ol>
    );
  }

  return (
    <div className="flex flex-col items-stretch md:flex-row md:items-center">
      {stages.map((s, i) => (
        <Fragment key={s.label}>
          {i > 0 && (
            <>
              <span
                aria-hidden
                className="flow-y relative mx-auto h-10 w-px bg-line md:hidden"
                style={{ "--d": `${i * 0.4}s` } as React.CSSProperties}
              />
              <span
                aria-hidden
                className="flow-x relative hidden h-px min-w-3 flex-[0.35] bg-line md:block"
                style={{ "--d": `${i * 0.4}s` } as React.CSSProperties}
              />
            </>
          )}
          <div data-reveal className="flex min-w-0 flex-col gap-2 md:max-w-[12rem] md:flex-1">
            <span className="truncate text-label tracking-[0.18em] text-muted uppercase">
              <span className="tnum text-accent">0{i + 1}</span> {s.label}
            </span>
            <div className="flex flex-col gap-2">
              {s.nodes.map((n) => (
                <div key={n.name} className="rounded-xl border border-line bg-surface px-3 py-2.5 lg:px-4 lg:py-3">
                  <div className="text-[0.9rem] leading-snug font-normal break-words">{n.name}</div>
                  {n.note && <div className="mt-0.5 text-xs text-muted">{n.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
