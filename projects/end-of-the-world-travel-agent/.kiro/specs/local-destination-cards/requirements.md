# Requirements Document

## Introduction

Este feature agrega fichas informativas locales (destination cards) para destinos del sur austral de Chile. Cada ficha contiene datos estables verificados (geografía, contexto cultural, accesos), separados explícitamente de datos dinámicos (horarios, precios, disponibilidad). Las fichas se almacenan como archivos JSON locales y se sirven sin dependencia de LLM, RAG ni servicios externos. El alcance inicial cubre Punta Arenas, Puerto Williams y Cabo de Hornos.

## Glossary

- **Sistema_Fichas**: Módulo de aplicación que resuelve consultas de destino devolviendo la ficha local correspondiente.
- **Ficha_Destino**: Estructura de datos que representa un destino con hechos estables, advertencias dinámicas, fuentes y enlaces internos.
- **Repositorio_Fichas**: Puerto que abstrae el acceso a las fichas almacenadas en JSON local.
- **Validador_Esquema**: Componente que verifica la conformidad estructural de una ficha contra su esquema definido.
- **Datos_Estables**: Hechos geográficos, culturales e institucionales que no cambian con frecuencia (ubicación, comuna, región, contexto histórico).
- **Datos_Dinámicos**: Información sujeta a cambio frecuente (horarios, precios, disponibilidad, estado de operadores) que la ficha NO contiene como valor concreto sino como advertencia.
- **Fuente**: Referencia bibliográfica o institucional con título, editor, URL, fecha de verificación y estado.
- **Enlace_Interno**: Ruta relativa dentro del sitio End of the World Travel que complementa la respuesta.

## Requirements

### Requirement 1: Recuperar ficha de destino por identificador

**User Story:** Como viajero, quiero obtener la ficha informativa de un destino específico, para acceder a contexto geográfico y cultural verificado.

#### Acceptance Criteria

1. WHEN el usuario consulta por un identificador de destino que corresponde a una entrada existente en el Repositorio_Fichas, THE Sistema_Fichas SHALL devolver la Ficha_Destino correspondiente con estado "supported" y los campos definidos en el contrato de respuesta.
2. IF el identificador de destino proporcionado no corresponde a ninguna entrada en el Repositorio_Fichas, THEN THE Sistema_Fichas SHALL devolver una respuesta con estado "unsupported", intención "destination-info" y un resumen indicando que el destino no está disponible.
3. IF el identificador de destino proporcionado es vacío, nulo o contiene solo espacios en blanco, THEN THE Sistema_Fichas SHALL devolver una respuesta con estado "unsupported" y un resumen indicando que el identificador es inválido.
4. THE Sistema_Fichas SHALL normalizar el identificador de destino mediante conversión a minúsculas y eliminación de diacríticos (tilde, diéresis, acento) antes de buscar en el Repositorio_Fichas, de modo que "Puerto Williams", "puerto williams" y "puerto wílliams" resuelvan a la misma ficha.
5. THE Sistema_Fichas SHALL NO modificar el comportamiento existente del caso de uso de conectividad Santiago → Puerto Williams; las consultas con intención "connectivity" seguirán siendo procesadas por el flujo de conectividad sin intervención del módulo de fichas.

### Requirement 2: Estructura y contenido de la ficha de destino

**User Story:** Como viajero, quiero que cada ficha contenga información estructurada y verificable, para distinguir hechos confirmados de datos que requieren verificación adicional.

#### Acceptance Criteria

1. THE Ficha_Destino SHALL contener los campos obligatorios: identificador, nombre oficial, región, comuna, coordenadas geográficas en formato decimal (latitud entre -90 y 90, longitud entre -180 y 180), resumen descriptivo de entre 50 y 300 caracteres, datos estables, advertencias dinámicas, fuentes y enlaces internos sugeridos.
2. THE Ficha_Destino SHALL incluir al menos una Fuente con título, editor, URL y fecha de verificación.
3. THE Ficha_Destino SHALL incluir un campo "verifiedAt" con la fecha de última verificación del contenido en formato ISO 8601 (YYYY-MM-DD).
4. THE Ficha_Destino SHALL separar los Datos_Estables de los Datos_Dinámicos en campos distintos, donde Datos_Estables contiene al menos los subcampos de contexto geográfico y contexto cultural, y los Datos_Dinámicos se expresan exclusivamente como elementos del arreglo de advertencias.
5. WHEN la ficha contiene información que puede variar por temporada, clima, estado de operadores o regulación gubernamental, THE Ficha_Destino SHALL expresar esa información como advertencia textual de máximo 500 caracteres, sin incluir valores concretos de precio, horario o disponibilidad.
6. IF un campo obligatorio de la Ficha_Destino está ausente o vacío, THEN THE Ficha_Destino SHALL ser considerada inválida y no será servida por el Sistema_Fichas.

### Requirement 3: Almacenamiento en JSON local

**User Story:** Como desarrollador, quiero que las fichas se almacenen como archivos JSON locales versionados, para mantener el sistema simple y sin dependencias externas en esta fase.

#### Acceptance Criteria

1. THE Repositorio_Fichas SHALL leer las fichas desde archivos JSON ubicados en el directorio `data/destinations/`, donde cada archivo se nombra con el identificador del destino en kebab-case y extensión `.json` (ejemplo: `puerto-williams.json`).
2. THE Repositorio_Fichas SHALL exponer una interfaz (puerto) que permita reemplazar la implementación de almacenamiento sin modificar la lógica de dominio.
3. WHEN se agrega una nueva ficha JSON al directorio, THE Repositorio_Fichas SHALL servirla tras reiniciar la aplicación sin modificar código fuente, cargando todos los archivos `.json` del directorio al inicio.
4. THE Sistema_Fichas SHALL funcionar sin conexión a red, LLM, RAG ni base de datos vectorial.
5. IF un archivo JSON del directorio `data/destinations/` no puede ser leído por error de entrada/salida, THEN THE Repositorio_Fichas SHALL omitir esa ficha del conjunto disponible y registrar un error indicando el nombre del archivo afectado.
6. IF el directorio `data/destinations/` no existe o no contiene archivos `.json`, THEN THE Repositorio_Fichas SHALL iniciar con un conjunto vacío de fichas y registrar una advertencia indicando la ausencia de datos.

### Requirement 4: Validación de esquema en frontera

**User Story:** Como desarrollador, quiero que los archivos JSON de fichas se validen contra un esquema definido, para detectar errores de estructura antes de que lleguen a la lógica de dominio.

#### Acceptance Criteria

1. WHEN el Repositorio_Fichas carga un archivo JSON, THE Validador_Esquema SHALL verificar que la estructura cumple con el esquema de Ficha_Destino, incluyendo presencia y tipo de dato correcto para todos los campos obligatorios definidos en el Requirement 2.
2. IF un archivo JSON no cumple el esquema, THEN THE Validador_Esquema SHALL reportar un error que incluya la ruta del campo afectado (e.g., "sources[0].url") y el tipo de violación (campo faltante, tipo incorrecto o valor fuera de rango), y el Repositorio_Fichas SHALL excluir ese archivo del conjunto de fichas disponibles para consulta.
3. THE Validador_Esquema SHALL verificar que el campo "verifiedAt" contiene una fecha válida en formato ISO 8601 (YYYY-MM-DD) y que dicha fecha no sea posterior a la fecha actual del sistema.
4. THE Validador_Esquema SHALL verificar que el arreglo de fuentes contiene al menos un elemento y que cada elemento incluye los campos obligatorios: título, editor, URL y fecha de verificación en formato ISO 8601.
5. WHEN un archivo JSON cumple la validación de esquema, THE Repositorio_Fichas SHALL incorporar la ficha al conjunto de destinos disponibles para consulta por el Sistema_Fichas.

### Requirement 5: Contrato de respuesta consistente

**User Story:** Como consumidor de la API, quiero que la respuesta de fichas de destino siga el mismo contrato general que las respuestas de conectividad, para mantener una interfaz uniforme.

#### Acceptance Criteria

1. THE Sistema_Fichas SHALL devolver respuestas que incluyan los campos del contrato general: status, intent, summary, confidence, warnings (arreglo), sources (arreglo), verifiedAt y suggestedInternalLinks (arreglo).
2. THE Sistema_Fichas SHALL usar el valor de intención "destination-info" en el campo intent para distinguir las respuestas de ficha de las respuestas de conectividad.
3. IF todas las fuentes de la ficha tienen estado "verified", THEN THE Sistema_Fichas SHALL asignar el campo confidence con valor "high".
4. IF al menos una fuente de la ficha tiene estado "provisional", THEN THE Sistema_Fichas SHALL asignar el campo confidence con valor "medium" e incluir una advertencia en el arreglo warnings indicando que la información requiere confirmación con fuente primaria.
5. WHEN el Sistema_Fichas devuelve una respuesta con estado "unsupported", THE Sistema_Fichas SHALL mantener la misma estructura de contrato con los campos warnings, sources y suggestedInternalLinks como arreglos vacíos, confidence con valor "none" y verifiedAt ausente.

### Requirement 6: Fuentes y trazabilidad

**User Story:** Como viajero, quiero ver las fuentes de la información presentada, para evaluar su confiabilidad y vigencia.

#### Acceptance Criteria

1. THE Ficha_Destino SHALL incluir para cada fuente: título (máximo 200 caracteres), editor, URL y fecha de verificación en formato ISO 8601 (YYYY-MM-DD).
2. THE Ficha_Destino SHALL incluir al menos una fuente de origen institucional chileno, académico o de operador primario como primera entrada del arreglo de fuentes.
3. WHEN la fecha de verificación de una fuente supera los 180 días desde la fecha actual, THE Sistema_Fichas SHALL incluir en el arreglo de advertencias un mensaje indicando el título de la fuente desactualizada y la fecha de su última verificación.
4. THE Sistema_Fichas SHALL exponer la fecha de verificación general de la ficha en el campo "verifiedAt" de la respuesta en formato ISO 8601 (YYYY-MM-DD).
5. IF una fuente tiene el campo URL vacío o ausente, THEN THE Validador_Esquema SHALL reportar un error de validación indicando el campo faltante en la fuente afectada.

### Requirement 7: Enlaces internos sugeridos

**User Story:** Como viajero, quiero recibir enlaces a contenido relacionado dentro del sitio, para profundizar mi investigación sin salir de la plataforma.

#### Acceptance Criteria

1. THE Ficha_Destino SHALL incluir un arreglo de enlaces internos sugeridos, donde cada enlace contiene una ruta relativa dentro del sitio End of the World Travel y una etiqueta descriptiva del contenido enlazado, con un máximo de 10 enlaces por ficha.
2. WHEN el destino consultado pertenece a la misma región que otros destinos registrados en el Repositorio_Fichas, THE Sistema_Fichas SHALL incluir enlaces a esas fichas relacionadas.
3. THE Sistema_Fichas SHALL incluir al menos un enlace interno por ficha de destino, pudiendo referenciar fichas de otros destinos o rutas de conectividad disponibles en el sistema.
4. IF un enlace interno referencia una ruta o destino que no existe en el Repositorio_Fichas ni en el repositorio de rutas, THEN THE Sistema_Fichas SHALL omitir ese enlace de la respuesta.

### Requirement 8: Alcance inicial de destinos

**User Story:** Como equipo de producto, queremos definir el alcance mínimo de destinos para la primera entrega, para validar la arquitectura con casos reales.

#### Acceptance Criteria

1. THE Repositorio_Fichas SHALL contener fichas válidas según esquema para los destinos: Punta Arenas, Puerto Williams y Cabo de Hornos, siendo cada una recuperable por su identificador normalizado.
2. THE Ficha_Destino de Puerto Williams SHALL incluir en sus Datos_Estables la ubicación geográfica en Isla Navarino, la comuna Cabo de Hornos y la Región de Magallanes y de la Antártica Chilena.
3. THE Ficha_Destino de Cabo de Hornos SHALL representar la comuna como entidad principal e incluir en sus Datos_Estables una nota de desambiguación que identifique explícitamente las tres acepciones del nombre: la isla, el cabo geográfico y la comuna administrativa.
4. THE Ficha_Destino de Punta Arenas SHALL incluir en sus enlaces internos sugeridos referencias a las fichas de Puerto Williams y Cabo de Hornos, reflejando su función como punto de conexión hacia destinos australes.
5. WHEN el Sistema_Fichas recibe una consulta por "Cabo de Hornos" sin calificador, THE Sistema_Fichas SHALL devolver la ficha de la comuna, incluyendo en el resumen una mención a la isla y al cabo geográfico como entidades relacionadas.

### Requirement 9: Tests unitarios de comportamiento de dominio

**User Story:** Como desarrollador, quiero tests que verifiquen el comportamiento de las fichas de destino, para asegurar que los cambios futuros no rompan la funcionalidad.

#### Acceptance Criteria

1. THE test suite SHALL incluir un test por cada destino del alcance inicial (Punta Arenas, Puerto Williams, Cabo de Hornos) que verifique que el Sistema_Fichas devuelve una respuesta con estado "supported" y una Ficha_Destino con todos los campos requeridos por el Requirement 2 poblados.
2. THE test suite SHALL incluir al menos un test que verifique que al consultar un identificador no registrado, el Sistema_Fichas devuelve una respuesta con estado "unsupported" y un mensaje indicando que el destino no está disponible.
3. THE test suite SHALL incluir al menos 3 variantes de identificador para un mismo destino, cubriendo cambio de mayúsculas (ej. "PUERTO WILLIAMS"), minúsculas (ej. "puerto williams") y ausencia de acentos (ej. "cabo de hornos" vs "Cabo de Hornos"), verificando que todas resuelven a la misma Ficha_Destino.
4. THE test suite SHALL incluir al menos 2 casos de validación de esquema: un archivo JSON con campo requerido faltante y un archivo JSON con formato inválido en el campo "verifiedAt", verificando que el Validador_Esquema reporta un error descriptivo en cada caso.
5. THE test suite SHALL ejecutarse sin conexión a red ni servicios externos, utilizando únicamente archivos JSON locales y sin invocar LLM, RAG ni bases de datos vectoriales.
6. THE test suite SHALL coexistir con los tests existentes del caso de uso de conectividad de modo que ambos conjuntos pasen exitosamente en la misma ejecución de `vitest run` sin requerir modificaciones a los tests existentes.
