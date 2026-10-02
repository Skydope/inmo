# Propuesta inmobiliaria Bolívar · documento completo

Diez páginas A4. Fuente editable HTML/CSS y PDF exportado. La muestra aprobada de fase 1 se conserva en `sample-phase1.html`.

- Abrir `index.html` directamente o servir esta carpeta con un servidor estático.
- Editar textos y estructura en `template.html`, estilos en `styles.css`.
- Ejecutar `node docs/propuesta-visual/generate.mjs` desde la raíz del proyecto para regenerar `index.html` con los SVG de Phosphor Fill.
- El botón «Guardar PDF» abre la impresión del navegador. Elegir A4, escala 100 %, sin encabezados ni pies del navegador. Las reglas de impresión ya definen márgenes cero y colores de fondo.

## Identidad y recursos

Paleta tomada de `src/app/globals.css`: crema #EFE8DC, superficie #F7F2EA, carbón #1A1A1A, superficie oscura #262626, dorado #C4A574, secundario #6E675E y texto claro #F3EFE6.

Fuentes de la aplicación, copiadas desde su compilación local: Manrope, Archivo Black e Instrument Serif Italic. Iconos SVG generados desde la dependencia instalada `@phosphor-icons/react` 2.1.10, todos con `weight="fill"`.

Capturas del 2 de octubre de 2026:

- Escritorio: `http://127.0.0.1:43123/`, viewport solicitado 1440 × 900.
- Móvil: `http://127.0.0.1:43123/propiedades/bol-01`, viewport solicitado 393 × 852.

Las imágenes muestran la aplicación existente con sus datos de ejemplo. Los marcos de MacBook e iPhone están construidos en CSS y no alteran las capturas. Los archivos, fuentes y capturas son locales; el HTML no depende de un CDN.

Verificado en navegador: las páginas miden A4, no desbordan verticalmente y el contenido mantiene separación con los pies. Exportación PDF comprobada: diez páginas A4, texto seleccionable, fuentes y capturas locales. Todas las páginas se revisaron visualmente.

## Revisión 02 · mapa móvil

Se reemplazó la ficha del iPhone por la captura del mapa suministrada por el usuario. Se conserva el zoom y la zona de Plaza Alsina / Plaza Mitre. `assets/web-mobile-map.png` guarda el original; `.map-capture` recorta visualmente los bordes del navegador sin modificar la imagen ni sus proporciones.

## Documento completo

Se incorporaron capturas reales de la aplicación local: mapa de escritorio con zoom en el centro, directorio de inmobiliarias en escritorio y móvil, y detalle de propiedad en escritorio y móvil. Todas contienen datos de demostración de la aplicación, no anuncios validados. La página de gestión usa diagramación editorial e íconos para las funciones previstas: no hay una pantalla de administración implementada que se pueda capturar.

No se modificó la aplicación ni el PDF original.
