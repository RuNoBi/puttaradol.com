import { Fragment } from "react";
import type { DiagramStage } from "@/content/projects";

type Props = { stages: DiagramStage[]; compact?: boolean };

/**
 * Data-flow diagram built from content: stage columns joined by connectors
 * with a looping data packet. Horizontal on wide screens, vertical on mobile
 * (always horizontal when compact).
 */
export function ArchitectureDiagram({ stages, compact }: Props) {
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
                className="flow-x relative hidden h-px min-w-6 flex-1 bg-line md:block"
                style={{ "--d": `${i * 0.4}s` } as React.CSSProperties}
              />
            </>
          )}
          <div data-reveal className="flex flex-col gap-2 md:max-w-[12rem] md:min-w-[8.5rem] md:shrink-0">
            <span className="text-label uppercase text-muted">
              <span className="tnum text-accent">0{i + 1}</span> {s.label}
            </span>
            <div className="flex flex-col gap-2">
              {s.nodes.map((n) => (
                <div key={n.name} className="rounded-xl border border-line bg-surface px-4 py-3">
                  <div className="text-[0.95rem] font-medium">{n.name}</div>
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
