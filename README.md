# Revisión de expediente — prueba local, nombre pendiente

Proyecto nuevo e independiente, construido desde vacío. Expedientes, documentos y ofertas ficticios. Sin código de aplicaciones anteriores, tarifas reales ni contratación.

Los tres cortes están implementados. La evaluación distingue interpretación original del modelo, aprobación/guardado y recuperación. La prueba final del participante y la medición frente al trabajo manual siguen pendientes. [Resultados y límites](devpost/evidence-slice3.md).

## Abrir

Con el servicio arrancado: **http://127.0.0.1:4317**. Para volver a arrancar, abrir una terminal en esta carpeta:

```powershell
npm start
```

Node 24.x (comprobado con 24.18.0), sin paquetes que instalar ni compilación. Ctrl+C detiene su servicio. No detener otros procesos si el puerto está ocupado.

La clave solo se lee en el servidor desde OPENAI_API_KEY o un .env excluido. Nunca introducirla en navegador o repositorio. Hay acceso real comprobado; **se han agotado los doce intentos autorizados**. Crear pruebas o reiniciar no restablece el cupo. No se habilitan más llamadas sin nueva autorización.

## Prueba final, en sesiones separadas si hace falta

1. En «Entrada de prueba», elige un caso y pulsa **Nueva prueba ficticia**. Cada uno comienza desde 600 Mb, 40 €, factura pendiente y seguimiento original. Los anteriores permanecen en el archivo local; la pantalla muestra solo el activo.
2. Pulsa **Usar respuesta real registrada (sin nueva llamada)**. Conserva la entrada preparada: se exige el mismo contexto, instrucciones y esquema que en la respuesta original. Un texto editado o un estado ya modificado no se empareja silenciosamente. Se identifica el intento original. Esto repite propuestas reales; no es inferencia nueva ni simulación.
3. Lee interpretación y citas **antes de corregir**. Aceptar una tarjeta no cambia todavía el expediente. Acepta, edita o rechaza, y confirma el fin de revisión para guardar. Se pueden guardar incorporaciones por partes sin declarar terminada la revisión.
4. Pulsa «Volver a leer lo guardado» o cierra y reabre. Comprueba valores, historial, fuentes y versiones. Para contrastar no aprobación, crea otra prueba del mismo caso y rechaza todas las propuestas: mantiene V1 y deja solo la revisión confirmada.

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

Puedes probar parcial, rechazos y avisos dentro de la misma sesión. **No se conservan borradores.** Si cierras tras guardar parcialmente, las incorporaciones sobreviven pero no las decisiones pendientes. Continuar con un nuevo análisis del estado cambiado requeriría inferencia y ahora está bloqueado por el cupo agotado. Para la prueba final sin gasto, termina cada revisión antes de cerrar; una prueba nueva permite repetir desde la base con la respuesta registrada.

Ctrl+R/F5 con trabajo pendiente abre aviso propio; «Volver» lo conserva y «Descartar» recarga sin incorporar ni finalizar. El navegador controla su aviso nativo de recarga/cierre. Chrome mostró ese aviso en la comprobación humana comunicada; no se ha probado cierre forzado ni todos los navegadores. Nada se guarda automáticamente.

La novedad y el texto documental se archivan como material aportado al finalizar. Rechazar recepción no crea un documento recibido ni valida el texto. El historial muestra antes/después, condiciones y citas; JSON queda en detalles secundarios cerrados.

## Evidencia y consumo

```powershell
npm test
```

32 controles locales, sin inferencia. Se ha verificado aceptación/rechazo por HTTP en diez escenarios y recuperación íntegra de veinte ejecuciones en otro proceso. [Salidas originales ficticias](devpost/evidence-model-slice3.json), [evaluación separada y fallos](devpost/evidence-slice3.md), [protocolo](devpost/evaluation.md). No confundir controles mecánicos con una valoración humana.

**12/12 intentos acumulados**, incluidos fallos/repeticiones anteriores; ocho nuevos en corte 3. Reserva 0,12 USD; cota conservadora de generación conocida **0,0081175 USD**, no factura. Entrada ≤ 6.000 tokens, salida ≤ 4.000, petición ≤ 24 KiB, sin reintentos. [Tarifas y cálculo](devpost/inference-budget.md). No se usan créditos de Google/AWS ni recursos nuevos.

Principal y C6 se reutilizaron tras comprobar contexto, fuentes, instrucciones y esquema. Dos propuestas redundantes mantienen fallos de precisión registrados. El primer fallo histórico de contrato también se conserva. No se ha demostrado fiabilidad general, utilidad neta ni ahorro de tiempo. La autorización contractual sigue fuera de escritura por límite técnico, separado de la evaluación semántica.

runtime/workspace.json conserva expedientes; runtime/inference-ledger.json conserva cupo; runtime/slice3/ conserva capturas, comparaciones y recuperación. runtime queda fuera de Git. No borrar el registro para recuperar intentos. Ante archivo corrupto se detiene sin reinicializar. Los fallos de timeout, refusal y disco lleno fueron simulados; no se afirma haber provocado fallos reales del proveedor o disco.

## Plan y proceso

[Alcance](devpost/scope.md), [PRD](devpost/prd.md), [especificación](devpost/spec.md), [checklist](devpost/checklist.md), [Pack oficial](skills/README.md) y [origen/licencia](skills/ORIGIN.md). Modo fast aprobado, control temprano realizado y prueba final pendiente. Perfil personal fuera de commits.

Git local, sin remoto. Sin publicación, despliegue, inscripción ni candidatura enviada. Nombre definitivo, decisión de participar, acabado y materiales públicos quedan pendientes.
