# Roadmap inicial

## Fase 1 — Fundación

- Crear historial de trabajo en GitHub.
- Definir alcance y criterios de éxito.
- Revisar la documentación central de Austral Beacon AI Lab.
- Seleccionar entre 2 y 5 documentos para el corpus inicial.
- Definir un esquema común de metadatos.

## Fase 2 — Ingesta documental

- Extraer texto de los documentos seleccionados.
- Limpiar encabezados, pies de página y ruido.
- Conservar título, institución, fecha, territorio, URL y licencia cuando corresponda.
- Generar archivos normalizados para procesamiento.

## Fase 3 — RAG mínimo

- Dividir los documentos en fragmentos.
- Generar embeddings.
- Crear un índice vectorial.
- Implementar recuperación semántica.
- Crear una cadena de respuesta restringida al contexto recuperado.

## Fase 4 — Validación

- Preparar preguntas de evaluación.
- Verificar precisión geográfica y documental.
- Confirmar que las fuentes mostradas correspondan a los fragmentos usados.
- Registrar errores, alucinaciones y mejoras.

## Fase 5 — Demostración

- Añadir una interfaz mínima.
- Preparar instrucciones reproducibles.
- Documentar arquitectura, decisiones y limitaciones.
- Grabar o preparar una demostración del flujo completo.

## Decisiones pendientes

- Lenguaje y framework definitivo.
- Proveedor de embeddings y modelo generativo.
- Base vectorial local o administrada.
- Plataforma de despliegue compatible con la capa gratuita.
- Corpus documental inicial.

## Orden inmediato

1. Elegir el corpus inicial.
2. Definir `metadata-schema.json`.
3. Crear el primer script de ingesta.
4. Añadir pruebas pequeñas antes de integrar la interfaz.
