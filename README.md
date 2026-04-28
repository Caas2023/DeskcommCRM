# DeskcommCRM

> CRM operacional multi-tenant para e-commerce, com IA conversacional integrada nativamente, WhatsApp via WAHA e LGPD nativa.

**Status:** MVP em desenvolvimento (Fase 1 — 8–12 semanas)
**Modo atual:** BPO interno (operadora atende múltiplos tenants)
**Modo futuro:** SaaS direto pra lojistas

---

## Visão de Produto

DeskcommCRM unifica atendimento humano, chatbot com RAG por tenant, gestão de pedidos e pipeline de pós-venda numa única plataforma multi-tenant. O canal primário é WhatsApp (via WAHA — API não-oficial). A arquitetura é multi-tenant desde o dia 1, sem refactor previsto pro pivot SaaS.

**Diferenciais competitivos:**

1. **IA operando o atendimento** com RAG por tenant (FAQ + política + catálogo Nuvemshop + conversas resolvidas), não chatbot decorativo.
2. **E-commerce-native**: pipeline e vocabulário desenhados pro ciclo "Carrinho abandonado → Pago → Enviado → Entregue → Pós-venda".
3. **MCP-ready**: arquitetura inclui MCP server (Fase 2) com 19 tools canônicas.
4. **LGPD nativa**: webhooks `customer/redact` e `customer/data_request` da Nuvemshop são contrato de primeira-classe.

---

## Stack

| Camada | Escolha |
|---|---|
| Frontend | Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui |
| Backend | Next.js Route Handlers (mesmo repo) |
| DB | Supabase (Postgres gerenciado, RLS em toda tabela tenant-aware) |
| Realtime | Supabase Realtime |
| Auth | Supabase Auth via `@supabase/ssr` |
| Storage | Supabase Storage |
| WhatsApp | WAHA Plus (engine NOWEB) |
| Hospedagem app | Vercel |
| Hospedagem WAHA | Railway (MVP) → VPS Hetzner (prod) |
| Validação | Zod |
| Rate limit | Upstash Redis |
| Cron | Vercel Cron |
| AI Gateway | Vercel AI Gateway (Anthropic primário, OpenAI backup) |
| Observability | Sentry |

---

## Como rodar local

### Pré-requisitos

- Node 20+ (use `nvm use` — `.nvmrc` está no repo)
- Docker + Docker Compose (pra WAHA local)
- Conta Supabase (projeto criado, plano free serve pra dev)
- Conta Upstash (Redis REST)
- Conta Sentry (opcional em dev)
- ngrok ou cloudflared (pra expor webhook do WAHA)

### Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar env
cp .env.example .env.local
# Preencher: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, INTERNAL_SECRET,
# WAHA_API_KEY (plaintext), UPSTASH_*, etc.

# 3. Rodar migrations Supabase (placeholder; schema real virá das specs)
npm run db:migrate

# 4. Subir WAHA local (com hash SHA512 da api key)
echo -n "$WAHA_API_KEY" | shasum -a 512 | awk '{print $1}' # → cole em WAHA_API_KEY_SHA512
docker compose up -d

# 5. Expor webhook publicamente (terminal separado)
ngrok http 3000  # → cole URL HTTPS em WAHA_WEBHOOK_BASE_URL e reinicie compose

# 6. Iniciar dev server
npm run dev
```

App: <http://localhost:3000>
WAHA dashboard: <http://localhost:3000/dashboard> (porta 3000 do container)
Health check: <http://localhost:3000/api/v1/health>

---

## Estrutura do Projeto

```
DeskcommCRM/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Rotas super-admin (admin.deskcomm.com)
│   ├── (app)/              # Rotas do tenant (app.deskcomm.com)
│   └── api/v1/             # API REST canônica
├── components/             # React components
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── supabase/           # Clients (browser, server, admin)
│   ├── waha/               # Cliente WAHA (Spec 03)
│   ├── ai/                 # IA + RAG (Spec 05)
│   ├── api/                # Wrappers, errors
│   └── env.ts              # Validação Zod das env vars
├── hooks/                  # React hooks compartilhados
├── supabase/
│   ├── config.toml
│   └── migrations/         # SQL versionado
├── tests/
│   ├── e2e/                # Playwright
│   └── unit/               # Vitest
├── scripts/                # CLI utilities (seed-tenant, etc.)
├── docs/                   # PRDs, specs, business rules, research
└── tasks/                  # Workflow de construção (todo.md)
```

---

## Documentação

- [`docs/prd/00-prd-master.md`](docs/prd/00-prd-master.md) — Visão e escopo
- [`docs/prd/01-prd-platform-base.md`](docs/prd/01-prd-platform-base.md) — Plataforma base (auth, tenancy, RBAC, LGPD)
- [`docs/research/reference-synthesis.md`](docs/research/reference-synthesis.md) — Arquitetura herdada
- [`CLAUDE.md`](CLAUDE.md) — Convenções e regras críticas (leitura obrigatória pra contribuir)

---

## Testes

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run test:unit     # Vitest
npm run test:e2e      # Playwright
```

---

## Licença

Proprietária. Todos os direitos reservados a Rafael Melgaço / DeskcommCRM. Uso, cópia ou redistribuição requerem autorização escrita.
