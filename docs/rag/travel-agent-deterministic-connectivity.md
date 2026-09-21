# Travel Agent — servicio interno de conectividad determinista

Base: `7e8abef2a9c57ebdf79fb4867a694c2480bacd5c`.
Rama: `feat/travel-agent-deterministic-connectivity`.
Modo: **experimental / deterministic / no-live / no-LLM**.

## Servicio y alcance

`answerConnectivityQuestion(query)` es una función interna del proyecto Travel Agent. No se registra en la UI, CLI, router HTTP, retriever general ni proveedor de modelos. Un consumidor interno debe importarla explícitamente. Esta entrega no añade endpoints ni modifica consumidores existentes.

```ts
import { answerConnectivityQuestion } from "./src/knowledge/knowledgeQueryService.js";

const answer = answerConnectivityQuestion(
  "¿Cómo se conecta Puerto Yungay con Villa O’Higgins y qué partes debo verificar antes de viajar?"
);
if (answer.answerType === "connectivity") {
  console.log(answer.answerParts);
} else {
  console.log(answer.reason);
}
```

Se admite únicamente la consulta aprobada y equivalentes tipográficos, incluido `O'Higgins` / `O’Higgins`. No se pretende resolver paráfrasis generales. Las consultas operacionales, ajenas al corredor o que soliciten una distancia/duración única producen `unsupported`, sin completar datos por inferencia.

## Arquitectura y reutilización

- `knowledgeQueryService.ts`: entrada interna, límites del input, resultado discriminado y rechazo seguro sin exponer errores internos.
- `knowledgeRepository.ts`: lectura local de seis JSON originales, con rutas relativas al módulo, independiente del directorio de ejecución. Sin red, copias factuales, cache mutable ni escritura. Requiere el checkout del monorepo; no es aún un bundle de despliegue.
- `connectivityQuery.ts`: invoca la lógica auditada y valida la salida antes de convertirla al contrato TypeScript, incluyendo citas, sensibilidad y las identidades de las relaciones.
- `knowledgeTypes.ts`: `ConnectivityAnswer`, `UnsupportedConnectivityAnswer`, `ConnectivityResult`, `KnowledgeRepository`, `KnowledgeSnapshot`, `ClaimEvidence`, `SourceCitation`, `ConflictDiagnostic` y `LiveTopic`.
- `shared/knowledge/travelAgentWave2Contract.mjs`: algoritmo original trasladado **sin cambiar sus bytes**. Su declaración `.d.mts` conserva entradas/salida `unknown` para exigir validación en el consumidor.
- El módulo histórico de `tests/knowledge/` sólo reexporta el módulo compartido. Producción no importa desde tests. Los 38 casos originales siguen ejercitando exactamente el mismo algoritmo.

El runner histórico conserva todos sus controles LF/CRLF y de integridad. Sólo amplía su lista explícita de archivos autorizados a los ocho archivos nuevos de esta integración y añade una comparación del algoritmo compartido contra el original auditado. El fixture y sus declaraciones históricas de capacidades no se cambian: describen el harness offline, no configuran el estado del nuevo servicio interno. Esas declaraciones no se exponen como capacidades de runtime en la respuesta del servicio.

## Datos consumidos directamente

1. `data/knowledge/batch-05-wave-2-connectivity-graph.json`
2. `data/knowledge/travel-agent-wave2-query-contract.json`
3. `data/verification/campo-hielo-sur-chilean-authority-validation.json`
4. `knowledge-base/research/batch-05-wave-2-retrieval-policy.json`
5. `knowledge-base/entities/places/puerto-yungay/claims.json`
6. `knowledge-base/entities/infrastructure/rio-bravo/claims.json`

No se duplican estos datos dentro del proyecto. Las citas provienen de `source_ids` y `provenance` existentes, con URL/localizador/página cuando están documentados; no se consultan las URLs durante la respuesta.

## Recorrido y evidencia

`query intent → entity resolution → relation traversal → claim selection → conflict guard → live fallback`

| Arista | Recorrido | Claim |
|---|---|---|
| `b05w2-rel-01` | Carretera Austral → Puerto Yungay | `b05w2-002` |
| `b05w2-rel-02` | Puerto Yungay → Río Bravo, por embarcación | `b05w2-001` |
| `b05w2-rel-04` | Río Bravo → contexto de acceso terrestre a Villa O’Higgins | `b05w2-003` |

La resolución inicial encuentra Puerto Yungay y Villa O’Higgins; el recorrido descubre Río Bravo. Se añade `b05w2-005` para su identidad como extremo documentado del cruce. La ruta resultante es `carretera-austral`, `puerto-yungay`, `rio-bravo`, `villa-ohiggins`.

Los cuatro claims estables deben ser verificados, elegibles, `public_core`, sin necesidad de verificación actual ni bloqueo para Travel Agent. Duplicados entre paquetes deben coincidir exactamente. Una relación requerida ausente, claim reclasificado/bloqueado, metadatos o procedencia inválidos produce `unsupported / knowledge_unavailable`.

`b05w2-006` **no se convierte en claim estable ni se desbloquea**. Se usa exclusivamente en `conflictGuard` para informar el conflicto. Su texto factual no se añade a `stableEvidence`. Las alternativas numéricas se leen del registro de verification enlazado: 90 y 100 km, 45 y 50 minutos. La salida no ofrece `selected_value` ni `selectedValue`.

## Respuesta determinista

**Contexto estable:** Puerto Yungay forma parte del corredor de la Carretera Austral hacia Villa O’Higgins. Las fuentes documentan conexión por embarcación con Río Bravo, extremo del cruce, y acceso terrestre hacia Villa O’Higgins.

**Conflicto:** Las fuentes conservan discrepancias de 90/100 km y 45/50 minutos para el cruce. No hay valor canónico seleccionado.

**Live:** Horarios, tarifas, operador actual, frecuencia, suspensiones, estado del camino y clima no están disponibles desde RAG estático y requieren verificación actual antes de viajar.

`requiresLiveVerification` siempre es `true`. Los siete topics son `ferry_schedule`, `fare`, `operator`, `service_frequency`, `suspension`, `road_condition`, `weather`; todos con `unavailable_from_static_rag`, sin valores. Esta salida no confirma disponibilidad ni permite planificar horarios.

## Validación

Desde la raíz del repositorio:

```sh
node tests/knowledge/test_travel_agent_wave2_contract.mjs
cd projects/end-of-the-world-travel-agent
npx vitest run tests/deterministicConnectivity.test.ts
npm run test:rag
npm run build:client
npm run typecheck
```

Resultados finales:

- Tests del servicio: 58/58 aprobados.
- Runner existente: 38/38 casos puros aprobados, junto con todos los controles de integridad y alcance.
- Authority Closure, Fitz Roy, Campo de Hielo Sur, los cinco paquetes Wave 2 y todos los blobs preexistentes protegidos: byte-identical mediante objetos Git.
- RAG: 16 archivos / 72 tests aprobados.
- Build cliente: aprobado.
- JSON y `git diff --check`: aprobados.
- Typecheck: falla con exactamente seis errores preexistentes; ninguno pertenece a los archivos nuevos. TS2352 en `src/knowledge/straitProjection.ts:53`, TS2345 en el mismo archivo:79 y cuatro TS2339 en `tests/puertoWilliamsProjection.test.ts:58–61`. Ambos archivos permanecen sin modificaciones.

## Alcance de archivos

Ocho creados:

- `shared/knowledge/travelAgentWave2Contract.mjs`
- `shared/knowledge/travelAgentWave2Contract.d.mts`
- `projects/end-of-the-world-travel-agent/src/knowledge/knowledgeQueryService.ts`
- `projects/end-of-the-world-travel-agent/src/knowledge/connectivityQuery.ts`
- `projects/end-of-the-world-travel-agent/src/knowledge/knowledgeTypes.ts`
- `projects/end-of-the-world-travel-agent/src/knowledge/knowledgeRepository.ts`
- `projects/end-of-the-world-travel-agent/tests/deterministicConnectivity.test.ts`
- `docs/rag/travel-agent-deterministic-connectivity.md`

Dos modificados: `tests/knowledge/travel_agent_wave2_contract.mjs` (reexportación) y `tests/knowledge/test_travel_agent_wave2_contract.mjs` (alcance autorizado y comprobación de traslado).

Sin modificar entidades, claims, relaciones, fuentes, fixtures, manifests Wave 1/2, Authority Closure, registro IGM, Fitz Roy o Campo de Hielo Sur. Sin nuevos nodos, geometrías, LLM, embeddings, vector store, APIs live, Wave 3 ni UI pública. No abrir PR ni hacer merge antes de auditoría.
