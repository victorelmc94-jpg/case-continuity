# English testing guide and source translations

The app uses Spanish to preserve the original fictional source wording. No real customers, prices, documents or conversations are included. All amounts/offers are invented, not current commercial recommendations.

## Reproduce the recorded R47 flow

Run `npm run demo:prepare`, `npm start`; open http://127.0.0.1:4317. No key or payment is required for replay.

Select **R47 · prueba breve de Editar**, click **Nueva prueba ficticia**, then **Usar respuesta real registrada (sin nueva llamada)**. This retrieves a previously captured real response, not a new inference. Creating a new trial keeps previous trials. Context/prompt must match exactly; the app refuses an incompatible replay.

R47 source translation:

> I have reviewed the numbers: my definitive maximum budget goes from 40 to 47 euros per month. Offer A might interest me, but first I want to discuss it with my partner; do not contract anything yet. I will send you the invoice tomorrow. I have no new information about fiber speed.

Baseline: 600 Mbps, two mobile lines, EUR40/month, invoice not received, adviser action required, next action “Clarify offer A's conditions”. R47 should propose EUR47, tentative interest subject to the partner/no-contract limits, and a combined next action retaining clarification alongside waiting for invoice/customer response. No new fiber information means no fiber change. A promise is not a received invoice.

Use **Editar** on **Próximo movimiento** and edit the actual text-value field to:

> Aclarar las condiciones de la oferta A; revisar la factura cuando llegue y esperar la respuesta del cliente tras hablar con su pareja.

Translation: “Clarify offer A's conditions; review the invoice when it arrives and wait for the customer's response after speaking with their partner.” Click **Aceptar esta edición**, resolve the other cards, then **Confirmar fin de revisión y guardar**. Close and reopen the URL. The exact value, partner/no-contract declaration, EUR47, 600 Mbps, invoice pending, citations and edited-history marker must survive. Card acceptance alone must not change the saved case.

## UI glossary

| Spanish | English / meaning |
|---|---|
| Expediente guardado; Datos Vn | Saved case; data version n |
| Presupuesto de referencia | Unconditional reference budget |
| Disposición condicionada | Conditional willingness, not accepted price |
| Podría estudiar hasta… | Could consider up to… |
| Interés expresado | Expressed interest, not contracting authority |
| El cliente pide no contratar todavía | Customer explicitly asks not to contract yet |
| Requiere acción propia | Adviser action required |
| Próximo movimiento | Next action recorded in the case, not action performed |
| Pendiente de recibir | Not yet received |
| Recibido, sin validar | Received, unvalidated |
| Aceptar / Editar / Rechazar | Accept / edit / reject proposal |
| Declaración o valor de texto | Actual declaration/text value, not just card summary |
| Guardar incorporaciones aceptadas | Save accepted incorporations; review stays open |
| Confirmar fin de revisión y guardar | Explicitly finish review and save |
| Revisado, sin cambios | Reviewed, no changes |
| Edición humana aceptada | Manually edited and accepted; test actor is recorded separately |
| Volver a leer lo guardado | Read the saved workspace again |
| Fuentes y antecedentes | Sources and antecedents |
| Nueva interpretación del modelo | Fresh provider interpretation |
| Respuesta registrada · sin nueva llamada | Recorded real response, no new call |
| Tarifas caducadas: generación bloqueada | Rates expired; fresh generation blocked |

## Historical family meanings

The principal source says: “Correction about fiber: I have 300 Mbps. I could consider up to 50 euros if both lines are included and the price does not increase for twelve months. Offer A interests me, but do not contract yet.” Both conditions must survive; reference EUR40 stays unchanged. Two historical redundant cards remain documented rather than hidden.

C1: conditional willingness, not unconditional budget change. C2: an explicit fiber correction with prior value retained. C3: separately provided invoice text, received but unvalidated; a promised invoice is not receipt. C4: interest without contracting permission. C5: conflicting permanence conditions retain both sources. C6: no new information, so only explicit completion creates one no-change note, preserving state/next action/version; repetition does not duplicate. Positive variants permit a definitive new budget or explicitly requested follow-up replacement after approval.

Historical recorded outputs have older prompt fingerprints and are not replayed as current ones. Their original interpretation/evidence is retained; use R47 for the packaged current replay. Fresh arbitrary-text interpretation is a different path requiring a key and current verified pricing. No special fallback presents replay as fresh interpretation.
