# Requirements Document

## Introduction

Este feature transforma la interfaz web mínima de End of the World Travel Agent en una experiencia visual profesional, documental, moderna y responsive. Se aplica una estética cartográfica inspirada en la Patagonia, Tierra del Fuego, Cabo de Hornos y los accesos antárticos chilenos, evitando un aspecto turístico genérico. Se trabaja exclusivamente sobre `public/index.html` y `public/styles.css`, manteniendo la compatibilidad completa con `app.client.ts`, los IDs existentes, la semántica HTML y el diseño mobile-first. No se introducen frameworks CSS, imágenes externas ni dependencias nuevas.

## Glossary

- **Interfaz_Web**: Página HTML estática con CSS puro que presenta la experiencia visual completa del agente de viaje.
- **Header_Visual**: Bloque de encabezado con identidad de marca, nombre del producto y breve descriptor editorial.
- **Intro_Editorial**: Sección breve que presenta el contexto geográfico y el propósito del agente, centrada en destinos y conectividad del sur austral de Chile.
- **Ejemplo_Visual**: Elemento visual reutilizable que muestra una pregunta de ejemplo al usuario como punto de partida para la consulta.
- **Formulario_Consulta**: Componente principal de interacción compuesto por campo de texto, botón de envío y mensaje de validación; preserva los IDs `query-form`, `question-input`, `submit-btn` y `validation-msg`.
- **Tarjeta_Respuesta**: Contenedor visual que presenta la respuesta del agente con secciones diferenciadas según tipo (connectivity, destination, unsupported, error).
- **Estética_Cartográfica**: Lenguaje visual inspirado en cartografía documental, exploración austral y tonos naturales del extremo sur; evita clichés turísticos masivos.
- **CSS_Puro**: Hoja de estilos sin preprocesadores, frameworks ni dependencias externas.

## Requirements

### Requirement 1: Header visual con identidad de marca

**User Story:** Como viajero, quiero ver un encabezado profesional que identifique claramente el producto End of the World Travel Agent y su conexión con Austral Beacon Media.

#### Acceptance Criteria

1. THE Header_Visual SHALL mostrar el nombre "End of the World Travel Agent" como título principal con jerarquía tipográfica destacada.
2. THE Header_Visual SHALL incluir una referencia sutil a Austral Beacon Media como marca editorial responsable.
3. THE Header_Visual SHALL usar una paleta de colores fríos y naturales coherente con la Estética_Cartográfica (tonos de gris azulado, blanco, azul profundo o verde austral).
4. THE Header_Visual SHALL diferenciarse del contenido principal mediante contraste visual, sin depender de imágenes externas.
5. THE Header_Visual SHALL preservar la estructura semántica existente con un `<header>` y un `<h1>`.

### Requirement 2: Introducción editorial centrada en destinos

**User Story:** Como viajero, quiero leer una breve introducción que me explique qué puedo consultar y el contexto geográfico del agente.

#### Acceptance Criteria

1. THE Intro_Editorial SHALL describir en una o dos oraciones que el agente responde consultas sobre destinos y conectividad del extremo sur de Chile (Punta Arenas, Puerto Williams, Cabo de Hornos, accesos antárticos).
2. THE Intro_Editorial SHALL usar un tono documental y conciso, sin lenguaje publicitario ni superlativos.
3. THE Intro_Editorial SHALL NO inventar datos geográficos, operadores ni servicios reales.
4. THE Intro_Editorial SHALL ser visualmente distinguible del formulario y de las preguntas de ejemplo, usando tipografía o espaciado diferenciado.

### Requirement 3: Preguntas de ejemplo como elementos visuales reutilizables

**User Story:** Como viajero, quiero ver las preguntas de ejemplo presentadas como elementos visuales claros que me orienten sobre qué consultar.

#### Acceptance Criteria

1. WHEN la página se carga, THE Interfaz_Web SHALL mostrar al menos dos preguntas de ejemplo como Ejemplo_Visual diferenciados del texto corrido.
2. THE Ejemplo_Visual SHALL tener un estilo visual de tarjeta, etiqueta o chip que lo distinga del párrafo narrativo.
3. THE Ejemplo_Visual SHALL mantener el contenido textual existente sin inventar preguntas adicionales ficticias.
4. THE sección de ejemplos SHALL preservar la estructura semántica con `aria-labelledby` y un encabezado asociado.
5. THE Ejemplo_Visual SHALL ser legible en pantallas desde 320px de ancho sin desbordamiento horizontal.

### Requirement 4: Formulario como componente principal de interacción

**User Story:** Como viajero, quiero que el formulario de consulta sea el elemento visual más destacado de la página, invitándome a interactuar.

#### Acceptance Criteria

1. THE Formulario_Consulta SHALL ocupar una posición central y prominente en la jerarquía visual de la página.
2. THE Formulario_Consulta SHALL aplicar estilos profesionales al campo de texto (bordes definidos, padding generoso, tipografía legible) y al botón (color de acción, contraste WCAG AA, estado hover visible).
3. THE Formulario_Consulta SHALL preservar los IDs `query-form`, `question-input`, `submit-btn` y `validation-msg` sin renombrarlos ni eliminarlos.
4. THE Formulario_Consulta SHALL mostrar estados visuales diferenciados para: reposo, foco en el input, hover en el botón, estado deshabilitado durante envío.
5. THE Formulario_Consulta SHALL preservar el `<label>` asociado al campo de texto y su accesibilidad con lectores de pantalla.
6. WHEN el campo de texto recibe foco, THE Formulario_Consulta SHALL indicar visualmente el foco mediante borde, sombra o cambio de color perceptible.

### Requirement 5: Presentación visual de respuestas de conectividad

**User Story:** Como viajero, quiero ver las rutas de conectividad presentadas con una estética profesional que facilite la lectura de etapas, advertencias y fuentes.

#### Acceptance Criteria

1. THE Tarjeta_Respuesta SHALL aplicar estilos diferenciados al contenedor `.answer-connectivity` que lo distingan visualmente como una tarjeta o bloque informativo.
2. THE sección `.answer-connectivity__summary` SHALL mostrarse con tipografía destacada como introducción de la ruta.
3. THE sección `.answer-connectivity__stages` SHALL presentar cada `.route-stage` como un elemento visual separado con estructura clara de origen, destino, modo y nota.
4. THE sección `.answer-connectivity__warnings` SHALL usar un estilo de alerta visual (color diferenciado, ícono CSS o borde lateral) que comunique precaución sin alarmar.
5. THE sección `.answer-connectivity__sources` SHALL presentar cada `.source-item` con tipografía reducida y estructura compacta.
6. THE sección `.answer-connectivity__verified-at` SHALL mostrarse como metadato secundario con tamaño y peso visual inferior al contenido principal.

### Requirement 6: Presentación visual de tarjetas de destino

**User Story:** Como viajero, quiero ver la información de un destino presentada como una ficha documental profesional, con secciones claras y jerarquía visual.

#### Acceptance Criteria

1. THE Tarjeta_Respuesta SHALL aplicar estilos diferenciados al contenedor `.answer-destination` que lo distingan como una ficha de destino.
2. THE elemento `.answer-destination__name` SHALL mostrarse como título principal de la ficha con tipografía destacada.
3. THE secciones `.answer-destination__geographic` y `.answer-destination__cultural` SHALL diferenciarse visualmente entre sí mediante separadores, fondos o iconografía CSS.
4. THE sección `.answer-destination__warnings` SHALL usar el mismo estilo de alerta visual coherente con las advertencias de conectividad.
5. THE elemento `.answer-destination__confidence` SHALL mostrar los niveles `.confidence-high`, `.confidence-medium` y `.confidence-none` con colores diferenciados (verde, amarillo/naranja y gris respectivamente).
6. THE sección `.answer-destination__verified-at` SHALL usar el mismo tratamiento de metadato secundario que en la respuesta de conectividad.
7. THE sección `.answer-destination__sources` SHALL presentar cada fuente con el mismo estilo compacto usado en conectividad.

### Requirement 7: Presentación visual de respuestas no soportadas y errores

**User Story:** Como viajero, quiero que los mensajes de error o consulta no reconocida sean visualmente claros pero no alarmantes.

#### Acceptance Criteria

1. THE contenedor `.answer-unsupported` SHALL usar un estilo informativo neutro (fondo suave, borde lateral o tipografía diferenciada) que indique limitación sin alarmar.
2. THE contenedor `.answer-error` SHALL usar un estilo de error distinguible (rojo o naranja atenuado) que comunique problema técnico sin exponer detalles internos.
3. THE respuestas de error y no soportadas SHALL mantener coherencia tipográfica con el resto de la interfaz.

### Requirement 8: Estética cartográfica y documental

**User Story:** Como viajero, quiero que la interfaz transmita una identidad visual documental e inspirada en la exploración austral, diferenciándose de sitios turísticos masivos.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL usar una paleta de colores basada en tonos fríos y naturales: azules profundos, grises azulados, blancos cálidos y acentos verdes o terracota austral.
2. THE Interfaz_Web SHALL usar tipografía con personalidad cartográfica o editorial: fuentes serif o sans-serif con carácter documental, usando system fonts o CSS font-stacks sin dependencias externas.
3. THE Interfaz_Web SHALL aplicar separación visual generosa (whitespace) entre secciones para transmitir calma y legibilidad.
4. THE Interfaz_Web SHALL evitar gradientes llamativos, sombras excesivas, bordes redondeados exagerados y cualquier elemento que sugiera turismo masivo o landing page comercial.
5. THE Interfaz_Web SHALL incorporar elementos decorativos sutiles mediante CSS (líneas, bordes, separadores) que evoquen cartografía o coordenadas geográficas, sin usar imágenes externas.

### Requirement 9: Diseño responsive y mobile-first

**User Story:** Como viajero, quiero usar la interfaz desde mi teléfono con la misma calidad visual que desde un computador de escritorio.

#### Acceptance Criteria

1. THE CSS_Puro SHALL usar un enfoque mobile-first donde los estilos base sirvan pantallas de 320px o más.
2. WHEN el viewport alcanza 768px o más, THE CSS_Puro SHALL aplicar adaptaciones de layout que aprovechen el espacio adicional (columnas, márgenes ampliados, tipografía ajustada).
3. THE Formulario_Consulta SHALL mantener funcionalidad táctil completa con áreas de toque de al menos 44×44px para el botón de envío.
4. THE Tarjeta_Respuesta SHALL adaptarse al ancho disponible sin desbordamiento horizontal ni texto truncado.
5. THE CSS_Puro SHALL NO usar unidades fijas (px) para anchos de contenedor principal; usará unidades relativas o max-width con margen automático.

### Requirement 10: Accesibilidad y contraste visual

**User Story:** Como usuario con necesidades de accesibilidad, quiero que la nueva estética visual mantenga o mejore la accesibilidad existente.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL mantener un ratio de contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande, conforme a WCAG 2.1 AA.
2. THE Interfaz_Web SHALL preservar todos los atributos `aria-live`, `aria-label`, `aria-labelledby`, `role` y `hidden` existentes en el HTML.
3. THE Interfaz_Web SHALL mantener un orden de foco lógico y un indicador de foco visible en todos los elementos interactivos.
4. THE estados del botón (hover, focus, disabled) SHALL ser distinguibles sin depender exclusivamente del color.
5. THE Interfaz_Web SHALL NO introducir contenido que dependa exclusivamente de color para transmitir información (los niveles de confianza usarán texto además de color).

### Requirement 11: Indicador de carga con estilo profesional

**User Story:** Como viajero, quiero que el estado de carga sea visualmente coherente con la nueva estética y no rompa la experiencia.

#### Acceptance Criteria

1. WHEN la consulta está siendo procesada, THE elemento `#loading` SHALL mostrarse con una animación CSS sutil (pulso, fade o spinner geométrico) coherente con la Estética_Cartográfica.
2. THE indicador de carga SHALL NO usar GIFs ni imágenes externas; usará exclusivamente animaciones CSS.
3. THE indicador de carga SHALL preservar el atributo `aria-live="polite"` y el atributo `hidden` para control programático por `app.client.ts`.

### Requirement 12: Compatibilidad estricta con app.client.ts

**User Story:** Como equipo técnico, queremos que el rediseño visual no rompa la lógica del cliente existente.

#### Acceptance Criteria

1. THE Interfaz_Web SHALL preservar los elementos con IDs `query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading` y `results` sin renombrarlos, eliminarlos ni cambiar su tipo de elemento HTML.
2. THE Interfaz_Web SHALL mantener el script `<script type="module" src="/js/app.client.js">` como módulo cargado desde la ruta existente.
3. THE Interfaz_Web SHALL mantener el idioma principal en español (`lang="es"` en `<html>`).
4. THE CSS_Puro SHALL NO alterar la visibilidad programática de `#loading`, `#validation-msg` ni `#results` (estos se controlan mediante el atributo `hidden` desde JavaScript).
5. THE Interfaz_Web SHALL NO modificar archivos en `src/domain`, `src/application`, `src/api` ni contratos existentes.

### Requirement 13: Restricciones técnicas y de alcance

**User Story:** Como equipo técnico, queremos que el rediseño se limite a mejoras visuales sin expandir funcionalidad ni agregar dependencias.

#### Acceptance Criteria

1. THE implementación visual SHALL modificar exclusivamente `public/index.html` y `public/styles.css`. Solo podrán añadirse archivos de tests dentro de `tests/` cuando sean necesarios para verificar estructura, accesibilidad o compatibilidad.
2. THE CSS_Puro SHALL NO usar preprocesadores (SASS, LESS), frameworks CSS (Tailwind, Bootstrap) ni dependencias npm nuevas.
3. THE Interfaz_Web SHALL NO incluir imágenes externas, web fonts cargadas desde CDN ni recursos de terceros.
4. THE feature SHALL NO agregar autenticación, PWA, service workers, despliegue ni funcionalidades de agente nuevas.
5. THE feature SHALL NO inventar contenido textual (nombres de operadores, horarios, precios, datos geográficos no verificados).
6. THE feature SHALL NO romper los 116 tests existentes del proyecto.
7. THE tests existentes SHALL NO modificarse salvo que exista una incompatibilidad demostrable causada por la nueva estructura HTML, y solo con justificación explícita.

### Requirement 14: Pruebas de estructura, accesibilidad y compatibilidad

**User Story:** Como equipo técnico, quiero tests que verifiquen que el rediseño mantiene la estructura y accesibilidad requerida.

#### Acceptance Criteria

1. WHEN se agregan tests, THE test suite SHALL verificar que los IDs protegidos (`query-form`, `question-input`, `submit-btn`, `validation-msg`, `loading`, `results`) existen en el HTML.
2. WHEN se agregan tests, THE test suite SHALL verificar que los atributos de accesibilidad (`aria-live`, `aria-label`, `aria-labelledby`, `role`) están presentes en los elementos correspondientes.
3. WHEN se agregan tests, THE test suite SHALL verificar que el script del cliente se carga como módulo desde `/js/app.client.js`.
4. THE tests nuevos SHALL ejecutarse con `vitest run` sin requerir navegador real.
5. THE tests nuevos SHALL coexistir con los 116 tests existentes sin modificarlos.
