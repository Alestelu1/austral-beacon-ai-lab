# Project Scope

## Nombre provisional

**Austral Knowledge Assistant**

## Problema

Austral Beacon Media reúne PDFs, estudios, mapas, sitios institucionales y documentos sobre Patagonia, Magallanes, Tierra del Fuego y la Antártica. Consultar manualmente ese material consume tiempo y dificulta mantener trazabilidad entre una respuesta y su fuente original.

## Propuesta de valor

Un asistente documental que permita hacer preguntas sobre un corpus pequeño y confiable, recupere evidencia relevante y genere respuestas fundamentadas sin inventar datos geográficos o institucionales.

## Usuario principal

Alexis Stelu, como desarrollador y editor de Austral Beacon Media.

## Prioridades

### P0 — obligatorias

1. Cargar un conjunto pequeño de documentos.
2. Normalizar metadatos y conservar procedencia.
3. Crear fragmentos adecuados para recuperación.
4. Generar embeddings.
5. Recuperar los fragmentos más relevantes.
6. Responder usando exclusivamente el contexto recuperado.
7. Mostrar las fuentes utilizadas.
8. Documentar instalación, arquitectura y límites.

### P1 — deseables

1. Interfaz web mínima.
2. Filtros por territorio, tipo de documento o proyecto.
3. Indicador de confianza o necesidad de revisión humana.
4. Registro básico de consultas.
5. Evaluación con preguntas de prueba.

### P2 — posteriores al Challenge

1. Ingesta automática desde GitHub o Drive.
2. Agentes editoriales.
3. Knowledge Graph.
4. Actualización continua de fuentes.
5. Integración con Atlas, Travel, Antarctic Pulse y Austral Dispatch.

## Restricciones

- El proyecto no dependerá de OCI mientras la cuenta de Oracle siga bloqueada.
- Se priorizarán alternativas con capa gratuita o ejecución local.
- El corpus inicial debe ser pequeño para garantizar una entrega funcional.
- Cada respuesta deberá conservar trazabilidad documental.
- Los proyectos de Alura y CódigoFacilito permanecerán separados.

## Criterios de éxito

- El sistema responde preguntas del corpus sin depender de memoria general del modelo.
- Cada respuesta incluye referencias identificables.
- Las respuestas inciertas se marcan para revisión.
- El repositorio muestra una evolución clara mediante commits.
