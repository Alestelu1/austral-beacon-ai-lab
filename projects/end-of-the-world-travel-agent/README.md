# End of the World Travel Agent

Esqueleto de un asistente turístico documental para el extremo austral de Chile, preparado para desarrollo guiado por especificaciones con Kiro.

## Propósito

Ayudar a visitantes a descubrir destinos, comprender conexiones y preparar viajes por Magallanes, Tierra del Fuego, Cabo de Hornos y gateways chilenos hacia la Antártica mediante información verificable.

## Alcance del MVP

1. Responder preguntas sobre destinos chilenos del extremo austral.
2. Explicar rutas y alternativas de conectividad.
3. Recomendar páginas internas y mostrar fuentes.
4. Reconocer cuando no existe evidencia suficiente.

## Fuera del MVP

- Reservas y pagos.
- Confirmación de disponibilidad.
- Precios en tiempo real.
- Recomendaciones sin fuentes.
- Sustitución de instrucciones oficiales o de seguridad.

## Estructura

```text
.kiro/steering/       Contexto persistente para Kiro
AGENTS.md             Reglas generales para agentes de código
docs/                 Visión, arquitectura y decisiones
src/                  Futuro código de aplicación
data/                  Datos de ejemplo, no fuente definitiva
tests/                 Pruebas futuras
```

## Flujo esperado

```text
Usuario → interfaz → agente → clasificación de intención → recuperación RAG → validación → respuesta con fuentes
```

## Inicio futuro con Kiro

1. Abrir esta carpeta como workspace.
2. Revisar `.kiro/steering/product.md`, `tech.md` y `structure.md`.
3. Crear una spec para el primer vertical: preguntas sobre Puerto Williams.
4. Aprobar requisitos, diseño y tareas antes de generar código.
5. Implementar una sola capacidad y agregar pruebas.

## Estado

Proyecto en fase de definición. No contiene todavía una aplicación ejecutable ni credenciales.