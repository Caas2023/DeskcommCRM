# DeskcommCRM — Workflow de Construção

Ordem definida pelo Rafael: **PRD → Regras de Negócio → Specs → Epics → Stories → Plano com Tasks**.

---

## Fase 0 — Brainstorming (em andamento)

- [x] Entender demanda e confirmar com o usuário
- [x] Decidir tenancy model (multi-tenant clássico desde dia 1)
- [x] Decidir escopo MVP (Opção B — com IA core)
- [x] Decidir integração e-commerce (Nuvemshop only)
- [x] Decidir perfil do primeiro tenant (PME médio)
- [x] Ler material de referência da Aula CRM Nichado WAHA
- [x] Decidir adoção da arquitetura de referência (integral, opção A)
- [x] Criar skeleton de docs do projeto
- [x] Preservar síntese da referência em `docs/research/`

## Fase 1 — PRD-Mestre + sub-PRDs

- [x] Escrever PRD-Mestre (`docs/prd/00-prd-master.md`) — visão, problema, escopo, stakeholders, métricas, restrições — **v0.1 escrito, em revisão pelo Rafael**
- [x] Sub-PRD 01: Plataforma Base (auth, multi-tenant, RBAC, audit, LGPD framework) — **v0.1 escrito**
- [x] Sub-PRD 02: Customer 360° + Identity Resolution determinística — **v0.1 escrito**
- [x] Sub-PRD 03: Canal WhatsApp (WAHA + anti-banimento + janela 24h + multi-atendente) — **v0.1 escrito**
- [x] Sub-PRD 04: Pipeline Kanban + Atendimento + Tickets + Handoff — **v0.1 escrito**
- [x] Sub-PRD 05: IA Conversacional (chatbot + RAG por tenant + sentiment detection) — **v0.1 escrito**
- [x] Sub-PRD 06: Integração Nuvemshop + LGPD webhooks — **v0.1 escrito**
- [x] Revisão final do PRD-Mestre + sub-PRDs — **spot-check de consistência cross-doc passou**

## Fase 2 — Regras de Negócio

- [x] Regras de tenancy e isolamento (T-01 a T-08) — em `docs/business-rules/00-business-rules-catalog.md`
- [x] Regras LGPD (L-01 a L-10) — idem
- [x] Regras WhatsApp (W-01 a W-12) — idem
- [x] Regras de pipeline (P-01 a P-08) — idem
- [x] Regras de atendimento (AT-01 a AT-08) — idem
- [x] Regras de IA (IA-01 a IA-11) — idem
- [x] Regras de billing/uso (B-01 a B-05) — idem

## Fase 3 — Specs Técnicas

- [ ] Spec arquitetural geral (camadas, contratos, fluxos)
- [ ] Spec de schema do banco (todas as tabelas + RLS + indexes + triggers)
- [ ] Spec da API REST `/api/v1/` (endpoints + payloads + erros)
- [ ] Spec de eventos (event_log + workers + naming)
- [ ] Spec de webhooks inbound/outbound (HMAC + retry + idempotência)
- [ ] Spec de WAHA integration (setup, sessões, handlers)
- [ ] Spec de RAG por tenant (vector store, ingestão, roteamento)
- [ ] Spec de UI (3 colunas chat, kanban, dashboards)
- [ ] Spec de auth + RBAC + super-admin
- [ ] Spec de observability (logs, métricas, audit, Sentry)

## Fase 4 — Epics

- [ ] Epic E1: Plataforma Base
- [ ] Epic E2: Conexão WhatsApp + Inbox Live
- [ ] Epic E3: Customer 360° + Identity Resolution
- [ ] Epic E4: Pipeline Kanban + Atendimento Humano
- [ ] Epic E5: IA Conversacional + Handoff
- [ ] Epic E6: Integração Nuvemshop + LGPD
- [ ] Epic E7: Hardening + Observability + Deploy

## Fase 5 — Stories

- [ ] Detalhar stories de cada epic com ACs
- [ ] Estimativas relativas (T-shirt sizing)
- [ ] Priorizar por Now/Next/Later

## Fase 6 — Plano de Tasks

- [ ] Quebrar stories em tasks técnicas
- [ ] Sequenciar com dependências explícitas
- [ ] Cronograma e marcos
