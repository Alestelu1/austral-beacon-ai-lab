# Puerto Williams — vista censal experimental

Primer experimento aislado del límite urbano INE 2024. Abrir `index.html` en un navegador; funciona sin servidor, mapas externos ni dependencias de red. Los enlaces a fuentes requieren conexión.

## Qué muestra

Una entidad de `Limite_Urbano_CPV24`, `ID_ENTIDAD = 1220102600101`, `ENTIDAD = PUERTO WILLIAMS`, `AREA_C = URBANO`. El resultado representa la delimitación censal 2024. No modifica entidades canónicas, índices Atlas ni Travel Agent.

La vista conserva la distinción entre localidad rural y entidad urbana homónimas. No incluye puntos DOP, Puerto Toro, carreteras ni atributos demográficos.

## Reproducción

Descargar el ZIP R12 desde el enlace del INE registrado en `provenance.json`, extraer el GeoPackage y ejecutar desde esta carpeta:

```sh
python3 build_preview.py /ruta/Cartografia_censo2024_R12.gpkg
```

El generador verifica el SHA-256 del GeoPackage previamente auditado y exige una sola entidad coincidente. Genera `index.html` y `provenance.json` a partir de `template.html`. Si cambia la descarga, revisar la nueva versión antes de actualizar el hash esperado.

El archivo declara MultiPolygon, pero el contenido binario usa MultiSurface, CurvePolygon y CompoundCurve. El lector conserva líneas y aproxima los arcos circulares con un paso angular máximo de 1 grado en el sistema de origen. La visualización aplica una proyección equirectangular local sobre SIRGAS 2000 (EPSG:4674); no convierte datum ni produce GeoJSON WGS84.

Es una aproximación para explorar el documento cartográfico. No certifica precisión métrica ni sirve para medición, navegación o delimitación jurídica. El generador utiliza únicamente la biblioteca estándar de Python. Esta ejecución utilizó Python 3.12.14.

## Validación realizada

- Hash del GeoPackage coincidente con la auditoría.
- Selección única por ID, nombre y estrato urbano.
- CRS binario EPSG:4674 comprobado.
- Anillos de salida cerrados, coordenadas finitas y extensión en Puerto Williams.
- Un polígono de salida con 1.104 coordenadas.
- Documento HTML con atribución, fecha censal, fuente y licencia.

### Revisión manual — 2026-10-18 (America/Santiago)

Pruebas realizadas por el usuario sobre el HTML local y revisadas en esta conversación:

| Comprobación | Evidencia | Resultado |
|---|---|---|
| Presentación en escritorio, leyenda y atribución | Captura 19:44:59 | Satisfactorio visualmente |
| Acercar | Captura 19:47:59, vista al 250 % | Confirmado |
| Enlaces originales | Confirmación del usuario 19:48 | Confirmado por el usuario |
| Ocultar y mostrar la capa | Confirmación del usuario 19:51 | Confirmado por el usuario |
| Restablecer | Confirmación del usuario 19:52 | Confirmado por el usuario |
| Contorno en QGIS | Capturas 21:08:18 y 21:15:19; sólo capa Limite_Urbano_CPV24, proyecto final EPSG:32719 | Coincidencia visual de los rasgos principales |
| Proyecto QGIS guardado | Confirmación del usuario 21:22 | Guardado localmente; archivo no incorporado al repositorio |

La captura final QGIS muestra proporciones y rasgos coherentes con la vista HTML. Es un contraste visual independiente con otro lector, no una medición de errores ni una certificación de la aproximación de curvas. La captura no muestra el filtro ni la tabla de atributos; la identidad exacta del registro se basa en el procedimiento seguido y la selección del generador.

Actualización 23:25 del 2026-10-18 (America/Santiago): el usuario confirmó que Alejar y Restablecer funcionan. Las capturas 23:21:58 y 23:22:27 muestran una ventana de escritorio estrecha con controles que se redistribuyen y textos, enlaces y atribución legibles. No muestran el modo de dispositivo ni un ancho CSS de 390 px; por ello no se considera completada la prueba móvil de 390 px.

Actualización 23:31 del 2026-10-18: la captura `screencapture-file-C-Users-stelu-Downloads-index-html-2026-10-18-23_31_18.png` muestra la distribución estrecha en una columna, botones acomodados, polígono completo al 100 % y leyenda, fuente y licencia legibles. No se aprecia recorte horizontal del contenido. La captura omite la barra de dimensiones de Chrome: confirma adaptación visual al ancho mostrado, pero no permite certificar 390 píxeles CSS.

Quedan pendientes: verificación instrumental del ancho exacto de 390 px y comparación numérica independiente de curvas. El recorte al aumentar el zoom es esperado; esta versión no tiene desplazamiento por arrastre.

La prueba con Playwright no llegó a ejecutarse: el entorno no tenía Chromium y su descarga falló. Las pruebas manuales anteriores no se atribuyen a Playwright ni a Vercel.

## Revisión antes de integrar

1. Revisar el contraste visual QGIS y las pruebas manuales registradas arriba.
2. Mantener explícitos los pendientes de móvil de 390 px y precisión numérica de curvas.
3. Limitar cualquier integración al directorio experimental; la promoción Atlas requiere una revisión separada.

Mantener este experimento fuera de los consumidores de producción hasta completar la revisión. `atlas_ready` permanece en `false`.

## Licencia y atribución

Datos y visualización derivada: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Fuente: Instituto Nacional de Estadísticas de Chile, Cartografía Censo 2024 — Región de Magallanes y de la Antártica Chilena. Transformaciones realizadas por Austral Beacon: selección de entidad, aproximación de curvas y proyección local para pantalla. Véanse las [condiciones INE](https://www.ine.gob.cl/terminos-de-uso-y-licencia-de-datos-abiertos).
