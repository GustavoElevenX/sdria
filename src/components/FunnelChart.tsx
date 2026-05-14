import { Panel, PanelHeader } from "@/components/ui/panel";

export function FunnelChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <Panel>
      <PanelHeader title="Funil comercial" eyebrow="Importados → reunião" />
      <div className="space-y-3 p-4">
        {data.map((item) => (
          <div key={item.label} className="grid grid-cols-[120px_1fr_48px] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
            <strong className="text-right">{item.value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}
