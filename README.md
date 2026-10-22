# Revisión de expediente — prueba local, nombre pendiente

Proyecto nuevo e independiente, creado desde vacío para evaluar una candidata de Build With AI: Basics. Todo el expediente y las ofertas de ejemplo son ficticios. No contiene código de aplicaciones anteriores.

Los **cortes 1 y 2** permiten analizar una novedad con un modelo real, aceptar, editar o rechazar propuestas, guardar por partes y finalizar explícitamente. Lo aprobado se recupera desde disco; una revisión sin cambios no crea versión vacía y su repetición sin información nueva no duplica el historial. El corte 1 fue probado por Víctor y se incorporaron sus tres ajustes de presentación. El corte 3 y la evaluación global siguen pendientes.

## Abrir

Con el servicio arrancado: **http://127.0.0.1:4317**.

Para arrancarlo de nuevo, abrir una terminal en esta carpeta y ejecutar:

```powershell
npm start
```

Usa Node 24.x (comprobado con 24.18.0). No hay paquetes que instalar ni compilación. Para detener: Ctrl+C en su terminal. Si el puerto está ocupado, no se cambia ni se detiene otro servicio.

El servidor lee OPENAI_API_KEY del entorno del proceso o de un .env local excluido de Git. Hay acceso comprobado en este equipo. No introducir la clave en el navegador, código o repositorio. .env.example contiene solo el nombre de la variable. Sin credencial se puede consultar lo guardado y ejecutar controles locales; analizar informa del problema sin simular resultados.

## Qué probar — aproximadamente 10–15 minutos de intervención

1. Al abrir verás el resultado ya comprobado. Abre «Fuentes y antecedentes» para examinar procedencia y valores anteriores.
2. Pulsa **Nueva prueba ficticia**: parte de 600 Mb, referencia de 40 €, sin interés incorporado. Las ejecuciones anteriores se conservan en el archivo local, aunque este corte solo muestra la activa.
3. Deja el texto preparado y pulsa **Analizar novedad con el modelo** una vez. Espera el resultado; consume un intento del cupo compartido. No hay reintentos automáticos.
4. Comprueba antes de corregir nada: propuesta de 300 Mb, disposición hasta 50 € si incluye las dos líneas y mantiene precio doce meses, interés en A e interpretación expresa de que no hay autorización. Una condición perdida o interés convertido en autorización es un fallo crítico, aunque el programa bloquee un campo.
5. Acepta, edita o rechaza cada tarjeta. El expediente de la izquierda/arriba debe permanecer igual. El botón final solo se habilita al resolver todas las tarjetas. Puedes rechazar una incorporación para comprobar que no se guarda. La fuente original se archivará como material aportado; eso no aprueba todo su contenido.
6. Prueba **Guardar incorporaciones aceptadas** con una tarjeta aceptada y otra pendiente. Solo la primera debe aparecer guardada; todavía no hay revisión confirmada. Rechazos y motivo siguen en pantalla pero no se guardan como borrador. Intenta cambiar de prueba: **Volver a la revisión** conserva el trabajo; **Descartar y continuar** pierde lo pendiente, manteniendo lo incorporado.
7. Resuelve las tarjetas restantes y **confirma el fin de revisión**. Si guardaste una parte antes, la conclusión reconoce esas incorporaciones y no las duplica. Si aceptas fibra y disposición condicionada, verás 300 Mb, referencia de 40 € y «Podría estudiar hasta 50 €/mes…» con ambas condiciones. Contratación destaca la petición de no contratar todavía con su cita incorporada. El campo técnico de autorización sigue fuera de escritura de V1.
8. Pulsa **Volver a leer lo guardado**, recarga o detén y vuelve a arrancar el servicio. Si solo guardaste una parte, verás «revisión sin finalizar». No se inventan las decisiones pendientes perdidas. El historial muestra antes/después, condiciones y fuentes; JSON queda en detalles técnicos cerrados.

Para probar una revisión sin cambios: en una prueba nueva usa referencia S-N06 y texto «No tengo novedades de este asunto desde la última revisión.». Analizar por sí solo no registra revisión. Confirmar debe mantener V1, estado y próximo movimiento y añadir una sola anotación. Reabrir la misma fuente, sin cambios posteriores en los datos, se identifica como revisión local sin otra consulta al modelo; confirmar sin información nueva conserva la anotación original. Un motivo humano concreto distinto puede aportar información, sin cambiar datos.

Si una propuesta es incorrecta, anota qué dijo el modelo antes de editarla. Interesan también redundancias, lectura confusa y trabajo de corrección. No hemos medido ahorro de tiempo ni utilidad frente al método manual.

## Límite de inferencia

Modelo fijo GPT-6 Luna. Máximo autorizado: 1 USD y doce intentos, contando errores y repeticiones. El registro persistente no se reinicia al crear prueba ni reiniciar servidor.
Entrada contada antes de generar, máximo 6.000 tokens; salida máxima 4.000, incluido razonamiento; petición de hasta 24 KiB, sin herramientas ni reintentos. Reserva conservadora de 0,01 USD por intento: como máximo 0,12 USD para los doce. [Tarifas y cálculo](devpost/inference-budget.md).
Tras los cortes 1 y 2 se usaron **4/12 intentos**, reserva 0,04 USD y cota conservadora del consumo de generación conocido 0,0029645 USD. No es una factura. Una nueva generación aumenta el registro; una reapertura local de fuente ya revisada y datos iguales no llama al modelo.
Las tarifas verificadas vencen el **23/10/2026 a las 22:11 Europe/Madrid**; se bloquearán nuevas generaciones hasta revisarlas.

## Comprobaciones y límites del corte

```powershell
npm test
```

28 pruebas con node:test para controles, presentación, presupuesto, disco y servicio HTTP; no llaman al proveedor. Las salidas simuladas están identificadas y no acreditan comprensión del modelo.
[Evidencia del corte 1](devpost/evidence-slice1.md) y [del corte 2](devpost/evidence-slice2.md) separan modelo, aprobaciones y recuperación. C6 se ejecutó con modelo real; los avisos y parciales también se probaron en un servicio aislado con simulación explícita, sin modificar el expediente conservado.

El guardado parcial está disponible y el completo exige resolver todas las tarjetas. Aún faltan las seis familias como conjunto, sus variantes y la medición de trabajo frente al método manual. La repetición conserva fuentes y efectos estructurados; si la misma fuente e importe presentan condiciones distintas, se informa conflicto en vez de fusionarlas automáticamente. Hay avisos internos cancelables; los borradores no sobreviven a recarga o reinicio. La advertencia nativa depende del navegador y no cubre cierres forzados; su diálogo no pudo acreditarse visualmente con la automatización usada.

Los datos viven en runtime/workspace.json; los intentos en runtime/inference-ledger.json y las respuestas técnicas ficticias en runtime/evaluation/. Todo runtime queda fuera de Git. No borrar el registro para recuperar cupo. Un archivo corrupto detiene lectura/guardado; no se reinicializa silenciosamente. No se garantiza resistencia absoluta a fallo físico de disco.

## Plan y proceso

- [Alcance](devpost/scope.md), [PRD](devpost/prd.md), [especificación](devpost/spec.md), [lectura conjunta](devpost/review.md).
- [Orden aprobado y checkpoint humano pendiente](devpost/checklist.md), [seis casos previstos](devpost/evaluation.md).
- [Pack oficial](skills/README.md), [origen fijado y licencia](skills/ORIGIN.md). Se siguen sus pasos reales; el perfil de 1-start queda fuera de commits.

Git es solo local. No hay repositorio remoto, despliegue, inscripción ni presentación. Nombre definitivo, participación, acabado y materiales públicos siguen pendientes del participante.
