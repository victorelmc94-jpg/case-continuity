---
doc: checklist
status: approved
updated: 2026-10-26
---

# Build Checklist

Build mode: fast — elegido por el usuario. Prueba temprana recibida y tres cortes construidos. El participante probó S-PRUEBA-47: nueva interpretación, aceptación, guardado y relectura; no Editar ni ahorro. Detectó pérdida de una actuación pendiente; corrección y regresión acotada del agente verificadas. Su prueba breve de Editar y la valoración final siguen pendientes.

Orden aprobado expresamente por el usuario. Esta continuación ejecuta el corte 3 sin funciones fuera de alcance. Los tres cortes incluyen comportamiento completo que se puede usar y verificar; no son fases separadas de interfaz, almacenamiento y modelo.

Git local y commits revisados autorizados. Se ha inicializado la carpeta dedicada; no hay repositorio remoto.
Inferencia autorizada hasta 1 USD y 40 intentos acumulados, incluidos los doce anteriores y todos los errores/repeticiones. Ampliación expresa del participante para texto propio y modelo real. Tarifas reconfirmadas, entrada contada antes de generar, máximo 6.000 tokens de entrada y 4.000 de salida, registro persistente y reserva conservadora de 0,01 USD/intento (máximo 0,40 USD). Si no se puede comprobar el límite, no generar. Ver inference-budget.md.
En cada commit: revisar cambios previstos, proteger learner-profile.md y credenciales, incorporar solo archivos de este proyecto; no usar un añadido masivo sin revisión.

## Slices

- [x] **1. Incorporar la novedad principal y recuperar sus cambios reales**
  Becomes usable: Una aplicación local permite analizar la entrada compuesta, revisar la corrección de fibra, el presupuesto condicionado y el interés, confirmar su incorporación y recuperar el resultado desde disco. Se muestra también la interpretación del modelo sobre ausencia de autorización.
  Why now: Demuestra el núcleo y el riesgo semántico desde el primer corte, sin una fachada genérica ni depender de campos inmutables. El arranque del proyecto forma parte de este resultado, no de un paso separado.
  PRD ref: `prd.md > The Core Journey`; `prd.md > Expediente y fuentes`; `prd.md > Propuestas con límites`; `prd.md > Finalización e historial sin cambios`.
  Spec ref: `spec.md > Proponente de cambios`; `spec.md > Reglas de incorporación`; `spec.md > Almacenamiento y repetición`; `spec.md > Contrato de generación`; `spec.md > Where It Runs and How Someone Tries It`; `spec.md > File Structure`.
  Build: Crear únicamente la aplicación prevista, sin paquetes externos, con base ficticia, pantalla funcional, análisis, contrato de interpretación y propuestas, fuente visible, decisiones explícitas y guardado/finalización completos. Incluir registro cerrado de campos modificables, sin hacer inmutables presupuesto o seguimiento; solo autorización contractual fuera de escritura. Proteger clave, validar referencias y escribir versiones/recibos. Modelo real tras autorización; cualquier salida simulada para controles se identifica y no valida MODEL.
  Verify (mechanical): Arrancar el servicio local según spec; ejecutar controles con node --test. En la entrada principal comprobar MODEL antes de editar: 300 Mb, 50 condicionado con ambas condiciones, interés y explicitly_not_authorized. Comprobar GUARDS con selección no aprobada y aprobada. Leer disco, reiniciar y comprobar RECOVERY: 300, presupuesto de referencia 40 junto a la condición nueva, interés sin contratación y fuentes. Anotar los tres veredictos. Sin presupuesto, esta verificación real queda NOT RUN y el corte no se marca completo por una simulación.
  Learner check: Abrir el caso, leer fuente y propuestas, guardar lo revisado y reabrir. Comprobar qué cambió y qué no; verificar que el modelo haya dicho expresamente que no existe autorización. Indicar qué resulta confuso o requiere corrección antes de extender el recorrido.
  Commit: `Add reviewed novelty flow with traceable persistence`

- [x] **2. Revisar por partes, terminar sin cambios y salir con aviso**
  Becomes usable: Se puede guardar una parte sin declarar terminada la revisión, finalizarla después, registrar «Revisado, sin cambios» sin versión vacía y repetir la misma fuente sin duplicados. Antes de perder trabajo revisado no guardado aparece un aviso.
  Why now: Prueba el límite entre incorporación, finalización y ausencia de cambios sobre el núcleo ya utilizable. Evita que el historial o la navegación falseen trabajo realizado.
  PRD ref: `prd.md > Revisión y guardado parcial`; `prd.md > Finalización e historial sin cambios`; `prd.md > Repetición y reapertura`; `prd.md > Entrada de una novedad`; `prd.md > States and Boundaries`.
  Spec ref: `spec.md > Interfaz de expediente y revisión`; `spec.md > Reglas de incorporación`; `spec.md > Almacenamiento y repetición`; `spec.md > Data Model`; `spec.md > Important Failure Modes`.
  Build: Añadir guardado parcial y actualización de la base del propio borrador tras su escritura, decisiones pendientes/rechazadas fuera del guardado y finalización explícita. Conservar recibos previos sin etiquetar falsamente «sin cambios» al terminar. Distinguir dataVersion, storageRevision y reviewEvents. Añadir idempotencia/deduplicación y avisos de descarte interno y recarga/cierre normal, incluidos rechazos y motivos no guardados.
  Verify (mechanical): Con node --test probar que parcial guarda solo lo aceptado, que finalizar exige resolver pendientes y que su repetición no duplica. C6: generar/cerrar no registra revisión, confirmar añade una anotación manteniendo V1, repetir mantiene una sola anotación; leer y reiniciar. Verificar avisos en el navegador y que volver conserva el borrador; descartarlo no finaliza. Para MODEL de C6 usar salida real si se autoriza o mantener NOT RUN; los controles simulados no suplen esa capa. Si ya hubo incorporaciones parciales, la finalización las reconoce.
  Learner check: Guardar una incorporación y dejar otra pendiente; intentar cambiar de prueba y volver sin perder decisiones. Finalizar después, reabrir y revisar la traza. Confirmar una revisión sin cambios y repetirla, comprobando que no aparecen actividad o versiones ficticias.
  Commit: `Add partial reviews, explicit completion and discard warnings`

- [x] **3. Ejecutar las seis familias, los cambios positivos y la recuperación ante errores**
  Becomes usable: La misma aplicación permite ejecutar C1–C6 y las variantes positivas C1-B/C6-B, con documento separado, contradicción de fuentes y modificaciones legítimas de presupuesto/seguimiento. Los resultados tienen evidencia separada de interpretación, controles y recuperación.
  Why now: Cierra el alcance y demuestra que conservar un campo en los casos negativos es una interpretación correcta, no una incapacidad técnica para cambiarlo. Permite decidir utilidad y acabado con evidencia del núcleo.
  PRD ref: `prd.md > Propuestas con límites`; `prd.md > Seis pruebas y registro de evidencia`; `prd.md > What We're Building`; `prd.md > States and Boundaries`.
  Spec ref: `spec.md > Ejemplos y verificación`; `spec.md > Contrato de generación`; `spec.md > Reglas de incorporación`; `spec.md > Data Model`; `spec.md > Important Failure Modes`; `spec.md > Verification`.
  Build: Completar selección de las seis bases aisladas, nota/documento como fuentes distintas, ofertas y contradicciones, presupuesto incondicional explícito y seguimiento respaldado. Generar evidencia técnica ficticia con salida original y veredictos MODEL/GUARDS/RECOVERY, sin incorporarla como dato aprobado. Completar manejo de timeout/refusal, error de disco, conflicto entre pestañas y cierre sin éxito falso. No añadir acabado de presentación ni integraciones.
  Verify (mechanical): Ejecutar node --test y la evaluación real autorizada. En C1-B, el modelo propone 45 como nuevo presupuesto de referencia; aceptado persiste y sin aprobación no cambia. En C6-B, propone cambios justificados de seguimiento; aceptados persisten. Evaluar por separado los seis casos base y la entrada principal. Reiniciar proceso y releer cada resultado. Probar fallos de guardado/llamadas y conflicto sin modificaciones o éxito falsos. Registrar por caso las tres capas y sus críticos; ninguna capa ni caso compensa otro. Si cambia contrato/prompt/comportamiento, repetir solo la evidencia afectada, dentro del consumo autorizado o detenerse para acordar ampliación.
  Learner check: Probar presupuesto condicional frente a cambio definitivo, documento presente frente a prometido y ausencia de noticias frente a petición explícita de esperar al cliente. Reabrir sin ayuda del agente y explicar lo aceptado, origen y pendiente. Medir trabajo total frente a actualización manual; valorar correcciones y trazabilidad antes de decidir acabado.
  Commit: `Complete six-case evaluation with independent recovery checks`

## Hands-on Checkpoints

- [x] Early usable behavior explored — el usuario confirmó el resultado visible del corte 1 y pidió historial claro, disposición «podría estudiar» y petición expresa de no contratar con fuente; ajustes incorporados en corte 2.
- [x] Revisión humana final y feedback: el participante probó texto propio en S-PRUEBA-47 y detectó pérdida del pendiente. Delegó la repetición afectada al agente el 26/10 y autorizó publicar el PoC con sus límites. No implica que haya probado Editar ni los seis casos personalmente.
- Modo fast elegido. Control temprano completado por feedback expreso; no exige presencia continua. La revisión final y la evaluación global siguen pendientes.

## Final Review

- [x] Los tres cortes están verificados mecánicamente y sus evidencias indican ejecución, código/prompt y límites; no implica aceptación humana final.
- [x] MODEL: evaluación original de seis casos/positivos documentada, con dos fallos de precisión. S-PRUEBA-47 original es FAIL por perder una actuación pendiente. Nuevo prompt comprobado solo en R47 y dos contrastes, sin compensar ese fallo ni recalificar salidas antiguas. Ver revision-pending-actions.md.
- [x] GUARDS: cambios válidos aceptados se guardan; no aceptados no se guardan; autorización contractual bloqueada se informa solo como restricción de V1.
- [x] RECOVERY: datos, antecedentes, fuentes, revisiones y versiones coinciden al leer de nuevo y reiniciar; parcial, deduplicación y fallos no producen estado ficticio en las comprobaciones ejecutadas.
- [x] Sin fallo crítico conocido pendiente en las comprobaciones acotadas tras el ajuste; el fallo original sigue como FAIL histórico. No implica garantía semántica general. Lista estructurada vacía documentada, declaración/cita y resultado conservados.
- [x] Prueba técnica delegada por el participante el 26/10: R47, Editar el valor → aceptar edición → guardar → cerrar pestaña y reabrir. Ejecutada por el agente en d136cb17, texto/fuentes/pendiente conservados. La prueba de Editar no se atribuye al participante. Ver release-check.md.
- [x] Observación humana y corrección acordada documentadas; por instrucción expresa la repetición de Editar la ejecutó el agente. Autoría separada en release-check.md y evidence-release.json.
- [x] Decisión de continuar hacia entrega del 26/10 documentada por instrucción expresa del participante. La comparación manual y medición no están realizadas; ahorro sigue sin demostrarse. No afirmar medición ni añadir acabado fuera del alcance.
- [x] Final review complete para este PoC con límites: el participante aprobó el paquete/publicación el 26/10. Vídeo y envío final siguen sujetos a revisión; no se declara candidatura presentada.

Evidencia histórica en los tres cortes; feedback humano del corte 1, aviso nativo de Chrome y aceptación/guardado/relectura de S-PRUEBA-47. Original preservado y corrección en revision-pending-actions.md. Sin prueba humana de Editar, reinicio ni valoración de tiempo atribuida.

## Code Tour and App Map

- [x] Learning activity: recapitulación de investigación real ya realizada por el participante al detectar que guardar correctamente no prueba interpretar correctamente; requisito, instrucciones y pruebas enlazados en mapa. Sin actividad de código nueva atribuida.
- [x] Práctica existente reconocida. No se hizo edición de código por el participante. Reflexión ofrecida, sin respuesta de aprendizaje atribuida ni exigencia de otra actividad; delegación solicitada.
- [x] `devpost/app-map.html` generado desde código real, rutas/símbolos comprobados y enlace mostrado. Guía offline sin scripts/red. Apertura visual en navegador bloqueada por protocolo local; no se declara validación visual.

Activity and evidence: observación humana S-PRUEBA-47 y recapitulación del 26/10; distinguir interpretación, controles y recuperación como práctica reutilizable. No dominio de código supuesto.
Route and stops: ruta de referencia en public/app.js (renderDraft/save), src/domain.mjs (commitReview), src/store.mjs (atomicWrite/WorkspaceStore.transact); no recorrido interactivo atribuido.
Edit outcome: solo edición por interfaz ejecutada por el agente; no edición de código humana.
Reflection: ofrecida; no se atribuye respuesta personal de aprendizaje. Perfil personal excluido de publicación.
Activity mode: alternativa enfocada sobre trabajo real previo y recapitulación, por preferencia explícita de delegación.

## Revisions

- 2026-10-26: participante pide terminar/presentar hoy, delega expresamente la repetición de Editar y solicita registrar actor real. Se sustituye la repetición humana pendiente por un check técnico delegado sin inventar práctica humana. Se conserva su observación original y el fallo MODEL. 36 controles locales, cero inferencia nueva, 17/40. Preparación local publicable, documentos técnicos ingleses y mapa; publicación y envío sujetos a revisión final.

- 2026-10-24: participante informa S-PRUEBA-47, expediente 21ff502f. Se conservan fuente, salida original, recibos, versiones y hashes. Aceptó tres propuestas sin editar y releyó: no registrar como prueba de Editar, cierre/reinicio o ahorro. Próximo movimiento perdía aclaración no resuelta: MODEL original FAIL aunque fuera aceptado.
- Corrección de generación: conservar actuaciones pendientes y combinar esperas; permitir reemplazo con cancelación/resolución/sustitución explícita. Campo sigue editable. Tres regresiones reales, un reemplazo legítimo guardado y una edición por pantalla del agente recuperada íntegramente en otro proceso. 33 controles locales pasan. Acumulado 17/40, reserva 0,17 USD, cota conocida 0,01225175 USD. Sin inferencia en edición/recuperación. No se repite ni se recalifica toda la tanda anterior.
- Añadida entrada ficticia R47 para una única prueba breve de Editar con la respuesta corregida registrada. Es material de prueba dentro del flujo existente, sin nueva función de negocio. El original humano no se reescribe. Reintento humano, comparación manual, decisión de acabado y entrega quedan pendientes. Publicación no autorizada.

- 2026-10-23, preparación final: participante autoriza 40 acumulados manteniendo 1 USD. Se conserva íntegro el bloque de doce intentos, sin reiniciar consumo ni retirar bloqueos. Una comprobación técnica real nueva: 13/40, quedan 27; 33 controles locales superados. Texto nuevo, dos cambios aceptados, sugerencia opcional rechazada y recuperación íntegra en otro proceso. Evidencia: final-review-readiness.md. No es prueba ni valoración del participante.
- Las dos redundancias originales siguen como FAIL de precisión: al repetirlas por pantalla requieren una tarjeta/decisión extra; rechazarlas permite finalizar guardando solo lo útil. Carga de tiempo y molestia pendientes de valoración humana. No se cambia el prompt ni se ocultan tarjetas. Origen de nueva interpretación, respuesta registrada y revisión local visibles en la sección de propuestas. Sin funciones nuevas de negocio.
- Prueba final del participante, medición y decisión de acabado/candidatura siguen sin marcar. La limitación histórica de cupo agotado tras corte 3 queda sustituida por la ampliación; las respuestas registradas siguen exigiendo contexto exacto y los borradores continúan sin persistirse.

- 2026-10-22, corte 3: commit 165a5b3. Seis familias, variantes positivas, factura prometida y principal evaluadas. Ocho llamadas nuevas, doce acumuladas, sin reintentos ni ampliación del presupuesto. Dos respuestas compatibles reutilizadas. 32 controles locales; veinte tratamientos de aprobación/rechazo comparados íntegramente en otro proceso. Evidencia separada en evidence-slice3.md y originales ficticios en evidence-model-slice3.json.
- No se detectan fallos críticos en la muestra actual; principal/C4 mantienen fallos de precisión por redundancia, que el agente rechaza en los controles. Prueba final humana y ahorro pendientes. No se marca aceptación global ni listo para publicar.
- Aviso propio de Ctrl+R visible y cancelación conservando PRUEBA comprobados por el agente. El participante confirma aparición del aviso nativo de Chrome; no se le atribuye cancelación/conservación ni prueba final del conjunto. El fallo inicial de ausencia de aviso queda registrado.
- Repetición explícita de respuestas reales registradas disponible solo para contexto exacto, sin nuevas llamadas. Cupo agotado: no permite analizar entradas editadas o continuar un estado parcial modificado tras perder su borrador. Limitación documentada antes de la prueba final; no hay fallback silencioso ni resultados inventados.

- 2026-10-22, continuación: feedback temprano recibido y corte 2 autorizado. Tres ajustes de presentación incorporados sin cambiar el expediente persistido. Evidencias en evidence-slice2.md; 28 controles locales y C6 real. No se declara superada la evaluación global ni ahorro medido.
- Commit del corte 2: 6120344. Se marca construido y comprobado mecánicamente, con la limitación visual del aviso nativo registrada en evidencia. Corte 3 queda sin ejecutar en esta continuación.
- Parciales se reconocen por recibos vinculados a fuente y huella; no hace falta guardar borradores o añadir otra base de datos. Reapertura de revisión ya terminada y datos iguales no consulta el modelo. Condiciones distintas para misma fuente/importe generan conflicto, sin fusión semántica automática.

- 2026-10-22: corte 1 ejecutado; 17 controles locales, modelo real, guardado y reinicio con igualdad completa. Esperar prueba humana antes del corte 2. No marcar completado el checkpoint humano.
- Commit del corte 1: b980823, revisado antes de incorporar los archivos. El check del corte acredita construcción y verificación mecánica; el checkpoint humano continúa pendiente por instrucción del usuario. No avanzar al siguiente corte hasta recibir su prueba.
- El primer modelo produjo un interés con value.text nulo; se mantuvo la validación, se precisó el contrato en las instrucciones y se conservó el FAIL original. Los intentos posteriores fueron válidos en los requisitos de la entrada principal. Se rechazó una propuesta redundante; no se presenta precisión perfecta ni ahorro medido.
- La respuesta API informó cache_write_tokens: se amplió la contabilidad conservadora con las tarifas oficiales de escritura y se desactivó la caché deliberada. Máximo de generación 0,0035 USD/intento; reserva 0,01 sin modificar los límites del usuario. Ver inference-budget.md.
- Implementación usa fixtures/main.json para el corte 1 y scripts/verify-slice1.mjs para evidencia de lectura y reinicio. El archivo de los seis ejemplos sigue pendiente del corte 3. Aviso básico de descarte ya presente por la condición de no perder trabajo sin advertencia; prueba completa de salidas y cancelación sigue en corte 2.
