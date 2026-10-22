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
- Salida total facturada: 0,50 USD por millón, incluido razonamiento y formato.
No herramientas, imágenes, archivos remotos, pro, fast ni retención explícita de caché.
Fuentes consultadas el 2026-10-22:
https://developers.openai.com/api/docs/pricing
https://developers.openai.com/api/docs/models/gpt-6-luna
https://developers.openai.com/api/docs/guides/token-counting

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

Generación máxima por intento: (6000 × 0,10 + 4000 × 0,50)/1.000.000 = 0,0026 USD.
Doce generaciones máximas: 0,0312 USD. La reserva de 0,12 USD deja margen conservador adicional; no se presenta la reserva como gasto real.
No asumir que un error sin usage costó cero. Mantener su reserva y mostrar uso conocido aparte.
Este cálculo es de consumo API bajo las tarifas verificadas; no usa la suscripción del agente ni créditos supuestos de terceros.

La aplicación conserva la autorización y limita consumo. No crea recursos externos ni publica.
