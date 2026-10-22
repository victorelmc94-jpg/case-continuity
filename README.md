# Revisión de expediente — prueba local, nombre pendiente

Proyecto nuevo e independiente, construido desde vacío. Expedientes, documentos y ofertas ficticios. Sin código de aplicaciones anteriores, tarifas reales ni contratación.

Los tres cortes están implementados. La evaluación distingue interpretación original del modelo, aprobación/guardado y recuperación. La prueba final del participante y la medición frente al trabajo manual siguen pendientes. [Resultados y límites](devpost/evidence-slice3.md).

## Abrir

Con el servicio arrancado: **http://127.0.0.1:4317**. Para volver a arrancar, abrir una terminal en esta carpeta:

```powershell
npm start
```

Node 24.x (comprobado con 24.18.0), sin paquetes que instalar ni compilación. Ctrl+C detiene su servicio. No detener otros procesos si el puerto está ocupado.

La clave solo se lee en el servidor desde OPENAI_API_KEY o un .env excluido. Nunca introducirla en navegador o repositorio. Hay acceso real comprobado. El participante amplió el cupo a **40 intentos acumulados, manteniendo 1 USD total**. Se conservan los doce anteriores: tras una comprobación técnica nueva hay **13 utilizados y 27 disponibles**. Crear pruebas o reiniciar no restablece el consumo.

## Prueba final, en sesiones separadas si hace falta

1. Elige «Principal» y pulsa **Nueva prueba ficticia**. Parte de 600 Mb, 40 €, factura pendiente y seguimiento original. Los anteriores se conservan; solo se muestra el activo.
2. Pon una referencia nueva, por ejemplo S-MI-PRUEBA-01, y sustituye «Texto original» por una novedad escrita por ti, usando solo datos ficticios. Una fuente conservada no se sobrescribe: cada novedad distinta necesita su propia referencia.
3. Pulsa **Analizar novedad con el modelo**. La sección muestra «Nueva interpretación del modelo · sin incorporar». Cada petición consume un intento, también si falla; no hay reintentos automáticos.
4. Lee interpretación y citas **antes de corregir**. Aceptar una tarjeta no cambia todavía el expediente. Acepta, edita o rechaza y confirma el fin de revisión para guardar. También se puede guardar por partes sin declarar terminada toda la revisión.
5. Cierra la pestaña y vuelve a abrir la misma dirección, o pulsa «Volver a leer lo guardado». Comprueba cambios, condiciones, fuentes, versiones y que lo rechazado no se incorporó. Es una prueba tuya pendiente, no un resultado ya superado.

**Respuestas registradas:** el otro botón sigue disponible para repetir los ejemplos originales. Muestra «Respuesta registrada · sin nueva llamada» y exige contexto exacto; editar el texto no genera una interpretación nueva por esa vía ni activa un fallback. Los resultados previstos de esas entradas fijas son:

| Entrada | Resultado a comprobar |
|---|---|
| Principal | Fibra 300; referencia 40; «Podría estudiar hasta 50 €/mes…» con ambas condiciones; interés y petición expresa de no contratar; seguimiento original. Rechazar la repetición innecesaria sobre factura pendiente. |
| C1 | Posibilidad de 50 condicionada a dos líneas y precio estable doce meses; referencia 40. |
| C2 | Corrección 600 → 300 atribuida al cliente; antecedente anterior conservado. |
| C3 | Nota y texto documental distintos; factura «Recibido, sin validar»; referencia 40, no 47. |
| C4 | Interés con «No contrates todavía»; rechazar la duda redundante sobre factura ya pendiente. |
| C5 | Permanencia contradictoria con ambas fuentes; no escoger automáticamente la más reciente. |
| C6 | Sin propuestas; solo confirmar crea «Revisado, sin cambios», manteniendo V1 y seguimiento. Repetir no duplica. |
| C1-B | Cambio legítimo del presupuesto de referencia 40 → 45, solo tras aprobación. |
| Factura prometida | Antecedente del envío anunciado; ningún documento recibido. |
| C6-B | Cambios legítimos en estado y próximo movimiento: esperar al cliente, sin llamada realizada. |

Puedes probar parcial, rechazos y avisos en sesiones separadas. **No se conservan borradores.** Si cierras tras guardar parcialmente, las incorporaciones sobreviven pero no las decisiones pendientes. Continuar puede requerir un nuevo análisis, que consume otro intento. Una respuesta registrada no sustituye ese análisis cuando cambió el contexto.

Ctrl+R/F5 con trabajo pendiente abre aviso propio; «Volver» lo conserva y «Descartar» recarga sin incorporar ni finalizar. El navegador controla su aviso nativo de recarga/cierre. Chrome mostró ese aviso en la comprobación humana comunicada; no se ha probado cierre forzado ni todos los navegadores. Nada se guarda automáticamente.

La novedad y el texto documental se archivan como material aportado al finalizar. Rechazar recepción no crea un documento recibido ni valida el texto. El historial muestra antes/después, condiciones y citas; JSON queda en detalles secundarios cerrados.

## Evidencia y consumo

```powershell
npm test
```

33 controles locales, sin inferencia. El corte 3 verificó aceptación/rechazo por HTTP en diez escenarios y recuperación íntegra de veinte ejecuciones en otro proceso. La preparación final añade una llamada real con texto ficticio nuevo, revisión/guardado por pantalla y recuperación íntegra tras reiniciar. [Preparación y límites actuales](devpost/final-review-readiness.md), [salidas originales ficticias](devpost/evidence-model-slice3.json), [evaluación del corte 3](devpost/evidence-slice3.md). Ninguna de estas pruebas técnicas es una valoración humana.

**13/40 intentos acumulados**, incluidos fallos/repeticiones anteriores. Reserva actual 0,13 USD; cota conservadora de generación conocida **0,0089175 USD**, no factura. Reserva máxima a cuarenta: 0,40 USD, dentro del límite total de 1 USD. Entrada ≤ 6.000 tokens, salida ≤ 4.000, petición ≤ 24 KiB, sin reintentos. [Tarifas y cálculo](devpost/inference-budget.md). No se usan créditos de Google/AWS ni recursos nuevos.

Principal y C6 se reutilizaron tras comprobar compatibilidad. Las dos redundancias conservan sus fallos de precisión y ahora se han revisado por pantalla: cada una exige una decisión adicional antes de finalizar; rechazarlas permite guardar lo útil. Su carga subjetiva y tiempo añadido no están medidos. No se ocultan ni se cambia el prompt para favorecer la prueba. Tampoco se ha demostrado fiabilidad general, utilidad neta ni ahorro. La autorización contractual sigue fuera de escritura por límite técnico, separado de la evaluación semántica.

runtime/workspace.json conserva expedientes; runtime/inference-ledger.json conserva cupo; runtime/slice3/ conserva capturas, comparaciones y recuperación. runtime queda fuera de Git. No borrar el registro para recuperar intentos. Ante archivo corrupto se detiene sin reinicializar. Los fallos de timeout, refusal y disco lleno fueron simulados; no se afirma haber provocado fallos reales del proveedor o disco.

## Plan y proceso

[Alcance](devpost/scope.md), [PRD](devpost/prd.md), [especificación](devpost/spec.md), [checklist](devpost/checklist.md), [Pack oficial](skills/README.md) y [origen/licencia](skills/ORIGIN.md). Modo fast aprobado, control temprano realizado y prueba final pendiente. Perfil personal fuera de commits.

Git local, sin remoto. Sin publicación, despliegue, inscripción ni candidatura enviada. Nombre definitivo, decisión de participar, acabado y materiales públicos quedan pendientes.
