# Implementation Plan: Interactive CLI Demo

## Overview

Implementación de una demostración interactiva por terminal (REPL) que permite explorar el agente de viaje escribiendo preguntas en lenguaje natural. Se separa el formateador puro de la E/S de consola. Se reutiliza `answerTravelQuestion` sin duplicar lógica. Sin dependencias nuevas — solo `node:readline/promises`.

## Tasks

- [x] 1. Crear formateador puro
  - [x] 1.1 Crear `src/ui/formatAnswer.ts`
    - Exportar función `formatAnswer(answer: TravelAnswer | DestinationCardAnswer): string`
    - Implementar type guard `isDestinationCardAnswer` usando `"confidence" in answer`
    - Para connectivity/supported: mostrar encabezado "Conectividad", resumen, etapas (from → to | modo | nota), advertencias y fuentes con verifiedAt
    - Para destination-info/supported: mostrar encabezado con nombre del destino, resumen, contexto geográfico, contexto cultural, advertencias, fuentes (título, editor, URL, verifiedAt), enlaces internos (ruta + label), confidence y verifiedAt
    - Para destination-info/unsupported: mostrar mensaje indicando destino no disponible
    - Para unknown/unsupported: mostrar mensaje indicando consulta no reconocida
    - La función debe ser pura: sin acceso a stdout, readline ni efectos secundarios
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 5.3_

- [x] 2. Crear tests del formateador
  - [x] 2.1 Crear `tests/formatAnswer.test.ts`
    - Test: respuesta connectivity/supported con 2 etapas, advertencias y fuentes → salida contiene resumen, etapas, advertencias, fuentes
    - Test: respuesta destination-info/supported con card completa → salida contiene nombre, resumen, geographicContext, culturalContext, warnings, sources, links, confidence, verifiedAt
    - Test: respuesta destination-info/unsupported → salida contiene mensaje de destino no disponible
    - Test: respuesta unknown/unsupported → salida contiene mensaje de consulta no reconocida
    - Usar objetos de datos fijos inline (no leer archivos JSON)
    - Sin red, sin readline, sin interacción de usuario
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Checkpoint — Typecheck y tests
  - Ejecutar `npm run typecheck` y verificar que pasa sin errores.
  - Ejecutar `npm test` y verificar que todos los tests existentes + formatAnswer pasan.

- [x] 4. Crear REPL de consola
  - [x] 4.1 Crear `src/cli.ts`
    - Importar `createInterface` de `node:readline/promises`
    - Importar `answerTravelQuestion` de `./application/answerTravelQuestion.js`
    - Importar `formatAnswer` de `./ui/formatAnswer.js`
    - Definir constante `EXIT_COMMANDS = ["salir", "exit", "quit"]`
    - Mostrar mensaje de bienvenida al iniciar
    - Bucle infinito con `rl.question("▶ ")`
    - Si línea vacía o solo espacios: continuar sin procesar
    - Si línea normalizada está en EXIT_COMMANDS: mostrar despedida, cerrar readline, salir
    - Si es pregunta: llamar `answerTravelQuestion(trimmed)`, formatear con `formatAnswer`, imprimir
    - Capturar errores inesperados: mostrar "Error interno" y continuar bucle
    - Manejar EOF (Ctrl+D): terminar limpiamente
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 7.4, 7.5_

- [x] 5. Agregar script npm
  - [x] 5.1 Agregar `"demo": "tsx src/cli.ts"` a `scripts` en `package.json`
    - No modificar los scripts existentes ("dev", "test", "typecheck")
    - _Requirements: 7.2_

- [x] 6. Checkpoint — Typecheck final
  - Ejecutar `npm run typecheck` y verificar que pasa sin errores incluyendo `src/cli.ts`.

- [x] 7. Prueba manual de la CLI
  - Ejecutar `npm run demo` y verificar interactivamente:
    - "¿Cómo llegar desde Santiago a Puerto Williams?" → muestra etapas de conectividad
    - "¿Qué es Puerto Williams?" → muestra ficha de destino
    - "Información de Cabo de Hornos" → muestra ficha con desambiguación
    - "¿Qué es Ushuaia?" → muestra mensaje de destino no disponible
    - "¿Cuánto cuesta un café?" → muestra mensaje de consulta no reconocida
    - "salir" → termina el programa
  - Verificar que las respuestas no contienen datos inventados

## Notes

- No se agregan dependencias: solo `node:readline/promises` (estándar de Node.js)
- No se modifican fichas JSON, rutas, specs anteriores ni lógica de dominio
- El formateador se ubica en `src/ui/` según la estructura del proyecto
- `src/cli.ts` es independiente de `src/index.ts` — no altera el punto de entrada existente
- Los tests del formateador usan datos fijos inline, no dependen de los archivos de fixtures

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4.1", "5.1"] },
    { "id": 4, "tasks": ["6"] },
    { "id": 5, "tasks": ["7"] }
  ]
}
```
