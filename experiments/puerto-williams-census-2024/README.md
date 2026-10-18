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

La prueba con Playwright no llegó a ejecutarse: el entorno no tenía Chromium y su descarga falló. Quedan pendientes la inspección visual en escritorio/móvil y la prueba de acercar, alejar, restablecer y ocultar la capa. No se consideran aprobadas por los despliegues Vercel.

## Revisión antes de integrar

1. Comparar el contorno con QGIS u otro lector independiente del GeoPackage, especialmente la aproximación de curvas.
2. Abrir `index.html` y verificar los controles, la legibilidad y el ancho móvil.
3. Confirmar que leyenda y atribución siguen visibles y que la interpretación censal resulta clara.

Mantener este experimento fuera de los consumidores de producción hasta completar la revisión. `atlas_ready` permanece en `false`.

## Licencia y atribución

Datos y visualización derivada: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Fuente: Instituto Nacional de Estadísticas de Chile, Cartografía Censo 2024 — Región de Magallanes y de la Antártica Chilena. Transformaciones realizadas por Austral Beacon: selección de entidad, aproximación de curvas y proyección local para pantalla. Véanse las [condiciones INE](https://www.ine.gob.cl/terminos-de-uso-y-licencia-de-datos-abiertos).
