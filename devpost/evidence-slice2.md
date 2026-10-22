---
doc: evidence-slice2
status: verified-mechanically
updated: 2026-10-22
learner-check: pending
---

# Corte 2 y ajustes solicitados tras la prueba del corte 1

Víctor confirmó que el resultado visible del corte 1 conservaba fibra, referencia de 40 €, disposición condicionada de 50 € e interés sin contratar. Solicitó tres ajustes de presentación y autorizó continuar con el corte 2. Ese feedback completa el checkpoint temprano; no se atribuyen al participante las pruebas técnicas del agente.

## Presentación

- Historial y procedencia muestran antes/después, unidades, condiciones y citas. JSON solo en «Detalles técnicos de la incorporación», cerrado por defecto.
- El caso conservado muestra «Podría estudiar hasta 50 €/mes si incluye las dos líneas y el precio no sube durante doce meses». No se transforma disposición en aceptación.
- Contratación muestra «El cliente pide no contratar todavía», con S-DEMO, fecha, declarante y cita. Se obtiene de una declaración incorporada y su respaldo literal; archivar una fuente no basta. El campo técnico de autorización sigue fuera de escritura de V1, como limitación.
- Estado «Requiere acción propia» y próximo movimiento «Aclarar las condiciones de la oferta A» permanecen iguales. El archivo completo del expediente del participante no cambió durante las pruebas: SHA-256 FA3AA7725B8F09CA41271856C4EB0D2A0BA52C6F59588FF807297E1B588D4704.
- Captura local: runtime/evaluation/slice2-history.png. No se publicó.

## MODEL — C6 real, aislado de las simulaciones

Fuente exacta del protocolo: S-N06, «No tengo novedades de este asunto desde la última revisión.» Una sola generación GPT-6 Luna, instrucciones/esquema del corte 1 sin cambios. Intento bc2e0cc6-5c3a-49cc-a6b9-87b2ad578955; 1274 tokens de entrada y 191 de salida facturada. PASS de C6: cero propuestas; authorization not_established; explica que no se puede inferir autorización ni negativa expresa de una mera ausencia de novedades.

Salida original y veredicto en runtime/slice2-c6/evaluation/{attempt}.json y model-verdict.json. No se editó la respuesta antes de evaluar. El motivo sugerido no se incorpora automáticamente al historial.
La repetición de fuente ya revisada con datos iguales abre una revisión local sin volver al proveedor, y se identifica así. No cuenta como segunda evidencia de comprensión.

## GUARDS — aprobación, parcial y repetición

PASS de 28 pruebas locales sin inferencia: parcial guarda solo lo aceptado; pendientes/rechazos quedan fuera; finalizar exige resolver todas; una orden parcial no puede declarar finalización. Solo la escritura propia actualiza la base del borrador. Otro borrador obsoleto sigue en conflicto. La repetición del mismo actionId no aplica otra vez. Una orden parcial antigua repetida después de finalizar tampoco reabre el borrador ni retrocede su base.
Los recibos de incorporaciones parciales sobreviven al borrador. Finalizar después los reconoce y no dice «sin cambios» ni crea una versión vacía. Un borrador perdido no reaparece con decisiones inventadas.
C6 real: analizar dejó el caso e historial intactos. Confirmar creó una revisión y mantuvo V1. Repetir mantuvo exactamente la misma ejecución y fecha de revisión; el contador de inferencia no aumentó. Un motivo humano concreto distinto puede añadir información al historial sin alterar datos; fechas nuevas o motivos equivalentes no duplican.

Deduplicación por fuente/contenido y efectos estructurados, sin fusionar fuentes distintas por parecido. Se ignoran resúmenes y redacción de presentación. Si la misma fuente e importe producen condiciones distintas, el guardado se bloquea como conflicto: no duplica ni sustituye silenciosamente. No se afirma equivalencia semántica automática entre condiciones redactadas de forma diferente.

Prueba de pantalla en servicio aislado con salida explícitamente **simulada**, sin credencial ni inferencia:

1. Se aceptó fibra, se rechazó presupuesto y se escribió un motivo, dejando interés pendiente. «Nueva prueba» abrió el aviso; «Volver a la revisión» conservó las tres decisiones/entradas.
2. Guardar parcial incorporó solo 300 Mb, con V2 y cero revisiones confirmadas; rechazo y motivo siguieron en pantalla, sin persistirse.
3. «Descartar y continuar» al releer perdió solo lo pendiente. La fibra guardada y el aviso de revisión sin finalizar permanecieron. Al reanalizar, las decisiones perdidas no se restauraron; la fibra se reconoció como ya guardada.
4. Finalizar con las otras propuestas rechazadas registró una incorporación previa, con V2 y un único recibo. Repetir mantuvo la anotación original.
5. Se intentó recargar con un motivo sin guardar: la automatización conservó pantalla y texto. No se obtuvo imagen del aviso nativo, así que esa comprobación visual queda sin acreditar. beforeunload sigue instalado; los avisos internos sí fueron observados y comprobados. No se prometen protección frente a cierres forzados ni recuperación de borradores.

## RECOVERY — procesos nuevos

C6 real: proceso 9092 → 15668, lectura HTTP y disco idénticas; huella de ejecución 2e7adf05deaf543a3c3dc8e868b7612ed972fa9fa86b67cf7b5179a89db03850. Mantiene V1 y una revisión. Cuatro intentos globales antes/después. Evidencia en runtime/slice2-c6/checkpoint.json y recovery.json.

Parcial simulado en navegador: segunda ejecución df9c9d32… dejó fibra guardada y otras dos propuestas pendientes; se detuvo proceso 19040 y arrancó 12376. Archivo completo idéntico antes/después: SHA-256 25C1E18A86240994D79C0A872A2576714B320BE693D5287F966BC0970C488383. La lectura nueva mostró 300 Mb, V2, una incorporación, cero revisiones y el aviso «revisión sin finalizar». El borrador anterior no fue recuperado como aprobado.

## Consumo y límite de la evidencia

Una generación adicional: cota conservadora 0,000414 USD. Acumulado **4/12 intentos**, reserva 0,04 USD y cota de generación conocida 0,0029645 USD. Ocho intentos disponibles, sin reiniciar el registro ni crear recursos externos. No es una factura. Tarifas y límites originales vigentes durante esta prueba; no hubo reintentos automáticos.

Los seis casos completos, variantes positivas y ahorro de tiempo siguen pendientes. C6 es una comprobación individual, no una aprobación global. Corte 3 no ejecutado. No hay publicación, inscripción, nombre definitivo ni cambios en aplicaciones anteriores.
