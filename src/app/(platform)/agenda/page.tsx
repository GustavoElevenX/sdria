import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { SchedulingRulesForm } from "@/components/SchedulingRulesForm";
import { checkCalendarAvailability, getDefaultCalendarDateRange } from "@/lib/services/calendar-service";
import { getAgentSettings } from "@/lib/services/settings-service";

export default async function AgendaPage() {
  const range = getDefaultCalendarDateRange();
  const settings = await getAgentSettings();
  const availability = await checkCalendarAvailability("closer-default", {
    start: range.start,
    end: range.end
  });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <p className="text-sm text-muted-foreground">Disponibilidade do closer, regras de reunião e criação de evento.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <PanelHeader title="Regras configuráveis" />
          <SchedulingRulesForm settings={settings} />
        </Panel>
        <Panel>
          <PanelHeader title="Horários sugeridos pela IA" action={<Button><CalendarDays size={16} /> Conectar Google</Button>} />
          <div className="grid gap-3 p-4 md:grid-cols-3">
            {availability.slots.map((slot) => (
              <div key={slot.startsAt} className="rounded-lg border border-border p-4">
                <p className="font-medium">{new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(slot.startsAt))}</p>
                <p className="mt-2 text-sm text-muted-foreground">{new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(slot.startsAt))}</p>
                <Button className="mt-4 w-full" variant="secondary">Oferecer ao lead</Button>
              </div>
            ))}
            {!availability.slots.length ? <p className="text-sm text-muted-foreground">Nenhum horário disponível ou Google Calendar ainda não configurado.</p> : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}
