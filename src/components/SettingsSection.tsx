import { Panel, PanelHeader } from "@/components/ui/panel";

export function SettingsSection({ title, fields }: { title: string; fields: Array<{ label: string; value: string }> }) {
  return (
    <Panel>
      <PanelHeader title={title} />
      <div className="grid gap-4 p-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="grid gap-2 text-sm">
            <span className="font-medium">{field.label}</span>
            <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" defaultValue={field.value} />
          </label>
        ))}
      </div>
    </Panel>
  );
}
