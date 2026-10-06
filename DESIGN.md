---
name: Inmu
description: A warm-paper catalog for one city.
colors:
  bg: "#efe8dc"
  bg-elevated: "#f7f2ea"
  fg: "#1a1a1a"
  fg-muted: "#6e675e"
  accent: "#1a1a1a"
  accent-muted: "#3a3530"
  glass: "rgba(255, 255, 255, 0.55)"
  glass-border: "rgba(26, 26, 26, 0.1)"
  gold: "#c4a574"
  gold-muted: "#a8906a"
  gold-fg: "#1a1a1a"
  danger: "#c45c5c"
  success: "#4f8f62"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  serif:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  full: "9999px"
  xl: "0.75rem"
  card: "1.5rem"
  panel: "1.75rem"
  sheet: "2.25rem"
spacing:
  "2": "8px"
  "4": "16px"
  "6": "24px"
  "10": "40px"
  "14": "56px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-foreground:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.gold-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  button-gold-hover:
    backgroundColor: "{colors.gold-muted}"
    textColor: "{colors.gold-fg}"
  button-account:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "48px"
  button-account-hover:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
  button-secondary:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "48px"
  input-search:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "10px 16px"
  chip:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: "12px 16px"
  nav-link:
    textColor: "{colors.fg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  nav-link-active:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
---

# Design System: Inmu

## Overview

**Creative North Star: "Warm paper, one city"**

Inmu reads as a local catalog printed on warm paper. The ground is the paper already in the site styles, type is ink, and a photograph of San Carlos de Bolívar appears when a page needs a place. Gold is the scarce chromatic note. It invites someone into the catalog or marks a map pin. It does not color the navigation or the account button.

Reading type is Manrope. Names and titles are Archivo Black, tracked slightly tight. Instrument Serif, italic, carries a single emphatic phrase. Sections on the public site sit in a wide column and often slide a paper sheet over a photo. Account screens stay on the same paper and the same faces: a narrow centered column, an ink pill to leave, and on the login a wide raised button for Google beside the city photograph.

Light and dark are one palette remapped. In the light theme the accent is ink. In the dark theme the accent becomes gold and the paper turns to ink. Motion is short and ease-out, and it drops away when reduced motion is requested.

**Key Characteristics:**

- Warm paper ground, ink type, gold kept rare
- Archivo Black, Manrope, and italic Instrument Serif
- Pills for actions; card, panel, and sheet radii for surfaces
- Soft lift and glass over photography, never a hard offset shadow
- One token set for light and dark, with gold taking the accent in the dark theme

## Colors

The palette is warm paper, near-black ink, and one gold. Status red and green exist for errors and confirmation. They are not a second brand accent.

### Primary

- **Warm Gold** (`#c4a574`): The scarce invitation. Explore on the home page, the agency contact pill, map pins for houses, and the map attribution link. Hover shifts to muted gold (`#a8906a`). Text on gold stays `--gold-fg`, which does not flip in the dark theme.

### Neutral

- **Warm Paper** (`#efe8dc`): The page ground (`--bg`) and the light `theme-color`.
- **Raised Paper** (`#f7f2ea`): Cards, the Google button, and other surfaces one step off the ground (`--bg-elevated`).
- **Ink** (`#1a1a1a`): Text, foreground pills, and the light-theme accent. Focus, selection, and the shared primary button use `--accent`, which equals ink in light.
- **Warm Stone** (`#6e675e`): Secondary copy (`--fg-muted`).
- **Soft Ink** (`#3a3530`): The light-theme muted accent (`--accent-muted`), used when a primary control hovers through the shared button.
- **Glass** (`rgba(255, 255, 255, 0.55)`): Chrome and secondary buttons over a photograph, with an 18px blur. The stronger map glass is `rgba(18, 18, 18, 0.48)`.
- **Hairline** (`rgba(26, 26, 26, 0.1)`): Borders on glass, fields, and the account button.

Errors use danger (`#c45c5c`). Confirmation uses success (`#4f8f62`).

In `.dark`, the same custom properties remap. `--bg` becomes the light theme's ink, `--bg-elevated` becomes `#262626`, `--fg` becomes `#f3efe6`, and `--fg-muted` becomes `#a8a297`. `--accent` is reassigned to gold and `--accent-muted` to muted gold. Glass falls to `rgba(255, 255, 255, 0.06)` with a `rgba(255, 255, 255, 0.12)` hairline. Danger becomes `#e07070` and success `#7cbc8a`. Gold and `--gold-fg` stay put.

### Named Rules

**The Scarce Gold Rule.** Gold marks a few invitations and house pins. It does not fill navigation, body text, or the account button.

**The Paper Ground Rule.** Pages sit on warm paper. Raised surfaces use the elevated paper. Do not lay the catalog out on pure white.

## Typography

**Display Font:** Archivo Black (with sans-serif)
**Body Font:** Manrope (with system-ui, sans-serif)
**Serif:** Instrument Serif, italic (with Georgia)

**Character:** A heavy gothic for the name and the title, a plain grotesque for reading and controls, and one italic serif phrase when a line needs a spoken stress.

### Hierarchy

- **Display** (400, 3rem, line-height 1, −0.02em): Page titles in Archivo Black. Login uses this size for “Ingresá”. Property titles use 1.875rem until the medium breakpoint, then 3rem. The wordmark in the login column is the title size.
- **Headline** (400, 3rem, line-height 1.15, −0.02em): Manrope section statements on the catalog. A single phrase inside the line may switch to Instrument Serif italic.
- **Title** (400, 1.25rem, line-height 1.2, −0.02em): Archivo Black for the brand link and for small section labels.
- **Serif** (400 italic, size of the line it sits in): Instrument Serif. On the login photograph the spoken line is 1.875rem and the display line under it stays Archivo Black.
- **Body** (400, 1rem, line-height 1.625): Manrope. Account copy is held to about 34 characters. Elsewhere a `max-w-md` measure is the usual cap. Supporting copy often drops to 0.875rem.
- **Label** (500, 0.875rem): Manrope medium, sentence case, on buttons, nav, and fields. Chips are the same ink pill at 0.75rem.

### Named Rules

**The Three Voices Rule.** Archivo Black for names and titles, Manrope for what you read and tap, Instrument Serif italic for one phrase in a line. Do not add a fourth face.

**The Title Tracking Rule.** Display and title tracking is −0.02em. Do not tighten past −0.04em.

## Layout

Public pages keep a slim outer gutter (8px, 12px from the medium breakpoint) around a photograph, then a paper sheet of content capped near 72rem with 16px of inner padding. Sections separate by about 56px; groups inside a section sit at 16px; labels sit 8px under the thing they caption.

The sheet overlaps the photograph (`-2rem`, `-3rem` from the medium breakpoint). Its top radius is the panel step, and the sheet step from the medium breakpoint. The bottom of the photograph stays square so that radius is the only curve at the join.

Account pages are a centered column on the same paper: about 24rem on login, 28rem on the account status page, with 24px of side padding (40px, then 56px on login as the viewport grows). Login is a full viewport. From 1024px the paper column and the city photograph split half and half, paper on the left. Below that, the photograph is a 7rem band and the column fills the rest. That split belongs to the entry screen. It is not the catalog grid.

## Elevation & Depth

Depth is tonal and soft. A surface either steps from paper to raised paper, blurs as glass over a photograph, or picks up a diffused shadow. Shadows always have a vertical offset and a wide blur. The shared primary button does not rest on a shadow; it changes color. The account button and the floating catalog chrome do.

### Shadow Vocabulary

- **Account lift** (`box-shadow: 0 10px 28px rgba(26, 26, 26, 0.08)`): The Google continue button at rest.
- **Chrome lift** (`box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18)`): Search, empty states, and other catalog panels floating on a photograph. Menus go slightly heavier (`0 12px 40px rgba(0, 0, 0, 0.22)`).
- **Sheet** (`box-shadow: 0 -28px 70px rgba(26, 26, 26, 0.16)`): The paper sheet climbing over the hero. In the dark theme the same shadow uses `rgba(0, 0, 0, 0.55)`.

### Named Rules

**The Soft Lift Rule.** Shadows are offset and blurred, or the surface simply steps to raised paper. A hard, zero-blur offset shadow is not part of this system.

## Shapes

Actions, nav items, filters, and chips are full pills. Large containers use the named radii: card (1.5rem) for property cards and menus of that family, panel (1.75rem) for category tiles and the sheet's top on small screens, sheet (2.25rem) for the large sheet and the explore stage. The account button is the deliberate exception: a wide control with a 0.75rem radius, not a pill. Fields in the catalog are pills; compact numeric fields use the same 0.75rem radius as the account button.

The public header joins the photograph with a tab whose bottom corners follow the card radius and whose top corners scoop in by 0.875rem. Login does not use that tab.

Photographs are clipped to the radius of their container, or they bleed to the viewport edge on the login panel.

## Components

### Buttons

Shared actions feel like a solid stamp. The account action feels like a raised slip of paper.

- **Shape:** Pills, except the account button (0.75rem).
- **Primary:** The shared button. Accent fill, paper text, 44px tall, 20px of side padding, label type. The large size is 48px tall with 28px of side padding. Hover uses the muted accent. In the dark theme this fill becomes gold because `--accent` does.
- **Foreground:** Nav “Ingresar”, sign-out, active filters, and chips. Foreground fill and paper text, same pill. Hover fades to 90% opacity. In the light theme this matches the primary button. In the dark theme it stays a light pill, because it follows `--fg` and `--bg`, not `--accent`.
- **Gold:** Explore and the agency contact. Gold fill, `--gold-fg` text, pill. Hover uses muted gold. Full width only inside a narrow mobile stack.
- **Account:** “Continuar con Google”. Full width, 48px tall, raised paper, hairline border, account-lift shadow, 0.75rem radius, the Google mark at 20px, label type. Hover returns the fill to the page paper. Disabled opacity is 60%.
- **Secondary:** Glass fill, ink text, pill, 48px tall. Used for the quiet catalog action. On a photograph, the quiet action can instead be a hairline of white at 50% with white text.
- **Focus:** A 2px accent outline, 2px outside the control. The shared button draws the same idea as a ring and suppresses the outline.

### Chips

- **Style:** Foreground fill, paper text, full pill, 0.75rem type, about 4px by 10px of padding.
- **State:** They label a fact (beds, baths, area). Selected filters use the same ink pill; an unselected filter is ghosted ink that tints on hover.

### Cards / Containers

- **Corner Style:** Card radius.
- **Background:** Raised paper. Category tiles are photographs with a black gradient and white type, clipped to the panel radius.
- **Shadow Strategy:** Catalog cards on the landing lift slightly on hover (2px up) without a resting shadow. Map and explore cards use the chrome lift.
- **Border:** None on the landing card. Map previews use the hairline.
- **Internal Padding:** About 12px to 16px.

### Inputs / Fields

- **Style:** Pill, hairline border, paper or raised-paper fill, label type, stone placeholder.
- **Focus:** The street field darkens the border toward ink. The agency search and the global rule use the 2px accent outline. Numeric fields are 0.75rem radius and shift the border to the accent while focused.
- **Error:** Login errors are 0.875rem danger text under the account button, not a tinted field. There is no password field.

### Navigation

The public bar is a set of paper tabs on the photograph: a house mark, pill links, a foreground “Ingresar” pill, and a round theme toggle. The active link is a foreground pill. Inactive links are quiet and tint on hover. From the medium breakpoint down, the links drop into a card-radius menu with the chrome-lift shadow. When the bar pins, it is a solid chrome strip with a light drop shadow (`0 8px 24px rgba(0, 0, 0, 0.12)`).

Login replaces that bar with the Archivo Black wordmark, linked home. The account status page uses the public bar again.

### Login photograph

The entry screen's right panel (top band on a phone) is the city photograph, full bleed. From 1024px a black gradient covers the lower part and carries two lines: Instrument Serif, then Archivo Black. On load the photograph settles once from scale 1.06 to 1, over 1.1s, with `cubic-bezier(0.16, 1, 0.3, 1)`. Reduced motion removes that animation.

## Do's and Don'ts

### Do:

- **Do** set pages on warm paper and raised surfaces on the elevated paper.
- **Do** set titles in Archivo Black at −0.02em, body and controls in Manrope, and at most one italic Instrument Serif phrase in a line.
- **Do** make catalog, nav, and sign-out actions full pills in the accent or the foreground.
- **Do** keep gold on the few invitations and pins that already use it.
- **Do** make “Continuar con Google” a full-width raised-paper button with a 0.75rem radius, a hairline, and the account lift.
- **Do** draw focus as a 2px accent outline, 2px outside the control.
- **Do** collapse authored motion when reduced motion is requested.

### Don't:

- **Don't** introduce a fourth typeface or a pure white page ground.
- **Don't** spend gold on body text, navigation chrome, or the account button.
- **Don't** use a hard, zero-blur offset shadow.
- **Don't** turn the Google continue control into an explore pill.
- **Don't** specify a system display face as the title voice. The title face is Archivo Black.
