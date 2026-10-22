---
doc: inference-budget
status: approved
updated: 2026-10-22
---

# Presupuesto de inferencia autorizado

El usuario autoriza como máximo 1 USD total y doce intentos de inferencia, contando errores y repeticiones. Se implementa un límite más conservador: reserva irrevocable de 0,01 USD por intento, máximo acumulado 0,12 USD. Los intentos fallidos no recuperan cupo ni reserva.

## Tarifas verificadas antes de generar
GPT-6 Luna, Responses API, contexto corto, servicio estándar/default, razonamiento standard/low:
- Entrada sin caché: 0,10 USD por millón de tokens.
- Entrada en caché: 0,01 USD por millón; escritura 30 min: 0,125; escritura 12 h: 0,25. Estas tarifas de escritura sustituyen la tarifa ordinaria, no se suman a ella.
- Salida total facturada: 0,50 USD por millón, incluido razonamiento y formato.
No herramientas, imágenes, archivos remotos, pro ni fast. Desde la corrección del primer intento se usa prompt_cache_options explicit, sin puntos de escritura, para no crear caché deliberada. El cálculo de seguridad contempla aun así toda entrada a 0,25 USD/millón, incluida la escritura implícita del primer intento.
Fuentes consultadas el 2026-10-22:
https://developers.openai.com/api/docs/pricing
https://developers.openai.com/api/docs/models/gpt-6-luna
https://developers.openai.com/api/docs/guides/token-counting
https://developers.openai.com/api/docs/guides/prompt-caching

## Límites obligatorios
- Modelo fijo gpt-6-luna y service_tier default.
- Petición de texto serializada: máximo 24 KiB; no truncar silenciosamente.
- Conteo exacto mediante POST /v1/responses/input_tokens con el mismo contexto, instrucciones y esquema.
- Máximo 6.000 tokens de entrada. Si no hay conteo válido o lo excede: no generar.
- max_output_tokens 4000 limita toda salida, incluido razonamiento.
- Una solicitud activa, sin reintentos automáticos ni llamadas de herramientas.
- Reservar intento y 0,01 USD en disco antes de cualquier petición del intento; si falla ese guardado no llamar. El conteo fallido también consume el cupo reservado por prudencia.
- No reiniciar cupos al crear caso, reiniciar servidor o cambiar de sesión.
- Si el proveedor informa uso o tarifa incompatible, bloquear nuevas llamadas hasta revisión.

Generación máxima por intento, incluyendo cualquier escritura de caché: (6000 × 0,25 + 4000 × 0,50)/1.000.000 = 0,0035 USD.
Doce generaciones máximas: 0,042 USD. La reserva de 0,12 USD deja margen conservador adicional; no se presenta la reserva como gasto real.
El conteo previo no se declara gratuito: no se encontró una tarifa separada publicada para ese endpoint. Se reserva 0,01 USD por intento completo, muy por encima del coste acotado de generación; no se crean operaciones auxiliares de pago ni reintentos ocultos.
No asumir que un error sin usage costó cero. Mantener su reserva y mostrar uso conocido aparte.
costUsd en el registro y «estimación máxima del uso conocido» en la pantalla son una cota conservadora calculada con entrada a 0,25 y salida a 0,50; no una consulta de la factura. El primer registro fue recalculado de forma conservadora al incorporar cache-write a la contabilidad, sin alterar la salida original.
Este cálculo es de consumo API bajo las tarifas verificadas; no usa la suscripción del agente ni créditos supuestos de terceros.

La aplicación conserva la autorización y limita consumo. No crea recursos externos ni publica.

## Corte 1 ejecutado
Tres intentos contabilizados, incluida la respuesta rechazada por falta de value.text y la revisión descartada al verificar el aviso. Sin llamadas automáticas adicionales. Detalle: evidence-slice1.md.
Reserva acumulada 0,03 USD; cota de generación conocida 0,0025505 USD; nueve intentos restantes. No hay errores sin usage en esos tres intentos.
La verificación de tarifas vence el 2026-10-23 a las 22:11:10 Europe/Madrid; a partir de entonces se bloquea analizar hasta revisarlas. La lectura y el guardado local siguen disponibles.

## Corte 2 ejecutado
Una generación adicional para C6, con el mismo registro y límites: 1274 tokens de entrada, 191 de salida; cota conservadora 0,000414 USD. Repetir la fuente ya revisada no consultó al modelo. Pruebas de controles de pantalla simuladas sin inferencia.
Acumulado: cuatro intentos, reserva 0,04 USD, cota de generación conocida 0,0029645 USD; ocho intentos restantes. La cifra del apartado anterior es la foto histórica del corte 1. Ver evidence-slice2.md.
