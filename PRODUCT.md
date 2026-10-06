# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quien busca una propiedad en San Carlos de Bolívar (venta, alquiler o temporal) entra sin cuenta, elige un aviso y contacta a la inmobiliaria.

La inmobiliaria entra con Google. Publicar no viene con la cuenta: el equipo de Inmu la asigna a mano a una inmobiliaria. Hasta entonces la cuenta existe y no puede cargar avisos.

El particular que publica en nombre propio queda para después, sin pantalla ni flujo propio ahora.

## Product Purpose

Inmu es el portal local de San Carlos de Bolívar. Conecta venta y alquiler con mapa, filtros y el catálogo de las inmobiliarias de la ciudad. Quien busca elige el aviso; la inmobiliaria cierra el trato.

## Positioning

El catálogo es de una sola ciudad y las inmobiliarias locales son quienes publican y cierran. No es un portal nacional ni un clasificado donde cualquiera sube un aviso por su cuenta.

## Operating Context

La exploración (inicio, mapa, ficha, directorio de inmobiliarias) es pública. El ingreso es solo para quien va a publicar o administrar.

El equipo de Inmu habilita cuentas desde un panel: vincula una cuenta de Google a una inmobiliaria. Los avisos de hoy en el front son datos de prueba; el backend del proyecto Supabase Inmo (`hkojikwadtngrxtaumrg`) está en otra organización, no en MatiasDev.

## Capabilities and Constraints

- La cuenta se crea solo con Google. No hay alta por mail, contraseña ni otro proveedor.
- Identidad y permiso están separados. La fila de perfil no otorga publicación. Publicar exige una membresía a una inmobiliaria, creada por el equipo.
- El administrador no se marca en datos que el usuario pueda editar.
- A futuro, un aviso de particular se cuelga de la persona y no de la membresía. Ese caso no se construye ahora.
- Cómo se administra el particular sigue abierto.

## Brand Commitments

El nombre público es Inmu. La constante `brandName` en `src/lib/brand.ts` dice Inmu.

La pantalla de ingreso sigue la composición de referencia que pasó el equipo: panel de acceso a la izquierda y panel visual a la derecha, con un solo medio de entrada (Google).

## Evidence on Hand

- Front en Next.js con datos de prueba en `src/lib/properties/seed.ts` y directorio en `src/lib/agencies/seed.ts`.
- La pantalla `/ingresar` existe y todavía no autentica.
- No hay testimonios, precios de producto ni casos reales para mostrar. No inventarlos.

## Product Principles

- Quien busca encuentra un aviso local; la inmobiliaria cierra.
- Entrar con Google no es lo mismo que poder publicar.
- Una sola puerta de cuenta, y el permiso lo da el equipo.
- El particular se deja preparado en el modelo, sin producto visible todavía.
- El alcance es San Carlos de Bolívar.
