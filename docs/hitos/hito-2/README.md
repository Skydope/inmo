# Hito 2 — El resto del sitio y datos reales

⏳ el hito 1 no cerró. Hay dos specs **visuales** en borrador (mocks, sin Google ni Supabase).
No cambian el orden de ejecución.

Lo que el hito 1 deja afuera a propósito: re-vestir las pantallas que no son del recorrido de
búsqueda, y pasar de datos de prueba a **avisos reales cargados por las inmobiliarias** en
Supabase (proyecto `hkojikwadtngrxtaumrg`, ver FICHA).

| Spec | Estado | Qué cubre |
|---|---|---|
| [`ingreso-y-cuenta`](ingreso-y-cuenta.md) | `draft` (2026-10-08), solo pantallas | `/ingresar` y `/cuenta` con datos fijos. El botón de Google es un link |
| [`carga-de-avisos`](carga-de-avisos.md) | `in-progress` (2026-10-08), solo pantallas | `/publicar` en siete pasos, sin guardar |
| `inmobiliarias` | sin escribir | Directorio re-vestido + página de cada inmobiliaria con sus propiedades |
| `datos-reales` | sin escribir | Esquema en Supabase con la taxonomía del hito 1, adapter real, RLS. Recién cuando el hito 1 cierre |

## Fases del prototipo visual

Se construye en este orden. Cada fase se mira a 360 px antes de pasar a la siguiente. Una fase no arranca hasta tener la referencia visual de esa fase (captura, link, o "seguí la spec").

| Fase | Pantallas | Qué se puede recorrer al terminar | Qué no entra |
|---|---|---|---|
| **1. Acceso** | `/ingresar`, `/ingresar?como=pendiente` | Google lleva al pendiente. "Escribir por WhatsApp", mientras se prueba, entra a la bienvenida (`/cuenta?como=primera`) | Lista de avisos, wizard |
| **2. Cuenta vacía** | `/cuenta?como=primera`, `/cuenta?como=vacio`, `/cuenta/datos` | Alta en 4 pasos (nombre y logo, oficina, contacto, matrícula) con checks a la izquierda en escritorio. Datos repite esos pasos para corregirlos | Lista de avisos, wizard de avisos |
| **3. Listado** | `/cuenta?como=lista` | Pestañas Borradores (1) y Publicados (2), tarjeta con foto, precio y zona, Ver y Editar, Cargar aviso | Que Editar abra el wizard con datos. Editar queda para la fase 4, apuntando a `/publicar/operacion` vacío |
| **4. Elegir** | `/publicar/operacion`, `/publicar/caracteristicas` | Operación, tipos según la operación, chips de características según la operación. Pie Anterior / Siguiente y "Paso N de 7" | Mapa, medidas, precio, fotos |
| **5. Datos del inmueble** | `/publicar/ubicacion`, `/publicar/medidas`, `/publicar/precio` | Zona, calle, ocultar dirección, pin arrastrable. Medidas según el tipo. Precio, moneda, consultar, expensas solo en departamento y PH | Fotos, texto, persistir |
| **6. Cierre** | `/publicar/fotos`, `/publicar/texto`, `/publicar/listo` | Elegir fotos, portada, subir y bajar. Videos locales, sin subir. Título sugerido y descripción plana. Publicar muestra la pantalla quieta de listo | Plano, recorrido 360, IA, animación, guardado real |

| Archivo | Qué guarda |
|---|---|
| 📋 [`pendientes.md`](pendientes.md) | Lo anotado para este hito |
| ✅ `completado.md` | Se crea con el primer cierre |
