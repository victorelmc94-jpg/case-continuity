---
doc: checklist
status: approved
updated: 2026-10-22
---

# Build Checklist

Build mode: fast — elegido expresamente por el usuario el 2026-10-22. Detenerse tras el corte 1 listo y esperar su prueba antes de ampliar.

Orden aprobado expresamente por el usuario. Implementar solo el corte 1 en este turno; los demás requieren su prueba previa. Los tres cortes incluyen comportamiento completo que se puede usar y verificar; no son fases separadas de interfaz, almacenamiento y modelo.

Git local y commits revisados autorizados. Se ha inicializado la carpeta dedicada; no hay repositorio remoto.
Inferencia autorizada hasta 1 USD y doce intentos totales, incluidos errores/repeticiones. Tarifas verificadas, entrada contada antes de generar, máximo 6.000 tokens de entrada y 4.000 de salida, registro persistente y reserva conservadora de 0,01 USD/intento. Si no se puede comprobar el límite, no generar. Ver inference-budget.md.
En cada commit: revisar cambios previstos, proteger learner-profile.md y credenciales, incorporar solo archivos de este proyecto; no usar un añadido masivo sin revisión.

## Slices

- [ ] **1. Incorporar la novedad principal y recuperar sus cambios reales**
  Becomes usable: Una aplicación local permite analizar la entrada compuesta, revisar la corrección de fibra, el presupuesto condicionado y el interés, confirmar su incorporación y recuperar el resultado desde disco. Se muestra también la interpretación del modelo sobre ausencia de autorización.
  Why now: Demuestra el núcleo y el riesgo semántico desde el primer corte, sin una fachada genérica ni depender de campos inmutables. El arranque del proyecto forma parte de este resultado, no de un paso separado.
  PRD ref: `prd.md > The Core Journey`; `prd.md > Expediente y fuentes`; `prd.md > Propuestas con límites`; `prd.md > Finalización e historial sin cambios`.
  Spec ref: `spec.md > Proponente de cambios`; `spec.md > Reglas de incorporación`; `spec.md > Almacenamiento y repetición`; `spec.md > Contrato de generación`; `spec.md > Where It Runs and How Someone Tries It`; `spec.md > File Structure`.
  Build: Crear únicamente la aplicación prevista, sin paquetes externos, con base ficticia, pantalla funcional, análisis, contrato de interpretación y propuestas, fuente visible, decisiones explícitas y guardado/finalización completos. Incluir registro cerrado de campos modificables, sin hacer inmutables presupuesto o seguimiento; solo autorización contractual fuera de escritura. Proteger clave, validar referencias y escribir versiones/recibos. Modelo real tras autorización; cualquier salida simulada para controles se identifica y no valida MODEL.
  Verify (mechanical): Arrancar el servicio local según spec; ejecutar controles con node --test. En la entrada principal comprobar MODEL antes de editar: 300 Mb, 50 condicionado con ambas condiciones, interés y explicitly_not_authorized. Comprobar GUARDS con selección no aprobada y aprobada. Leer disco, reiniciar y comprobar RECOVERY: 300, presupuesto de referencia 40 junto a la condición nueva, interés sin contratación y fuentes. Anotar los tres veredictos. Sin presupuesto, esta verificación real queda NOT RUN y el corte no se marca completo por una simulación.
  Learner check: Abrir el caso, leer fuente y propuestas, guardar lo revisado y reabrir. Comprobar qué cambió y qué no; verificar que el modelo haya dicho expresamente que no existe autorización. Indicar qué resulta confuso o requiere corrección antes de extender el recorrido.
  Commit: `Add reviewed novelty flow with traceable persistence`

- [ ] **2. Revisar por partes, terminar sin cambios y salir con aviso**
  Becomes usable: Se puede guardar una parte sin declarar terminada la revisión, finalizarla después, registrar «Revisado, sin cambios» sin versión vacía y repetir la misma fuente sin duplicados. Antes de perder trabajo revisado no guardado aparece un aviso.
  Why now: Prueba el límite entre incorporación, finalización y ausencia de cambios sobre el núcleo ya utilizable. Evita que el historial o la navegación falseen trabajo realizado.
  PRD ref: `prd.md > Revisión y guardado parcial`; `prd.md > Finalización e historial sin cambios`; `prd.md > Repetición y reapertura`; `prd.md > Entrada de una novedad`; `prd.md > States and Boundaries`.
  Spec ref: `spec.md > Interfaz de expediente y revisión`; `spec.md > Reglas de incorporación`; `spec.md > Almacenamiento y repetición`; `spec.md > Data Model`; `spec.md > Important Failure Modes`.
  Build: Añadir guardado parcial y actualización de la base del propio borrador tras su escritura, decisiones pendientes/rechazadas fuera del guardado y finalización explícita. Conservar recibos previos sin etiquetar falsamente «sin cambios» al terminar. Distinguir dataVersion, storageRevision y reviewEvents. Añadir idempotencia/deduplicación y avisos de descarte interno y recarga/cierre normal, incluidos rechazos y motivos no guardados.
  Verify (mechanical): Con node --test probar que parcial guarda solo lo aceptado, que finalizar exige resolver pendientes y que su repetición no duplica. C6: generar/cerrar no registra revisión, confirmar añade una anotación manteniendo V1, repetir mantiene una sola anotación; leer y reiniciar. Verificar avisos en el navegador y que volver conserva el borrador; descartarlo no finaliza. Para MODEL de C6 usar salida real si se autoriza o mantener NOT RUN; los controles simulados no suplen esa capa. Si ya hubo incorporaciones parciales, la finalización las reconoce.
  Learner check: Guardar una incorporación y dejar otra pendiente; intentar cambiar de prueba y volver sin perder decisiones. Finalizar después, reabrir y revisar la traza. Confirmar una revisión sin cambios y repetirla, comprobando que no aparecen actividad o versiones ficticias.
  Commit: `Add partial reviews, explicit completion and discard warnings`

- [ ] **3. Ejecutar las seis familias, los cambios positivos y la recuperación ante errores**
  Becomes usable: La misma aplicación permite ejecutar C1–C6 y las variantes positivas C1-B/C6-B, con documento separado, contradicción de fuentes y modificaciones legítimas de presupuesto/seguimiento. Los resultados tienen evidencia separada de interpretación, controles y recuperación.
  Why now: Cierra el alcance y demuestra que conservar un campo en los casos negativos es una interpretación correcta, no una incapacidad técnica para cambiarlo. Permite decidir utilidad y acabado con evidencia del núcleo.
  PRD ref: `prd.md > Propuestas con límites`; `prd.md > Seis pruebas y registro de evidencia`; `prd.md > What We're Building`; `prd.md > States and Boundaries`.
  Spec ref: `spec.md > Ejemplos y verificación`; `spec.md > Contrato de generación`; `spec.md > Reglas de incorporación`; `spec.md > Data Model`; `spec.md > Important Failure Modes`; `spec.md > Verification`.
  Build: Completar selección de las seis bases aisladas, nota/documento como fuentes distintas, ofertas y contradicciones, presupuesto incondicional explícito y seguimiento respaldado. Generar evidencia técnica ficticia con salida original y veredictos MODEL/GUARDS/RECOVERY, sin incorporarla como dato aprobado. Completar manejo de timeout/refusal, error de disco, conflicto entre pestañas y cierre sin éxito falso. No añadir acabado de presentación ni integraciones.
  Verify (mechanical): Ejecutar node --test y la evaluación real autorizada. En C1-B, el modelo propone 45 como nuevo presupuesto de referencia; aceptado persiste y sin aprobación no cambia. En C6-B, propone cambios justificados de seguimiento; aceptados persisten. Evaluar por separado los seis casos base y la entrada principal. Reiniciar proceso y releer cada resultado. Probar fallos de guardado/llamadas y conflicto sin modificaciones o éxito falsos. Registrar por caso las tres capas y sus críticos; ninguna capa ni caso compensa otro. Si cambia contrato/prompt/comportamiento, repetir solo la evidencia afectada, dentro del consumo autorizado o detenerse para acordar ampliación.
  Learner check: Probar presupuesto condicional frente a cambio definitivo, documento presente frente a prometido y ausencia de noticias frente a petición explícita de esperar al cliente. Reabrir sin ayuda del agente y explicar lo aceptado, origen y pendiente. Medir trabajo total frente a actualización manual; valorar correcciones y trazabilidad antes de decidir acabado.
  Commit: `Complete six-case evaluation with independent recovery checks`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — después del corte 1; feedback sobre fuente, interpretación original y resultado recuperado antes de ampliar comportamiento.
- [ ] Final kick-the-tires exploration and feedback completed — después del corte 3, con los seis casos y variantes verificables; sin repetir artificialmente una revisión ya resuelta.
- Modo fast elegido. Control temprano obligatorio tras el corte 1; esperar la prueba del usuario antes de ampliar. No exige presencia continua durante ejecución autónoma.

## Final Review

- [ ] Los tres cortes están verificados y sus evidencias indican qué se ejecutó, con qué versión de código/prompt y qué sigue NOT RUN.
- [ ] MODEL: seis casos y contrastes positivos con salida original, sin confundir un bloqueo técnico o corrección humana con comprensión.
- [ ] GUARDS: cambios válidos aceptados se guardan; no aceptados no se guardan; autorización contractual bloqueada se informa solo como restricción de V1.
- [ ] RECOVERY: datos, antecedentes, fuentes, revisiones y versiones coinciden al leer de nuevo y reiniciar; parcial, deduplicación y fallos no producen estado ficticio.
- [ ] No hay fallos críticos pendientes. Si los hay, detener la aceptación del núcleo, registrar el problema y reevaluar la ruta; no compensar con aciertos.
- [ ] El participante ha explorado los casos, comunicado observaciones y vuelto a probar las correcciones acordadas; no inventar revisión si no ocurrió.
- [ ] Medición de tiempo y correcciones registrada; ahorro solo como resultado si los datos lo apoyan. Decisión de continuar, ajustar o parar documentada antes del acabado adicional.
- [ ] Final review complete — feedback resolved and learner confirms ready to ship.

No hay resultados ni feedback todavía. Las revisiones acordadas durante la construcción se añadirán como tareas reales, no se inventan ahora.

## Code Tour and App Map

- [ ] Learning activity complete — conectar una incertidumbre real o seguir una incorporación desde la novedad hasta el guardado, con evidencia de código terminado.
- [ ] Optional edit and transfer reflection addressed — ofrecer, declinar o reconocer práctica ya realizada, sin repetirla ni imponer reflexión.
- [ ] `devpost/app-map.html` generado desde código terminado, comprobado y mostrado, con una práctica reutilizable del proyecto.

Activity and evidence: no realizada; se registrará práctica observada, no dominio supuesto.
Route and stops: pendientes del código real; no generar rutas como si existieran.
Edit outcome: no propuesto ni ejecutado.
Reflection: no solicitada; la respuesta personal, si existe, irá al perfil excluido de commits.
Activity mode: pendiente, según experiencia y práctica que ya se haya producido.

## Revisions
