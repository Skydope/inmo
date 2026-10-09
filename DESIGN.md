---
name: Bolívar Inmo
description: The sign and the city plan. Warm paper, ink, and scarce gold.
colors:
  papel: "#efe8dc"
  blanco: "#f7f2ea"
  tinta: "#1a1a1a"
  tinta-suave: "#6e675e"
  niebla: "#a8a297"
  linea: "#e4dcd0"
  plano-50: "#f3efe6"
  plano-700: "#1a1a1a"
  plano-800: "#3a3530"
  trigo: "#c4a574"
  alerta: "#b4432f"
  noche: "#1a1a1a"
  sobre-noche: "#f7f2ea"
typography:
  display:
    fontFamily: "Archivo Black, Impact, sans-serif"
    fontSize: "clamp(2.75rem, 18cqh, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.8
    letterSpacing: "-0.02em"
    fontFeature: "uppercase"
  question:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  voice:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1
    fontFeature: "tabular-nums"
  body:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  sign:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    fontStretch: "75%"
    letterSpacing: "0.06em"
    fontFeature: "uppercase"
rounded:
  control: "0.75rem"
  tarjeta: "1rem"
  hoja: "1.5rem"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.plano-700}"
    textColor: "{colors.blanco}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "44px"
  button-primary-large:
    backgroundColor: "{colors.plano-700}"
    textColor: "{colors.blanco}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.plano-800}"
  button-outline:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "44px"
  option:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    height: "64px"
  chip:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.full}"
    height: "44px"
  sign:
    backgroundColor: "{colors.noche}"
    textColor: "{colors.sobre-noche}"
    typography: "{typography.sign}"
    rounded: "4px"
  card:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.tarjeta}"
  footer:
    backgroundColor: "{colors.noche}"
    textColor: "{colors.sobre-noche}"
    typography: "{typography.body}"
---

# Design System: Bolívar Inmo

## Overview

**Creative North Star: "El cartel y el plano"**

Bolívar Inmo is a search tool for one town. The page sits on warm paper. Type is ink. Gold is scarce by day and becomes the action at night. The two objects are the "VENDE" sign nailed to a house and the city plan drawn in the footer.

Mode: Operate. The visitor finds a property and contacts the agency. Mobile first, checked at 360 px. Motion is short, except the home: the sheet climbs over the house, the sentence lights word by word, and the plan draws itself. Those effects are CSS only, behind `animation-timeline` and `prefers-reduced-motion: no-preference`.

**Key Characteristics:**

- Warm paper, ink, and gold. Day action is ink. Night action is gold.
- Archivo Black only for "VIVÍ BOLÍVAR". Encode Sans for the interface. Instrument Serif, upright, only for the sheet sentence and the footer line.
- The footer, the operation sign, and the scrims stay dark in both themes.
- 44 px touch targets. One question per step. Counts come from the data.

## Colors

Warm paper for the ground, ink for type and for the day action, gold for the night action and for "Destacada".

### Primary

- **Tinta de acción** (`plano-700`, #1a1a1a): continue, the selected option, the map pin, the logo square. By day it is the same ink as the text. Hover is `plano-800` (#3a3530).
- **Oro** (`trigo`, #c4a574): "Destacada" by day, with ink on top. At night `plano-700`, `primary`, and the focus ring remap to this gold, and the label on it is ink (#1a1a1a).

### Neutral

- **Papel** (`papel`, #efe8dc): the page.
- **Papel alto** (`blanco`, #f7f2ea): cards, the filter sheet, bars.
- **Tinta** (`tinta`, #1a1a1a): text and icons. On paper it measures 14.29.
- **Piedra** (`tinta-suave`, #6e675e): secondary text. On paper it measures 4.58, just over 4.5. Do not lighten it.
- **Niebla** (`niebla`, #a8a297): secondary text on the dark footer only. On `noche` it measures 6.86. It does not flip at night.
- **Línea** (`linea`, #e4dcd0): borders. Never text.
- **Noche** (`noche`, #1a1a1a) and **Sobre noche** (`sobre-noche`, #f7f2ea): the pair that does not follow the theme. Footer, operation sign, photo badges, dialog and drawer scrims.

### Named Rules

**The Fixed Night Rule.** Anything that must stay dark uses `noche` and `sobre-noche`. Do not paint it with `tinta` and `blanco`: those two swap at night, and the footer would turn into paper.

**The Day Ink Rule.** By day, blue is not an action color. Forward motion is ink.

**The Scarce Gold Rule.** By day, gold is only "Destacada". At night it is the action, not a wash behind the page.

## Typography

**Display:** Archivo Black (Impact)
**Interface:** Encode Sans (system-ui)
**Voice:** Instrument Serif, roman (Georgia)

### Hierarchy

- **Display** (400, clamp from 2.75rem, tracking −0.02em, uppercase): "VIVÍ BOLÍVAR" on the hero and in the footer. The word "BOLÍVAR" is 4.8 em wide in this face. Do not put Archivo Black on section titles.
- **Question** (700, 1.375rem, 1.75rem from `lg`, stretch 87.5%): "¿Qué estás buscando?" and the other step questions.
- **Title** (700, 1.5rem, stretch 87.5%): section headings on the home sheet.
- **Voice** (400, from 1.75rem, never italic, never under 24px): the sheet sentence and the footer invitation.
- **Price** (700, tabular numerals, stretch 87.5%): listing prices. On a card, `text-xl` or `text-lg`. On the map pin, 0.875rem, the same step as `text-sm`.
- **Body** (400, 1rem): reading copy.
- **Sign** (700, 0.75rem, stretch 75%, uppercase, tracking 0.06em): VENTA / ALQUILER / TEMPORARIO.

### Named Rules

**The Three Voices Rule.** Archivo Black is the sign on the roof. Encode Sans is everything you read and tap. Instrument Serif, upright, is one sentence on the home. Do not italicize it and do not add a fourth face.

**The Width Rule.** `--em-bolivar` is 4.8 because that is the measured width of "BOLÍVAR" in Archivo Black at −0.02em. It was 5.1 for stretched Encode Sans. Do not reuse that number.

## Layout

Single column at 360 px with a 16 px gutter. One question or one task per screen. The home hero fills the first screen: house, title, tabs, and the three options. The map link sits above the question. Results are the map at every width. The property cards sit in a strip on the map. The count is a pill on the left and Filtros sits on the right. On a wide screen the filter sheet enters from the right, the same way as the menu.

## Elevation & Depth

Flat paper, with a soft shadow only on what floats: the filter card, the sheet over the photo, map pins, carousel arrows.

### Shadow Vocabulary

- **Filtro** (`0 2px 6px rgb(0 0 0 / 0.08), 0 16px 40px rgb(0 0 0 / 0.18)`): the question card on the photo.
- **Hoja** (`0 -28px 70px rgb(23 33 28 / 0.16)`): the sheet climbing over the hero.
- **Flecha** (`0 2px 8px rgb(0 0 0 / 0.12)`): carousel arrows.

### Named Rules

**The Line First Rule.** Separate with `linea` before reaching for a shadow.

## Shapes

12 px controls, 16 px cards, 24 px sheet tops. Pills only for chips, the map link, and the footer actions. The operation sign is a 4 px rectangle.

## Components

### Buttons

Primary is ink by day and gold by night, 44 px (56 px for the main action of a screen). Text on it is `blanco`, which flips to ink when the fill is gold. Outline is raised paper with a `linea` border. Focus is a 2 px ring in `plano-700`.

### Chips

44 px pills. Zones and features. Selected state is a check, not color alone.

### Cards / Containers

Raised paper, 1 px `linea`, 16 px radius. No shadow unless the card floats.

### Inputs / Fields

44 px tall, 16 px text, raised paper, `linea` border, 12 px radius.

### Navigation

The home tabs sit on the photo. The menu opens from the same side as the button: left on the home tabs, right on the header. The header bar is hidden until the sheet covers the tabs, then it pins. With reduced motion it appears without sliding.

### The sign

`noche` fill, `sobre-noche` type, condensed uppercase. It stays a dark sign in both themes.

### Footer

Always `noche`, type `sobre-noche`, secondary links in `niebla`. The plan of the city draws in on the home only.

## Do's and Don'ts

### Do:

- **Do** measure a new pair with `node scripts/contraste.mjs` before shipping it. Body text stays at or above 4.5.
- **Do** keep touch targets at 44 px.
- **Do** let the day/night button drive the hero photo, the title, and the map. The title at night is ink-light (`tinta`, #f3efe6), not the surface token.
- **Do** keep reduced motion as less travel. Color and state changes stay. The pinned bar still appears.

### Don't:

- **Don't** bring back blueprint blue (#1f4e79, #0c2560) as the action or the night sky.
- **Don't** set the hero title from `prefers-color-scheme`. The button owns the theme.
- **Don't** paint the footer or the operation sign with `bg-tinta text-blanco`.
- **Don't** put Archivo Black on every heading, or italicize Instrument Serif.
- **Don't** kill every animation with `animation-duration: 0.01ms`. That breaks scroll-driven timelines.
