# App routes (tenant)

> Placeholder. Rotas vivem em `app.deskcomm.com` (ou subdomínio do tenant no SaaS).

Conteúdo a popular conforme Specs 02, 03, 04, 05, 06:

- `/app/inbox` — caixa de entrada de conversas WhatsApp do tenant
- `/app/conversations/[id]` — visualizador 3-colunas (lista + chat + sidepanel CRM)
- `/app/contacts` — Customer 360°
- `/app/leads` — Kanban de pipelines (drag-drop com `@hello-pangea/dnd`)
- `/app/orders` — pedidos sincronizados da Nuvemshop
- `/app/settings/{channels,team,ai-agent,nuvemshop,lgpd}` — configuração

Toda rota é tenant-aware. RLS filtra automaticamente; nunca confiar em `organization_id` vindo do client.
