---
title: Specs Reconciliation Log
version: 1.0
status: ativo
date: 2026-04-28
owner: Rafael Melgaço
---

# Specs Reconciliation Log

> Registro canônico das reconciliações entre Specs 01-09 quando conflitos foram detectados durante o consolidation pass da Spec 09. Decisões aqui **sobrescrevem** texto em specs individuais que conflite — texto antigo permanece pra histórico mas as edições foram aplicadas in-place.

## Contexto

A Spec 09 (Frontend↔Backend Integration Contract) consolidou comunicação ponta-a-ponta antes da implementação das telas P0. Durante o processo, 5 inconsistências de nomenclatura/canonicidade foram detectadas entre Specs anteriores. Resolvidas em 2026-04-28, nesta ordem:

## R-01 — Nomenclatura de canal Realtime: plural

**Conflito**: Spec 04 §4.2 usava `useChannelSession` com canal nomeado `org-{orgId}-channel-session` (singular). Spec 09 §6 (Realtime Channel Registry) padronizou todos canais como plural alinhado ao nome da tabela observada.

**Decisão canônica**: canal de `useChannelSession` é `channel-sessions-{orgId}` (plural).

**Aplicação**:
- ✅ Spec 04 §4.2 — texto atualizado in-place
- ✅ Spec 09 §6 — já usava plural

**Justificativa**: convenção uniforme em todos os 17 canais do registry; nome do canal espelha nome da tabela (`channel_sessions`).

---

## R-02 — Error code canônico para "sem credencial válida"

**Conflito**: Spec 01 §7.5 catalogou `auth_required` (401). Specs informais e usos coloquiais usaram `unauthenticated`.

**Decisão canônica**: **`auth_required`** é o único error code aceito pra HTTP 401 sem credencial. `unauthenticated` é proibido como código (mas pode aparecer em descrições humanas).

**Aplicação**:
- ✅ Spec 01 §7.5 — adicionada nota canônica
- ✅ Spec 09 §8 — já usava `auth_required` exclusivamente
- 🔁 Code reviews futuras devem rejeitar uso de `unauthenticated` em error codes

---

## R-03 — Error codes ausentes em Spec 01 §7.5

**Conflito**: Specs 02, 04 e 09 referenciavam codes que não estavam no catálogo canônico de Spec 01 §7.5.

**Decisão canônica**: 7 novos error codes adicionados a Spec 01 §7.5:

| Code | HTTP | Origem |
|---|:---:|---|
| `conversation_already_claimed` | 409 | Spec 04 §9.2 (AT-02 atomic claim) |
| `pipeline_immutable_use_clone` | 422 | Sub-PRD 02 P-01 |
| `lost_reason_required` | 422 | Sub-PRD 02 P-03 |
| `lost_reason_invalid` | 422 | Sub-PRD 02 P-03 |
| `phone_must_be_e164` | 422 | Spec 02 §3.1 |
| `merge_irreversible` | 405 | Spec 02 §3.4 (merge_queue) |

**Aplicação**:
- ✅ Spec 01 §7.5 — tabela ampliada
- ✅ Spec 09 §8 — error→UI playbook já cobria todos

---

## R-04 — OCC com `expected_updated_at` em mutations de leads

**Conflito**: Spec 02 sugeriu Optimistic Concurrency Control via header `If-Unmodified-Since` ou body `expected_updated_at` em mutations de `crm_leads`. Pergunta: a coluna `updated_at` existe e é confiável?

**Decisão canônica**: **CONFIRMADO**. `crm_leads.updated_at` existe via migration 0003 e é mantida pelo trigger `fn_set_updated_at` em todo UPDATE. Pode ser usada como token OCC em headers `If-Unmodified-Since: <iso>` ou body `expected_updated_at: <iso>`. Em conflito (`updated_at` no servidor > `expected_updated_at` no request), retorna 409 com error code `concurrent_update`.

**Aplicação**:
- ✅ Sem mudança em código/spec — comportamento já correto
- 🔁 Spec 01 §7.5 — adicionar `concurrent_update` (409) em próxima revisão (Wave de implementação)

---

## R-05 — `connectNuvemshop` como Server Action

**Conflito**: Spec 06 §4.2 documentou OAuth start como rota REST `GET /api/v1/integrations/nuvemshop/connect` que faz redirect. Spec 09 ADR-02 prescreveu Server Actions pra fluxos de form/redirect simples.

**Decisão canônica**: **Server Action `connectNuvemshop()` é o caminho default da UI**. A rota REST permanece como fallback documentado pra clients server-to-server.

**Aplicação**:
- ✅ Spec 06 §4.2 — texto atualizado in-place com nova seção §4.2 (Server Action) e renomeação da seção legacy pra §4.2.1 (fallback)
- ✅ Spec 09 §11 — `connectNuvemshop` listado no Server Actions catalog

**Justificativa**: progressive enhancement, type-safe, integra com revalidatePath, padrão Next.js 15.

---

## Política pra próximas reconciliações

1. Conflitos detectados durante implementação devem ser logados aqui com IDs sequenciais (R-06, R-07, ...)
2. Decisões canônicas **sobrescrevem** texto em specs individuais — edição in-place + nota cruzada
3. Wave de implementação que tocar uma área conflitada **deve** ler este log antes de codar
4. Reconciliações que mudam contratos públicos (API endpoints, payloads, error codes) versionam o changelog em `CHANGELOG.md` quando ele existir

## Próximas reconciliações esperadas

Pontos onde conflitos são prováveis (a verificar em waves futuras):
- Naming de hooks (`useFoo` vs `useFooQuery` vs `useFooMutation`) — ADR-13 a registrar
- Convenção de slug pra rotas dinâmicas (`[id]` vs `[fooId]`) — registrar quando a primeira tela for implementada
- Política de cache TanStack Query (`staleTime`, `gcTime`) por tipo de recurso — Spec 09 §13 deixou genérico
