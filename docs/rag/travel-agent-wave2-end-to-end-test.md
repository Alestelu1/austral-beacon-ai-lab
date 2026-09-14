# Travel Agent Wave 2 — contrato end-to-end determinista

Base exacta: `472671e043babf555eb801ff34261f01345140b0`.
Rama: `test/travel-agent-wave2-end-to-end`.
Estado: prueba aislada preparada para auditoría; ningún consumidor real conectado.

## Alcance

Consulta: «¿Cómo se conecta Puerto Yungay con Villa O’Higgins y qué partes debo verificar antes de viajar?»

La prueba ejecuta intención → resolución de entidades → recorrido de relaciones → selección de claims → diagnóstico de conflictos → fallback live. Sólo admite la consulta aprobada y equivalentes tipográficos; rechaza otras intenciones. No es un buscador general ni una evaluación de embeddings.

Se usa JavaScript ESM sin dependencias para permitir ejecución offline con Node y probar la misma lógica pura en un runtime JavaScript aislado. Los nombres sugeridos en Python se sustituyen por archivos `.mjs`; no se modifica ningún proyecto, paquete npm, claim, relación ni salvaguarda.

## Contrato y procedencia

`data/knowledge/travel-agent-wave2-query-contract.json` contiene el caso, expectativas, rutas de los datos originales y capacidades deshabilitadas. Las expectativas son aserciones, no una respuesta prefabricada: quitar una relación o claim requerido hace fallar la recuperación.

Los nodos mencionados se resuelven desde el grafo; Río Bravo se descubre durante el recorrido. El corredor se construye con:

| Relación | Recorrido | Claim |
|---|---|---|
| b05w2-rel-01 | Carretera Austral → connects_with → Puerto Yungay | b05w2-002 |
| b05w2-rel-02 | Puerto Yungay → connects_by_ferry → Río Bravo | b05w2-001 |
| b05w2-rel-04 | Río Bravo → road_access_context → Villa O’Higgins | b05w2-003 |

La selección añade el claim de identidad b05w2-005, que documenta Río Bravo como extremo del cruce, sin equipararlo al río. Los duplicados entre paquetes se deduplican por ID y deben ser idénticos. Se conservan source_ids, procedencia y metadatos de los claims y relaciones recuperados.

b05w2-006 se consulta exclusivamente en `conflict_diagnostics.channel = offline_guard_only`. No se habilita como evidencia estable ni se elimina su bloqueo para Travel Agent/general RAG. Las alternativas se leen del registro de verification existente enlazado por ese claim. El output de conflicto no contiene `selected_value`; los null originales se validan sin alterarlos.

El validador acepta únicamente el output cerrado reconstruido desde esos datos. Rechaza campos extra, valores únicos, cambios de texto y datos operacionales inventados. Esta comprobación está deliberadamente limitada al contrato determinista; no pretende validar semánticamente cualquier prosa futura de un LLM.

## Demostración construida por código

### A — contexto documental estable

Puerto Yungay forma parte del corredor de la Carretera Austral hacia Villa O’Higgins. Las fuentes documentan conexión por embarcación con Río Bravo, extremo del cruce, y acceso terrestre hacia Villa O’Higgins.

### B — conflicto documental

Las fuentes conservan discrepancias de 90/100 km y 45/50 minutos para el cruce. No hay valor canónico seleccionado.

### C — información live requerida

Horarios, tarifas, operador actual, frecuencia, suspensiones, estado del camino y clima no están disponibles desde RAG estático y requieren verificación actual antes de viajar.

Los siete topics son `ferry_schedule`, `fare`, `operator`, `service_frequency`, `suspension`, `road_condition` y `weather`. Cada uno produce `unavailable_from_static_rag`, sin valor. La respuesta exige `requires_live_verification: true`. No se llama a ninguna API.

## Controles y ejecución reproducible

Desde el checkout de esta rama, con Node instalado y el commit base accesible en Git:

```sh
node tests/knowledge/test_travel_agent_wave2_contract.mjs --demo
```

El runner carga JSON reales desde disco y ejecuta 38 casos positivos/negativos, incluidos pérdida de aristas, ausencia de claims, reclasificación dinámica, duplicados divergentes, selección o eliminación de alternativas, distancia/duración únicas, horarios, frecuencia, tarifa, operador y disponibilidad inventados.

Además verifica contra objetos Git los bytes de Authority Closure (requisito 12), Fitz Roy (13), Campo de Hielo Sur (14), los cinco paquetes Wave 2 (18) y todos los blobs preexistentes. Restringe los cambios a estos cinco archivos nuevos, valida JSON y ejecuta `git diff --check`. Los requisitos 1–11 y 15–17 están cubiertos por los casos puros; el control de alcance confirma que no se conecta código runtime.

## Resultados de esta sesión

- 38/38 casos puros ejecutados satisfactoriamente en V8 aislado con los JSON recuperados del SHA base. Se ejecutó el mismo código funcional y de casos que se incluye en los módulos, retirando únicamente las declaraciones export para su carga en el evaluador.
- JSON del contrato validado mediante parseo y serialización; formato de los archivos nuevos revisado.
- La comparación de árboles Git remotos permite verificar que todos los archivos preexistentes conservan sus hashes; el resumen final de entrega informa el resultado tras crear el commit.
- Runner Node completo y sus comprobaciones de filesystem/Git: **no ejecutados aquí**, porque el entorno de terminal está indisponible.
- Suite RAG, build cliente y typecheck: **no ejecutados en esta sesión por la misma limitación**. No se presentan resultados anteriores como ejecuciones nuevas. La auditoría previa de Wave 2 registró RAG 72/72, build aprobado y seis errores preexistentes de typecheck; esa información es sólo antecedente.
- `git diff --check` nativo queda pendiente de ejecutar con el runner; la revisión textual en V8 no sustituye ese comando.

Comandos adicionales para completar la validación en un checkout con dependencias instaladas:

```sh
cd projects/end-of-the-world-travel-agent
npm run test:rag
npm run build:client
npm run typecheck
```

## Archivos creados

- `data/knowledge/travel-agent-wave2-query-contract.json`
- `tests/knowledge/travel_agent_wave2_contract.mjs`
- `tests/knowledge/travel_agent_wave2_cases.mjs`
- `tests/knowledge/test_travel_agent_wave2_contract.mjs`
- `docs/rag/travel-agent-wave2-end-to-end-test.md`

Archivos modificados o eliminados: ninguno. No se genera geometría ni embedding, no hay vector ingestion, LLM, API live, Wave 3 ni conexión al Travel Agent real. No abrir PR ni hacer merge antes de auditoría.
