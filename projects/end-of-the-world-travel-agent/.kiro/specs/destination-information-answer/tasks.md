# Implementation Plan: Destination Information Answer

## Overview

Integración del módulo de fichas de destino con el punto de entrada público `answerTravelQuestion`. Se agrega detección de intención informativa en dos pasos (indicador + destino) y despacho a `getDestinationCard`. Se mantiene prioridad connectivity > destination-info > unknown. Sin dependencias nuevas, sin modificar fichas JSON ni módulos existentes del slice anterior.

## Tasks

- [x] 1. Ampliar answerTravelQuestion con imports y singleton del repositorio
  - [x] 1.1 Agregar imports a `src/application/answerTravelQuestion.ts`
    - Importar `resolve` de `node:path`
    - Importar `LocalJsonDestinationCardRepository` de `../adapters/LocalJsonDestinationCardRepository.js`
    - Importar `getDestinationCard` de `./getDestinationCard.js`
    - Importar tipo `DestinationCardAnswer` de `../domain/types.js`
    - No modificar imports existentes
    - _Requirements: 2.1, 2.2, 7.5_

  - [x] 1.2 Crear instancia singleton del repositorio a nivel de módulo
    - Declarar `const destinationRepository = new LocalJsonDestinationCardRepository(resolve(import.meta.dirname, "../../data/destinations"))`
    - Ubicar después de la declaración de `route`
    - No crear nueva instancia en ninguna función
    - _Requirements: 2.2, 7.1_

- [x] 2. Implementar constantes y funciones de detección
  - [x] 2.1 Agregar constantes `DESTINATION_INFO_INDICATORS` y `KNOWN_DESTINATIONS`
    - `DESTINATION_INFO_INDICATORS`: arreglo con ["que es", "que son", "cuentame", "cuenteme", "informacion", "donde esta", "donde queda", "hablame", "hableme", "sobre", "acerca de", "describir", "descripcion"]
    - `KNOWN_DESTINATIONS`: arreglo de objetos `{ pattern: string; identifier: string }` para "punta arenas", "puerto williams", "cabo de hornos"
    - Ubicar antes de las funciones
    - _Requirements: 1.1, 1.5_

  - [x] 2.2 Implementar función `hasInfoIndicator(normalized: string): boolean`
    - Retorna `true` si `normalized` contiene al menos un elemento de `DESTINATION_INFO_INDICATORS`
    - _Requirements: 1.1, 1.4_

  - [x] 2.3 Implementar función `extractDestinationName(normalized: string): string | null`
    - Paso 1: buscar coincidencia en `KNOWN_DESTINATIONS`, retornar su `identifier` si existe
    - Paso 2: si no coincide con destino conocido, buscar segmento posterior a cada indicador informativo; limpiar puntuación; retornar si no es vacío
    - Retornar `null` si no se puede extraer nombre
    - _Requirements: 1.1, 1.5, 2.1_

- [x] 3. Implementar orden de despacho en answerTravelQuestion
  - [x] 3.1 Refactorizar `isSupportedConnectivityQuestion` para recibir string ya normalizado
    - Cambiar firma interna para recibir `value: string` (ya normalizado)
    - Eliminar la llamada a `normalize` dentro de la función
    - Normalizar una sola vez en `answerTravelQuestion` y pasar el resultado
    - Mantener exactamente la misma lógica de detección de connectivity
    - _Requirements: 4.1, 4.2_

  - [x] 3.2 Actualizar cuerpo de `answerTravelQuestion` con el flujo de tres intenciones
    - Normalizar `question` una vez al inicio: `const normalized = normalize(question)`
    - Evaluar connectivity primero: `if (isSupportedConnectivityQuestion(normalized))` → retornar TravelAnswer de conectividad (sin cambios)
    - Evaluar destination-info: `if (hasInfoIndicator(normalized))` → extraer destino con `extractDestinationName(normalized)` → si hay destino, retornar `getDestinationCard(destinationName, destinationRepository)`
    - Fallback: retornar TravelAnswer unsupported/unknown (sin cambios)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.4, 4.1, 5.1_

  - [x] 3.3 Actualizar la firma exportada de `answerTravelQuestion`
    - Cambiar tipo de retorno a `TravelAnswer | DestinationCardAnswer`
    - _Requirements: 3.1, 3.2_

- [x] 4. Revisar src/index.ts
  - [x] 4.1 Verificar exports de tipos en `src/index.ts`
    - Revisar si `DestinationCardAnswer` ya está exportado y si la firma pública refleja `TravelAnswer | DestinationCardAnswer`
    - Actualizar exports únicamente si `DestinationCardAnswer` todavía no está exportado o si la firma pública requiere un cambio real
    - Si ya está correctamente exportado, no modificar `src/index.ts`
    - Mantener exports existentes sin alterar
    - _Requirements: 3.1_

- [x] 5. Checkpoint — Typecheck
  - Ejecutar `npm run typecheck` y verificar que pasa sin errores.

- [x] 6. Ampliar tests de answerTravelQuestion
  - [x] 6.1 Agregar tests de intención destination-info con destinos cubiertos
    - Test: "¿Qué es Puerto Williams?" → intent: destination-info, status: supported, card.id: puerto-williams
    - Test: "Cuéntame sobre Punta Arenas" → intent: destination-info, status: supported, card.id: punta-arenas
    - Test: "Información de Cabo de Hornos" → intent: destination-info, status: supported, card.id: cabo-de-hornos
    - No borrar ni reescribir los tests existentes
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.2 Agregar tests de variaciones de mayúsculas y acentos
    - Test: "HABLAME DE PUERTO WILLIAMS" → intent: destination-info, status: supported
    - Test: "Donde esta Punta Arenas" → intent: destination-info, status: supported
    - _Requirements: 6.4, 1.5_

  - [x] 6.3 Agregar test de destino no cubierto
    - Test: "¿Qué es Ushuaia?" → intent: destination-info, status: unsupported, confidence: none
    - _Requirements: 6.5, 5.2_

  - [x] 6.4 Agregar tests de fallback unknown
    - Test: "Puerto Williams" (sin indicador informativo) → intent: unknown, status: unsupported
    - Test: "¿Cuánto cuesta un café?" → intent: unknown, status: unsupported
    - _Requirements: 6.6, 5.1_

  - [x] 6.5 Agregar test de regresión de conectividad
    - Test: "¿Cómo llegar desde Santiago a Puerto Williams?" → intent: connectivity, status: supported, stages.length: 2
    - Verificar que las dos pruebas existentes siguen en el archivo sin modificaciones
    - _Requirements: 6.7, 4.2, 4.3_

- [x] 7. Checkpoint — Run full test suite
  - Ejecutar `npm test` y verificar que todas las pruebas pasan (existentes + nuevas).

## Notes

- No se modifica: `getDestinationCard.ts`, `LocalJsonDestinationCardRepository.ts`, `normalize.ts`, `validateDestinationCard.ts`, `data/destinations/*.json`
- No se agregan dependencias, scripts temporales, APIs, LLM, RAG, AWS ni frontend
- El repositorio singleton usa `resolve(import.meta.dirname, "../../data/destinations")` — misma ruta probada
- Los tests existentes en `answerTravelQuestion.test.ts` permanecen intactos; solo se agregan nuevos bloques `describe`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5"] }
  ]
}
```
