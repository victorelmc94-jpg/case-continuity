---
doc: pending-actions-revision
status: agent-verified-human-edit-retry-pending
updated: 2026-10-24
---

# S-PRUEBA-47: conservar lo que sigue pendiente

## Prueba original del participante

El participante escribió una novedad distinta de la preparada, pidió interpretación nueva, aceptó tres tarjetas, confirmó y volvió a leer. No probó Editar y no midió tiempo. El expediente 21ff502f-c5fe-4472-8d5c-0474a55ac0a9 y la salida original están preservados en evidence-s-prueba-47-original.json, con instrucciones, uso, fuentes, versiones, recibos y hashes. La respuesta API completa original sigue en runtime; una copia local adicional se conserva sin publicar razonamiento interno ni credenciales.

Fuente literal: «He revisado las cuentas: mi presupuesto máximo definitivo pasa de 40 a 47 euros al mes. La oferta A podría interesarme, pero primero quiero comentarlo con mi pareja; no contrates nada todavía. La factura te la enviaré mañana. Sobre la velocidad de fibra no tengo información nueva.»

Antes figuraba «Aclarar las condiciones de la oferta A». El modelo propuso reemplazarlo por «Esperar la factura prometida para mañana y la decisión del cliente tras comentarlo con su pareja». La novedad no resuelve, cancela ni sustituye expresamente la aclaración de condiciones. La espera nueva y la aclaración podían coexistir. **MODEL: FAIL de continuidad**, aunque el presupuesto 47, fibra 600, interés condicionado, falta de autorización y factura no recibida fueran correctos. La aceptación humana no cambia ese veredicto.

GUARDS: las tres aceptaciones se guardaron y ningún recibo lleva humanEdited=true. RECOVERY: el participante comunica relectura correcta y los datos actuales concuerdan; no se le atribuye cierre/reinicio. Editar y ahorro: no comprobados por el participante.

## Corrección y verificación acotada del agente

Se añaden instrucciones generales para que next_movement conserve actuaciones pendientes. Una novedad puede añadir seguimiento paralelo; el modelo debe proponer una combinación útil. Solo una resolución, cancelación o sustitución explícita permite retirar una actuación. No se cambia el esquema, no se bloquea el campo, no se filtran salidas para imponer el resultado y no se reescribe el expediente original.

Tres llamadas reales, una por entrada y sin reintentos automáticos. Misma base original independiente en los tres casos:

| Caso | Salida original observada | Veredicto acotado |
|---|---|---|
| R47, mismo texto humano | Propone 47, interés posible con pareja/no contratar y «Aclarar las condiciones de la oferta A; esperar la factura prometida para mañana y la decisión de la persona tras comentarlo con su pareja». Fibra/factura sin cambio. | PASS de la corrección: propuesta útil, sin desaparición del pendiente. |
| Promesa y decisión aún pendiente | Conserva aclarar condiciones y añade seguimiento de factura/decisión; no inventa documento recibido ni contratación. | PASS de conservación ante novedad paralela. |
| Cancelación expresa de aclarar A | Retira la aclaración cancelada; propone esperar otra oferta y factura pendiente, sin llamar/contratar. Un control separado acepta y guarda el reemplazo real. | PASS del contraste positivo; el campo sigue modificable. |

Salidas originales, citas, usos y veredictos en evidence-pending-actions.json. En R47 el texto y la cita conservan literalmente la condición de hablar con la pareja; la lista estructurada conditions quedó vacía. No se afirma extracción estructurada completa por ese hecho. Las tres respuestas cumplen los criterios focales, sin demostrar fiabilidad general o precisión perfecta.

Los resultados de los seis casos anteriores son históricos del prompt anterior: no se han repetido como una tanda nueva ni se presentan como evidencia actual de este cambio. Sus respuestas originales y las dos redundancias siguen conservadas. El mecanismo de respuesta registrada exige la huella exacta del contexto/instrucciones; los registros anteriores no se recalifican como salidas del prompt corregido. R47 tiene un registro nuevo compatible para la prueba breve, sin sustituir los archivos antiguos.

Una comprobación inicial se detuvo por un archivo de bloqueo de un proceso ya terminado, antes de reserva o red; no consumió intento. Se confirmó que proceso/puerto no estaban activos. El verificador comprueba proceso vivo y serializa sus generaciones con un bloqueo exclusivo. Los tres intentos reales fueron 15, 16 y 17, con identificadores únicos y usage conciliado con el registro. No hubo llamadas solapadas ni reintentos del proveedor.

## Edición: comprobación del agente, no del participante

En un espacio aislado, el agente abrió R47 con la respuesta real registrada, pulsó Editar en Próximo movimiento y cambió **el valor de texto**, además del resumen. No fue solo una edición de presentación. Texto guardado:

«Aclarar las condiciones de la oferta A; revisar la factura cuando llegue y esperar la respuesta del cliente tras hablar con su pareja.»

Después pulsó «Aceptar esta edición», aceptó las otras dos tarjetas y confirmó. Antes de guardar seguía V1; después V2, presupuesto 47, fibra 600, factura pendiente e interés literal condicionado/sin autorización. El recibo del movimiento conserva citas originales, el nuevo valor y humanEdited=true. La etiqueta del producto «Edición humana aceptada» describe esta ruta manual; **la ejecutó el agente simulando la intervención**, no demuestra que el participante la haya probado.

Tras terminar el proceso 3632 y arrancar el 16656, la comparación íntegra por HTTP y SHA-256 coincide: 586c5b9089befba1d0906c36953a0a635ebb6e00174a05abfcf9e5b686033fd7. Se reabrió visualmente; captura runtime/pending-actions/edit-reopened.png. También se recuperó desde disco el control positivo de reemplazo. El original humano conserva su hash 7571cd78bff6b7f762608de60b6147ac3eb75c0471379b66bac038e393805076.

Se ajusta además el reconocimiento visual de «no contrates nada todavía», para destacar esa instrucción cuando existe en una declaración ya incorporada y su cita. No cambia autorización ni deriva aprobación de una fuente sin aceptar. Pasan los 33 controles locales, incluido ese texto y referencias sin respaldo.

## Consumo y prueba pendiente

Acumulado: **17/40**, quedan **23**, límite total **1 USD**. Reserva 0,17 USD; cota de generación conocida 0,01225175 USD, no factura; cero uso desconocido. Esta revisión añadió tres llamadas, cota 0,002536 USD. Guardado, edición y recuperación reutilizaron respuestas sin inferencia. Las tarifas y límites siguen vigentes según inference-budget.md.

Única prueba breve solicitada al participante: en R47 crear prueba nueva, cargar respuesta registrada corregida, Editar el valor del próximo movimiento, aceptar la edición/otras dos tarjetas, confirmar, cerrar y reabrir. Comprobar texto exacto, marca de edición, fuentes y que aclarar condiciones continúa pendiente. No necesita generar de nuevo. Las instrucciones operativas están también al principio de README.md.

Siguen pendientes su repetición de Editar, valoración de carga y comparación manual, decisión sobre acabado/candidatura, cierre explícito de Final Review y breve cierre de aprendizaje/app-map del Pack. Para preparar entrega faltarán revisión de código/historial y documentación para repositorio público, vídeo de demo y nombre/textos del participante, reconfirmando formulario y plazo vigentes. Nada publicado ni enviado.

La [portada oficial](https://learn-ai-basics.devpost.com/) se revisó el 24/10: pide vídeo de 1–3 minutos y repositorio público con los documentos de planificación, y anuncia cierre el 26/10/2026 a las 17:00 EDT, equivalente a **22:00 Europe/Madrid** ese día. La URL de bases devolvió 403 en esta consulta; no se afirma haberlas revalidado ahora ni se resuelven contradicciones previas con esa portada. Confirmar bases/formulario antes de presentar.
