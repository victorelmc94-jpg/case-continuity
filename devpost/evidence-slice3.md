---
doc: evidence-slice3
status: verified-with-observations
updated: 2026-10-22
learner-final-review: pending
---

# Corte 3 — evaluación separada del núcleo

Evaluador: agente técnico. Datos completamente ficticios. No son pruebas ni valoraciones atribuidas al participante. El participante sí comunicó el resultado visible del corte 1 y, en esta continuación, que Chrome mostró el aviso nativo «Es posible que los cambios no se guarden». No ha comunicado todavía su prueba final de los diez escenarios ni una medición de tiempo.

## Resultado

Los criterios críticos de interpretación se cumplen en las respuestas seleccionadas de C1–C6, las dos variantes positivas, la factura prometida y la entrada principal. No se detectan condiciones perdidas, interés convertido en autorización ni modificaciones no aprobadas en esta muestra. Esto no se obtiene por campos inmutables: C1-B cambia realmente presupuesto de referencia a 45 y C6-B cambia estado y próximo movimiento.

Hay **dos fallos de precisión no críticos**: principal repite como antecedente una factura ya pendiente; C4 propone como duda el mismo dato ya conocido. Se rechazan expresamente en la prueba de guardado. No se borran de la salida original ni se presentan como propuestas útiles. Por eso MODEL no tiene un PASS sin reservas en esos dos escenarios. El resultado no demuestra ahorro ni precisión perfecta.

El fallo histórico del primer intento (interés con value.text nulo) sigue en evidence-slice1.md. No se ha repetido ese intento ni se ha convertido retrospectivamente en PASS. El prompt se corrigió antes de los intentos reutilizados; en corte 3 no se alteran sus instrucciones ni esquema.

## MODEL — interpretación original, antes de controles o edición

Salida literal estructurada en evidence-model-slice3.json. Los archivos raw completos permanecen localmente en runtime, con usage y respuesta del proveedor; el documento de evidencia no incluye razonamiento interno ni credenciales. Las comprobaciones semánticas siguientes las realiza el agente leyendo las salidas originales, independientemente del validador de tipos/citas.

| Caso | MODEL | Observado antes de revisión |
|---|---|---|
| Principal | FAIL de precisión no crítico; críticos PASS | 300 Mb; 50 posible con las dos condiciones; referencia sin sobrescribir; interés con no contratar y explicitly_not_authorized. Duda útil sobre las condiciones desconocidas de A. Un antecedente redundante sobre factura pendiente. |
| C1 | PASS | conditional_budget 50 con dos líneas y estabilidad doce meses; «Podría llegar» y decisión pendiente; no cambio de referencia ni seguimiento. |
| C2 | PASS | fiber_correction 300 con citas de S-BASE-01 y S-N02; rectificación declarada, sin «verificado por operador». |
| C3 | PASS | document_receipt de S-DOC03 realmente aportado; cita nota y documento. No propone presupuesto 47 ni validación/documentación completa. |
| C4 | FAIL de precisión no crítico; críticos PASS | Interés y petición expresa de no contratar; explicitly_not_authorized con cita. Además, incertidumbre redundante sobre factura pendiente. |
| C5 | PASS | Incertidumbre de permanencia con citas exactas de A1 «sin permanencia» y A2 «doce meses»; no resuelve cuál aplica ni sustituye la oferta anterior. |
| C6 | PASS, reutilizado | Cero propuestas; ausencia de novedades no implica caso resuelto ni autorización; motivo de no cambio. |
| C1-B | PASS | case_update/budget_reference 45 incondicional; explicitly_not_authorized con cita. Campo modificable de verdad. |
| C3-P | PASS | Antecedente del anuncio de envío al día siguiente; no inventa recepción ni documento. |
| C6-B | PASS | Dos case_update: esperar decisión/no llamar y esperar aviso del cliente; no afirma llamada o contratación realizadas. |

La omisión de una operación contractual no prueba comprensión: la clasificación explícita y su explicación/cita son las evidencias de principal y C4. La aplicación no puede modificar autorización contractual en V1 y no hay afirmación contraria.

### Reutilización y llamadas

Principal: intento feee5da9-3dae-4a45-a015-ab3d3c6ebac7. C6: bc2e0cc6-5c3a-49cc-a6b9-87b2ad578955. Se compararon novedad completa, instantánea inicial persistida, fuentes iniciales, instrucciones, esquema, modelo, razonamiento y límites. Los datos de organización del caso no entran en el payload. Documento opcional vacío mantiene exactamente el contexto anterior. No se presentan como inferencias nuevas.

| Intento nuevo | Caso | Referencia original |
|---|---|---|
| 5 | C1 | d53a2350-c266-4dde-a0d1-2ccb020d12ee |
| 6 | C2 | 7eaba458-c69c-454d-b415-5aa99737c325 |
| 7 | C3 | f46bb470-205a-4561-8ba1-cf2f0c68f3d2 |
| 8 | C3-P | 09900e34-a393-49ca-ba46-49ecbbd1a58e |
| 9 | C4 | bd11c660-0888-48c4-a341-1361a7fc42c9 |
| 10 | C5 | deb1998c-7233-4f08-b27c-08264f25c6fd |
| 11 | C1-B | 6ac11b47-10c8-4b9c-8d33-5a51819d73e0 |
| 12 | C6-B | c1584082-2b5d-4bd7-9b2f-696e832d4e75 |

Ocho llamadas nuevas, cero reintentos en este corte, doce acumuladas contando errores/repeticiones anteriores. Registro compartido conservado; **cupo agotado**. Reserva 0,12 USD; cota de generación conocida 0,0081175 USD, sin usage desconocido. No es factura ni afirmación de gratuidad del conteo previo. Límites y tarifas seguían vigentes al ejecutar; no se usaron créditos supuestos ni otros servicios de pago.

## GUARDS — PASS en los diez escenarios

scripts/evaluate-slice3.mjs verify usa el servicio HTTP real, almacenamiento real y las salidas originales registradas; no invoca proveedor. Por cada caso crea dos expedientes aislados:

- Sin aprobar: analizar no altera el expediente; finalización incompleta o no confirmada se rechaza. Rechazar todo mantiene datos V1 y solo registra revisión al confirmar.
- Con aprobación: guarda las propuestas elegidas sin ediciones semánticas. En principal y C4 el agente de pruebas rechaza la repetición inútil; no se atribuye esa selección al usuario.
- Los positivos guardan 45 y los dos cambios de seguimiento. Los negativos conservan los valores porque sus propuestas no piden cambiarlos; los controles no los congelan.
- Condiciones guardadas iguales a la salida original completa. C3 conserva íntegro S-DOC03 y estado «Recibido, sin validar». Rechazar recepción no crea documento recibido aunque la fuente quede archivada como material aportado.
- Repetir orden es idempotente; la misma fuente/documentos ya revisados no produce llamada, anotación o versión extra. Cambiar el conjunto documental cambia la identidad de revisión; una fuente conservada no se sustituye.

Veinte ejecuciones: las diez rechazadas y la C6 aceptada permanecen V1; nueve aceptadas generan V2. Una revisión por ejecución. Número exacto de recibos y hash completo por expediente en runtime/slice3/checkpoint.json. No hay criterio de cinco aciertos que compense un crítico.

Los 32 controles locales incluyen pendientes, rechazo, edición humana expresa, parciales, confirmación posterior, motivo nuevo, deduplicación, fuente/cita inventada, escritura contractual fuera del contrato, revisión obsoleta de otra pestaña, reenvío de parcial tras finalizar, respuesta registrada con contexto distinto, documento ausente, cupo agotado/caducado y ausencia de clave.

Fallos inyectados: timeout/conexión, refusal, salida/JSON incompletos, disco lleno y JSON local corrupto. Sin éxito falso ni modificación de lo previamente guardado; sin reintento automático. En disco fallido se conserva la base del borrador para reintento explícito idéntico. Son simulaciones controladas, no incidentes reales del proveedor/disco. Un error inicial del propio test esperaba cuatro llamadas simuladas donde eran tres; se corrigió esa expectativa y pasó la suite completa, sin consumir inferencia.

## RECOVERY — PASS en los diez escenarios y ambos tratamientos

Un proceso termina tras guardar; otro arranca en la misma carpeta aislada. Se releen los veinte expedientes completos por el almacén de la aplicación y se comparan estructuralmente y por SHA-256: datos, versiones, fuentes, recibos, historial, fechas e identificadores. La vista HTTP del expediente activo coincide con el disco. El resto se comprueba por el almacén; no se afirma haber abierto veinte pantallas.

runtime/slice3/recovery.json identifica procesos, hora, número de expedientes y huella del espacio de prueba. El registro de inferencia coincide antes/después. El expediente del recorrido humano del corte 1 no se ha usado como espacio de prueba ni se ha sustituido.

Última ejecución sobre el código final: proceso de guardado 20432 → recuperación 13472; 2026-10-22 21:45:11 UTC. Veinte expedientes de esta evaluación, todos iguales. SHA-256 del espacio de prueba completo: 4bc5d8f98b62ccba1f60ad894485fb643f1c536faf5deda83e7178e2d2a3c1d6. Las ejecuciones previas de verificación permanecen en el espacio aislado; no se confunden con veinte pruebas humanas.

## Comprobación visual de recarga y factura

- Chrome, versión inicial: el participante informó que no apareció el aviso al intentar Ctrl+R. Se conserva ese fallo observado.
- Se añade aviso propio para Ctrl+R/F5, aviso visible de trabajo pendiente y compatibilidad returnValue=true en el manejador nativo. No guarda borradores ni incorpora nada al salir.
- Agente, Chrome: escribe PRUEBA, Ctrl+R abre «Hay trabajo sin guardar». Captura runtime/slice3/reload-warning.png. «Volver a la revisión» conserva el texto íntegro con PRUEBA; el expediente persistido permanece igual.
- Recargar por API del navegador no acreditó el diálogo nativo y descartó el texto en la pestaña de prueba. No se presenta como PASS nativo ni protección ante automatización.
- Participante, nueva versión, flecha circular de Chrome: comunica aviso de recarga «Es posible que los cambios no se guarden». Acredita visualmente la aparición del aviso nativo. No ha confirmado el resultado de cancelarlo y conservar PRUEBA; no se le atribuye esa comprobación.
- Agente, servicio aislado sin inferencia: C3 desde selector, nota/documento distintos, respuesta registrada identificada, aceptación explícita, guardado y recarga. Recupera V2, referencia 40, factura recibida sin validar e historial con S-N03/S-DOC03. Captura runtime/slice3/document-reopened.png.

## Límites y decisión pendiente

Muestra pequeña, una respuesta seleccionada por entrada: no demuestra robustez ante variaciones o repetición estocástica. Dos fallos de precisión requieren rechazos; no se ha medido trabajo neto. Aviso nativo comprobado visualmente en Chrome por comunicación humana, sin atribuir cancelación/conservación ni pruebas del resto de escenarios. Ningún cierre forzado probado.

La respuesta registrada exige contexto exacto y está rotulada: repetición de evidencia, nunca nueva comprensión ni fallback oculto. No sirve para entrada editada o estado modificado tras un parcial que perdió su borrador. Retomar ese análisis requeriría nueva inferencia, bloqueada por el cupo. Leer o guardar el borrador abierto no consume.

Pendientes: prueba final del participante, valoración de correcciones, medición frente a actualización manual, decisión de continuar/ajustar/parar y cualquier acabado. Si revisar/corregir consume tanto como actualizar manualmente sin aportar trazabilidad útil, parar y reevaluar. Sin promesa de ahorro, competitividad acreditada ni aceptación global humana.
