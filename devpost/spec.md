---
doc: spec
status: approved
updated: 2026-10-23
review: joint-with-prd
---

# Proyecto sin nombre definitivo — Technical Spec

Paquete conjunto aprobado: cambios legítimos y evaluación separada de modelo, controles y persistencia. Orden, fast y Git local autorizados. Tres cortes construidos; evidencia técnica y dos fallos de precisión en evidence-slice3.md. Prueba final humana pendiente. Inferencia ampliada a **40 acumulados y 1 USD total**; al preparar la entrega, trece utilizados. Ver final-review-readiness.md. Sin funciones nuevas de negocio.

## How This Works, In Plain Language
Tres cortes construidos. La preparación final habilita el cupo expresamente ampliado y conserva sus registros. La interfaz distingue una nueva interpretación de una respuesta registrada, que nunca se usa como fallback. El expediente probado previamente se conserva; las comprobaciones técnicas nuevas usan un espacio aislado.

Propuesta: una página en el navegador habla con un pequeño programa que corre en este equipo. Ese programa lee y guarda un archivo local con los casos ficticios.
Al pulsar analizar, envía al modelo la novedad y el contexto del caso. El modelo devuelve propuestas y citas; no puede escribir el expediente.
La persona revisa. Solo una orden explícita de guardado llega al componente que valida e incorpora los datos. La finalización de revisión es otra intención explícita.
Los datos y el historial se guardan juntos para evitar que uno indique éxito y el otro no. Una revisión sin cambios añade historial, manteniendo la misma versión de datos.
Esta forma evita servicios de alojamiento, cuentas y base de datos externa. El coste es que la aplicación funciona como herramienta local de una persona, con un proceso escritor.

## The Core Journey Through the System
Implements prd.md > The Core Journey.
1. Navegador solicita la ejecución activa; si no existe, la persona inicia C1–C6.
2. El servidor crea una copia aislada del ejemplo y devuelve datos y fuentes ficticias.
3. La persona envía nota/documento. El servidor valida límites, cuota autorizada y referencias, y solicita propuestas al modelo.
4. El servidor valida la respuesta y crea un borrador solo en memoria, ligado a la ejecución y revisión del almacenamiento. Devuelve propuestas, sin escribir datos del caso.
5. La persona decide sobre propuestas. Editar la entrada original invalida el análisis; editar una propuesta no llama al modelo.
6. Guardar parcial o finalizar envía únicamente las incorporaciones explícitamente aceptadas y, en la segunda modalidad, la intención de terminar la revisión.
7. El servidor valida, comprueba repetición y vigencia, construye el siguiente documento y lo escribe. Devuelve una lectura nueva desde disco.
8. Al reabrir, la misma ejecución se lee del archivo; no se reconstruye desde la conversación ni desde la salida del modelo.

## Stack
Stack aceptado e iniciado en el corte 1:
- Node.js 24.x; instalado y comprobado en este equipo: v24.18.0. Sin actualización propuesta.
- HTML, CSS y JavaScript del navegador, sin framework ni proceso de compilación.
- Módulos integrados node:http, node:fs/promises, node:crypto, fetch y node:test. Sin paquetes de aplicación que instalar.
- Persistencia JSON en un archivo de trabajo excluido de commits.
- OpenAI Responses API con gpt-6-luna como candidato inicial, sujeto a autorización y prueba real. No hay proveedor alternativo automático.
Motivo: un proceso local y una dependencia externa para probar el núcleo; no pagar el coste de infraestructura de un CRM.
Documentación: [HTTP](https://nodejs.org/docs/v24.18.0/api/http.html), [archivos](https://nodejs.org/docs/v24.18.0/api/fs.html), [pruebas](https://nodejs.org/docs/v24.18.0/api/test.html), [fetch](https://nodejs.org/docs/v24.18.0/api/globals.html#fetch), [modelo](https://developers.openai.com/api/docs/models/gpt-6-luna).

## Where It Runs and How Someone Tries It
Solo local, en navegador de escritorio, con Node 24.x.
Comando de arranque: node --env-file-if-exists=.env src/server.mjs (también npm start).
Abrir http://127.0.0.1:4317 . Si el puerto está ocupado, salir con mensaje; no alterar otro servicio.
La credencial se lee del entorno o de .env local excluido de Git. Sin clave o sin autorización de inferencia: se puede leer el expediente y ejecutar controles deterministas, pero analizar informa que falta acceso; no finge una llamada.
Comandos de verificación previstos: node --test para controles sin inferencia y una ejecución explícita separada para C1–C6 con el modelo real.
Arranque, guardado parcial y ejemplos disponibles y comprobados mecánicamente. Falta probarlos y valorar su utilidad con el participante, usando texto escrito por él.
El vídeo puede grabarse localmente. Repositorio público y vídeo accesible siguen siendo entregables futuros; despliegue opcional y no autorizado aquí.

## Look and Feel
Implements prd.md > Screens and Layout; Look and Feel.
CSS simple y tipografía del sistema. Área guardada visualmente distinta de propuesta, etiquetas textuales y foco de teclado visible. Los valores anteriores vienen del caso, no del modelo.
Las citas se abren en contexto junto a la propuesta. No introducir librerías visuales ni un chat.
Nombre visible temporal descriptivo; el nombre definitivo lo decide el participante.

## Components

### Interfaz de expediente y revisión
Archivos public/index.html, public/app.js y public/styles.css.
Implements prd.md > Expediente y fuentes; Entrada de una novedad; Revisión y guardado parcial; Finalización e historial sin cambios; Repetición y reapertura.
Conserva el borrador de pantalla en memoria. No utiliza localStorage para guardar automáticamente contenido del caso. Releer desde servidor después de cada éxito; no mostrar un cambio como persistido antes de la respuesta. Renderizar fuentes y propuestas como texto, sin ejecutar HTML aportado.
Mantener indicador de trabajo revisado no guardado para aceptaciones, ediciones, rechazos y motivo de revisión. Interceptar acciones internas que puedan descartarlo con aviso Volver a revisión/Descartar y continuar; volver permite guardar incorporaciones o finalizar mediante los controles normales, sin convertir rechazos/motivo en borrador persistido. Al cerrar o recargar usar beforeunload con las limitaciones del navegador. Avisar no guarda ni finaliza por sí solo.

### Servicio local
Archivo src/server.mjs.
Implements prd.md > States and Boundaries; Seis pruebas y registro de evidencia.
Sirve estáticos y cinco rutas:
- GET /api/health: estado local, sin credenciales.
- GET /api/run: ejecución activa y datos confirmados.
- POST /api/run: crear ejecución desde fixture C1–C6; no borra anteriores.
- POST /api/analyze: analizar novedad contra ejecución/revisión indicadas.
- POST /api/commit: modo partial o finalize, identificador de borrador, base vigente, actionId y decisiones explícitas.
Rechazar métodos/rutas ajenos, cargas excesivas y guardados sin intención válida. Para POST exigir JSON, Host local y Origin del propio servicio; no abrir CORS ni exponer la clave al cliente.
Una petición de análisis a la vez; una cola de escritura local. No se admiten varios procesos escritores sobre el mismo archivo.
GET /api/session entrega un token local para las mutaciones. En corte 2, /api/commit devuelve también el mismo borrador con su base y tarjetas guardadas tras un parcial; solo se actualiza después de la escritura. Reabrir una fuente ya finalizada con datos iguales crea un borrador local vacío, sin atribuirle interpretación nueva ni consultar al modelo.

### Proponente de cambios
Archivo src/model.mjs.
Implements prd.md > Propuestas con límites; Entrada de una novedad.
Prepara contexto acotado, instrucciones y esquema. Las fuentes se tratan como datos, no como instrucciones. No se dan herramientas de ejecución al modelo.
Comprueba estado completed, ausencia de refusal y contenido output_text; analiza y valida el JSON. No usa output_text como propiedad universal del REST: extrae los bloques message/content de output.
No reintenta de pago automáticamente ni convierte respuestas incompletas en propuestas guardables.
La forma válida no demuestra significado correcto; C1–C6 evalúan ambos.

### Reglas de incorporación
Archivo src/domain.mjs.
Implements prd.md > Propuestas con límites; Revisión y guardado parcial; Finalización e historial sin cambios; Repetición y reapertura.
Operaciones permitidas: actualizar datos del alcance respaldados por fuente, añadir presupuesto condicionado, registrar documento presente, añadir interés/preferencia no contractual, conservar ofertas, añadir incertidumbre/antecedente y actualizar estado operativo/próximo movimiento con fundamento explícito.
Hay un registro cerrado de campos y tipos; no un parche arbitrario del archivo. El presupuesto de referencia admite cambios explícitos e incondicionales, y estado/próximo movimiento admiten cambios legítimos revisados. Su conservación en un caso negativo no se debe a que sean inmutables.
Solo falta una operación de modificar autorización contractual. El servidor bloquea ese campo, pero la evaluación registra aparte si el modelo interpretó correctamente la ausencia de autorización. La protección no hace pasar la primera capa.
Los valores anteriores se obtienen de los datos persistidos. Cada referencia de fuente debe existir y cada cita debe ser un fragmento exacto de su texto. Los cambios de seguimiento son datos del expediente, no acciones comerciales ejecutadas.
Un presupuesto condicionado exige condiciones no vacías; las pruebas y la revisión humana comprueban que ninguna condición real se haya perdido. No se promete detectar por reglas toda omisión semántica.
El guardado recibe una lista explícita de propuestas aceptadas, con edición humana si existe. No aplica automáticamente el resto de la respuesta. Registra esa autoría sin inventar respaldo documental.
Para finalize, el servidor exige la intención explícita y una decisión válida para cada propuesta del borrador: aceptada, aceptada editada o rechazada; una decisión ausente nunca se interpreta como rechazo ni aprobación. Para partial solo incorpora la selección aceptada que aparece en el resumen de guardado.
Un partial satisfactorio actualiza la base del mismo borrador a la revisión que acaba de escribir y marca sus incorporaciones como ya guardadas. No duplica al finalizar. Esto solo reconoce su propia escritura; un cambio externo produce conflicto e invalida el borrador obsoleto.

### Almacenamiento y repetición
Archivo src/store.mjs.
Implements prd.md > Revisión y guardado parcial; Finalización e historial sin cambios; Repetición y reapertura.
Un archivo runtime/workspace.json contiene ejecuciones, datos, versiones, fuentes, trazas de incorporación y revisiones confirmadas.
Cada escritura: releer, comprobar storageRevision, calcular resultado, escribir temporal en el mismo directorio, sincronizar/cerrar y sustituir el archivo. Una cola impide escrituras simultáneas dentro del proceso.
No se promete resistencia absoluta a fallos de disco. JSON inválido o error de escritura detiene el guardado; no reinicializa ni descarta trabajo previo.
Persistir los elementos aceptados y la finalización solicitada en el mismo documento evita actualizaciones separadas de datos e historial.
actionId permite responder al mismo intento de guardado sin repetirlo. Un segundo clic no es una segunda revisión.
Los recibos añaden reviewKey (referencia y huella de fuente), reviewSourceId y effectKey. Los recibos no vinculados aún a un ReviewEvent forman las revisiones abiertas; no se añade otra persistencia de borradores. Finalizar incluye los recibos previos de esa fuente que aún no se habían finalizado. Una repetición sin nuevos efectos ni motivo útil conserva la fecha y anotación anteriores.
effectKey ignora resúmenes y texto de presentación. Para una disposición de la misma fuente e importe, condiciones distintas generan conflicto en lugar de duplicar o sustituir. No se decide su equivalencia semántica por parecido. Referencias distintas no se fusionan automáticamente.

### Ejemplos y verificación
Archivo fixtures/cases.json y pruebas con node:test.
Implements prd.md > Seis pruebas y registro de evidencia; What We're Building.
Una base ficticia y seis entradas con resultados esperados; iniciar prueba crea runId nuevo sin destruir otras.
Controles deterministas verifican guardado, citas, versiones, deduplicación, reapertura y errores con respuestas simuladas identificadas como tales.
Las pruebas reales C1–C6 registran además calidad semántica, correcciones y tiempo. No declarar núcleo validado solo por pasar simulaciones.
Cada ejecución produce tres resultados independientes: MODEL (interpretación/propuestas sin corregir), GUARDS (aprobación/guardado) y RECOVERY (datos persistidos y reapertura). Capturar la salida real del modelo antes de transformaciones para la evaluación técnica con datos ficticios; no incorporarla como dato aprobado al expediente. Las protecciones o la corrección humana no reescriben MODEL.
Las variantes positivas de C1 y C6 se ejecutan también con el modelo real: cambiar presupuesto cuando sí es explícito y cambiar seguimiento cuando sí está justificado. No basta demostrar esas operaciones con respuestas simuladas.

## Data Model
- Workspace: schemaVersion, storageRevision, activeRunId, runs y actionIds ya aplicados.
- Run: id, fixtureId, dataVersion, caseData, sources, dataVersions, incorporationReceipts y reviewEvents.
- caseData: necesidades, fibra declarada, presupuesto de referencia, condiciones, ofertas, documentos, interés/decisiones, antecedentes, incertidumbres, estado operativo y próximo movimiento.
- Source: id y versión/contenido inmutables, tipo, autor atribuido, fecha de fuente, texto original y huella de contenido. La fuente original que se archivará se muestra en el guardado; queda como aportada, no validada.
- IncorporationReceipt: propuesta aprobada/editada, campos afectados, antes/después, fuentes, autor de la revisión y fecha; vinculado al episodio de revisión.
- ReviewEvent: fuentes revisadas, fecha real de revisión del servidor, conclusión, motivo opcional y recibos relacionados. Solo existe si se solicitó finalizar. Fechas de revisión en ISO UTC, mostradas en Europe/Madrid; fechas de fuente conservadas aparte, sin inferir plazos.
- Draft: id, runId, baseStorageRevision, fuentes de entrada, interpretación del modelo, propuestas y decisiones pendientes; solo memoria. No es progreso guardado.
- Evidencia de evaluación: salida original y veredictos MODEL/GUARDS/RECOVERY con datos exclusivamente ficticios, en runtime/evaluation/ cuando se ejecute expresamente la evaluación autorizada. Es un registro técnico, no historial del caso ni aprobación del contenido del modelo.
- Métricas de llamadas: runtime/inference-ledger.json contiene contador y uso técnico, sin clave ni contenido del caso; no constituye una anotación de revisión ni modifica dataVersion o storageRevision del expediente. Reservar un intento antes de llamar para no perder el límite al reiniciar.

Tres conceptos distintos:
1. dataVersion aumenta solo si cambian efectivamente datos del caso, incluido un antecedente nuevo.
2. storageRevision controla colisiones de escritura y puede variar por una anotación; no se muestra como nueva versión de datos.
3. reviewEvents cuenta revisiones confirmadas, no generaciones ni cierres.

Historial sin cambios: una nota puede aumentar el historial, manteniendo dataVersion y caseData iguales.
Repetición: comparar fuentes/versiones y efectos ya incorporados. No duplicar por nueva fecha de revisión o paráfrasis del modelo. Para una revisión sin efectos nuevos, solo un motivo humano concreto distinto puede justificar información adicional. No usar semejanza de texto para fusionar fuentes distintas.
Si se perdieron borradores tras un guardado parcial, los recibos recuperan lo ya incorporado y señalan que no hay finalización; lo restante no se inventa ni se aprueba por omisión.

## File Structure
Estructura de V1: src/, public/, tests/, fixtures/main.json y fixtures/cases.json implementados para los tres cortes:
- src/server.mjs — servicio y rutas locales.
- src/domain.mjs — operaciones permitidas e invariantes.
- src/store.mjs — lectura, escritura, versiones e idempotencia.
- src/model.mjs — llamada y validación de propuestas.
- public/index.html, app.js, styles.css — pantalla funcional.
- public/presentation.mjs — formatos legibles, unidades e instrucción expresa de no contratar solo con declaración incorporada y cita respaldada; JSON únicamente en detalles técnicos secundarios.
- fixtures/main.json y no-news.json — entrada principal y C6 disponibles; las seis bases y variantes aún no están completas.
- fixtures/cases.json — seis entradas y expectativas ficticias.
- tests/domain.test.mjs, store.test.mjs, model.test.mjs, server.test.mjs — controles sin coste de inferencia.
- runtime/workspace.json — casos, versiones, fuentes e historial; excluido de Git.
- runtime/inference-ledger.json — intentos y uso técnico, independiente del caso y excluido de Git.
- runtime/evaluation/ — evidencias técnicas ficticias y veredictos por capa, excluidos de Git; su captura requiere ejecución explícita de evaluación.
- .env.example — nombres de variables sin secretos; no se incluye una clave real.
- devpost/ — planes y evaluación; learner-profile.md excluido.
- skills/ — Pack oficial ya presente y con procedencia fijada.
No se añade framework, CI ni paquete de cobertura para esta prueba.

## External Services and Dependencies

### Contrato de generación
POST https://api.openai.com/v1/responses ; Authorization: Bearer desde variable local.
Cuerpo previsto: model gpt-6-luna; store false; reasoning.effort low; max_output_tokens 4000; instructions de comparación y límites; input con caso/fuentes/novedad; text.format con type json_schema, name case_proposals, strict true y schema.
Sin herramientas, búsqueda, archivos remotos, historial conversacional del proveedor ni llamadas de acciones.

Contrato del JSON generado:
- Raíz: interpretation, proposals y no_change_reason. Este último es texto o null, nunca un registro automático.
- interpretation: authorization (explicitly_not_authorized, not_established, explicit_authorization_reported o uncertain), explanation y source_refs. Es una interpretación evaluable, no una orden ni campo de autorización persistible. Incluir una categoría de autorización expresa permite detectar si el modelo se equivoca en C4; no ocultar esa salida tras el bloqueo técnico.
- Cada propuesta: kind, summary (texto), target, value, conditions (lista de textos), uncertainties (lista de textos) y source_refs.
- value tiene exactamente number (número o null), text (texto o null), document_source_id (texto o null), offer_id (texto o null) y offer (objeto tipado o null). offer contiene id, descripción, precio mensual nullable, condiciones y referencias de fuente; nunca autorización contractual. Propiedades no aplicables son null. No se acepta un parche arbitrario de objetos.
- source_refs es una lista de objetos con source_id y quote exacta. El programa asigna id de propuesta y obtiene el valor anterior del expediente.

| kind | target | Contenido de value y regla |
| --- | --- | --- |
| fiber_correction | current_fiber_mbps | number positivo; text puede conservar la rectificación atribuida. |
| case_update | mobile_lines, needs, budget_reference, operational_state, next_movement o client_preference | Un solo campo permitido por propuesta. number para líneas/presupuesto, text para necesidades/estado/movimiento/preferencia; tipo y límites comprobados por el registro de campos. Fuente explícita y revisión humana; no crear acciones realizadas. |
| conditional_budget | budget_conditions | number para el importe condicionado, text para la declaración; conditions no vacía. No modifica el máximo incondicional. |
| offer_record | offers | offer tipada y fuente; conserva contradicciones con otras versiones, no reemplaza sin revisión ni decide la mejor tarifa. |
| document_receipt | documents | document_source_id identifica texto documental realmente incluido. |
| offer_interest | offer_interest | offer_id existente y text atribuido; no hay campo de autorización. |
| uncertainty | uncertainties | text describe la duda; referencias a ambas fuentes cuando hay contradicción. |
| antecedent | antecedents | text atribuido con fuente; no muta campos operativos. |

Los kinds y targets son enums cerrados y el programa verifica su correspondencia. Se permiten las modificaciones legítimas; una fuente condicional aplicada como presupuesto incondicional es un fallo semántico aunque su tipo sea válido. La obligatoriedad de conditions no demuestra que estén todas: eso se comprueba en MODEL y al revisar.
En el esquema todas las propiedades se declaran required; objetos con additionalProperties false; valores optativos como tipo nullable. El validador del dominio vuelve a comprobar combinaciones kind/target/value y fuentes tras analizar JSON.
Documentación comprobada: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Responses create](https://developers.openai.com/api/reference/resources/responses/methods/create), [modelo](https://developers.openai.com/api/docs/models/gpt-6-luna).
store false no se presenta como garantía de retención cero por el proveedor.

### Acceso y coste
Acceso real comprobado mediante tres generaciones en el corte 1. Saldo y cuota total de la cuenta no se han consultado; no se infieren a partir de estas respuestas.
Tarifas verificadas el 2026-10-22: entrada ordinaria 0,10 USD/millón; entrada en caché 0,01; escritura 30 min 0,125 y 12 h 0,25; salida 0,50, incluido razonamiento. [Tarifas](https://developers.openai.com/api/docs/pricing). La estimación anterior de 0,0096 omitía las posibles escrituras de caché y queda sustituida por el cálculo conservador de inference-budget.md.

Autorizados 1 USD total y cuarenta intentos acumulados, incluidos los doce anteriores y fallos/repeticiones. Reserva en disco de 0,01 USD antes de cualquier petición; no se recupera por error. Entrada contada antes de generar, máximo 6.000 tokens; salida máxima 4.000; contexto hasta 24 KiB; timeout de conteo 20 s y generación 45 s. Sin herramientas, paralelismo ni reintentos automáticos. Si el conteo falta o excede máximo, no generar.
Toda entrada se calcula a la tarifa más alta de escritura: máximo 0,0035 USD/generación y 0,14 para cuarenta. Reserva máxima 0,40 USD, dentro de 1 USD. Tarifas reconfirmadas, vigentes hasta 23/10/2026 23:54:18 Europe/Madrid; después se bloquea generar hasta revisarlas. Ver inference-budget.md.
Al preparar entrega: trece usados, veintisiete disponibles. No se restablece consumo al crear casos o reiniciar. Migración explícita auditada conserva intentos y bloqueos anteriores. Un timeout cuenta y puede tener consumo desconocido.
No usar el ahorro de una estimación para justificar un gasto no autorizado. No hay saldo o créditos de Google/AWS comprobados.

## Important Failure Modes
- Modelo no disponible, refusal, límite, timeout o JSON/cita inválidos: mostrar error y no ofrecer una respuesta falsa como resultado real. Nada del caso se guarda. Si se invocó proveedor, el intento cuenta.
- Archivo inaccesible, inválido o error al sustituir: no mostrar guardado/finalización satisfactorios; conservar borrador en pantalla y datos anteriores, informar la incidencia.
- Otra pestaña o petición cambia storageRevision: rechazar con conflicto y recargar; no adaptar ni aplicar automáticamente sobre una base distinta.
- Borrador perdido al cerrar: lo guardado se conserva; el trabajo pendiente no aparece como revisado. No hay recuperación automática en V1.

## Verification
Implements prd.md > What We're Building.
Los ejemplos y expectativas están definidos en evaluation.md.
1. MODEL: C1–C6, variantes positivas C1/C6 y entrada principal compuesta con modelo real solo tras autorización. Evaluar la interpretación/propuesta original, incluida ausencia de autorización, presencia de todas las condiciones y cambios legítimos; sin usar un campo bloqueado como acierto.
2. GUARDS: controles sin inferencia contra campos fuera de alcance, autorización contractual, citas inexistentes, decisiones no aceptadas, guardado obsoleto y finalización incompleta. Demostrar también que cambios válidos revisados sí se guardan y los mismos sin aprobación no se guardan.
3. RECOVERY: leer disco, cerrar/reabrir y reiniciar. C2 conserva 300 y antecedente; C6 mantiene V1 y una anotación, repetición sin duplicados. Verificar también persistencia de presupuesto y seguimiento válidos de las variantes positivas.
4. Guardado parcial y salida: nada pendiente se incorpora; no hay evento final; al finalizar no se etiqueta sin cambios si ya hubo incorporaciones. Avisar antes de perder decisiones revisadas sin guardar en acciones internas y recarga/cierre normal; no prometer recuperación de borradores.
5. Registrar los tres veredictos por separado, con PASS/FAIL/NOT RUN y fallos críticos. Un fallo crítico bloquea el global; una capa correcta no compensa otra errónea. Un guardado bloqueado puede pasar GUARDS y mantener MODEL en FAIL.
6. Registrar tiempos completos y correcciones. El ahorro continúa como hipótesis hasta medirlo; no hay objetivo ficticio de PASS ni media de cinco de seis.

## What Was Simplified and Why
Una pantalla local, una novedad y seis ejemplos; texto en lugar de PDF; archivo local en lugar de base externa; controles de edición limitados a lo necesario para los casos; borradores de sesión en lugar de persistencia automática.
No se simula el núcleo para ahorrar integración. El modo de prueba técnica con salidas simuladas nunca sustituye las seis ejecuciones reales.

## Decisions and Open Issues
Del usuario: paquete aceptado con el ajuste de cambios legítimos, evaluación en tres capas, solo autorización contractual fuera de modificación, aviso antes de perder trabajo revisado, guardado parcial/finalización separados, tiempo como hipótesis y prioridad al núcleo con reapertura.
Se mantiene la arquitectura local sin dependencias y la persistencia única. Cambia el registro de operaciones y el contrato de interpretación, no el proveedor ni la infraestructura. El modelo candidato no implica permiso de consumo.
Incertidumbre real aportada por el usuario: si la corrección de propuestas exige tanto trabajo que la actualización manual sea mejor. Se investigará con C1–C6 y comparación documentada; no se inventa una tecnología para resolverla.
Resueltos: orden, fast, Git local e inferencia hasta 1 USD/40 acumulados. Prueba temprana recibida y tres cortes evaluados técnicamente. La revisión final humana sigue pendiente; las dos redundancias originales se mantienen documentadas y visibles.
Nombre, acabado y candidatura quedan en manos del participante. Ver checklist.md y final-review-readiness.md. No se acredita ahorro ni se compensa ningún fallo crítico con otros aciertos.
