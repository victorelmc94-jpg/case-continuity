---
doc: evidence-slice1
status: verified-mechanically
updated: 2026-10-22
learner-check: pending
---

# Corte 1 — evidencia separada por capa

Solo la entrada principal compuesta. **No es el resultado de los seis casos ni evidencia de ahorro.** Datos y ofertas ficticios. Comprobación ejecutada por el agente; la prueba personal de Víctor sigue pendiente. Ninguna revisión técnica se atribuye a él.

## MODEL — respuesta original, antes de correcciones o protecciones

| Intento | Entrada / salida facturada en tokens | Resultado observado |
| --- | --- | --- |
| eb41bfff-a32c-45e8-bf8b-bcc3dc56a64c | 1246 / 776 | Interpretación esperada: 300 Mb, 50 con ambas condiciones y explicitly_not_authorized. FAIL de contrato útil: offer_interest.value.text era null. El validador rechazó el conjunto; no se incorporó nada. |
| 4af105a2-1fa1-4e12-b9ba-49f78ff2c0f0 | 1312 / 1023 | Tras precisar value.text en las instrucciones, interpretación y propuestas principales válidas. Añadió antecedente redundante de factura pendiente. Esta revisión se descartó durante la comprobación del aviso; no se guardó ni finalizó. |
| feee5da9-3dae-4a45-a015-ab3d3c6ebac7 | 1312 / 1367 | PASS de los requisitos semánticos de la entrada principal y del contrato. 300 Mb; 50 condicionados a incluir dos líneas y no subir precio doce meses; interés en A con «no contrates todavía»; explicitly_not_authorized. Añadió una duda útil sobre condiciones de A no comprobadas y un antecedente redundante. |

No se corrigió la salida del tercer intento antes de juzgar MODEL. Se aceptaron sin edición cuatro propuestas (corrección, presupuesto condicionado, interés y duda) y se rechazó la redundancia de factura. Esa necesidad de rechazo cuenta como trabajo de revisión; no se presenta precisión perfecta.
El primer FAIL permanece en la evidencia: el cambio de instrucciones resuelve la deficiencia de contrato para la versión actual; otro acierto no lo borra. No hubo pérdida observada de condiciones ni conversión de interés en autorización en estas salidas. Esto no prueba fiabilidad general.

La autorización se evaluó en la explicación y en el JSON original. Mantener el campo contractual sin cambios es solo una protección de V1, no el motivo de este veredicto.

Salida original del tercer intento: huella SHA-256 fd2118896f01ee61585c80df5e026b71e9110021178a58efd56fc5e8b47f2deb. Las respuestas originales están en runtime/evaluation/{attempt}.json, fuera de Git. Instrucciones y esquema usados viajan en esa evidencia; el commit del corte fija el código. No se exponen credenciales.

## GUARDS — aprobación y escritura

PASS mecánico del corte, con 17 pruebas locales sin inferencia y el recorrido en navegador con la respuesta real:

- Generar, aceptar tarjetas y rechazar una no alteró datos ni historial: V1, 600 Mb, cero recibos y cero revisiones, comprobado leyendo el archivo antes del botón final.
- Confirmar exigió decisiones explícitas en todas las tarjetas. Incorporó las cuatro aceptadas; la propuesta redundante rechazada no creó antecedente.
- El expediente permite cambios legítimos: la fibra pasó realmente de 600 a 300. Los controles simulados adicionales prueban que presupuesto de referencia y seguimiento también admiten cambios, sin atribuirles comprensión del modelo. Sus variantes reales siguen pendientes del corte 3.
- Pruebas de servidor y dominio rechazaron decisiones pendientes, falta de finalización explícita, fuente/cita falsa, campos ajenos al contrato, autorización contractual, base obsoleta y doble orden con contenido cambiado. Una repetición idéntica de actionId no duplicó escrituras.
- Pruebas de disco comprobaron lectura inválida sin borrado, fallo de escritura sin sustitución del estado anterior y escritura serializada.
- Se observó el aviso nativo al intentar sustituir la novedad revisada. Esa interacción terminó descartando el borrador, sin modificar el expediente ni registrar revisión. **No se acredita con ella la cancelación del aviso ni todas las salidas del corte 2.**

Las simulaciones técnicas están explícitamente identificadas en tests/helpers.mjs y server.test.mjs. El rechazo del interés incompleto tiene prueba de regresión. El contexto de aislamiento bloqueaba localhost y rename en temporales; las comprobaciones se ejecutaron con el permiso concedido fuera de ese aislamiento, sin instalar paquetes.

## RECOVERY — disco y proceso nuevo

PASS de lectura desde disco, reinicio real del servicio y lectura HTTP en un proceso distinto:

- Ejecución 37e782a8-12c1-445b-8c3a-85b2951bcef6; datos V2, cuatro recibos, tres fuentes originales, una revisión confirmada y una propuesta rechazada.
- Fibra 300; presupuesto de referencia 40; disposición condicionada 50 con ambas condiciones; interés sin contratar; duda sobre oferta A; factura pendiente. Estado «Requiere acción propia» y próximo movimiento «Aclarar las condiciones de la oferta A» conservados.
- Huella de la ejecución completa antes y después: bca53bd1616da104a9e522ff96d1f568b1dfe11a441dc436dda7cddeed19fc13.
- PID antes 11112 y después 7196; verificación a 2026-10-22T20:31:55.055Z. Igualdad profunda del objeto leído del disco y del devuelto por HTTP, incluidos versiones, fuentes, recibos y fecha. Tres intentos antes y después: el reinicio no recuperó cupo.
- Referencia y resultado reproducibles en runtime/evaluation/slice1-checkpoint.json y slice1-recovery.json. Captura: slice1-recovered.png. Todo fuera de Git.

Comandos ejecutados: node --test (17/17), node scripts/verify-slice1.mjs before-save, checkpoint y recovery. No llaman al modelo; la inferencia real fue solicitada expresamente desde la interfaz.

## Consumo y límites

GPT-6 Luna, Responses, default, low/standard. Tres intentos iniciados y tres respuestas con usage; nueve cupos restantes. Ningún reintento automático. Reserva 0,03 USD. Cota conservadora de generación conocida 0,0025505 USD, incluida toda entrada al precio máximo de cache-write; no es una factura. [Tarifas y presupuesto](inference-budget.md).

## Pendiente

Prueba humana temprana y feedback antes de ampliar. Cortes 2 y 3 sin ejecutar; seis casos/variantes, deduplicación completa, guardado parcial y todas las salidas no validados. Ahorro de tiempo y superioridad frente a actualización manual: hipótesis sin medición. Evaluación global: NOT RUN.
