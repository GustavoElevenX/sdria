# SDR IA WhatsApp

MVP de plataforma B2B para operar um agente SDR conversacional via WhatsApp.

O projeto cobre:

- CRM de leads com score de contexto.
- Importação de leads com fluxo CSV/XLSX planejado.
- Detalhe do lead com análise da IA, perguntas internas e cases.
- Base de cases e base de conhecimento.
- Inbox estilo WhatsApp/CRM com controle IA/humano.
- Playbook, templates, agenda, aprendizado operacional, relatórios e integrações.
- APIs mockadas para evoluir para Supabase, OpenAI, WhatsApp Cloud API e Google Calendar.
- Migration Supabase/Postgres com pgvector em `supabase/schema.sql`.

## Rodar localmente

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` e preencha apenas segredos técnicos quando for ligar integrações reais.
