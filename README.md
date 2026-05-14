# SDR IA WhatsApp

MVP de plataforma B2B para operar um agente SDR conversacional via WhatsApp.

O projeto cobre:

- CRM de leads com score de contexto.
- Importação de leads com fluxo CSV/XLSX planejado.
- Detalhe do lead com análise da IA, perguntas internas e cases.
- Base de cases e base de conhecimento.
- Inbox estilo WhatsApp/CRM com controle IA/humano.
- Playbook, templates, agenda, aprendizado operacional, relatórios e integrações.
- APIs conectadas a Supabase, OpenAI, WhatsApp Cloud API e Google Calendar quando as variáveis de ambiente estão configuradas.

Sem credenciais no `.env`, as telas carregam em modo vazio/configuração pendente. O sistema não simula operação real como se estivesse conectado.
- Migration Supabase/Postgres com pgvector em `supabase/schema.sql`.

## Rodar localmente

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` e preencha apenas segredos técnicos. Cadastre uma empresa em `companies` e informe `DEFAULT_COMPANY_ID`, ou deixe o sistema usar a primeira empresa cadastrada.
