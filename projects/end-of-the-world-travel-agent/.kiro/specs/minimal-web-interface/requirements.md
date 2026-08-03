# Requirements Document

## Introduction

Este feature agrega una interfaz web mínima, responsive y accesible para End of the World Travel Agent. La interfaz consume exclusivamente la API HTTP local ya existente (`POST /api/answer`) y presenta las respuestas estructuradas del agente de forma legible en el navegador. No se introduce React, Vue, Angular ni frameworks CSS. Se mantiene la identidad documental y sobria del proyecto.

## Glossary

- **Interfaz_Web**: Página HTML estática con CSS y JavaScript nativo que permite al usuario interactuar con el agente desde un navegador.
- **Formulario_Consulta**: Componente visual con un campo de texto y un botón que envía la pregunta a la API.
- **Renderizador_Respuesta**: Lógica JavaScript que interpreta el objeto JSON devuelto por la API y lo presenta visualmente según su tipo (connectivity, destination-info, unsupported).
- **Estado_Carga**: Indicación visual de que la consulta está siendo procesada por la API.

## Requirements

### Requirement 1: Estructura y contenido de la página

**User Story:** Como viajero, quiero abrir una página web con instrucciones claras para hacer preguntas sobre el sur austral de Chile.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL mostrar un encabezado con el texto "End of the World Travel Agent".
2. THE Interfaz_Web SHALL mostrar una breve explicación indicando que el agente responde consultas sobre destinos y conectividad del sur austral de Chile.
3. THE Interfaz_Web SHALL mostrar ejemplos de preguntas que el usuario puede formular, incluyendo al menos una pregunta de conectividad y una de información de destino.
4. THE Interfaz_Web SHALL incluir un formulario con un campo de texto etiquetado y un botón "Consultar".
5. THE Interfaz_Web SHALL usar HTML semántico con estructura lógica de encabezados, párrafos, listas y formulario.

### Requirement 2: Envío de consultas

**User Story:** Como viajero, quiero escribir una pregunta y enviarla al agente desde el navegador.

#### Acceptance Criteria

1. WHEN el usuario escribe una pregunta y presiona el botón "Consultar" o la tecla Enter, THE Interfaz_Web SHALL enviar una solicitud POST a `/api/answer` con el cuerpo JSON `{"question": "texto"}`.
2. IF el campo de texto está vacío o contiene solo espacios, THEN THE Interfaz_Web SHALL NO enviar la solicitud y SHALL mostrar un mensaje indicando que debe escribir una pregunta.
3. THE Interfaz_Web SHALL deshabilitar el botón y el campo de texto mientras la consulta está siendo procesada, para evitar envíos dobles.
4. THE Interfaz_Web SHALL restaurar el formulario a estado activo después de recibir la respuesta o un error.

### Requirement 3: Estado de carga

**User Story:** Como viajero, quiero saber que mi consulta está siendo procesada.

#### Acceptance Criteria

1. WHEN la solicitud es enviada a la API, THE Interfaz_Web SHALL mostrar un indicador de carga visible (texto o animación simple).
2. WHEN la respuesta o error es recibido, THE Interfaz_Web SHALL ocultar el indicador de carga.
3. THE indicador de carga SHALL ser anunciado a tecnologías asistivas mediante `aria-live` o rol equivalente.

### Requirement 4: Renderizado de respuestas de conectividad

**User Story:** Como viajero, quiero ver las rutas de conectividad presentadas de forma clara y estructurada.

#### Acceptance Criteria

1. WHEN la API devuelve una respuesta con intent "connectivity" y status "supported", THE Renderizador_Respuesta SHALL mostrar: resumen, etapas de ruta (origen, destino, modo y nota), advertencias, fuentes con fecha de verificación y fecha de verificación general.
2. THE Renderizador_Respuesta SHALL etiquetar visualmente cada sección (resumen, etapas, advertencias, fuentes).
3. THE Renderizador_Respuesta SHALL NO inventar ni complementar información más allá de lo devuelto por la API.

### Requirement 5: Renderizado de respuestas de información de destino

**User Story:** Como viajero, quiero ver la ficha de un destino presentada de forma completa y legible.

#### Acceptance Criteria

1. WHEN la API devuelve una respuesta con intent "destination-info" y status "supported", THE Renderizador_Respuesta SHALL mostrar: nombre del destino, resumen, contexto geográfico, contexto cultural, advertencias, fuentes (título, editor, URL y fecha de verificación), enlaces internos sugeridos, confianza y fecha de verificación.
2. THE Renderizador_Respuesta SHALL mostrar cada fuente como un elemento con su título, editor, URL clickeable y fecha.
3. THE Renderizador_Respuesta SHALL mostrar los enlaces internos sugeridos con su ruta y etiqueta.
4. THE Renderizador_Respuesta SHALL indicar visualmente el nivel de confianza (high, medium, none).

### Requirement 6: Renderizado de respuestas no soportadas

**User Story:** Como viajero, quiero recibir un mensaje claro cuando el agente no puede responder mi pregunta.

#### Acceptance Criteria

1. WHEN la API devuelve una respuesta con status "unsupported" e intent "destination-info", THE Renderizador_Respuesta SHALL mostrar un mensaje indicando que el destino no está disponible.
2. WHEN la API devuelve una respuesta con status "unsupported" e intent "unknown", THE Renderizador_Respuesta SHALL mostrar un mensaje indicando que la consulta no fue reconocida.
3. THE Renderizador_Respuesta SHALL NO inventar sugerencias ni datos alternativos cuando la respuesta es unsupported.

### Requirement 7: Manejo de errores HTTP y de red

**User Story:** Como viajero, quiero saber cuando hay un problema técnico que impide obtener una respuesta.

#### Acceptance Criteria

1. IF la solicitud a la API falla por error de red (servidor no disponible, timeout, conexión rechazada), THEN THE Interfaz_Web SHALL mostrar un mensaje indicando que no se pudo contactar al servidor.
2. IF la API responde con HTTP 400, THEN THE Interfaz_Web SHALL mostrar el mensaje de error devuelto por la API.
3. IF la API responde con HTTP 500, THEN THE Interfaz_Web SHALL mostrar un mensaje indicando un error interno del servidor.
4. THE Interfaz_Web SHALL NO mostrar stack traces, rutas internas ni detalles técnicos al usuario.

### Requirement 8: Diseño responsive y mobile-first

**User Story:** Como viajero, quiero usar la interfaz desde mi teléfono con la misma facilidad que desde un computador.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL usar un diseño mobile-first que sea legible y funcional desde 320px de ancho.
2. THE Interfaz_Web SHALL adaptar el layout para pantallas más amplias (≥768px) sin romper la funcionalidad.
3. THE Interfaz_Web SHALL usar un tamaño de fuente base legible y suficiente contraste según WCAG 2.1 AA (ratio mínimo 4.5:1 para texto normal).
4. THE Interfaz_Web SHALL mantener un tono visual documental y sobrio, coherente con la identidad de End of the World Travel.

### Requirement 9: Accesibilidad básica

**User Story:** Como usuario con necesidades de accesibilidad, quiero poder usar la interfaz con teclado y tecnologías asistivas.

#### Acceptance Criteria

1. THE Formulario_Consulta SHALL incluir un `<label>` asociado correctamente al campo de texto.
2. THE Interfaz_Web SHALL mantener un orden de foco lógico y visible para navegación por teclado.
3. THE área de resultados SHALL usar `aria-live="polite"` para anunciar cambios a lectores de pantalla.
4. THE Interfaz_Web SHALL ser navegable completamente con teclado (Tab, Enter, sin trampas de foco).
5. THE botón "Consultar" SHALL indicar su estado deshabilitado mediante `aria-disabled` o atributo `disabled`.

### Requirement 10: Restricciones técnicas

**User Story:** Como equipo técnico, queremos mantener la interfaz simple y sin dependencias pesadas.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL usar HTML, CSS y TypeScript o JavaScript nativo, sin React, Vue, Angular ni frameworks CSS.
2. THE Interfaz_Web SHALL consumir exclusivamente la API HTTP local existente (`POST /api/answer`); no duplicará `answerTravelQuestion` ni accederá directamente al repositorio.
3. THE Interfaz_Web SHALL NO agregar dependencias nuevas al `package.json` salvo que sean estrictamente necesarias para servir archivos estáticos o compilar TypeScript del cliente.
4. THE Interfaz_Web SHALL NO implementar autenticación, PWA, base de datos, LLM, RAG ni despliegue móvil en esta fase.
5. THE Interfaz_Web SHALL NO modificar fichas JSON, rutas de datos existentes ni lógica de dominio.
6. THE Interfaz_Web SHALL mantener separada la capa de presentación de la lógica del dominio y del servidor API.

### Requirement 12: Servicio de archivos estáticos desde el servidor existente

**User Story:** Como desarrollador, quiero que la interfaz web sea servida por el mismo servidor HTTP existente sin necesidad de un segundo proceso.

#### Acceptance Criteria

1. THE servidor HTTP existente SHALL servir la página principal HTML en `GET /`.
2. THE servidor HTTP existente SHALL servir la hoja de estilos en `GET /styles.css`.
3. THE servidor HTTP existente SHALL servir el JavaScript del cliente en `GET /app.js`.
4. THE rutas `POST /api/answer` y `GET /health` SHALL mantener su comportamiento actual sin modificaciones.
5. THE servicio de archivos estáticos SHALL NO duplicar ni modificar la lógica de `answerTravelQuestion`, las fichas JSON ni las respuestas de la API.
6. THE Interfaz_Web SHALL consumir `/api/answer` mediante una URL relativa y mismo origen; no se implementará CORS en esta fase ni se usará un segundo servidor.

### Requirement 13: Estrategia de pruebas sin navegador

**User Story:** Como desarrollador, quiero que las pruebas de presentación se ejecuten en Vitest sin navegador real ni dependencias pesadas de DOM.

#### Acceptance Criteria

1. THE test suite SHALL ejecutarse con Vitest sin necesidad de un navegador real.
2. THE test suite SHALL priorizar funciones puras y testeables para: construir la vista de connectivity, construir la vista de destination-info, construir la vista unsupported, interpretar errores HTTP y validar preguntas.
3. THE test suite SHALL NO agregar jsdom ni dependencias de entorno de navegador salvo que el diseño demuestre que son imprescindibles.
4. THE funciones de renderizado SHALL recibir datos y retornar strings HTML o estructuras intermedias, permitiendo verificación sin DOM.

### Requirement 11: Pruebas

**User Story:** Como desarrollador, quiero tests que verifiquen el comportamiento de la interfaz sin depender de un navegador real.

#### Acceptance Criteria

1. THE test suite SHALL verificar que el envío de una pregunta válida produce una solicitud POST correcta y renderiza la respuesta.
2. THE test suite SHALL verificar el estado de carga (indicador visible durante la solicitud).
3. THE test suite SHALL verificar el renderizado de una respuesta de connectivity.
4. THE test suite SHALL verificar el renderizado de una respuesta de destination-info.
5. THE test suite SHALL verificar el renderizado de una respuesta unsupported.
6. THE test suite SHALL verificar el manejo de errores HTTP y de red.
7. THE test suite SHALL verificar que el campo vacío no produce envío.
8. THE test suite SHALL coexistir con los tests existentes sin modificarlos, ejecutándose en `vitest run`.
