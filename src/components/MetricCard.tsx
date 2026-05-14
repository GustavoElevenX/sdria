import { Panel } from "@/components/ui/panel";

export function MetricCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <Panel className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <strong className="text-2xl font-semibold">{value}</strong>
        {trend ? <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{trend}</span> : null}
      </div>
    </Panel>
  );
}
