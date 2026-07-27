# Requirements Document

## Introduction

Este feature conecta las fichas de destino locales (Local Destination Cards) con el flujo principal del agente de viaje. El objetivo es que `answerTravelQuestion` reconozca preguntas informativas en español sobre destinos cubiertos (Punta Arenas, Puerto Williams, Cabo de Hornos) y devuelva la información estructurada de la ficha correspondiente, reutilizando íntegramente `getDestinationCard` y `LocalJsonDestinationCardRepository`. No se introduce LLM, RAG, frontend ni dependencias nuevas.

## Glossary

- **Pregunta_Informativa**: Consulta en lenguaje natural cuya intención es obtener información general sobre un destino (qué es, dónde está, cuéntame sobre).
- **Detector_Intención**: Lógica dentro de `answerTravelQuestion` que clasifica una pregunta como "connectivity", "destination-info" o "unknown".
- **Respuesta_Destino**: Objeto `DestinationCardAnswer` devuelto cuando la intención detectada es "destination-info".
- **Destinos_Cubiertos**: Punta Arenas, Puerto Williams y Cabo de Hornos — los destinos con fichas válidas en `data/destinations/`.

## Requirements

### Requirement 1: Detección de intención informativa sobre destinos

**User Story:** Como viajero, quiero hacer preguntas informativas en español sobre destinos del sur austral y recibir la ficha correspondiente, sin necesidad de usar un formato específico.

#### Acceptance Criteria

1. WHEN el usuario formula una pregunta que menciona un destino cubierto y contiene al menos un indicador informativo (tales como "qué es", "cuéntame", "información", "dónde está", "háblame", "sobre", "acerca de", "describir", "descripción"), THE Sistema SHALL clasificar la intención como "destination-info" y delegar al caso de uso `getDestinationCard`.
2. WHEN la pregunta menciona un destino cubierto pero también contiene indicadores de conectividad ("llegar", "viajar", "ir", "ruta", "conexión") junto con un origen ("Santiago"), THE Sistema SHALL clasificar la intención como "connectivity" y procesarla con el flujo de conectividad existente, sin intervención del módulo de fichas.
3. IF la pregunta no coincide con ningún patrón de intención reconocido, THEN THE Sistema SHALL devolver una respuesta con estado "unsupported" e intención "unknown".
4. THE Detector_Intención SHALL normalizar la pregunta (minúsculas, sin diacríticos) antes de evaluar patrones, reutilizando la función `normalize` existente en `src/domain/normalize.ts`.
5. THE Detector_Intención SHALL reconocer nombres de destinos cubiertos en cualquier variante de mayúsculas y con o sin acentos (ej. "puerto williams", "Puerto Williams", "PUERTO WILLIAMS").

### Requirement 2: Delegación al caso de uso existente

**User Story:** Como desarrollador, quiero que las preguntas informativas se resuelvan usando `getDestinationCard` sin duplicar lógica.

#### Acceptance Criteria

1. WHEN la intención es "destination-info", THE Sistema SHALL extraer el nombre del destino de la pregunta y pasarlo como identificador a `getDestinationCard(identifier, repository)`.
2. THE Sistema SHALL instanciar `LocalJsonDestinationCardRepository` con la ruta `data/destinations/` y reutilizarlo para todas las consultas de destino sin crear una nueva instancia por pregunta.
3. THE Sistema SHALL NO duplicar la lógica de normalización, validación de esquema, carga JSON ni búsqueda por slug/nombre que ya existe en el módulo `local-destination-cards`.
4. IF `getDestinationCard` devuelve una respuesta con estado "unsupported", THEN THE Sistema SHALL propagar esa respuesta sin modificarla ni inventar información.

### Requirement 3: Contrato de respuesta para preguntas informativas

**User Story:** Como consumidor de la API, quiero que las respuestas a preguntas informativas incluyan toda la información estructurada de la ficha.

#### Acceptance Criteria

1. WHEN la intención es "destination-info" y el destino existe, THE Sistema SHALL devolver una respuesta que incluya: status ("supported"), intent ("destination-info"), nombre del destino, summary, stableData.geographicContext, stableData.culturalContext, warnings, sources, suggestedInternalLinks, confidence y verifiedAt.
2. WHEN la intención es "destination-info" y el destino no existe en el repositorio, THE Sistema SHALL devolver una respuesta con status "unsupported", intent "destination-info", confidence "none", arreglos vacíos y verifiedAt ausente.
3. THE Sistema SHALL NO inventar, extrapolar ni complementar la información más allá de lo contenido en la ficha JSON local.

### Requirement 4: Preservación del comportamiento de conectividad

**User Story:** Como usuario existente, quiero que las preguntas de conectividad Santiago → Puerto Williams sigan funcionando exactamente igual.

#### Acceptance Criteria

1. THE Sistema SHALL mantener intacto el comportamiento de `answerTravelQuestion` para consultas de conectividad que mencionan un origen, un destino y un indicador de viaje.
2. WHEN el usuario pregunta "¿Cómo llegar desde Santiago a Puerto Williams?", THE Sistema SHALL responder con intención "connectivity" y las etapas de ruta existentes, sin intervención del módulo de fichas de destino.
3. THE test suite existente `answerTravelQuestion.test.ts` SHALL seguir pasando sin modificaciones.

### Requirement 5: Manejo de preguntas no reconocidas

**User Story:** Como viajero, quiero que el sistema me indique claramente cuando no puede responder, en lugar de inventar información.

#### Acceptance Criteria

1. IF la pregunta no coincide con los patrones de conectividad ni de información de destino, THEN THE Sistema SHALL devolver una respuesta con status "unsupported", intent "unknown" y un resumen indicando que no puede responder la consulta.
2. IF la pregunta menciona un destino que no está en el repositorio de fichas (ej. "¿Qué es Ushuaia?"), THEN THE Sistema SHALL devolver status "unsupported", intent "destination-info", confidence "none" y un resumen indicando que el destino no está disponible.
3. THE Sistema SHALL NO generar respuestas especulativas ni presentar datos no respaldados por las fichas locales.

### Requirement 6: Pruebas unitarias

**User Story:** Como desarrollador, quiero tests que verifiquen la integración del detector de intención con las fichas de destino.

#### Acceptance Criteria

1. THE test suite SHALL incluir un test que verifique que "¿Qué es Puerto Williams?" devuelve status "supported", intent "destination-info" y la ficha de Puerto Williams.
2. THE test suite SHALL incluir un test que verifique que "Cuéntame sobre Punta Arenas" devuelve status "supported", intent "destination-info" y la ficha de Punta Arenas.
3. THE test suite SHALL incluir un test que verifique que "Información de Cabo de Hornos" devuelve status "supported", intent "destination-info" y la ficha de Cabo de Hornos.
4. THE test suite SHALL incluir tests con variaciones de mayúsculas y ausencia de acentos que resuelvan al mismo destino.
5. THE test suite SHALL incluir un test que verifique que un destino no cubierto (ej. "¿Qué es Ushuaia?") devuelve status "unsupported" con intent "destination-info".
6. THE test suite SHALL incluir un test que verifique que una pregunta no relacionada (ej. "¿Cuánto cuesta un café?") devuelve status "unsupported" con intent "unknown".
7. THE test suite SHALL incluir un test de regresión que verifique que "¿Cómo llegar desde Santiago a Puerto Williams?" sigue devolviendo intent "connectivity" con las etapas de ruta correctas.
8. THE test suite SHALL ejecutarse sin red, LLM, RAG ni servicios externos, coexistiendo con los tests existentes en `vitest run`.

### Requirement 7: Restricciones técnicas

**User Story:** Como equipo técnico, queremos mantener el sistema simple y sin dependencias externas en esta fase.

#### Acceptance Criteria

1. THE Sistema SHALL funcionar sin LLM, RAG, bases de datos vectoriales, AWS ni APIs externas.
2. THE Sistema SHALL NO agregar dependencias nuevas al `package.json`.
3. THE Sistema SHALL NO modificar el contenido de las fichas JSON en `data/destinations/`.
4. THE Sistema SHALL NO agregar frontend, interfaz web ni componentes de UI.
5. THE Sistema SHALL reutilizar los tipos, puertos y adaptadores definidos en el módulo `local-destination-cards` sin duplicarlos.
