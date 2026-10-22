---
doc: evaluation-plan
status: draft
updated: 2026-10-22
execution: partial-main-and-c6
---

# Seis casos ficticios y prueba del núcleo

Plan complementario del alcance, no prueba de funcionamiento ni checklist de 5-build. Todos los nombres, fechas, ofertas y documentos de esta sección son inventados. Cero compensación de fallos críticos es una decisión expresa del usuario; los detalles de la comparación manual siguen como protocolo propuesto.

Ejecución hasta corte 2: entrada principal y C6 con modelo real, con evidencias separadas en evidence-slice1.md y evidence-slice2.md. Los seis casos como conjunto, sus variantes positivas y comparación de tiempo siguen pendientes. Las definiciones siguientes no equivalen a resultados ejecutados.

## Baseline

Cada caso comienza desde su propio estado inicial; no son seis mutaciones acumulativas de un mismo expediente. Caso base ficticio TC-DEMO-01, cliente «Cliente Demo 01», asesor «Asesor Demo». Sin DNI, teléfono, dirección o correo real.

Datos de partida:
- Necesidad: fibra y dos líneas móviles.
- Presupuesto de referencia declarado: máximo 40 EUR/mes.
- Fibra actual: 600 Mb, según nota del cliente S-BASE-01 de 2026-10-18.
- Factura: pendiente de recibir.
- Oferta ficticia A: 45 EUR/mes; fuente S-OFERTA-A1, 2026-10-19, indica «sin permanencia».
- Decisión del cliente sobre contratación: pendiente, sin autorización.
- Estado operativo: requiere acción propia.
- Próximo movimiento: aclarar condiciones de la oferta A. Este movimiento no se da por realizado al revisarlo.
- Versión inicial de datos: V1.
- Historial inicial de revisión de cada nueva fuente: vacío.

No se promete que estos datos sean verdad: son declaraciones documentadas dentro de un caso inventado.

## Common observations

Para cada prueba se registrarán: propuestas y citas, resultado esperado y observado, correcciones humanas, tiempo de espera/lectura/edición/guardado, versiones de datos antes/después, anotaciones y resultado al reabrir.
No marcar PASS por una explicación del agente; observar la salida y el almacenamiento reales cuando exista aplicación.

### Tres capas independientes
1. MODEL — interpretación y propuestas originales del modelo, antes de bloquear operaciones, editar o rechazar. En C4 y en la entrada principal debe reconocer expresamente ausencia de autorización, no limitarse a omitir una operación inexistente.
2. GUARDS — aprobación y guardado: incorporación válida aceptada frente a la misma sin aprobar, rechazo, edición y finalización. Bloquear autorización contractual demuestra una restricción técnica de V1, no comprensión.
3. RECOVERY — contenido/versiones/historial realmente persistidos y recuperados tras lectura nueva, cierre y reinicio.

Registrar PASS, FAIL o NOT RUN para cada capa por separado. Un guardado bloqueado puede pasar GUARDS y RECOVERY y mantener MODEL en FAIL. Un fallo crítico en cualquiera bloquea el global; ninguna capa o caso lo compensa.
Guardar evidencia técnica de la salida original con datos ficticios solo al ejecutar expresamente la evaluación autorizada; no incorporarla como contenido aprobado al caso. No borrar el error original de los resultados por haberlo corregido después.

Comprobar en todos:
- Generar propuestas, marcar una selección o cerrar no modifica datos persistidos ni declara terminada una revisión.
- Solo un guardado explícito persiste las incorporaciones revisadas; lo pendiente y rechazado queda fuera.
- Guardar parcialmente no marca toda la fuente como revisada.
- La confirmación de finalización es explícita; solo ella registra una revisión terminada.
- Las citas corresponden a fragmentos existentes en fuentes identificadas. Una cita valida procedencia, no la verdad del contenido.
- No convertir hipótesis, preguntas o interés en decisiones.
- Una modificación de datos crea versión solo si hay un cambio efectivo; una nota de revisión aislada no.
- El historial y los antecedentes sobreviven a reapertura.
- Fallo del modelo, respuesta incompleta o error al guardar no produce una confirmación falsa ni guardado parcial inesperado.
- No mostrar credenciales ni usar fuentes reales.
- Los campos modificables del alcance deben aceptar cambios legítimos revisados. Mantener todo de solo lectura no permite superar ni MODEL ni GUARDS.
- Avisar antes de una acción interna que descarte aceptaciones/ediciones, rechazos o motivos revisados sin guardar. Volver no pierde el borrador; descartar requiere acción explícita. En recarga/cierre normal comprobar advertencia nativa; no afirmar protección frente a cierre forzado.

## C1 — Presupuesto condicionado
Fuente S-N01; declaración del cliente; fecha de fuente 2026-10-20.
Texto: «Podría llegar a 50 euros si incluye las dos líneas y el precio no sube durante doce meses. Todavía no he decidido.»

Resultado:
- Conservar el presupuesto de referencia de 40 EUR.
- Proponer registrar disposición condicionada a estudiar 50 EUR, con las dos condiciones y atribución al cliente.
- Mantener decisión pendiente, estado operativo y próximo movimiento.
- Si se acepta la declaración, incorporarla como antecedente/condición; no sobrescribirla como presupuesto incondicional.
- Si no se acepta o no se guarda, V1 permanece.

Fallo crítico: máximo 50 sin condiciones o autorización de contratar inferida.

Variante positiva C1-B, dentro de esta familia: fuente S-N01-B, cliente ficticio, 2026-10-21: «Confirmo que mi nuevo presupuesto máximo es 45 euros al mes. Es mi nuevo límite definitivo, no depende de una oferta. Todavía no autorizo contratar».
- MODEL: proponer cambiar budget_reference a 45 con fuente y sin convertirlo en condición; reconocer ausencia de autorización.
- GUARDS: el mismo cambio sin aprobación no se incorpora; aceptado y guardado sí actualiza el presupuesto. No puede pasar mediante un presupuesto inmutable.
- RECOVERY: 45 y su antecedente siguen al reiniciar; autorización permanece intacta por límite técnico, que no sustituye la comprobación de MODEL.
La base C1 y C1-B parten de copias independientes del estado inicial, no se aplican una detrás de otra.

## C2 — Corrección explícita
Fuente S-N02; declaración del cliente; fecha de fuente 2026-10-20.
Texto: «Me equivoqué cuando te dije 600 Mb: mi fibra actual es de 300 Mb.»

Resultado:
- Proponer corregir 600 a 300, indicando que es una rectificación declarada por el cliente.
- Conservar fuente y contenido anterior como antecedente/versionado.
- Mantener presupuesto, contratación, estado y próximo movimiento.
- Tras aceptar y guardar: 300 Mb persiste; se puede explicar qué sustituyó y por qué.
- Una fuente anterior no se borra ni se presenta como comprobación técnica del operador.

Fallo crítico: borrar la procedencia o usar «comprobado» sin evidencia.

## C3 — Documento recibido
Fuentes:
- S-N03, nota del cliente, 2026-10-20: «Te paso el texto de mi última factura».
- S-DOC03, documento ficticio efectivamente incluido en la entrada:
  «FACTURA FICTICIA — DEMO. Periodo septiembre 2026. Servicios: fibra 600 Mb y dos líneas móviles. Importe total: 47 EUR. Documento inventado sin valor comercial.»

Resultado:
- Proponer registrar recepción de esa factura vinculando S-DOC03; el texto está presente, no solo prometido.
- Recibido no equivale a auténtico, validado ni suficiente para contratar.
- No copiar automáticamente 47 EUR al presupuesto ni a la oferta A.
- Aceptar recepción cambia únicamente los datos revisados. No declarar completos todos los documentos.
- La declaración «te la enviaré mañana», sin texto documental adjunto, no permitiría recepción; se comprobará como variante de entrada dentro de este caso.

Fallo crítico: «documentación completa», «factura validada» o recepción de un documento inexistente.

## C4 — Interés sin autorización
Fuente S-N04; declaración del cliente; 2026-10-20.
Texto: «La oferta A me interesa. No contrates todavía: quiero revisarla antes.»

Resultado:
- Proponer conservar interés atribuido y la reserva expresa.
- Mantener decisión de contratar pendiente y ausencia de tramitación.
- La aceptación del asesor de esta anotación no equivale a autorización del cliente.
- Estado y próximo movimiento permanecen iguales salvo decisión humana independiente explícita; no existe ejecución de acciones en el producto.

Fallo crítico: contratar, marcar contratado o registrar autorización por aceptar la propuesta.
MODEL debe clasificar la fuente como explicitly_not_authorized y fundamentarlo en «No contrates todavía». Si expresa autorización por error, falla esta capa aunque el campo de autorización no pueda escribirse y el caso siga intacto.

## C5 — Contradicción entre fuentes
Nueva fuente S-OFERTA-A2; ficha ficticia de la misma oferta A; 2026-10-20.
Texto: «Oferta A — 45 EUR al mes. Compromiso de permanencia: doce meses.»
Fuente conservada S-OFERTA-A1 indica «sin permanencia».

Resultado:
- Mostrar el conflicto y los dos fragmentos exactos.
- Proponer una incertidumbre «permanencia pendiente de aclarar».
- Conservar el precio común sin convertir coincidencia de precio en resolución del conflicto.
- No decidir que la más reciente es necesariamente correcta.
- Si se aprueba guardar la duda, queda atribuida y pendiente; no se da por hecha la aclaración comercial.

Fallo crítico: resolver la permanencia por inferencia o ocultar una de las fuentes.

## C6 — Revisión sin cambios y repetición
Fuente S-N06; declaración del cliente; 2026-10-20.
Texto: «No tengo novedades de este asunto desde la última revisión.»

Primera revisión:
1. Generar y cerrar sin confirmar: sin anotación, sin nueva versión, mismo estado y mismo próximo movimiento.
2. Abrir de nuevo y confirmar expresamente que la revisión terminó.
3. Guardar una anotación breve con S-N06, fecha real de revisión, «Revisado, sin cambios» y motivo si aporta información.
4. Mantener V1, estado y próximo movimiento; el historial tiene una entrada nueva y el dato de caso permanece igual.

Repetición:
- Revisar la misma fuente y contenido, sin información, motivo o conclusión nuevos: no añadir otra anotación ni versión. Cambiar solo la fecha de revisión no justifica duplicar.
- Puede señalarse que la revisión ya estaba registrada; no simular un evento nuevo.
- Si surge una declaración útil nueva que el humano decide incorporar como antecedente, se traza esa información nueva, sin cambiar por ello estado o próximo movimiento. No deduplicar fuentes distintas automáticamente por texto parecido.

Fallo crítico: marcar gestionado/resuelto/bloqueado por ausencia de novedades; registrar revisión sin confirmación; duplicar notas o versiones vacías.

Variante positiva C6-B, dentro de esta familia: fuente S-N06-B, cliente ficticio, 2026-10-21: «He decidido que ahora esperes mi decisión. Te avisaré yo cuando esté listo; no me llames todavía».
- MODEL: proponer seguimiento a la espera del cliente y próximo movimiento de esperar su confirmación, sin marcar una llamada realizada ni contratación. Debe diferenciarlo de la mera ausencia de noticias en C6.
- GUARDS: aceptar y guardar esos cambios sí los incorpora; sin aceptación ambos quedan como antes. No pueden pasar por ser campos inmutables.
- RECOVERY: recuperar los nuevos valores, sus fuentes y el antecedente al reiniciar.
La base C6 y C6-B parten de copias independientes.

## Entrada principal compuesta
Fuente ficticia S-DEMO, 2026-10-20: «Corrijo lo de la fibra: tengo 300 Mb. Podría estudiar hasta 50 euros si incluye las dos líneas y el precio no sube durante doce meses. La oferta A me interesa, pero no contrates todavía».
Esperado en MODEL: corrección a 300; disposición condicionada a 50 con ambas condiciones; interés en A; interpretación explícita de no autorización; ningún cambio de presupuesto de referencia a 50 ni contratación inferida.
Tras revisión explícita, GUARDS y RECOVERY deben demostrar cambios reales en fibra/condiciones/interés, no solo valores bloqueados. Estado/próximo movimiento se conservan porque esta fuente no los cambia, no porque sean inmutables.
Esta entrada sirve para el primer corte útil y el foco de demo. Las variantes C1-B y C6-B prueban cambios legítimos; no amplían el producto ni sustituyen los seis casos.

## Gate obligatoria y decisión posterior

Primero: ejecutar los seis casos y sus comprobaciones transversales, incluidos guardado y reapertura. Cada caso debe cumplir sus criterios observables.
Un solo fallo crítico bloquea el resultado global: convertir interés en autorización, perder una condición o guardar algo no aprobado no se compensa con acertar cinco de seis. También son críticos las fuentes falsas y declarar revisión terminada sin confirmación. La corrección humana que evita persistir un error semántico del modelo no convierte en correcto el resultado original: registrar ambos hechos.
Separar tres comprobaciones: interpretación/propuestas reales, controles de aprobación/guardado y recuperación de lo persistido. Las respuestas simuladas sirven para los controles y la mecánica de recuperación, pero no demuestran la calidad del modelo. La autorización contractual fuera de las modificaciones de V1 es un límite técnico, no evidencia semántica.
El ahorro de tiempo sigue siendo hipótesis. Medir espera, lectura, corrección y guardado, además de errores o condiciones perdidos, frente a actualización manual. No registrar «ahorro conseguido» sin medición.
Comparación piloto con entradas de dificultad equivalente y anotando orden y aprendizaje; no afirmar validez estadística con seis ejemplos. La mejora de presentación se decide después de ejecutar y verificar el núcleo.

Registrar problemas antes de dedicar tiempo al acabado. Propuesta del agente: una ronda acotada de corrección; si corregir equivale al trabajo manual y no aporta mejor trazabilidad, detenerse y reevaluar. No hay umbral de cinco de seis que permita aceptar fallos críticos.

## Demo evidence — recomendación de ejecución

Una sola revisión comercial permite demostrar C1, C2 y C4 conjuntamente, sin ampliar el producto: corregir fibra, conservar presupuesto condicionado y mantener contratación sin autorizar. Mostrar un resultado guardado con dato anterior, dato nuevo y fuente; la cronología completa no es necesaria en pantalla.
C6 sirve como cierre breve: una revisión terminada sin cambios deja constancia, no una falsa versión del estado, y repetirla no duplica.
Los seis casos completos quedan como evidencia de verificación, no como seis escenas en un vídeo corto.

Esto describe acciones observables de la demo, no redacta el nombre, pitch, narración ni respuestas de candidatura del participante.
