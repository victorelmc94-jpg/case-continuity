---
doc: planning-notes
status: draft
updated: 2026-10-22
---

# Notas de decisión y revisión de la candidata

Este documento acompaña al alcance. Las valoraciones y propuestas son del agente, no decisiones atribuidas al participante. Ningún test de producto ha sido ejecutado.

## Revisión como jurado

Conclusión: mantener la candidata del puente, con innovación todavía moderada y una exigencia alta de ejecución. No hay evidencia de que otra de las candidatas analizadas sea claramente superior en el conjunto de criterios.
El comprobador de entrega a gestoría es la alternativa más fácil de demostrar, pero el material disponible no acredita mejor diferenciación y su valoración se apoya en una descripción del usuario. Un formulario comercial guiado sería aún más fácil de confundir con productos habituales.
No se ha realizado un estudio exhaustivo de competidores ni se afirma originalidad absoluta.

| Criterio oficial | Debilidad más seria hoy | Mejora propuesta sin ampliar funciones |
| --- | --- | --- |
| Diseño | Una pantalla llena de texto, citas y botones puede trasladar al asesor todo el trabajo de interpretación. | Diseñar la lectura alrededor del resultado del caso: cambio concreto, fuente localizable y consecuencias que permanecen pendientes. Verificar que el usuario lo entienda al reabrir sin narración del agente. |
| Impacto potencial | El dolor procede del contexto del participante; no hay aún evidencia medida de ahorro ni de uso por otros asesores. | Comparar revisión asistida y actualización manual contando correcciones, esperas y errores. Presentar lo observado como piloto; evitar prometer adopción o ahorro universal. |
| Innovación/idea | Citas, revisión humana e historial ya son conceptos conocidos; un LLM podría producir un resumen parecido. | Demostrar aplicación precisa y persistente de correcciones, condiciones y ausencia de autorización. La diferencia tiene que estar en el estado resultante y su explicación, no en decir «IA responsable». |
| Presentación | Puede parecer que no pasa nada cuando se evita un cambio indebido; una demo solo de rechazos sería poco convincente. | Mostrar una incorporación útil y un límite preservado en la misma entrada. Un dato pasa de 600 a 300 Mb; el máximo sigue en 40 EUR; queda registrada la posibilidad condicionada de 50 EUR y la contratación sigue pendiente. |

Los cuatro criterios tienen igual peso según las bases consultadas:
https://learn-ai-basics.devpost.com/rules .
La portada omite impacto potencial; no se adopta esa omisión al planificar.

### Momento que demostraría la diferencia

Una novedad combina una corrección, una condición y una negativa a contratar aún. El asesor revisa y guarda. Al reabrir, ve la corrección aplicada, el presupuesto de referencia intacto junto a la condición nueva y la contratación pendiente, cada incorporación enlazada a su fuente.
Ese contraste entre lo que se incorporó y lo que se conservó muestra valor rápidamente. Un resumen bonito o un listado de propuestas sin comprobar su efecto guardado no basta.

La repetición de una revisión sin cambios debe demostrar después que el historial no infla actividad ni versiones. Es evidencia secundaria; no sobrecargar el momento principal con todos los casos.

### Mayor mejora propuesta

Cambiar el centro de la ejecución desde «generar propuestas» a «poder retomar un expediente correcto y explicable tras una novedad difícil».
No se añaden integraciones ni un agente que actúe. Se hace visible la procedencia y se comprueba el resultado persistido.
El aspecto debe ayudar a leerlo, y la presentación pública debe comunicar el alcance real y sus límites. No se redactan por IA los textos ni el guion reservados al participante por 6-ship.
No se promete ganar ni se asignan puntuaciones de jurado ficticias.

## Hechos de acceso al modelo ya comprobados en este chat

- 2026-10-22: la variable OPENAI_API_KEY estaba presente en el entorno del proceso y a nivel de usuario; no se mostró su valor.
- Se hizo GET /v1/models autenticado, de solo lectura. Respondió y mostró, entre otros, gpt-6-luna, gpt-5.4-mini y gpt-4.1-mini.
- No se hizo inferencia ni se generó consumo de tokens de inferencia.
- Esto confirma autenticación y visibilidad del catálogo, no saldo, cuota, continuidad del acceso ni permisos suficientes para cada llamada de generación.
- No se copian credenciales al proyecto. No se inspeccionó ni reutilizó la configuración de otros proyectos.
- Google y AWS: créditos y acceso de inferencia no comprobados; no se presuponen ni son necesarios para alojar una demo local.
- El modelo candidato del paquete es GPT-6 Luna; no hay presupuesto de inferencia autorizado ni calidad comprobada por generación.

Referencia de coste consultada, no selección definitiva:
gpt-6-luna, estándar y contexto corto: 0,10 USD por millón de tokens de entrada y 0,50 USD por millón de salida. Cien llamadas hipotéticas de 3.000 tokens de entrada y 1.000 tokens de salida facturada cada una resultarían en 0,08 USD antes de impuestos y otros cargos aplicables. Contar toda salida facturada, incluido razonamiento cuando corresponda. No equivale a coste medido ni garantiza calidad.
Documentación: https://developers.openai.com/api/docs/pricing y https://developers.openai.com/api/docs/models/gpt-6-luna .
No se vuelve a consultar ni probar el modelo por crear estos documentos.

## Ruta técnica aceptada con ajuste

Aplicación local, persistencia local y petición al modelo para proponer cambios estructurados. El modelo no recibe capacidad de escribir el estado ni de ejecutar acciones comerciales.
Las reglas de revisión, guardado y repetición deben ser verificables en la aplicación; no depender solo de una instrucción al modelo.
La arquitectura concreta figura en spec.md, aceptada dentro del paquete conjunto con las precisiones del usuario. Se retira la inmovilidad de campos como medio de superar casos: hay modificaciones legítimas de datos, presupuesto y seguimiento revisadas.
Autorización contractual continúa fuera de modificaciones de V1; el modelo debe interpretarla aparte. Cambia el contrato de propuestas y su evaluación, no la arquitectura local.

## Dedicación estimada e interrupciones

Estimaciones, no horas medidas ni compromiso del usuario:
| Parte | Persona | Agente |
| --- | --- | --- |
| Planificación y decisiones | 60–90 min | 1–2 h |
| Núcleo y revisión temprana | 30–45 min | 4–6 h |
| Seis casos y correcciones | 60–90 min | 3–4 h |
| Repositorio y documentación | 15–30 min | 1–2 h |
| Vídeo, textos y presentación | 2–3 h | 1–2 h |

Reserva orientativa global: 16–24 h, aproximadamente 5–7 h de intervención directa y 10–16 h de agente, con margen para incidencias; intervalos redondeados, no sumas exactas ni plazo garantizado.
No se presupone disponibilidad continua. La persona interviene en decisiones de alcance/producto, revisión temprana y final, evaluación de utilidad y preparación de su material público. Entre esos puntos pueden agruparse trabajos del agente.
Si hay una decisión necesaria sin respuesta, se conserva el punto y se espera: el tiempo transcurrido no es aprobación.
No se promete ejecución posterior a un turno sin una ejecución activa o nueva reanudación del trabajo.

Tramo propuesto para decidir si continuar: 90–150 min humanos y 4–6 h de agente para planificación y una primera prueba comprobable del núcleo. Posteriormente se autorizó el corte 1, ya comprobado; queda la prueba humana. Es una estimación de planificación, no una medición de trabajo o ahorro.

## Registro de decisiones

- Usuario: nueva candidata independiente, sin trasladar código de proyectos previos; solo datos ficticios.
- Usuario: dominio fibra y dos líneas móviles; conservar necesidades, presupuesto, condiciones, ofertas, documentos pendientes y decisiones.
- Usuario: conservar fuente, revisión humana y límites; no inferir contratación o acciones realizadas.
- Usuario: anotación sin cambios solo al confirmar fin de revisión, con fuente, fecha, conclusión y motivo útil; mismo estado y próximo movimiento; sin versión vacía; antecedente útil permitido; no duplicar revisión sin información nueva.
- Usuario: autoriza carpeta nueva dedicada y proceso formal del Pack; documentos a revisión antes de construir; nombre pendiente.
- Usuario: aspirar a candidatura competitiva, concentrando esfuerzo en un resultado convincente, sin añadir funciones por apariencia.
- Usuario: aprueba la dirección del alcance y el foco de demo resumidos; pide PRD y especificación juntos para revisión.
- Usuario: ningún fallo crítico se compensa con aciertos en otros casos; el ahorro de tiempo sigue como hipótesis; primero ejecutar seis casos y reabrir, después decidir acabado.
- Se retira cualquier lectura de cinco de seis como puerta de aprobación. Hay cero tolerancia a críticos; cada caso debe comprobarse.
- Agente propone para revisión: detalles de controles, límites de V1, arquitectura local, modelo e intentos limitados; una ronda de ajuste antes de reevaluar.
- Usuario: acepta el paquete con el ajuste de que los campos del alcance admitan cambios legítimos; la inmovilidad de autorización contractual no demuestra comprensión.
- Usuario: exige evaluar por separado interpretación/propuestas, controles de aprobación/guardado y resultado persistido/reapertura.
- Usuario: acepta guardado parcial/finalización y borradores no persistidos, con aviso antes de perder trabajo revisado sin guardar.
- Agente incorpora C1-B y C6-B como variantes positivas para presupuesto y seguimiento; no añade infraestructura ni habilita gasto. Máximo propuesto de doce intentos: hasta nueve iniciales y tres repeticiones selectivas, no una tanda completa de repetición.
- Usuario, posteriormente: aprueba orden, fast y Git local con commits revisados. Autoriza inferencia hasta 1 USD/doce intentos, con tarifas y límites previos. Construir solo corte 1 y esperar su prueba. Presentación/publicación siguen sin autorizar.

## Próximos pasos formales

1-start: perfil real creado, basado en respuestas previas; experiencia o preferencias no establecidas se reconocen como tales.
2-scope: dirección y foco de demo aprobados; scope en approved con las precisiones de evaluación del usuario.
3-prd: paquete aceptado con el ajuste incorporado; approved.
4-spec: paquete aceptado con el ajuste incorporado; approved. La revisión conjunta fue pedida por el usuario y no se editaron las instrucciones originales del Pack.
5-build: orden approved, fast y Git local; corte 1 con aplicación local, modelo, guardado y reinicio verificados. Ver evidence-slice1.md. Checkpoint humano pendiente; no avanzar al corte 2.
6-ship: no iniciado; no hay inscripción, publicación ni candidatura presentada.

Los textos de planificación actuales están en español. La traducción pertinente al inglés queda para preparación de entrega; no se declara cumplido ese requisito ahora.

## Paquete conjunto de revisión
[Lectura conjunta](review.md), [PRD](prd.md), [especificación técnica](spec.md) y [orden de construcción aprobado](checklist.md). El paquete registra la aceptación con ajuste y las autorizaciones posteriores.
La aprobación de la dirección no prueba utilidad, precisión ni ahorro. Hasta ejecutar el núcleo, las ventajas son hipótesis.
