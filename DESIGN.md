---
name: Bolívar Inmo
description: The sign and the city plan. A clear search tool for one town.
colors:
  papel: "#f7f8f6"
  blanco: "#ffffff"
  tinta: "#17211c"
  tinta-suave: "#56635c"
  linea: "#dfe4e0"
  plano-50: "#eaf0f6"
  plano-700: "#1f4e79"
  plano-800: "#183d5f"
  trigo: "#e3b04b"
  alerta: "#b4432f"
typography:
  question:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1
    fontVariantNumeric: "tabular-nums"
  title:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    fontStretch: "87.5%"
    lineHeight: 1.2
  sign:
    fontFamily: "Encode Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    fontStretch: "75%"
    letterSpacing: "0.06em"
    textTransform: "uppercase"
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
    border: "1px solid {colors.linea}"
    rounded: "{rounded.control}"
    height: "44px"
  option:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    border: "1px solid {colors.linea}"
    rounded: "{rounded.control}"
    minHeight: "80px"
  option-selected:
    backgroundColor: "{colors.plano-50}"
    border: "1px solid {colors.plano-700}"
    indicator: "check in {colors.plano-700}"
  chip:
    backgroundColor: "{colors.blanco}"
    border: "1px solid {colors.linea}"
    rounded: "{rounded.full}"
    minHeight: "44px"
  sign:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    typography: "{typography.sign}"
    rounded: "4px"
  card:
    backgroundColor: "{colors.blanco}"
    border: "1px solid {colors.linea}"
    rounded: "{rounded.tarjeta}"
  header:
    backgroundColor: "{colors.blanco}"
    borderBottom: "1px solid {colors.linea}"
    height: "56px"
---

# Design System: Bolívar Inmo

## Overview

A search tool for one town, San Carlos de Bolívar. Mobile first, verified at 360 px. The
identity comes from two objects of small-town real estate: **the "VENDE" sign** nailed to the
front of a house (compact heavy letters, flat color, full contrast) and **the city plan**
(white paper, thin lines, the blue of blueprint copies). Mode: **Operate**. The visitor
completes a task: find a property and contact the agency.

The full rationale, in Spanish, lives in the local skill `identidad-visual`
(`.claude/skills/identidad-visual/SKILL.md`). Tokens live in `src/app/globals.css` with
measured contrasts.

## Colors

### Primary

`plano-700` (#1f4e79) is the only flat color in the interface and it means "move forward":
continue, see properties, contact, the selected option, the active map pin. White on it
measures 8.7. Hover and pressed: `plano-800`. Selected backgrounds: `plano-50`.

### Neutral

`papel` page background (a barely green-tinted white, never cream), `blanco` surfaces,
`tinta` text (15.5 on papel), `tinta-suave` secondary text (5.9 on papel), `linea` borders
only (never text).

### Named Rules

- **Blue means forward.** Anything blue that does not advance the task is wrong.
- **Trigo is rare.** Only the "Destacada" label. Never a button.
- **No cream, no gold, no glass, no gradients, no colored shadows.**

## Typography

One family for everything functional, **Encode Sans** (Impallari Type, Argentina), variable in
weight and width. Two scoped exceptions on the home page only (spec `vivi-bolivar`): the
**display** "VIVÍ BOLÍVAR" (Encode Sans at 125 % width, 900, uppercase) and **the voice**,
Instrument Serif 400 upright, for the sheet's statement and the home footer line only (never
below 24 px, never italic).

### Hierarchy

Question 32 px, ficha price 30 px, card price 24 px, section title 20 px (all 700 at 87.5 %
width, utility `font-titulo`); body 16 px; secondary 14 px; the operation sign 12 px at 75 %
width in uppercase.

### Named Rules

- **The sign is the only uppercase** (plus the "VIVÍ BOLÍVAR" display).
- **Prices use tabular numerals.**
- **Never below 14 px for reading; inputs at 16 px** (iOS zooms below that).

## Layout

Single column at 360 px with a 16 px gutter. One question or one task per screen, one
primary button, fixed at the bottom when it is the main action. Desktop adapts (two columns
for results), it is not the design target.

## Elevation & Depth

### Shadow Vocabulary

Neutral, soft shadows only on floating things: the map card, fixed bars, sheets.

### Named Rules

- Separate with `linea` before reaching for a shadow.

## Shapes

12 px controls, 16 px cards, 24 px sheet tops, pills only for chips and map pins.

## Components

### Buttons

Primary blue, 44 px (56 px for the main action of a screen); outline white with border;
ghost; link. Focus ring in `plano-700`.

### Chips

44 px tall pills for zones and features; selected = blue border, `plano-50` background and
a check.

### Cards / Containers

White, 1 px `linea` border, 16 px radius, no shadow unless floating.

### Inputs / Fields

44 px tall, 16 px text, white, `linea` border, 12 px radius.

### Navigation

White 56 px header with logo and menu (a sheet from the right). Search steps replace the
header with a step bar.

### Login photograph

`/ingresar` keeps its reference composition: access on the left, a photo of Bolívar on the
right.

## Do's and Don'ts

### Do:

- Measure contrast with `node scripts/contraste.mjs` before adding a color.
- Keep every touch target at 44 px or more.
- Make the selected state visible without color (a check).
- Keep motion to transitions of 200 ms or less with `transform` and `opacity`.

### Don't:

- Animate entrances or counters, or animate with JS libraries. The only scroll effects are the home's CSS-only ones (the sheet over the hero, the statement lighting up by color, the footer plan drawing, the pinned bar), behind `@supports` and `prefers-reduced-motion`.
- Put photos or gradients behind controls, except the home hero: the country house by day or by night (following `prefers-color-scheme`), "VIVÍ BOLÍVAR" behind the roof, and the search options on a solid white card.
- Use blue for decoration.
- Add dark mode styles without the decision recorded in the skill (the hero photo and title are the only exception).
