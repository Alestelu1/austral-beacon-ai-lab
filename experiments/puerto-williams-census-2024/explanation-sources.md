# Fuentes de la explicación territorial

Verificado el 2026-10-19 (America/Santiago). Alcance: texto interpretativo del experimento; geometría y controles conservados.

| Afirmación | Fuente | Localización y alcance |
|---|---|---|
| El límite urbano censal distingue área urbana y rural y tiene finalidad estadística | INE, Alcances de la base cartográfica del Censo 2017 | pp. 4 y 10. Referencia metodológica 2017; no se presenta como especificación de geometrías 2024. |
| Puerto Williams es capital de la comuna de Cabo de Hornos | DL 2.868, texto consolidado en LeyChile | Artículo 46, número 1. |
| La comuna es una unidad administrativa territorial y tiene contexto urbano y rural | DL 2.868; reporte comunal BCN, unidad 12201 | Artículo 1 y artículo 46; reporte, sección 1.5. No se trasladan cifras de población a esta explicación. |
| Este contorno corresponde a una entidad urbana 2024 | GeoPackage INE ya auditado | Limite_Urbano_CPV24, ID_ENTIDAD 1220102600101. Véase provenance.json. |

## Enlaces

- INE: https://www.ine.gob.cl/docs/default-source/geodatos-abiertos/manuales/censo/alcances-base-cartografica-censo-2017.pdf?sfvrsn=d513cb51_6
- LeyChile: https://www.leychile.cl/navegar?idNorma=7020
- BCN: https://www.bcn.cl/siit/reportescomunales/comunas_v.html?idcom=12201
- Cartografía 2024: https://censo2024.ine.gob.cl/resultados/

## Validación

Se añade el mismo bloque explicativo en template.html e index.html para que se conserve al regenerar la vista. Los elementos path del HTML generado permanecen idénticos. No se crea un polígono comunal ni se infiere la extensión administrativa desde el contorno urbano. La comparación numérica de curvas y la prueba instrumental a 390 px siguen pendientes según README.md.

### Revisión manual — 2026-10-19

- Captura local `screencapture-file-C-Users-stelu-Downloads-index-html-2026-10-19-00_19_02.png`: la sección «¿Este contorno representa toda la comuna?» se muestra completa y legible en escritorio, con definiciones, tres enlaces y la distinción temporal 2017/2024.
- El usuario confirmó a las 00:23 (America/Santiago) que funcionan los tres enlaces nuevos: INE, LeyChile y BCN.
- La captura respalda presentación visual; no constituye una prueba de comprensión con usuarios independientes ni una certificación de precisión cartográfica.
- La vista móvil de esta nueva sección no se ha comprobado. Se conservan los pendientes técnicos del experimento señalados en README.md.
