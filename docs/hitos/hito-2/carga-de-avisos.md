---
slug: carga-de-avisos
hito: 2
estado: in-progress
creada: 2026-10-08
---

# Carga de avisos (prototipo visual)

> Wizard mobile para cargar un aviso, con **datos en memoria**. Un paso por pantalla, la
> URL dice en qué paso estás. No guarda en ningún servidor: al recargar, los campos vuelven
> a vacío. Depende de las pantallas de [`ingreso-y-cuenta.md`](ingreso-y-cuenta.md) (la barra
> y el botón "Cargar aviso").
>
> Reemplaza el borrador del panel que estaba en la raíz de `docs/` (2026-10-08). El aviso que se arma es el
> `Property` de `modelo-de-busqueda`: no se piden campos que la ficha pública no muestra.

## Problema

`/publicar` entra al primer paso del wizard. Para ver si el formulario se entiende en
el celu hace falta el recorrido completo, antes de tener Supabase.

## Objetivo

En el celular, una inmobiliaria completa un aviso en siete pasos, con los tipos, las zonas y
las características que ya usa el buscador. Puede salir cuando quiere. Al final ve una
pantalla quieta con tres links. Nada se persiste.

## Historias de usuario

- Como **inmobiliaria**, quiero cargar una casa en venta sin ver campos de un terreno ni de
  un portal nacional.
- Como **inmobiliaria**, quiero ocultar la dirección y que el mapa igual tenga un punto.
- Como **inmobiliaria**, quiero irme a la mitad y volver a la cuenta, sabiendo que el
  prototipo no guarda lo escrito.

## Cómo se recorre (el mock)

| URL | Paso |
|---|---|
| `/publicar/operacion` | 1. Operación y tipo |
| `/publicar/ubicacion` | 2. Zona y dirección |
| `/publicar/medidas` | 3. Medidas |
| `/publicar/precio` | 4. Precio |
| `/publicar/caracteristicas` | 5. Características |
| `/publicar/fotos` | 6. Fotos |
| `/publicar/texto` | 7. Título y descripción |
| `/publicar/listo` | Publicado (mock) |

Un paso que no está en la tabla responde 404. El orden de "Siguiente" y "Anterior" es el de
la tabla. Los valores viven en el cliente; si se recarga o se abre el paso directo, el
formulario está vacío y el paso se ve igual.

"Salir" va a `/cuenta?como=vacio`. No hay diálogo: no hay nada guardado.

## Pantalla base

A 360 px, sin columna de pasos. El paso se lee en el título.

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo            Salir    │ la barra de ingreso-y-cuenta
│ Norte Propiedades                  │
├────────────────────────────────────┤
│ Paso 2 de 7                        │ 14 px, tinta suave
│ ¿Dónde está?                       │ h1
│                                    │
│ (campos del paso)                  │
│                                    │
├────────────────────────────────────┤
│ [ Anterior ]        [ Siguiente ]  │ fijos abajo, ≥ 44 px
└────────────────────────────────────┘
```

- En el paso 1 no está "Anterior".
- En el paso 7, "Siguiente" se llama **Publicar**.
- "Guardar borrador", en el paso 7, es un link a `/cuenta?como=lista`. No escribe el
  formulario en esa lista: la lista de prueba ya tiene un borrador.
- Inputs a 16 px. Opciones grandes, como el buscador, no `<select>` nativos para operación,
  tipo, zona ni características.
- El cascarón es el del alta de la inmobiliaria: en escritorio, la lista de pasos a la
  izquierda (ícono, línea, título). En 360 px, los mismos círculos en una fila que scrollea
  adentro, más "Paso N de 7". Un paso siguiente no se abre desde la lista hasta pasar por
  Siguiente; la URL directa sí abre ese paso, vacío.
- El pie (Anterior / Siguiente) queda fijo abajo de la columna. Los campos scrollean.

## Pasos

### 1. Operación y tipo (`/publicar/operacion`)

- Operación: **Venta**, **Alquiler**, **Alquiler temporario**. Una sola.
- Tipo: grilla con el ícono de lucide que ya usa cada tipo. Solo los de
  `tiposDe(operacion)`, en ese orden. Al cambiar la operación, un tipo que no aplica se
  deselecciona.
- Temporario ofrece casa, departamento y casa quinta. No hay "terreno / lote" ni
  "galpón / depósito": los nombres son los de la taxonomía (Terreno, Galpón, Casa quinta).

### 2. Ubicación (`/publicar/ubicacion`)

- Zona: la lista cerrada, agrupada en Ciudad, Afueras y Localidades del partido. Una sola.
- Calle y altura: un texto (`address`). Sin piso ni departamento: no están en el aviso.
- **Mostrar la dirección exacta**: interruptor, prende por defecto.
- Mapa con un pin en el centro de Bolívar (`BOLIVAR_CENTER`). Se puede arrastrar. El mapa es
  isla cliente y se pide solo en este paso. La atribución de OpenStreetMap queda visible.
- Con el interruptor apagado, el mapa sigue y el texto de ayuda dice que en la ficha se va a
  ver la zona, no la calle.

### 3. Medidas (`/publicar/medidas`)

Según el tipo elegido en el paso 1. Si se abrió este paso directo, se muestran las medidas de
una casa y un texto chico: "Ejemplo para una casa. Elegí el tipo en el paso 1."

| Tipo | Campos |
|---|---|
| Casa, departamento, PH, casa quinta | Ambientes, dormitorios, baños, cocheras, m² total, m² cubiertos, años (0 = a estrenar) |
| Terreno | m² total |
| Campo | Hectáreas |
| Local, oficina, galpón | m² total, m² cubiertos, baños, cocheras |
| Cochera | m² total |

Contadores con botones − y +, no un teclado como primera opción. Las superficies sí se
escriben.

### 4. Precio (`/publicar/precio`)

- Moneda: USD o ARS. Arranca en la de la operación (venta USD, alquiler y temporario ARS).
  No se convierte el monto al cambiarla: el número queda y cambia la etiqueta.
- Monto, entero.
- **Consultar precio**: si está marcado, el monto se vacía y se deshabilita.
- Expensas (ARS por mes) y **No paga expensas**: solo si el tipo es departamento o PH.

No hay "apto profesional" ni "acepta permuta".

### 5. Características (`/publicar/caracteristicas`)

Chips de varias. Solo `caracteristicasDe(operacion)`:

| Operación | Qué se ofrece |
|---|---|
| Venta | Cochera, pileta, patio o jardín, parrilla, apto crédito, a estrenar |
| Alquiler y temporario | Cochera, pileta, patio o jardín, parrilla, acepta mascotas, amoblado |

Nada de SUM, gimnasio, gas, cloacas, cámaras ni seguridad 24 h: el buscador no las filtra y
la ficha no las muestra.

### 6. Fotos (`/publicar/fotos`)

- Elegir varias con `<input type="file" accept="image/*" multiple>`.
- Se ven en miniatura en el orden elegido. La primera lleva la pastilla **Portada**.
- Cada una tiene **Subir** y **Bajar** (reordenar sin arrastrar).
- Se pueden sacar.
- Las imágenes son object URLs.
- Abajo, videos: `<input type="file" accept="video/*" multiple>`, vista local con
  `<video controls>` y **Sacar**. No son la portada. Tampoco se suben.
- No hay plano ni recorrido 360.

### 7. Texto (`/publicar/texto`)

- Título, una línea. Si hay tipo, zona y dormitorios en memoria, viene un sugerido editable
  ("Casa de 3 dormitorios en Centro"). Si no, el campo queda vacío con el placeholder
  "Casa de 3 dormitorios en Centro".
- Descripción: `<textarea>` de texto plano. Sin negritas y sin botón de IA.
- **Publicar** → `/publicar/listo`.
- **Guardar borrador** → `/cuenta?como=lista`.

### Listo (`/publicar/listo`)

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo            Salir    │
│                                    │
│ El aviso quedó publicado           │
│ En el prototipo no se guardó.      │
│                                    │
│ Ver en el sitio                    │ ficha de un id del seed
│ Cargar otro                        │ /publicar/operacion?nuevo=1
│ Ir a mis avisos                    │ /cuenta?como=lista
└────────────────────────────────────┘
```

Sin ilustración ni animación. El texto dice que no se guardó, para que no se pruebe el mock
como si fuera el alta real.

## Alcance

**Entra:** las ocho rutas, los campos de las tablas, el pin arrastrable en el paso 2, la
previsualización local de fotos y de videos, el título sugerido cuando los pasos anteriores están en
memoria.

**No entra:**

- Persistir el aviso, el borrador automático, ni editar un aviso existente con sus datos
  (Editar, en la cuenta, abre el paso 1 vacío).
- Agente responsable, equipo, Meta Ads, texto enriquecido, plano, recorrido 360.
- Métricas del aviso.
- Campos que no están en `Property` (piso, superficie semicubierta, frente/contrafrente,
  antigüedad en tres categorías). El video se previsualiza y no se guarda: `Property` no
  tiene ese campo.

## Criterios de aceptación

- [ ] A 360 px, cada paso muestra su título y sus campos sin scroll horizontal. El pie
      (Anterior / Siguiente) se ve sin tapar el último campo: el contenido scrollea, el pie
      queda fijo.
- [ ] Con Venta elegida se puede elegir Terreno; con Alquiler temporario, no.
- [ ] El paso de medidas de un campo pide hectáreas. El de un terreno pide m² y no pide
      dormitorios.
- [ ] Expensas solo aparecen en departamento y PH.
- [ ] El paso de características de un alquiler ofrece mascotas y amoblado, y no ofrece apto
      crédito.
- [ ] La primera foto lleva "Portada". Subir y Bajar cambian el orden.
- [ ] Publicar lleva a `/publicar/listo` y esa pantalla no anima.
- [ ] Recargar `/publicar/ubicacion` muestra el paso vacío, con el pin en el centro de
      Bolívar.
- [ ] El mapa no se descarga en los otros pasos.

## Riesgos

- El mapa en el paso 2 pesa. Es el único paso que lo carga (`next/dynamic`, `ssr: false`).
- El estado en memoria se pierde al recargar. Es el techo de este prototipo; al conectar el
  alta, el borrador pasa a Supabase y estas rutas dejan de ser solo visuales.

## Lo que se encontró al implementar

- El alta de la inmobiliaria ya tenía la lista de pasos a la izquierda. Este wizard usa el
  mismo cascarón (Manuel, 2026-10-08). La spec lo había dejado afuera.
- Los videos quedan como object URL en el navegador. No van a la ficha ni a `Property`.

## Preguntas abiertas

- Ninguna para el prototipo. Al conectar el alta: si el borrador se retoma en el paso donde
  se dejó, y si Editar abre el wizard con los datos.
