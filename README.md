# Revisión de expediente — prueba local, nombre pendiente

Proyecto nuevo e independiente, creado desde vacío para evaluar una candidata de Build With AI: Basics. Todo el expediente y las ofertas de ejemplo son ficticios. No contiene código de aplicaciones anteriores.

El **corte 1** permite analizar la novedad principal con un modelo real, aceptar, editar o rechazar propuestas, confirmar el fin de revisión y recuperar desde disco lo aprobado. Los siguientes cortes esperan la prueba de Víctor. No es todavía la aplicación completa ni una candidatura preparada para publicar.

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
6. Confirma el fin de revisión y guarda. Solo las aceptadas deben aparecer. Si aceptas la corrección y el presupuesto condicionado, verás 300 Mb, referencia todavía de 40 € y disposición condicionada de 50 € con ambas condiciones. La autorización contractual queda fuera de escritura en V1, un límite técnico.
7. Pulsa **Volver a leer lo guardado**, recarga o detén y vuelve a arrancar el servicio. Comprueba datos, fuente, recibos de incorporación e historial.

Si una propuesta es incorrecta, anota qué dijo el modelo antes de editarla. Interesan también redundancias, lectura confusa y trabajo de corrección. No hemos medido ahorro de tiempo ni utilidad frente al método manual.

## Límite de inferencia

Modelo fijo GPT-6 Luna. Máximo autorizado: 1 USD y doce intentos, contando errores y repeticiones. El registro persistente no se reinicia al crear prueba ni reiniciar servidor.
Entrada contada antes de generar, máximo 6.000 tokens; salida máxima 4.000, incluido razonamiento; petición de hasta 24 KiB, sin herramientas ni reintentos. Reserva conservadora de 0,01 USD por intento: como máximo 0,12 USD para los doce. [Tarifas y cálculo](devpost/inference-budget.md).
En la comprobación del corte 1 se usaron **3/12 intentos**, reserva 0,03 USD y cota conservadora del consumo de generación conocido 0,0025505 USD. No es el importe de una factura. Cualquier nueva prueba aumenta el registro mostrado en pantalla.
Las tarifas verificadas vencen el **23/10/2026 a las 22:11 Europe/Madrid**; se bloquearán nuevas generaciones hasta revisarlas.

## Comprobaciones y límites del corte

```powershell
npm test
```

17 pruebas con node:test para controles, presupuesto, disco y servicio HTTP; no llaman al proveedor. Las salidas simuladas están identificadas y no acreditan comprensión del modelo.
[Evidencia de corte 1](devpost/evidence-slice1.md) separa la salida real original, las aprobaciones y la recuperación después de reiniciar el proceso. El script scripts/verify-slice1.mjs comprueba antes de guardar, crea una referencia tras guardar y compara contra un proceso nuevo; nunca llama al modelo.

En este corte el guardado es completo: exige aceptar o rechazar todas las propuestas y confirmar. Aún faltan guardado parcial, repetición con deduplicación completa y las seis familias con sus variantes. No se declara el núcleo global validado. Hay avisos antes de descartar trabajo; los borradores no se conservan tras recarga o reinicio. La advertencia de cierre depende del navegador y no cubre cierres forzados.

Los datos viven en runtime/workspace.json; los intentos en runtime/inference-ledger.json y las respuestas técnicas ficticias en runtime/evaluation/. Todo runtime queda fuera de Git. No borrar el registro para recuperar cupo. Un archivo corrupto detiene lectura/guardado; no se reinicializa silenciosamente. No se garantiza resistencia absoluta a fallo físico de disco.

## Plan y proceso

- [Alcance](devpost/scope.md), [PRD](devpost/prd.md), [especificación](devpost/spec.md), [lectura conjunta](devpost/review.md).
- [Orden aprobado y checkpoint humano pendiente](devpost/checklist.md), [seis casos previstos](devpost/evaluation.md).
- [Pack oficial](skills/README.md), [origen fijado y licencia](skills/ORIGIN.md). Se siguen sus pasos reales; el perfil de 1-start queda fuera de commits.

Git es solo local. No hay repositorio remoto, despliegue, inscripción ni presentación. Nombre definitivo, participación, acabado y materiales públicos siguen pendientes del participante.
