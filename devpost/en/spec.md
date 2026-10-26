---
doc: spec
status: approved
edition: English technical edition of the approved Spanish spec
updated: 2026-10-26
---

# Case Continuity — Technical Specification

## System and Core Journey

One browser page talks to one local Node process. The process reads/writes a JSON workspace. Analysis sends bounded fictional context to a model and returns proposals; the model has no write authority or tools. Explicit reviewer decisions go through domain validation, then case data, receipts, versions and review events are saved together. Reopening reads disk. No cloud database or deployment is needed.

Request active trial → create an independent fixture if needed → submit dated source/document → validate source/context and request proposals → validate response/citations → hold draft in memory → review/edit/reject → explicit partial or final save → validate current storage revision → atomic write → return a fresh read. Editing a source requires a new analysis; editing a proposal does not call the provider.

## Stack and Run

Node 24.x, tested with 24.18.0; plain HTML/CSS/JavaScript. Built-ins `node:http`, `node:fs/promises`, `node:crypto`, `fetch` and `node:test`. No application dependencies or build step. See root English README: `npm run demo:prepare`, `npm start`, http://127.0.0.1:4317. Ctrl+C stops only this process. The port is local-only; a port conflict is an error, never permission to terminate unrelated services.

`demo:prepare` packages the original R47 captured response from public evidence, checks its current request fingerprint and validates it. It does not generate, reset usage, overwrite different records or alter saved cases. No key is needed for this explicitly labeled replay.

## Components and Actual Paths

- `public/index.html`, `app.js`, `styles.css`: one review screen; session-memory draft, explicit choices, source quotations rendered with `textContent`, unsaved-work warnings. Success appears only after a server save/read.
- `public/presentation.mjs`: readable before/after, conditional-willingness wording and a no-contract highlight only when an incorporated statement and exact supporting source both contain the instruction.
- `src/server.mjs`: localhost HTTP, request size/host/origin/session-token checks, in-memory drafts and current-revision checks. One writer process is enforced by a local lock.
- `src/model.mjs`: bounded context, prompt, closed JSON schema, usage reserve/count, provider calls, validation/capture. No automatic retry/fallback or case-writing tool.
- `src/domain.mjs`: typed operation/field registry, exact source checking, approval handling, deduplication, partial/final semantics and receipts/versions.
- `src/store.mjs`: serialized transactions and temporary-file write/flush/rename. Error leaves prior committed data; corrupt JSON is reported, not reset.
- `src/fixtures.mjs`, `fixtures/`: fictional cases; `src/recorded.mjs` accepts only exact matching recorded context/prompt.

## HTTP Contract

`GET /api/health` (non-secret status), `GET /api/session` (local mutation token), `GET /api/run` (saved view), `POST /api/run` (independent fixture), `POST /api/analyze` (fresh interpretation), `POST /api/recorded` (explicit replay), `POST /api/commit` (partial/final). Mutations require same-origin JSON and token. No CORS opening. Credentials never enter client responses.

Analysis is serialized; drafts are ephemeral and bounded in number. A completed unchanged source can reopen deterministically without a model, clearly labeled as local review. Partial-save responses advance only the matching draft after a successful write; replaying an old command cannot revive a consumed draft.

## Data Model and Incorporation

Workspace: schema version, storage revision, active run, run collection and idempotent action records. Run: fixture identity, case data, sources, data versions, incorporation receipts and review events. Source includes reference, author, type, date, text and content hash. Case includes needs, fiber/mobile count, unconditional budget, conditional budget list, offers, document status, interest statements, state/next action, uncertainties and antecedents.

A proposal has kind, summary, target, typed value, conditions, uncertainties and exact source references. The closed schema disallows extra properties. Domain validation rechecks source existence/exact quotes and allowed kind/target/value combinations.

| Kind | Target / important rule |
|---|---|
| fiber_correction | positive integer `current_fiber_mbps`; prior value retained |
| case_update | approved allowed numeric/text field; no arbitrary patch |
| conditional_budget | `budget_conditions`; positive amount and nonempty structured conditions; reference unchanged |
| offer_record | typed offer and real included source references |
| document_receipt | actual separate included document source, “received, unvalidated” |
| offer_interest | existing offer plus nonempty attributed declaration; no authorization write |
| uncertainty / antecedent | sourced attributed text |

Each accepted incorporation records original/revised proposal, before/after, source references, reviewer/date, review identity and edit flag. Original model output is separate evidence, never overwritten by a human edit. A manual edit remains subject to validation; source checking cannot prove its semantics.

The effective operation is deduplicated using reviewed-source identity, kind, target and operative values/conditions. An already-incorporated conditional budget with differing conditions creates a conflict rather than a silent merge. A storage revision mismatch blocks saving. Data versions increase only for actual incorporated information; no-change review notes do not create empty data versions.

Finalization requires all cards decided and an explicit completion flag. Partial saves incorporate only approved cards and leave review open. Finalization recognizes earlier partial receipts. Repeated unchanged reviews/reasons do not duplicate history. Sources are immutable; different sources are not merged by similar wording.

## Model and Safety Boundaries

OpenAI Responses API, `gpt-6-luna`, default service tier, low reasoning, `store:false`, no execution tools, strict schema. Sources are untrusted data, never instructions. Conditions, tentative interest, contradiction and no authorization are distinct. Pending actions remain unless explicitly resolved/canceled/replaced; parallel waits may be combined. Context recency alone cannot remove work or settle contradiction.

Check complete provider status/refusal/content before JSON/domain validation. Invalid, incomplete or refused outputs never become saveable proposals. Schema validity and blocked authorization writes do not demonstrate comprehension. `store:false` is not claimed to guarantee zero provider retention.

Current R47 interest has an empty structured conditions array, but full declaration/citation retain partner approval and no-contract instruction. This is a limited extraction failure, not an unconditional interest fact. There is no automated filtering/ranking based on that array. Conditional budget requires a nonempty list; completeness remains a semantic review task. No general semantic guarantee is claimed.

## Usage and Failure Modes

40 cumulative attempts, USD1 total, including errors/repeats. Existing ledger: 17 used. Reserve USD0.01 before any provider request; 6,000 input/4,000 output tokens; pre-count; 24KiB payload; count timeout20s/generation45s; no automatic retry. Missing key/expired rates/limits block generation. A timeout counts and may have unknown cost. Unexpected usage locks further calls. Data creation/restart never resets usage.

Verified rates used a USD0.25/million upper input bound including possible cache writes and USD0.50/million output, including reasoning. Per-generation ceiling USD0.0035; reserve maximum USD0.40. Current checked-in verification is expired; recheck official pricing before new generation. Known cumulative estimate USD0.01225175 is not billing evidence. No presumed Google/AWS credits or new paid resources.

Provider/count/schema/source failures yield an error without case writes or a fake fallback. Disk failure does not report success. Corruption stops without resetting. Stale views conflict. Closing loses unsaved drafts; normal warnings are browser-dependent and do not cover forced process shutdown.

## Verification and Simplifications

36 deterministic tests, original captured model cases, separate save/approval controls and recovery checks. Six-case historical prompt evaluation is not retroactively current evidence. Original S-PRUEBA-47 remains a continuity failure. Three corrected generations plus targeted round trips and delegated manual-edit UI reopening are agent evidence. Simulation is labeled; no savings or general reliability is inferred.

Local JSON instead of database; text instead of PDF/OCR; one update instead of integrations; no authentication server/public hosting, multi-user editing or autosaved drafts. Final name, readiness, license/publication and participant-authored submission remain human decisions. [Current release record](../release-check.md).
