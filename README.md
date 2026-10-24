# Revisión de expediente — prueba local, nombre pendiente

Proyecto nuevo e independiente, construido desde vacío. Expedientes, documentos y ofertas ficticios. Sin código de aplicaciones anteriores, tarifas reales ni contratación.

Los tres cortes están implementados. El participante probó texto propio, aceptación, guardado y relectura en S-PRUEBA-47, y detectó un próximo movimiento que perdía una actuación pendiente. Se preservó el original y se corrigió la generación con una regresión acotada. Falta su prueba breve de Editar y la comparación manual. [Corrección, evidencias y límites](devpost/revision-pending-actions.md).

## Abrir

Con el servicio arrancado: **http://127.0.0.1:4317**. Para volver a arrancar, abrir una terminal en esta carpeta:

```powershell
npm start
```

Node 24.x (comprobado con 24.18.0), sin paquetes que instalar ni compilación. Ctrl+C detiene su servicio. No detener otros procesos si el puerto está ocupado.

La clave solo se lee en el servidor desde OPENAI_API_KEY o un .env excluido. Nunca introducirla en navegador o repositorio. Cupo autorizado: **40 intentos acumulados y 1 USD total**. Tras la prueba del participante y tres regresiones nuevas hay **17 utilizados y 23 disponibles**. Crear pruebas o reiniciar no restablece consumo. La prueba breve siguiente no necesita inferencia nueva.

## Una prueba breve pendiente: Editar → guardar → reabrir

1. Elige **R47 · prueba breve de Editar**, pulsa **Nueva prueba ficticia** y **Usar respuesta real registrada**. Es la respuesta corregida ya comprobada por el agente, no una interpretación nueva. El expediente original 21ff502f se conserva sin modificar.
2. En **Próximo movimiento → Editar**, cambia **Declaración o valor de texto** por: «Aclarar las condiciones de la oferta A; revisar la factura cuando llegue y esperar la respuesta del cliente tras hablar con su pareja.»
3. Pulsa **Aceptar esta edición**, acepta las otras dos tarjetas y **Confirma el fin de revisión y guarda**.
4. Cierra y reabre la aplicación. Comprueba ese texto exacto, «Edición humana aceptada», fuentes y que no desaparece aclarar las condiciones. Deben seguir 47 €, fibra 600, interés posible sujeto a hablar con la pareja, no contratar y factura pendiente. La marca solo se atribuirá al participante cuando él comunique esta prueba.

Puedes continuar con texto propio mediante «Analizar novedad con el modelo», usando una referencia nueva en cada fuente distinta. Una fuente ya conservada no se sobrescribe. Esa vía sí consume intento, también si el proveedor falla, sin reintentos automáticos. Editar una tarjeta no vuelve a llamar al modelo. Lo pendiente del borrador no se conserva al cerrar; lo guardado sí.

**Respuestas registradas:** exige contexto e instrucciones exactos. R47 tiene una respuesta compatible con el prompt corregido. Las anteriores siguen archivadas como evidencia histórica; su huella antigua no se hace pasar por una respuesta del nuevo prompt. No hay fallback. La tabla siguiente conserva los criterios de las entradas originales, que no se han vuelto a evaluar como una tanda completa tras esta corrección:

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

33 controles locales, sin inferencia, pasan con la corrección. La regresión nueva tiene tres respuestas originales reales, un contraste positivo guardado y una edición manual del agente por pantalla, recuperada íntegramente en otro proceso. [Revisión actual](devpost/revision-pending-actions.md), [original humano preservado](devpost/evidence-s-prueba-47-original.json), [regresión y edición del agente](devpost/evidence-pending-actions.json). Las pruebas históricas del corte 3 siguen en sus documentos. Ninguna verificación del agente sustituye la prueba humana de Editar.

**17/40 intentos acumulados**, incluidos fallos/repeticiones anteriores. Reserva 0,17 USD; cota conservadora de generación conocida **0,01225175 USD**, no factura. Reserva máxima 0,40 USD dentro de 1 USD. Entrada ≤ 6.000 tokens, salida ≤ 4.000, petición ≤ 24 KiB, sin reintentos. [Tarifas y cálculo](devpost/inference-budget.md). Sin créditos supuestos de Google/AWS ni recursos nuevos.

En la evaluación histórica del corte 3, Principal y C6 se reutilizaron tras comprobar compatibilidad con las instrucciones de entonces. Las dos redundancias conservan sus fallos de precisión y se revisaron por pantalla: cada una exige una decisión adicional antes de finalizar; rechazarlas permite guardar lo útil. Su carga subjetiva y tiempo añadido no están medidos. Las salidas originales siguen intactas. La corrección actual añade una regla general sobre actuaciones pendientes, sin excepciones para R47. Tampoco se ha demostrado fiabilidad general, utilidad neta ni ahorro. La autorización contractual sigue fuera de escritura por límite técnico, separado de la evaluación semántica.

runtime/workspace.json conserva expedientes; runtime/inference-ledger.json conserva cupo; runtime/slice3/ conserva capturas, comparaciones y recuperación. runtime queda fuera de Git. No borrar el registro para recuperar intentos. Ante archivo corrupto se detiene sin reinicializar. Los fallos de timeout, refusal y disco lleno fueron simulados; no se afirma haber provocado fallos reales del proveedor o disco.

## Plan y proceso

[Alcance](devpost/scope.md), [PRD](devpost/prd.md), [especificación](devpost/spec.md), [checklist](devpost/checklist.md), [Pack oficial](skills/README.md) y [origen/licencia](skills/ORIGIN.md). Modo fast aprobado, control temprano realizado y prueba final pendiente. Perfil personal fuera de commits.

Git local, sin remoto. Sin publicación, despliegue, inscripción ni candidatura enviada. Nombre definitivo, decisión de participar, acabado y materiales públicos quedan pendientes.
