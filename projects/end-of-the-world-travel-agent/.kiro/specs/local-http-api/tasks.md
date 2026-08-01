# Implementation Plan: Local HTTP API

## Overview

Implementación incremental de una API HTTP local mínima usando `node:http`. Expone `GET /health` y `POST /api/answer`, reutilizando `answerTravelQuestion` como única fuente de lógica. Sin frameworks, sin dependencias nuevas, con pruebas automatizadas usando puerto efímero.

## Tasks

- [x] 1. Crear infraestructura básica de respuestas HTTP JSON
  - [x] 1.1 Crear `src/api/app.ts` con helpers de respuesta
    - Crear archivo `src/api/app.ts`
    - Exportar función `createApp(): http.Server`
    - Implementar helper interno `sendJson(res, status, body)` que serializa el cuerpo, establece `Content-Type: application/json; charset=utf-8` y termina la respuesta
    - Implementar helper interno `sendError(res, status, code, message)` que usa `sendJson` con la estructura `{ error: { code, message } }`
    - El servidor creado por `createApp()` NO inicia escucha (`listen` no se llama)
    - Implementar un handler de solicitudes mínimo que responda 404 para cualquier ruta (placeholder para siguientes tareas)
    - _Requirements: 1.1, 1.2, 1.4, 2.2, 5.1_

- [x] 2. Implementar GET /health
  - [x] 2.1 Agregar handler de `/health` en `src/api/app.ts`
    - Enrutar `GET /health` al handler de salud
    - Responder HTTP 200 con `{"status": "ok", "service": "end-of-the-world-travel-agent"}`
    - Responder HTTP 405 con `Allow: GET` si el método no es GET
    - _Requirements: 2.1, 2.2, 5.2_

  - [x] 2.2 Agregar test de GET /health en `tests/api.test.ts`
    - Crear archivo `tests/api.test.ts`
    - Iniciar servidor con `listen(0)`, obtener puerto asignado
    - Test: GET /health → 200, body contiene status "ok" y service correcto
    - Test: POST /health → 405, body contiene error code METHOD_NOT_ALLOWED, header Allow: GET
    - Cerrar servidor en afterAll
    - _Requirements: 7.1, 7.8_

- [x] 3. Implementar lectura limitada del cuerpo
  - [x] 3.1 Implementar función `readBody` en `src/api/app.ts`
    - Función interna `readBody(req, maxBytes): Promise<string>`
    - Acumular chunks hasta maxBytes (16384 = 16 KB)
    - Si se excede el límite: destruir stream, rechazar con error identificable
    - Retornar el cuerpo como string UTF-8
    - _Requirements: 4.4, 6.1_

  - [x] 3.2 Agregar test de cuerpo demasiado grande y JSON malformado
    - Test: POST /api/answer con cuerpo > 16 KB → 413 PAYLOAD_TOO_LARGE
    - Test: POST /api/answer con texto no-JSON → 400 INVALID_JSON
    - _Requirements: 7.6_

- [x] 4. Implementar validación de question
  - [x] 4.1 Implementar validación del campo question en `src/api/app.ts`
    - Parsear JSON del cuerpo
    - Verificar que `question` existe en el objeto
    - Verificar que `question` es de tipo string
    - Verificar que `question.trim()` no es vacío
    - Responder 400 INVALID_REQUEST con mensajes descriptivos para cada caso
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 4.2 Agregar tests de validación de question
    - Test: POST /api/answer con `{}` → 400, code INVALID_REQUEST, message contiene "question"
    - Test: POST /api/answer con `{"question": 123}` → 400, code INVALID_REQUEST
    - Test: POST /api/answer con `{"question": "   "}` → 400, code INVALID_REQUEST
    - _Requirements: 7.5_

- [x] 5. Implementar POST /api/answer
  - [x] 5.1 Conectar handler de `/api/answer` con `answerTravelQuestion`
    - Enrutar `POST /api/answer` al handler de respuesta
    - Importar `answerTravelQuestion` desde `../application/answerTravelQuestion.js`
    - Después de validar question: invocar `answerTravelQuestion(question)`
    - Responder HTTP 200 con el objeto resultado serializado directamente como JSON
    - Responder HTTP 405 con `Allow: POST` si el método no es POST
    - No usar `formatAnswer` — la respuesta es el objeto estructurado
    - No importar repositorios internos ni duplicar lógica de dominio
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2_

  - [x] 5.2 Agregar tests de POST /api/answer
    - Test: POST con pregunta de conectividad → 200, intent "connectivity", stages presente
    - Test: POST con pregunta de información de destino → 200, intent "destination-info", card presente
    - Test: POST con pregunta no soportada → 200, status "unsupported"
    - Test: GET /api/answer → 405, Allow: POST
    - _Requirements: 7.2, 7.3, 7.4, 7.8_

- [x] 6. Implementar manejo de rutas y métodos no existentes
  - [x] 6.1 Completar enrutamiento para rutas no registradas
    - Verificar que cualquier URL distinta de `/health` y `/api/answer` responde 404 NOT_FOUND
    - Verificar que los handlers existentes ya responden 405 para métodos incorrectos
    - _Requirements: 5.1, 5.2_

  - [x] 6.2 Agregar test de ruta inexistente
    - Test: GET /unknown → 404, code NOT_FOUND
    - _Requirements: 7.7_

- [x] 7. Implementar manejo de errores inesperados
  - [x] 7.1 Agregar try/catch global al handler de solicitudes
    - Envolver el handler principal en try/catch
    - En caso de error inesperado: responder 500 INTERNAL_ERROR
    - Registrar error con `console.error` para diagnóstico
    - No exponer stack, rutas internas ni detalles al cliente
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. Crear src/api/server.ts
  - [x] 8.1 Crear archivo de arranque `src/api/server.ts`
    - Importar `createApp` de `./app.js`
    - Leer puerto de `process.env["PORT"]` con fallback a 3000
    - Crear servidor con `createApp()`
    - Iniciar escucha con `server.listen(port)`
    - Mostrar mensaje `[API] Listening on http://localhost:${port}`
    - No contener lógica de rutas ni validación
    - _Requirements: 1.3, 1.4_

- [x] 9. Agregar script npm
  - [x] 9.1 Agregar `"api": "tsx src/api/server.ts"` a scripts en `package.json`
    - No modificar scripts existentes (dev, demo, test, typecheck)
    - _Requirements: 8.1, 8.2_

- [x] 10. Completar y verificar tests/api.test.ts
  - [x] 10.1 Verificar cobertura completa de tests
    - Confirmar que todos los tests de las tareas anteriores están en `tests/api.test.ts`
    - Verificar que el servidor se cierra correctamente en afterAll sin handles abiertos
    - Verificar que los tests no dependen de orden de ejecución
    - _Requirements: 7.9, 7.10_

- [x] 11. Checkpoint de calidad
  - Ejecutar `npm run typecheck` y verificar sin errores.
  - Ejecutar `npm test` y verificar que todas las pruebas existentes y nuevas pasen.
  - No corregir problemas no relacionados con esta spec.

- [x] 12. Prueba manual de la API
  - Ejecutar `npm run api`.
  - Verificar manualmente:
    - GET `/health` → 200 con JSON de estado
    - POST `/api/answer` con pregunta de conectividad → 200 con etapas
    - POST `/api/answer` con pregunta de destino → 200 con ficha
    - POST `/api/answer` con entrada inválida → 400
    - Ruta inexistente → 404
  - Detener correctamente el servidor

## Notes

- No se agrega Express, Fastify ni dependencias nuevas
- Solo `node:http` para el servidor
- `createApp()` exporta el servidor sin escucha para testabilidad
- Tests usan puerto efímero (0) y `fetch` global de Node 18+
- No se modifica lógica de dominio, fichas JSON, CLI ni specs anteriores
- No se usa `formatAnswer` — la API devuelve objetos JSON estructurados directamente

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2"] },
    { "id": 5, "tasks": ["6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["8.1", "9.1"] },
    { "id": 8, "tasks": ["10.1"] },
    { "id": 9, "tasks": ["11"] },
    { "id": 10, "tasks": ["12"] }
  ]
}
```
