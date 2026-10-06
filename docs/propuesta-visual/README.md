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

## Revisión 03 · refinamiento editorial y cierre ejecutivo

- Se unificó la numeración entre cabeceras temáticas y foliado físico (`01` a `10`).
- Se incorporaron píldoras de flujo (`.channel-pill`) y flechas Phosphor doradas para visualizar claramente los recorridos de canales.
- Se agregó en la página 7 el mockup fotorrealista de cartel físico en vereda con código QR (`assets/cartel-mockup.jpg`) como placeholder sustituible, junto al flujo visual que conecta el cartel con la ficha en el celular.
- Se jerarquizó en la página 8 el distintivo del Centro de Martilleros (*«Profesional matriculado verificado»*) con formato de credencial/tarjeta institucional.
- Se sumó la propuesta de valor de **carga inicial 100% asistida** en páginas 6 y 9 para derribar la objeción operativa de migración de catálogo.
- Se rediseñó la página 10 (cierre) reemplazando la MacBook repetida por un **panel ejecutivo de cierre**: hoja de ruta en 3 pasos, compromisos inmutables y canales directos de contacto (WhatsApp: `11 7062-3866`, email: `matiasasin123@gmail.com`).
- Ajustes métricos en CSS para garantizar márgenes generosos y evitar cualquier desborde o contacto con los pies de página A4.


## Revisión 04 · capturas reales y síntesis editorial

- Nuevas capturas reales de búsqueda con filtros, ficha y contacto del mismo PH y directorio enfocado en una inmobiliaria. Se conserva el mapa móvil elegido por el usuario.
- Dos iPhone más legibles sustituyen los tres teléfonos repetitivos; los MacBook mantienen sus proporciones y biseles.
- Cartel de Norte Propiedades generado para ilustrar el recorrido cartel → ficha. La imagen y el QR están identificados como ilustrativos; el QR definitivo requiere la URL pública de la propiedad.
- Carga asistida jerarquizada en la página 6, textos acortados y contacto ampliado. Se mantienen el piloto de 4–6 inmobiliarias y los 60 días sin costo.
- Verificación profesional condicionada a la participación formal del Centro. Se eliminaron promesas absolutas y bloques repetidos.
- Capturas de la aplicación con datos de ejemplo; no se modificó la aplicación. Paleta original e iconos Phosphor Fill conservados.
- Respaldo anterior en `revisions/2026-10-04-before/`. El PDF final sustituye la exportación anterior y conserva diez páginas A4 con texto seleccionable.
