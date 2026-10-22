---
doc: final-review-readiness
status: technically-ready-human-test-pending
updated: 2026-10-23
---

# Preparación de la prueba final con texto propio y modelo real

Autorizado: 40 intentos **acumulados**, manteniendo 1 USD total, mismo alcance funcional. No se cambia prompt, esquema ni campos de negocio. No se ocultan propuestas repetidas. Se mantiene la evidencia original del corte 3. Esta preparación técnica corresponde al agente; la prueba final, valoración y comparación manual del participante siguen pendientes.

## Consumo y controles

Tarifas de GPT-6 Luna reconfirmadas en [documentación oficial](https://developers.openai.com/api/docs/pricing), 22/10/2026 23:54:18 Europe/Madrid: entrada 0,10 USD/millón, caché 0,01, escrituras 30 min 0,125 y 12 h 0,25, salida 0,50. Para la cota conservadora se calcula toda entrada a 0,25. Se mantienen 6.000 tokens de entrada contados antes de generar, 4.000 de salida incluidos razonamiento, 24 KiB por petición, una llamada activa y cero reintentos automáticos. Máximo de generación por intento 0,0035 USD; cuarenta máximas 0,14; reserva máxima 0,40 dentro de 1 USD. El conteo previo no se declara gratuito. Tarifas bloquean nuevas llamadas tras 23/10/2026 23:54:18 Europe/Madrid si no se reconfirman.

La migración local agrega revisión de autorización de 12 a 40 y conserva los doce intentos anteriores y bloqueos. Se compara por SHA-256 el bloque de doce registros antes/después. No se crea ningún recurso de pago ni se expone la clave. Script explícito: scripts/authorize-final-review.mjs; registro local runtime/evaluation/authorization-extension.json.

33 controles locales superados. Incluyen el intento 41 bloqueado, persistencia del consumo tras reinicio, errores que no recuperan cupo y migración idempotente sin eliminar bloqueos por anomalías. En el primer pase, el nombre inicial del script terminaba en «-test.mjs» y Node lo descubrió como prueba: ejecutó la migración ya autorizada, sin red ni consumo, antes del paso previsto. Se renombró para excluirlo del descubrimiento y el pase final contiene solo los 33 controles. No modificó expedientes; el historial de autorización conserva la transición original.

## Comprobación técnica nueva, no prueba humana

Una llamada real desde la interfaz en un expediente aislado. Fuente ficticia S-CHEQUEO-REAL-13 distinta de las entradas preparadas: rectificación a 1.000 Mb, referencia 40, posibilidad de estudiar 46 si las dos líneas tienen datos ilimitados y no cambia la cuota durante seis meses, ninguna oferta elegida y prohibición de contratar.

- MODEL: original reconoce 1.000, 46 condicionado con ambas condiciones y explicitly_not_authorized con cita. No eleva la referencia a 46 ni atribuye contratación. Además propone orientar el próximo movimiento a comprobar condiciones de A: sugerencia opcional inferida del contexto, no una orden del cliente ni acción realizada. El agente la rechaza; no se califica toda salida como perfecta ni se atribuye esa decisión al participante.
- GUARDS: antes de guardar, la pantalla conserva V1/600/40. Dos tarjetas aceptadas sin edición y la sugerencia de seguimiento rechazada. Tras confirmar, V2 con 1.000, referencia 40, disposición condicional 46, texto y dos condiciones, fuentes/recibos y una revisión. Estado y próximo movimiento originales. La fuente completa conserva la petición de no contratar; en este caso sin interés incorporado no aparece una instrucción negativa destacada derivada de interés. «Sin autorización registrada» sigue siendo límite técnico, no sustituto de la interpretación explícita del modelo.
- RECOVERY: termina el proceso 4124, arranca el 9332; igualdad íntegra del expediente por HTTP y SHA-256 eac17e4cb711b6df22453f4b2b5b686719e4ab4dca5e75bfbc3b780de8b768ce. Visualmente se reabre el mismo caso, condiciones e historial. No se inventa un borrador recuperado.

Evidencia local: runtime/live-readiness/checkpoint.json (salida original y caso completo), evaluation/26374686-b1cf-493d-a095-0443323dd23a.json (respuesta API original), recovery.json y reopened.png. Sin datos reales ni credenciales. La salida original no se incorpora al expediente como si fuese una decisión aprobada.

Intento nuevo 13: 1336 tokens de entrada, 932 de salida, cota 0,0008 USD. Acumulado: **13/40**, **27 disponibles**, reserva 0,13 USD, cota de generación conocida 0,0089175 USD, sin uso desconocido. No es factura. Los controles posteriores con respuestas registradas no aumentan el contador.

## Redundancias: efecto observado y límite de la conclusión

Se conservan los dos FAIL de precisión del corte 3: principal repite factura pendiente como antecedente y C4 la propone como duda. Se repiten por pantalla las respuestas originales claramente rotuladas «Respuesta registrada · sin nueva llamada», sin inferencia nueva.

Principal: cuatro tarjetas útiles aceptadas dejan 4/5 revisadas y finalizar deshabilitado. Rechazar la quinta permite finalizar, con cuatro incorporaciones y sin antecedente redundante. C4: aceptar interés deja 1/2; rechazar duda permite finalizar con una incorporación y sin duda redundante. No hay obligación de aceptarlas ni bloqueo posterior al rechazo; tampoco desaparecen automáticamente para favorecer el resultado.

**Carga objetiva:** una tarjeta y una decisión extra por cada uno de esos casos, con lectura y desplazamiento adicionales. Rechazarlas conserva los cambios útiles. **Carga subjetiva, segundos adicionales y efecto sobre utilidad neta: no medidos.** La sugerencia opcional de seguimiento de la prueba nueva también exigió una decisión humana simulada por el agente; no se descuenta de una futura medición.

## Entrega al participante

El recorrido está en README.md: nueva prueba ficticia, referencia nueva, texto propio, «Analizar novedad con el modelo», revisión/guardado y reapertura. Las respuestas registradas permanecen como opción distinta, con origen visible también dentro de la sección de propuestas. No se usan como fallback ni se presentan como una interpretación nueva.

Nada de esto declara superados los tres objetivos del participante. Pendientes: su novedad, interpretación valorada por él, capacidad de revisar/guardar sin asistencia, recuperación comprobada por él, carga de redundancias y correcciones, comparación con actualización manual, decisión de acabado y candidatura. No se atribuyen tiempos, aprendizaje, satisfacción ni ahorro sin observación.
