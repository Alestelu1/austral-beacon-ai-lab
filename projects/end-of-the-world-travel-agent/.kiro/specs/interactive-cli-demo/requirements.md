# Requirements Document

## Introduction

Este feature agrega una demostración interactiva mínima por terminal (CLI REPL) para End of the World Travel Agent. La demo permite al usuario escribir preguntas en lenguaje natural y recibir respuestas formateadas de forma legible directamente en consola, reutilizando exclusivamente `answerTravelQuestion` como punto de entrada público. No se introduce LLM, RAG, frontend, API HTTP ni dependencias nuevas.

## Glossary

- **CLI_REPL**: Bucle de lectura-evaluación-impresión interactivo en terminal que recibe preguntas del usuario y muestra respuestas formateadas.
- **Formateador**: Función pura que transforma un objeto de respuesta (`TravelAnswer | DestinationCardAnswer`) en una cadena legible para consola.
- **Comando_Salida**: Palabras reservadas ("salir", "exit", "quit") que terminan el bucle interactivo.

## Requirements

### Requirement 1: Bucle interactivo de lectura

**User Story:** Como usuario, quiero escribir preguntas en la terminal y recibir respuestas inmediatas, para explorar el sistema de forma conversacional.

#### Acceptance Criteria

1. WHEN el usuario ejecuta el script de demostración, THE CLI_REPL SHALL mostrar un mensaje de bienvenida y un prompt indicando que espera una pregunta.
2. WHEN el usuario escribe una pregunta y presiona Enter, THE CLI_REPL SHALL enviar la pregunta a `answerTravelQuestion` y mostrar la respuesta formateada.
3. WHEN el usuario escribe "salir", "exit" o "quit" (insensible a mayúsculas y espacios), THE CLI_REPL SHALL terminar el bucle y mostrar un mensaje de despedida.
4. WHEN el usuario envía una línea vacía o solo espacios, THE CLI_REPL SHALL ignorar la entrada y volver a mostrar el prompt sin invocar `answerTravelQuestion`.
5. THE CLI_REPL SHALL continuar aceptando preguntas hasta que el usuario invoque un Comando_Salida o cierre el proceso.

### Requirement 2: Formato de respuestas de conectividad

**User Story:** Como usuario, quiero ver las rutas de conectividad de forma clara y legible en la terminal.

#### Acceptance Criteria

1. WHEN `answerTravelQuestion` retorna una respuesta con intent "connectivity" y status "supported", THE Formateador SHALL mostrar: el resumen, cada etapa de ruta (origen → destino, modo, nota), las advertencias y las fuentes con fecha de verificación.
2. THE Formateador SHALL separar visualmente cada sección (resumen, etapas, advertencias, fuentes) usando encabezados o separadores de texto plano.

### Requirement 3: Formato de respuestas de información de destino

**User Story:** Como usuario, quiero ver la información de fichas de destino de forma estructurada y legible.

#### Acceptance Criteria

1. WHEN `answerTravelQuestion` retorna una respuesta con intent "destination-info" y status "supported", THE Formateador SHALL mostrar: nombre del destino, resumen, contexto geográfico, contexto cultural, advertencias, fuentes verificadas, enlaces internos sugeridos, confidence y verifiedAt.
2. THE Formateador SHALL etiquetar claramente cada campo mostrado para que el usuario identifique qué tipo de información está leyendo.
3. THE Formateador SHALL mostrar cada fuente con su título, editor, URL y fecha de verificación.
4. THE Formateador SHALL mostrar cada enlace interno con su ruta y etiqueta.

### Requirement 4: Formato de respuestas no soportadas

**User Story:** Como usuario, quiero recibir un mensaje claro cuando el sistema no puede responder mi pregunta.

#### Acceptance Criteria

1. WHEN `answerTravelQuestion` retorna una respuesta con status "unsupported", THE Formateador SHALL mostrar un mensaje indicando que la pregunta no puede ser respondida con la información disponible.
2. IF la respuesta unsupported tiene intent "destination-info", THEN THE Formateador SHALL indicar que el destino consultado no está disponible.
3. IF la respuesta unsupported tiene intent "unknown", THEN THE Formateador SHALL indicar que la consulta no fue reconocida.

### Requirement 5: Separación de lógica y E/S

**User Story:** Como desarrollador, quiero que la lógica de formateo esté separada de la entrada/salida de consola, para poder testear el formateo independientemente.

#### Acceptance Criteria

1. THE Formateador SHALL ser una función pura que recibe un objeto de respuesta y retorna una cadena de texto, sin efectos secundarios ni acceso directo a `process.stdout` o `readline`.
2. THE CLI_REPL SHALL usar el Formateador para producir la cadena y luego imprimirla en consola como paso separado.
3. THE Formateador SHALL NO invocar `answerTravelQuestion`, acceder al repositorio de fichas, ni duplicar lógica de detección de intención.

### Requirement 6: Pruebas unitarias del formateador

**User Story:** Como desarrollador, quiero tests que verifiquen que el formateador produce salidas correctas para cada tipo de respuesta.

#### Acceptance Criteria

1. THE test suite SHALL incluir un test que verifique que el formateador produce una salida legible para una respuesta de connectivity con etapas y fuentes.
2. THE test suite SHALL incluir un test que verifique que el formateador produce una salida legible para una respuesta de destination-info con todos los campos de la ficha.
3. THE test suite SHALL incluir un test que verifique que el formateador produce un mensaje apropiado para una respuesta unsupported/unknown.
4. THE test suite SHALL ejecutarse sin red, sin interacción de usuario y coexistir con los tests existentes en `vitest run`.

### Requirement 7: Restricciones técnicas

**User Story:** Como equipo técnico, queremos mantener la demo simple y sin efectos colaterales en el sistema.

#### Acceptance Criteria

1. THE CLI_REPL SHALL funcionar sin LLM, RAG, bases de datos vectoriales, AWS, API HTTP ni frontend.
2. THE CLI_REPL SHALL NO agregar dependencias nuevas al `package.json`. Usará únicamente `node:readline` de la biblioteca estándar.
3. THE CLI_REPL SHALL NO modificar el contenido de las fichas JSON en `data/destinations/` ni `data/routes/`.
4. THE CLI_REPL SHALL NO duplicar la detección de intención, acceso al repositorio ni lógica de normalización que ya existe en `answerTravelQuestion`.
5. THE CLI_REPL SHALL reutilizar `answerTravelQuestion` tal como se exporta desde el punto de entrada público del proyecto.
6. THE CLI_REPL SHALL NO inventar, extrapolar ni complementar la información mostrada más allá de lo contenido en la respuesta recibida.
