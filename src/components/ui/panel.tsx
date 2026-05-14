import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-border bg-white shadow-panel", className)}>{children}</section>;
}

export function PanelHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border p-4">
      <div>
        {eyebrow ? <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p> : null}
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}
