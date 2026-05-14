import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  FileBarChart,
  Inbox,
  Plug,
  Settings,
  Sparkles,
  Target,
  Users
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/conversas", label: "Conversas", icon: Inbox },
  { href: "/cases", label: "Cases", icon: Target },
  { href: "/conhecimento", label: "Conhecimento", icon: BookOpen },
  { href: "/playbook", label: "Playbook", icon: Sparkles },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/aprendizado", label: "Aprendizado", icon: Brain },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/integracoes", label: "Integrações", icon: Plug }
];

export const dynamic = "force-dynamic";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r border-border bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Bot size={20} />
          </div>
          <div>
            <p className="font-semibold">SDR IA</p>
            <p className="text-xs text-muted-foreground">Operação WhatsApp</p>
          </div>
        </div>
        <nav className="grid gap-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white/95 px-5 backdrop-blur">
          <div>
            <p className="text-sm font-medium">Empresa Demo</p>
            <p className="text-xs text-muted-foreground">Agente SDR consultivo com controle humano</p>
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">MVP operacional</div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
