---
slug: ingreso-y-cuenta
hito: 2
estado: draft
creada: 2026-10-08
---

# Ingreso y cuenta (prototipo visual)

> Pantallas de acceso y de la cuenta de una inmobiliaria, con **datos fijos**. No hay Google,
> ni Supabase, ni lista blanca real: cada pantalla es una ruta y el botón "Continuar con
> Google" es un link. Cuando se conecte el ingreso, se reemplaza ese link; las pantallas
> quedan.
>
> Reemplaza el borrador de acceso que estaba en la raíz de `docs/` (2026-10-08). El panel de
> carga está en [`carga-de-avisos.md`](carga-de-avisos.md). No cambia el orden del hito 1.

## Problema

`/ingresar` ya entra con Google de verdad y `/cuenta` dice que publicar se habilita "cuando
te vinculamos". Para ver el recorrido de una inmobiliaria (no está en la lista, primera vez,
cuenta vacía, cuenta con avisos) hay que tener una sesión real. Estas pantallas se necesitan
antes, para mirarlas en el celu.

## Objetivo

Con links, sin backend, se puede recorrer: ingreso → no autorizado, ingreso → primera vez →
cuenta vacía, y cuenta con avisos de prueba. La cuenta es de **una** inmobiliaria ya cargada.
A 360 px no hay riel ni métricas. En escritorio, la cuenta ya abierta es una hoja clara
sobre el papel: riel angosto (Avisos, Datos, Salir), el ítem activo como pastilla, título
a la izquierda y "Cargar aviso" a la derecha. El alta y los datos siguen con la lista de
pasos, dentro de la misma hoja.

## Historias de usuario

- Como **inmobiliaria que todavía no está habilitada**, quiero que me lo digan claro y tener
  un WhatsApp para escribir.
- Como **inmobiliaria que entra por primera vez**, quiero confirmar el nombre, el WhatsApp y
  el logo, y después ver la cuenta vacía.
- Como **inmobiliaria que ya cargó avisos**, quiero ver borradores y publicados, y un botón
  para cargar otro.

## Cómo se recorre (el mock)

Nada llama a `signInWithOAuth`. El estado es la URL.

| URL | Qué se ve |
|---|---|
| `/ingresar` | Ingreso |
| `/ingresar?como=pendiente` | Correo no habilitado |
| `/cuenta?como=primera` | Bienvenida, una sola vez |
| `/cuenta?como=vacio` | Cuenta sin avisos |
| `/cuenta?como=lista` | Borradores y publicados de prueba |
| `/cuenta/datos` | Nombre, WhatsApp y logo, para corregirlos |

Un `como` desconocido en `/cuenta` muestra la cuenta vacía.

La inmobiliaria fija es **Norte Propiedades** (la del seed: logo, WhatsApp `5492314421101`,
Av. San Martín 840). No se elige entre varias.

Los avisos de `/cuenta?como=lista` son tres objetos fijos en un solo módulo de mock (dos
publicados, un borrador). Los números de la pantalla salen de esa lista. No hay visitas,
porcentajes ni favoritos.

## Pantallas

Barra en el celu (en `/cuenta`, `/cuenta/datos` y en el wizard de carga; no en `/ingresar`):

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo            Salir    │ 56 px. Salir → /ingresar
└────────────────────────────────────┘
```

En escritorio, `/cuenta?como=vacio` y `/cuenta?como=lista` reemplazan esa barra por el riel.
El alta y `/cuenta/datos` mantienen Salir arriba a la derecha, junto a la lista de pasos.

Sin el header público ni el pie. "Salir" no cierra una sesión: vuelve a `/ingresar`.

### Ingreso (`/ingresar`)

Se mantiene el layout que ya está (foto a la derecha en escritorio, franja arriba en el
celular, logo, título). Cambia el botón y el pie.

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                     │
│                                    │
│ Ingresá                            │
│ Con tu cuenta de Google.           │
│ Publicar se habilita cuando tu     │
│ inmobiliaria está adherida.        │
│                                    │
│ [ G  Continuar con Google ]        │ link a /cuenta?como=primera
│                                    │
│ ¿Tu inmobiliaria todavía no está?  │
│ Escribinos                         │ link a /ingresar?como=pendiente
└────────────────────────────────────┘
```

- El botón se ve como el de Google (marca de Google + texto) y es un `<a>`. Mide ≥ 44 px.
  En la fase 1 el href es `/ingresar?como=pendiente`. En la fase 2 pasa a
  `/cuenta?como=primera`.
- "Escribinos" no abre WhatsApp todavía: lleva a la pantalla de no habilitado, que es donde
  está el contacto.

### No habilitado (`/ingresar?como=pendiente`)

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                     │
│                                    │
│ Acceso pendiente                   │
│                                    │
│ Este correo no está entre las      │
│ inmobiliarias habilitadas. Si ya   │
│ nos escribiste, estamos dando de   │
│ alta. Si no, escribinos y la       │
│ sumamos.                           │
│                                    │
│ [ Escribir por WhatsApp ]          │ → /cuenta?como=primera
│ Volver a ingresar                  │ → /ingresar
└────────────────────────────────────┘
```

- Mientras se prueba el prototipo, "Escribir por WhatsApp" no abre el chat: entra a la
  bienvenida, como si fuera el primer ingreso. El `wa.me` vuelve cuando haya número del portal.
- No dice el correo, porque en el prototipo nadie ingresó uno.

### Primera vez (`/cuenta?como=primera`)

Cuatro pasos, con los datos que ya muestra la ficha. En escritorio, lista a la izquierda:
ícono por paso, línea entre uno y el siguiente. Al completar, el círculo se llena de negro
(el acento de la marca, sin un tilde) y la sección siguiente entra en fade. En 360 px esa
columna no entra: los mismos círculos, unidos por una línea, y arriba "Paso N de 4". Al
entrar (solo la primera vez) un velo con blur avisa que es la versión piloto; se cierra con
Entendido. El nombre corta a 40 caracteres. El logo se centra a mano en un recuadro.

1. **La inmobiliaria.** Nombre y logo.
2. **La oficina.** Calle (predice a partir de 3 letras) y altura en la misma fila, más un mapa
   (OpenStreetMap). Buscar se habilita con los dos campos o al tocar el mapa, y marca el punto
   con el logo del paso anterior. Tocar el mapa completa la calle y la altura. No es el
   domicilio fiscal. No pide la ubicación del celular.
3. **Contacto.** WhatsApp y teléfono muestran la bandera y +54; se completa el resto. El
   WhatsApp no puede quedar vacío. Mail opcional.
4. **Matrícula.** Puede quedar vacía. **Comenzar** va a `/cuenta?como=vacio`.

No se pide CUIT, CUIL ni domicilio fiscal: el portal no factura.

- Los campos vienen llenos con Norte Propiedades. Al tocar Comenzar **no se guardan**.
- El logo se arrastra y se acerca en un visor cuadrado (círculo de guía). Al confirmar,
  queda un PNG de 512 px en memoria. No se sube. Si pesa más de 1,5 MB, no abre el recorte.
- **Al conectar el alta** (no está en este prototipo): ese cuadrado se codifica a **WebP**
  calidad 0.8, lado 512, y se guarda en el almacenamiento. El código del recorte deja el
  lado anotado en `src/lib/logo-recorte.ts` (`LADO_SALIDA`).
- Un paso siguiente no se puede abrir hasta pasar por Continuar. Anterior vuelve.

### Cuenta vacía (`/cuenta?como=vacio`)

En el celu, barra con logo y Salir. En escritorio, el riel. El título es "Avisos" y
"Cargar aviso" queda a la derecha (arriba del pliegue). La frase va en una card.

```
┌────────────────────────────────────┐
│ Avisos              [Cargar aviso] │
│ Norte Propiedades                  │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Todavía no publicaste          │ │
│ │ ningún aviso.                  │ │
│ └────────────────────────────────┘ │
│ Datos de la inmobiliaria           │ solo en el celu → /cuenta/datos
└────────────────────────────────────┘
```

"Cargar aviso" va a `/publicar/operacion?nuevo=1`.

### Cuenta con avisos (`/cuenta?como=lista`)

El mismo cascarón. Las pestañas no navegan: muestran la parte de la lista fija que
corresponde. El conteo es el largo de cada parte. Arranca en Publicados.

```
┌────────────────────────────────────┐
│ Avisos              [Cargar aviso] │
│ Norte Propiedades                  │
│                                    │
│ [ Publicados 2 ]  Borradores 1     │
│                                    │
│ ┌────┬────────────────────────────┐│
│ │foto│ Casa de dos plantas…       ││
│ │    │ US$ 185.000 · Centro       ││
│ │    │ Publicado · Editar · Ver   ││
│ └────┴────────────────────────────┘│
└────────────────────────────────────┘
```

- Las pestañas no navegan: muestran la parte de la lista fija que corresponde. El conteo es
  el largo de cada parte.
- **Editar** → `/publicar/operacion?nuevo=1` (abre el paso 1 vacío).
- **Ver** → la ficha pública de un id del seed, en otra pestaña (`<a target="_blank">`). El borrador no tiene Ver.
- No hay Pausar, Cerrar, métricas, consultas ni equipo.

### Datos (`/cuenta/datos`)

Los mismos cuatro pasos, para corregirlos. En este caso todos los pasos se pueden abrir
(ya están completos: el actual no lleva check, el resto sí). **Listo** vuelve a
`/cuenta?como=vacio`. No persiste.

## Alcance

**Entra:** las seis rutas de la tabla, la barra de la cuenta, los tres avisos fijos, la
previsualización local del logo.

**No entra:**

- Google, Supabase, cookies de sesión, whitelist de verdad.
- Sidebar de métricas, consultas y equipo. CUIT, CUIL y domicilio fiscal. Meta Ads, badge "Verificada".
- Elegir entre varias inmobiliarias.
- Guardar el nombre, el WhatsApp o el logo.
- Animación de bienvenida.

## Criterios de aceptación

- [ ] A 360 px, sin scroll horizontal, las seis URLs muestran su pantalla. El pliegue de
      `/cuenta?como=vacio` muestra el título y "Cargar aviso" sin bajar.
- [ ] "Continuar con Google" es un link. En la fase 1 va a `/ingresar?como=pendiente`;
      desde la fase 2, a `/cuenta?como=primera`. No hay pedido a Supabase ni a Google.
- [ ] "Escribir por WhatsApp", mientras se prueba, es un link a `/cuenta?como=primera`.
- [ ] En la lista, "Borradores" y "Publicados" muestran 1 y 2, que son los ítems del mock.
- [ ] Inputs a 16 px como mínimo. Cada control mide ≥ 44 px y tiene nombre accesible.
- [ ] Recargar no parte nada: cada URL se basta sola.

## Riesgos

- Que el botón siga llamando a `signInWithGoogle` al reusar la pantalla actual. El prototipo
  reemplaza esa acción por el link.
- Que más adelante se conecte Google y estas URLs con `como` queden públicas. Al conectar,
  se borran `como` y el módulo de mock.

## Preguntas abiertas

- Número real de WhatsApp del portal para "Escribir por WhatsApp". Hasta entonces, número de
  prueba.
