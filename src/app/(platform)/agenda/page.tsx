import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { checkCalendarAvailability } from "@/lib/services/calendar-service";

export default function AgendaPage() {
  const availability = checkCalendarAvailability("closer-default", { start: new Date().toISOString(), end: new Date().toISOString() });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <p className="text-sm text-muted-foreground">Disponibilidade do closer, regras de reunião e criação de evento.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <PanelHeader title="Regras configuráveis" />
          <div className="grid gap-3 p-4 text-sm">
            {["Duração padrão da reunião", "Dias disponíveis", "Horários disponíveis", "Tempo mínimo de antecedência", "Intervalo entre reuniões", "Título padrão", "Descrição padrão", "Participantes internos", "Link online"].map((rule) => (
              <label key={rule} className="grid gap-1">
                <span>{rule}</span>
                <input className="h-9 rounded-md border border-border px-3 outline-none focus:border-primary" />
              </label>
            ))}
          </div>
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
          </div>
        </Panel>
      </div>
    </div>
  );
}
