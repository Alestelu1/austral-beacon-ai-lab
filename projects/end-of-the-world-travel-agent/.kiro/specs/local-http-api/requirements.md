# Requirements Document

## Introduction

Este feature expone End of the World Travel Agent mediante una API HTTP local mínima. El servidor se implementa usando exclusivamente módulos estándar de Node.js (`node:http`), sin frameworks ni dependencias nuevas. La API devuelve respuestas JSON estructuradas reutilizando `answerTravelQuestion` como única fuente de lógica. No se introduce LLM, RAG, frontend, autenticación ni base de datos.

## Glossary

- **API_Server**: Servidor HTTP local creado con `node:http` que expone los endpoints del agente.
- **Handler_Answer**: Función que procesa solicitudes POST `/api/answer`, valida la entrada y delega a `answerTravelQuestion`.
- **Handler_Health**: Función que responde GET `/health` con el estado del servicio.
- **Request_Body**: Objeto JSON con la estructura `{ "question": string }` enviado por el cliente.

## Requirements

### Requirement 1: Servidor HTTP con módulos estándar

**User Story:** Como desarrollador, quiero un servidor HTTP mínimo para consumir el agente programáticamente sin instalar frameworks.

#### Acceptance Criteria

1. THE API_Server SHALL crearse usando exclusivamente el módulo `node:http` de Node.js.
2. THE API_Server SHALL NO agregar Express, Fastify, Hono ni ninguna dependencia HTTP nueva al `package.json`.
3. THE API_Server SHALL escuchar en un puerto configurable mediante variable de entorno `PORT`, con valor por defecto `3000`.
4. THE API_Server SHALL exportar la función de creación del servidor por separado de la función que inicia la escucha, permitiendo instanciar el servidor para pruebas sin abrir un puerto real.

### Requirement 2: Endpoint de salud

**User Story:** Como operador, quiero verificar que el servidor está activo con una solicitud simple.

#### Acceptance Criteria

1. WHEN el cliente envía una solicitud GET a `/health`, THE API_Server SHALL responder con HTTP 200 y un cuerpo JSON: `{"status": "ok", "service": "end-of-the-world-travel-agent"}`.
2. THE respuesta de `/health` SHALL incluir el encabezado `Content-Type: application/json; charset=utf-8`.

### Requirement 3: Endpoint de respuesta a preguntas

**User Story:** Como consumidor de la API, quiero enviar una pregunta y recibir la respuesta estructurada del agente.

#### Acceptance Criteria

1. WHEN el cliente envía una solicitud POST a `/api/answer` con un cuerpo JSON válido `{"question": "texto"}`, THE API_Server SHALL invocar `answerTravelQuestion(question)` y responder con HTTP 200 y el objeto `TravelAnswer | DestinationCardAnswer` serializado como JSON.
2. THE respuesta SHALL incluir el encabezado `Content-Type: application/json; charset=utf-8`.
3. THE API_Server SHALL reutilizar exclusivamente `answerTravelQuestion` desde el punto de entrada público del proyecto, sin duplicar detección de intención ni acceso al repositorio.
4. THE API_Server SHALL NO usar `formatAnswer` en el endpoint; la respuesta es el objeto JSON estructurado, no texto de consola.

### Requirement 4: Validación de entrada

**User Story:** Como consumidor de la API, quiero recibir errores claros cuando envío solicitudes inválidas.

#### Acceptance Criteria

1. IF el cuerpo de la solicitud POST a `/api/answer` no contiene un campo `question`, THEN THE API_Server SHALL responder con HTTP 400 y un cuerpo JSON: `{"error": "Field \"question\" is required"}`.
2. IF el campo `question` no es de tipo string, THEN THE API_Server SHALL responder con HTTP 400 y un cuerpo JSON: `{"error": "Field \"question\" must be a non-empty string"}`.
3. IF el campo `question` es un string vacío o compuesto solo de espacios, THEN THE API_Server SHALL responder con HTTP 400 y un cuerpo JSON: `{"error": "Field \"question\" must be a non-empty string"}`.
4. IF el cuerpo de la solicitud no es JSON válido, THEN THE API_Server SHALL responder con HTTP 400 y un cuerpo JSON: `{"error": "Invalid JSON body"}`.

### Requirement 5: Manejo de rutas y métodos no soportados

**User Story:** Como consumidor de la API, quiero respuestas consistentes cuando accedo a rutas o métodos incorrectos.

#### Acceptance Criteria

1. IF el cliente solicita una ruta que no existe (distinta de `/health` y `/api/answer`), THEN THE API_Server SHALL responder con HTTP 404 y un cuerpo JSON: `{"error": "Not found"}`.
2. IF el cliente usa un método HTTP no permitido en un endpoint existente (ej. POST a `/health` o GET a `/api/answer`), THEN THE API_Server SHALL responder con HTTP 405 y un cuerpo JSON: `{"error": "Method not allowed"}`.

### Requirement 6: Manejo de errores internos

**User Story:** Como operador, quiero que los errores internos no expongan detalles de implementación al cliente.

#### Acceptance Criteria

1. IF ocurre un error inesperado durante el procesamiento de una solicitud, THEN THE API_Server SHALL responder con HTTP 500 y un cuerpo JSON: `{"error": "Internal server error"}`.
2. THE API_Server SHALL NO incluir stack traces, rutas de archivos ni mensajes internos en la respuesta de error.
3. THE API_Server SHALL registrar el error en `console.error` para diagnóstico del operador.

### Requirement 7: Pruebas automatizadas

**User Story:** Como desarrollador, quiero tests que verifiquen todos los comportamientos del API sin depender de un servidor externo.

#### Acceptance Criteria

1. THE test suite SHALL incluir un test que verifique que GET `/health` responde HTTP 200 con `{"status": "ok", "service": "end-of-the-world-travel-agent"}`.
2. THE test suite SHALL incluir un test que verifique que POST `/api/answer` con `{"question": "¿Cómo llegar desde Santiago a Puerto Williams?"}` responde HTTP 200 con intent "connectivity".
3. THE test suite SHALL incluir un test que verifique que POST `/api/answer` con `{"question": "¿Qué es Puerto Williams?"}` responde HTTP 200 con intent "destination-info".
4. THE test suite SHALL incluir un test que verifique que POST `/api/answer` con una pregunta no soportada responde HTTP 200 con status "unsupported".
5. THE test suite SHALL incluir un test que verifique que POST `/api/answer` sin campo `question` responde HTTP 400.
6. THE test suite SHALL incluir un test que verifique que POST `/api/answer` con JSON malformado responde HTTP 400.
7. THE test suite SHALL incluir un test que verifique que GET a una ruta inexistente responde HTTP 404.
8. THE test suite SHALL incluir un test que verifique que GET `/api/answer` responde HTTP 405.
9. THE test suite SHALL usar el servidor instanciado sin abrir un puerto real (request injection o servidor en puerto efímero cerrado después del test).
10. THE test suite SHALL ejecutarse sin red externa, LLM, RAG ni servicios externos, coexistiendo con los tests existentes en `vitest run`.

### Requirement 8: Script npm

**User Story:** Como desarrollador, quiero iniciar el servidor con un comando simple.

#### Acceptance Criteria

1. THE proyecto SHALL incluir un script npm `"api": "tsx src/api/server.ts"` que inicie el servidor en el puerto configurado.
2. THE script SHALL NO modificar los scripts existentes (`dev`, `demo`, `test`, `typecheck`).

### Requirement 9: Restricciones técnicas

**User Story:** Como equipo técnico, queremos mantener el sistema simple y enfocado.

#### Acceptance Criteria

1. THE API_Server SHALL funcionar sin LLM, RAG, bases de datos vectoriales, AWS ni APIs externas.
2. THE API_Server SHALL NO agregar dependencias nuevas al `package.json`.
3. THE API_Server SHALL NO modificar el contenido de las fichas JSON en `data/destinations/` ni `data/routes/`.
4. THE API_Server SHALL NO agregar frontend, interfaz web, autenticación ni CORS.
5. THE API_Server SHALL NO modificar la lógica de dominio, los adaptadores ni las specs anteriormente completadas.
