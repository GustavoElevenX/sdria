import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <Panel className="w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">SDR IA WhatsApp</h1>
            <p className="text-sm text-muted-foreground">Acesso à operação comercial</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span>Email</span>
            <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" placeholder="admin@empresa.com" />
          </label>
          <label className="grid gap-2 text-sm">
            <span>Senha</span>
            <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" type="password" placeholder="••••••••" />
          </label>
          <Button>Entrar</Button>
        </div>
      </Panel>
    </main>
  );
}
