---
doc: joint-planning-review
status: approved
updated: 2026-10-22
---

# Revisión conjunta de producto y solución técnica

El usuario ha aceptado el paquete conjunto con el ajuste aquí incorporado: cambios legítimos permitidos y evaluación en tres capas independientes. [PRD](prd.md) y [especificación](spec.md) recogen sus precisiones. Posteriormente aprobó orden, fast, Git local y hasta 1 USD/doce intentos. Corte 1 construido y comprobado, pendiente de su prueba; [evidencias](evidence-slice1.md).

## Resultado que debe demostrar la primera versión
Introducir una novedad de un cliente ficticio de fibra y dos móviles, revisar cambios con sus fuentes, guardar solo lo aprobado y recuperar un expediente correcto al reabrir.
La revisión sin cambios deja constancia solo al confirmar su finalización; conserva estado, próximo movimiento y versión de datos. Repetir la misma revisión sin información nueva no duplica.

## Decisiones del paquete aceptado con ajuste

| Producto | Ejecución técnica propuesta | Consecuencia práctica |
| --- | --- | --- |
| Una pantalla con expediente, novedad, propuestas e historial | HTML/CSS/JavaScript y un servidor local Node 24, sin framework | Menos preparación; se usa en este equipo y no como servicio multiusuario. |
| El modelo sugiere; la persona incorpora | La API del modelo no tiene acceso al guardado; las incorporaciones pasan por reglas del programa | Validar formato y citas no garantiza significado; se evalúan los seis casos. |
| Los campos del alcance admiten cambios legítimos revisados | Registro cerrado de campos y operaciones, incluido presupuesto de referencia y seguimiento | No se supera la evaluación manteniéndolos inmutables. C1-B y C6-B exigen cambios positivos. |
| Solo autorización contractual queda fuera de modificaciones de V1 | El modelo sí interpreta su existencia o ausencia en una salida evaluable independiente | El bloqueo técnico no acredita comprensión; equivocarse en C4 mantiene MODEL en FAIL. |
| «Guardar incorporaciones revisadas» y «Confirmar fin de revisión» son intenciones distintas | Datos versionados y revisión confirmada se registran con reglas distintas en un mismo archivo | Un guardado parcial no declara revisado todo el caso; finalizar no pierde incorporaciones previas. |
| Lo pendiente no se guarda automáticamente | Aviso antes de descartar trabajo revisado sin guardar; salida interna cancelable y advertencia nativa en cierre/recarga normal | Incluye aceptaciones, ediciones, rechazos y motivo. No se promete recuperar borradores o interceptar cierres forzados. |
| La procedencia queda disponible | La confirmación incluye las fuentes originales que se archivarán como aportadas | Archivar una fuente no convierte todos sus contenidos en hechos aprobados. |
| Seis pruebas independientes y reapertura | Ejemplos ficticios aislados, almacenamiento local y controles contra repetición | Se puede repetir cada prueba sin borrar las anteriores ni usar aplicaciones reales. |
| Modelo GPT-6 Luna | Conteo antes de generar, entrada ≤ 6000 y salida ≤ 4000, doce intentos totales | Generación comprobada en corte 1; calidad global de los seis casos pendiente. Presupuesto máximo 1 USD autorizado, reserva conservadora ≤ 0,12 USD. |

No cambia la arquitectura local. Se amplían operaciones permitidas, interpretación evaluable y comprobaciones positivas. El nombre sigue pendiente y no se autoriza consumo por aceptar el modelo candidato.

## Comprobación obligatoria
[C1–C6 y resultados esperados](evaluation.md):
1. Presupuesto condicionado: mantener 40 EUR de referencia y conservar todas las condiciones de estudiar 50.
2. Corrección: 600 a 300 Mb con procedencia y antecedente.
3. Documento incluido: recibido, sin afirmar autenticidad ni documentación completa.
4. Interés: conservarlo sin autorización de contratar.
5. Contradicción: mostrar ambas fuentes y no resolverla por inferencia.
6. Sin novedades: anotación solo al confirmar, misma versión de datos y repetición sin duplicados.

Un solo fallo crítico bloquea el resultado global. Interés convertido en autorización, condición perdida o contenido no aprobado guardado no se compensan con otros aciertos. También bloquean fuentes falsas y finalización sin confirmación. Registrar el error aunque la persona lo detecte antes de guardar.

Tres resultados independientes: MODEL (interpretación/propuestas originales), GUARDS (aprobación/guardado) y RECOVERY (resultado persistido/reapertura). Una capa correcta no compensa otra errónea.
Primero pruebas sin coste para controles y recuperación; después, si se autoriza, seis casos con modelo real, variantes positivas de C1/C6 y entrada principal compuesta. Las simulaciones o los campos bloqueados no validan MODEL.
Se han ejecutado 17 controles locales y la entrada principal con modelo real. Los seis casos y variantes siguen pendientes del corte 3.

## Coste y medición
Acceso de generación comprobado: tres respuestas con uso informado. Saldo y cuota total de cuenta no consultados. El límite autorizado es 1 USD/doce intentos, con entrada contada y salidas acotadas. El cálculo conservador actualizado incluye escrituras de caché: [presupuesto](inference-budget.md). Tres intentos usados; quedan nueve. No se promete otra tanda completa si se agota el cupo. No se activan servicios de Google o AWS.

El ahorro de tiempo es una hipótesis. Registrar espera, lectura, corrección y guardado frente al trabajo manual; también trazabilidad y errores. Después de esos resultados se decide continuar, ajustar o parar y cuánto acabado merece. No hay porcentaje de ahorro conseguido.

## Lectura y siguiente paso
- [PRD completo](prd.md): controles, resultado esperado, guardado parcial, finalización y límites.
- [Especificación completa](spec.md): componentes, datos, contratos, errores y pruebas.
- [Evaluación](evaluation.md): seis entradas ficticias y observaciones.

El [orden de construcción](checklist.md) está aprobado, en modo fast. Tras el corte 1 se espera la prueba humana antes de ampliar. El nombre definitivo sigue pendiente; no bloquea probar el núcleo.
