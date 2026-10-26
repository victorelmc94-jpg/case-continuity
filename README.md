# Case Continuity — technical documentation

A local proof of concept for reviewing a new update against a fictional telecom case. A reviewer accepts, edits or rejects proposed changes, explicitly saves them and reopens the case with its sources and history. This document describes implementation and testing; it is not the participant's submission statement.

## Run without an API key

Node.js **24.x** (tested with 24.18.0) and a desktop browser are required. No application packages to install, build step or cloud resources.

```sh
npm run demo:prepare
npm start
```

Open **http://127.0.0.1:4317**. The prepare command packages an existing, disclosed real model response; it makes no API call and does not replace saved cases or reset the inference ledger. Stop this server with Ctrl+C. Start it again after a computer shutdown. Do not terminate another service if the port is occupied.

1. Select **R47 · prueba breve de Editar**, then **Nueva prueba ficticia** (new fictional trial).
2. Click **Usar respuesta real registrada (sin nueva llamada)** (use recorded real response). This is a replay, **not fresh interpretation**, requiring the exact original context/prompt fingerprint. There is no silent fallback.
3. Read the source and proposals. In **Próximo movimiento → Editar** (next action → edit), change **Declaración o valor de texto** (actual text value) and click **Aceptar esta edición** (accept this edit). Accept or reject the other cards.
4. Click **Confirmar fin de revisión y guardar** (finish review and save). Accepting a card alone does not save it.
5. Close/reopen the tab. Check the exact saved text, quotations and **Edición humana aceptada** (manually edited and accepted) in history. This label describes the review route, not the actor who performed a test.

R47 definitively changes the reference budget from EUR40 to EUR47/month. Fiber stays 600 Mbps, the invoice remains unreceived, and interest in offer A remains subject to talking with the customer's partner, with an explicit instruction not to contract. The unresolved clarification of offer A must remain in the next action. [English source translations and UI glossary](devpost/en/testing.md).

## Optional fresh interpretation

The server integrates the OpenAI Responses API with `gpt-6-luna`. It reads `OPENAI_API_KEY` only from the local server environment or an ignored `.env`; [.env.example](.env.example) is blank. Never enter credentials in the browser or repository.

Fresh analysis requires a valid key, current verified rates and available authorization. **Checked-in rate verification expired on 25 October 2026, deliberately blocking fresh generation until rechecked.** Replay, review, saving and recovery remain available. Startup, editing, tests and saving do not trigger inference. There is no automatic retry or provider fallback.

The author's ledger remains **17/40 cumulative attempts**, including errors/repetitions; known conservative generation estimate **USD0.01225175**, not an invoice. Total authorization USD1; USD0.01 reserved before each attempt, input pre-counted and capped at 6,000 tokens, output at 4,000, request at 24KiB, with timeouts. Existing saved data and usage must not be deleted to restore quota.

## Verify and assess

```sh
npm test
```

**36 local tests pass**, without model calls. Current targeted tests reuse three original corrected responses (R47, parallel wait, explicit cancellation), checking unresolved actions and disk round trips. They are not new generations. The earlier six-case MODEL evaluation used the previous prompt and remains historical.

The three evaluation layers are independent: original **MODEL interpretation**, **GUARDS for approval/saving**, **RECOVERY from storage**. A blocked field does not prove comprehension; other passing cases do not compensate for a critical error.

Known limits: human review remains necessary; general reliability and time savings are unproven. Two historical redundant proposals remain precision failures. R47 has an empty structured interest-condition list although the complete declaration and quotation retain the partner/no-contract limits; no filtering or priority logic depends on that list. Contract authorization is outside V1 writes, assessed separately from semantic understanding. Drafts are not persisted; normal navigation warns where the browser supports it. An accepted edit can still be semantically wrong; exact citations do not prove semantic correctness.

## Planning and evidence

Original approved documents: [scope](devpost/scope.md), [PRD](devpost/prd.md), [spec](devpost/spec.md). English technical editions: [scope](devpost/en/scope.md), [PRD](devpost/en/prd.md), [spec](devpost/en/spec.md). [Build checklist](devpost/checklist.md), [offline app map](devpost/app-map.html), [English evidence](devpost/en/evidence.md), [latest release check](devpost/release-check.md).

Original participant trial, **including its wrong next action**: [preserved artifact](devpost/evidence-s-prueba-47-original.json). Corrected original responses and the earlier agent edit/restart: [artifact](devpost/evidence-pending-actions.json). Later delegated UI tests are agent tests, not participant practice. No time saving has been measured.

New independent application, started empty during the submission period. Prior concepts informed requirements; no previous application code/data was imported. The [Devpost Learn Skill Pack](skills/README.md) is course material, separately attributed and licensed through [provenance](skills/ORIGIN.md).

Node built-ins plus plain HTML/CSS/browser JavaScript. `src/model.mjs` proposes without storage authority; `src/domain.mjs` validates explicit decisions; `src/store.mjs` atomically writes data, receipts, versions and review history together. `src/server.mjs` binds only to 127.0.0.1 with origin/token/revision checks. `public/app.js` renders the review workspace.

All records, offers, documents and quotes are fictional. `runtime/`, credentials and the personal learner profile are excluded from Git. No live tariffs, contracting, integrations, public hosting or additional paid infrastructure. Publication/video/submission status is recorded separately in [the delivery plan](devpost/delivery-plan.md); none is implied by this README.
