import { CheckCircle2, Circle, Clock, MapPin, User } from "lucide-react";
import { stageLabel, timelineStages, type LotEvent } from "@/lib/timeline";

export function LotTimeline({ events }: { events: LotEvent[] }) {
  const byStage = new Map(events.map((e) => [e.stage, e]));

  return (
    <ol className="relative space-y-0">
      {timelineStages.map((stage, i) => {
        const ev = byStage.get(stage);
        const done = Boolean(ev);
        const last = i === timelineStages.length - 1;
        return (
          <li key={stage} className="relative flex gap-3 pb-5 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className={
                  "absolute left-[11px] top-6 h-full w-0.5 " + (done ? "bg-primary/50" : "bg-border")
                }
              />
            ) : null}
            <span className="relative z-10 mt-0.5 shrink-0">
              {done ? (
                <CheckCircle2 className="size-6 text-primary" />
              ) : (
                <Circle className="size-6 text-muted-foreground/40" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className={done ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>
                  {stageLabel[stage]}
                </p>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                    (done ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground")
                  }
                >
                  {done ? "Completed" : "Pending"}
                </span>
              </div>
              {ev ? (
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" /> {ev.at}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="size-3.5" /> {ev.actor}
                  </span>
                  {ev.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {ev.location}
                    </span>
                  ) : null}
                  {ev.note ? <span className="w-full text-foreground/70">{ev.note}</span> : null}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Deterministic verification block rendered as a scannable-looking code. */
export function VerificationCode({ value }: { value: string }) {
  const size = 11;
  let h = 7;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i += 1) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push(((h >> 16) & 1) === 1);
  }
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className="grid gap-[2px] rounded-xl border border-border bg-card p-2"
        style={{ gridTemplateColumns: `repeat(${size}, 10px)` }}
        aria-label={`Verification code for ${value}`}
      >
        {cells.map((on, i) => (
          <span key={i} className={"size-[10px] rounded-[2px] " + (on ? "bg-foreground" : "bg-transparent")} />
        ))}
      </div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground">{value}</p>
    </div>
  );
}
