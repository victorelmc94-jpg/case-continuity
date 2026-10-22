---
doc: prd
status: approved
updated: 2026-10-22
review: joint-with-spec
---

# Proyecto sin nombre definitivo — Product Requirements

Permitir que un asesor retome un expediente ficticio de fibra y dos móviles después de incorporar una novedad revisada, conservando fuentes, condiciones y dudas.
Source: scope.md > The Unique Kernel; Who It's For; The POC Boundary.

Paquete aceptado por el usuario el 2026-10-22, condicionado a incorporar su ajuste: los campos incluidos deben admitir cambios legítimos y la comprensión del modelo se evalúa aparte de las protecciones técnicas. Se integran aquí esas precisiones. Guardado parcial y borradores no persistidos están aceptados, con aviso antes de perder trabajo revisado no guardado. Posteriormente aprobó orden, modo fast, Git y hasta 1 USD/doce intentos. Solo el corte 1 está construido y comprobado; esperar su prueba antes de ampliar.

## The Core Journey
1. Abrir una prueba ficticia de los seis casos; ver los datos actuales, fuentes, estado operativo y próximo movimiento.
2. Introducir una novedad: nota y, si corresponde, texto documental separado, con identificación de fuente, autor/tipo y fecha.
3. Pulsar «Analizar novedad». Ver propuestas comparadas con el dato conservado, su fundamento y lo que sigue pendiente. Nada se incorpora todavía.
4. Leer la fuente y aceptar, corregir o rechazar cada propuesta. No hay aceptación masiva por defecto.
5. Opcionalmente guardar las incorporaciones ya revisadas sin declarar terminada la revisión completa.
6. Cuando haya terminado de revisar la novedad y resuelto las propuestas visibles, confirmar su finalización. La confirmación guarda las incorporaciones revisadas restantes y la conclusión de revisión en una sola operación.
7. Cerrar/reabrir o reiniciar la aplicación y recuperar el caso desde disco: distinguir lo incorporado, antecedentes, dudas y movimientos todavía pendientes.
Source: scope.md > The Core Loop; What "Working" Looks Like.

## Screens and Layout
Una pantalla de trabajo, sin chat ni navegación de CRM, dentro del paquete aceptado con el ajuste registrado.
- Cabecera: caso ficticio activo y versión de datos; acceso a ejemplos C1–C6.
- Área del expediente: necesidades, presupuesto, condiciones, ofertas, documentos, decisiones, estado y próximo movimiento.
- Área de revisión: fuente/nota, texto documental opcional, propuestas y controles de guardado.
- Historial debajo: revisiones confirmadas y acceso a cambios/antecedentes con sus fuentes.
En anchuras menores, las áreas se apilan; el objetivo inicial es uso en navegador de escritorio.
No se añade una pantalla de administración ni una biblioteca de clientes.

## Look and Feel
No hay una preferencia estética específica elegida por el usuario.
Propuesta funcional para esta primera versión: fondo claro, tipografía del sistema, buena separación entre información guardada y propuesta, texto comercial sencillo y etiquetas explícitas. Color de apoyo, nunca como único indicador de pendiente/aceptado.
No habrá trabajo de marca, animaciones ni acabado de presentación antes de ejecutar y verificar los seis casos.
Esta propuesta responde a la prioridad de comprobación; no se presenta como gusto confirmado del participante.

## Features and Behavior

### Expediente y fuentes
Mostrar necesidades, presupuesto de referencia, condiciones, ofertas ficticias, documentación, decisiones, antecedentes e incertidumbres.
Cada incorporación conserva quién lo dijo, fecha de fuente y fragmento original. La fecha de revisión es otra fecha.
Una fuente aportada no es una fuente verificada; recibir un documento no demuestra autenticidad.
Los datos del alcance admiten propuestas de modificación y guardado explícito cuando la fuente lo justifica: necesidades, fibra y líneas, presupuesto de referencia o condicionado, ofertas, documentación, preferencias/decisiones no contractuales, antecedentes, incertidumbres, estado operativo y próximo movimiento. No convertir una condición en cambio incondicional ni una intención en acción realizada.
Solo la autorización de contratación queda fuera de las modificaciones de V1. Es un límite técnico; conservar ese campo intacto no demuestra comprensión. La interpretación del modelo debe expresar por separado si hay autorización, no la hay o no puede establecerse, con sus fuentes.
Criterio: al reabrir se puede explicar qué cambió y consultar su origen sin reconstruir toda la conversación.
Source: scope.md > The Unique Kernel; The POC Boundary.

### Entrada de una novedad
Aceptar una nota y texto documental separado dentro de la misma novedad, con referencias distintas. El caso de factura requiere contenido documental realmente incluido.
Una promesa de enviar un documento no lo marca recibido.
Borradores en memoria durante la sesión, sin guardado automático, aceptados por el usuario con aviso previo. Considerar trabajo revisado sin guardar tanto aceptaciones/ediciones como rechazos y motivo de revisión. Navegación dentro de la aplicación, cambio de prueba o sustitución de la entrada debe avisar antes de perderlo y permitir volver a la revisión o descartar expresamente y continuar. Volver permite usar los controles normales de guardado/finalización; no se promete guardar rechazos o motivos aislados como borrador. Para recarga/cierre de pestaña se instala la advertencia nativa cuando el navegador lo permita; no se promete interceptar caídas del proceso o cierres forzados. Lo ya guardado permanece.
El envío al modelo es una acción explícita. Editar la entrada después de analizar invalida esas propuestas y exige analizar de nuevo; editar una incorporación propuesta no vuelve a llamar al modelo.
Criterio: introducir, analizar o abandonar una novedad no modifica datos ni historial confirmado.
Source: scope.md > The Core Loop; Explicitly Cut.

### Propuestas con límites
Cada propuesta muestra tipo de incorporación, valor anterior obtenido del expediente, resultado sugerido, citas, condiciones y dudas.
Tipos de V1: actualizar datos del alcance respaldados por fuente, conservar presupuesto condicionado, registrar recepción documental, interés/preferencia sin autorización, incertidumbre, antecedente y cambios justificados de seguimiento. No son parches libres ni acciones ejecutadas.
- Una rectificación explícita conserva el dato anterior.
- El importe condicionado se conserva junto al presupuesto de referencia, sin sustituirlo como máximo incondicional.
- Una contradicción muestra ambas fuentes y queda abierta; la fecha más reciente no resuelve por sí sola.
- Interés y aceptación del asesor de una anotación no equivalen a autorización del cliente.
Si no hay incorporación útil, mostrar ese resultado y permitir finalizar con anotación sin cambios.
El ejemplo principal debe corregir la fibra a 300 Mb, conservar el presupuesto condicionado con todas sus condiciones y expresar en la interpretación del modelo que no hay autorización para contratar.
Si otra novedad establece explícitamente un presupuesto de referencia nuevo sin condiciones, debe poder proponerse y guardarse. Si pide un cambio concreto del seguimiento, debe poder revisarse y guardarse sin inventar que ese movimiento se ha realizado. Las variantes positivas de C1 y C6 comprueban esta capacidad: mantener siempre el valor anterior no permite superar la prueba.
Criterio: los resultados visibles deben cumplir C1–C6; una respuesta bien formada no basta para dar por correcto su significado.
Source: scope.md > The Unique Kernel; What "Working" Looks Like.

### Revisión y guardado parcial
Todas las propuestas empiezan pendientes. Aceptar o editar requiere una decisión explícita; rechazar es una revisión, pero no incorpora ese contenido.
«Guardar incorporaciones revisadas» muestra exactamente qué se incorporará y qué seguirá pendiente. La fuente original necesaria para acreditar esas incorporaciones figura también en la confirmación de guardado como material aportado, sin aprobar todo su contenido.
La aceptación editada registra la redacción humana y conserva la cita original. No se inventa una fuente para justificar la edición.
El guardado parcial puede crear una versión de datos si hay un cambio efectivo; no registra una revisión completa. La traza del cambio se identifica como incorporación guardada, no como «caso revisado».
Criterios: rechazos y pendientes nunca se incorporan por accidente; un guardado parcial deja explícito que la revisión sigue abierta.
Source: scope.md > The Core Loop.

### Finalización e historial sin cambios
Propuesta: botón «Confirmar fin de revisión» con resumen del resultado; deshabilitado mientras queden propuestas visibles pendientes. Pulsarlo declara que la persona terminó de revisar la novedad; resolver tarjetas por sí solo no lo declara.
- Si hay incorporaciones revisadas aún sin guardar, guardarlas junto a la conclusión en una operación.
- Si no hay cambios efectivos y no hubo incorporaciones previas de esa revisión: «Revisado, sin cambios», fuente, fecha de revisión y motivo concreto opcional.
- Si ya se guardaron incorporaciones parcialmente, la finalización reconoce esas incorporaciones; no afirma «sin cambios» solo porque no queden nuevas.
- Una declaración útil aceptada puede incorporarse como antecedente sin cambiar estado operativo ni próximo movimiento.
Una anotación de revisión sola no incrementa la versión de datos. Un antecedente nuevo sí es información incorporada y queda trazado, aunque el estado operativo no cambie.
No se exige motivo artificial. Un motivo sugerido solo se guarda si la persona lo confirma con el resto de la revisión.
Criterio: generar, cerrar, recargar o marcar propuestas no produce un evento de revisión terminada.
Source: scope.md > What "Working" Looks Like.

### Repetición y reapertura
Revisar la misma fuente y contenido sin nuevos efectos, conclusión o motivo humano útil no duplica anotaciones ni versiones. Una fecha de revisión nueva o una paráfrasis del modelo no justifican duplicar.
Fuentes distintas no se fusionan automáticamente por texto parecido.
Tras guardado, una lectura nueva del almacenamiento confirma el resultado; el mensaje de éxito no depende solo de la pantalla actual.
Si hubo guardado parcial y se perdió el borrador, al reabrir se ven sus incorporaciones y que la revisión no se finalizó; las propuestas sin guardar no se recuperan como aceptadas.
Criterios: C6 mantiene V1 con una anotación; repetirlo mantiene V1 y una anotación. C2 muestra 300 Mb y su antecedente después de reiniciar.
Source: scope.md > What "Working" Looks Like.

### Seis pruebas y registro de evidencia
Los ejemplos son seis situaciones independientes del mismo tipo de caso ficticio, no seis operaciones acumuladas.
Propuesta: «Iniciar prueba Cn» crea una ejecución aislada del ejemplo, sin borrar pruebas previas. La ejecución activa se conserva al reabrir.
Registrar tres veredictos independientes por caso: 1) interpretación y propuestas del modelo antes de protecciones o corrección humana; 2) controles de aprobación/guardado; 3) resultado persistido y recuperación al reabrir. Conservar errores y sus correcciones sin reescribir como correcto el resultado original.
Que una operación esté prohibida no acredita que el modelo haya entendido la fuente. Una propuesta semánticamente errónea mantiene el fallo de la primera capa aunque el programa la bloquee y el almacenamiento quede intacto.
El ahorro de tiempo es una hipótesis, no un indicador positivo prefijado.
No simular respuestas correctas en el flujo de modelo real; las simulaciones de pruebas técnicas se etiquetan y no cuentan como evidencia del núcleo.
Source: scope.md > Decision to Continue; evaluation.md.

## States and Boundaries
- Sin prueba activa: seleccionar C1–C6; nada se inicializa sobre aplicaciones anteriores.
- Sin novedad o fuente incompleta: mensaje concreto; no enviar al modelo.
- Analizando: una petición, indicador de espera y guardados deshabilitados; no reintentos de pago invisibles.
- Propuestas pendientes: sin incorporación, sin revisión confirmada.
- Incorporaciones parciales guardadas: persistidas con fuente, revisión sin finalizar.
- Revisión finalizada: resultado confirmado y comprobado al releer.
- Fallo de modelo o formato: error sin cambios; no sustituir con resultados inventados.
- Datos cambiados en otra pestaña: pedir recargar, sin sobrescribir silenciosamente.
- Fallo al guardar: no mostrar éxito ni declarar finalización. Conservar trabajo en pantalla para reintentar.
- Salir con trabajo revisado sin guardar: aviso propio antes de navegación o cambio de caso dentro de la aplicación; advertencia nativa antes de recarga/cierre cuando el navegador la permita. No persistir el borrador ni marcar revisión terminada por avisar o salir.
- Privacidad del proyecto: datos ficticios; credencial accesible solo al proceso local, nunca al navegador ni repositorio.

## Product Decisions
Confirmadas: dominio telecom, fibra y dos móviles, un flujo, fuentes/condiciones/incertidumbres, autoridad humana, anotación confirmada sin cambios, no duplicar, resultado al reabrir, foco de demo y criticidad no compensable.
Paquete aceptado con ajuste: pantalla única, arquitectura local, guardado parcial/finalización separados, borradores no persistidos con aviso, ejemplos aislados y apariencia funcional. Se retira el bloqueo general de campos delicados. Solo queda excluida la modificación de autorización contractual; su interpretación sigue siendo evaluable y puede fallar.
Tres capas de evaluación separadas, sin compensar errores críticos entre capas ni entre casos. Inferencia autorizada hasta 1 USD/doce intentos; evidencia del corte 1 en evidence-slice1.md. No constituye validación global de los seis casos.

## What We're Building
Flujo completo descrito y seis ejemplos verificables, con recepción documental como texto, guardado controlado, datos versionados, historial y reapertura.
Un solo fallo crítico bloquea el resultado global: interés convertido en autorización, condición perdida, contenido no aprobado guardado, procedencia falsa o finalización sin confirmación. Acertar otros casos no lo compensa.
Distinguir fallo semántico del modelo de control que impide guardarlo: la intervención humana que detecta el error no convierte la propuesta original en correcta.
Primero comprobar los seis casos; después decidir acabado adicional.

## Deferred From the POC
Borradores recuperables entre sesiones, modificación de autorización contractual, más sectores, exportaciones avanzadas y despliegue público. No hacen falta para la primera comprobación y añadirían comportamiento y pruebas. No se difiere la capacidad de proponer cambios legítimos de estado o próximo movimiento dentro del flujo aprobado.

## Possible Later Enhancements
Mejorar lectura y presentación solo si los resultados del núcleo lo justifican. La revisión de diseño no debe maquillar una prueba fallida.

## Non-Goals
Tarifas reales, comparación de mercado, OCR, carga de PDF, integraciones, gestión de cuentas, contratación, envío de mensajes o decisiones comerciales automáticas.
El nombre final y los textos públicos son del participante.

## Open Questions
Resueltos: orden aprobado, Git local, modo fast y presupuesto máximo 1 USD/doce intentos. Antes de ampliar al corte 2, recoger la prueba humana del corte 1. No superar cupo ni gasto sin nueva autorización.
No bloquean esta primera planificación: nombre final, marca, despliegue, acabado adicional.
