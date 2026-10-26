# Marca: de Dapta Calendars a AxonCalendar

Inventario de todo lo que lleva la marca de Dapta en este repo y cómo se
sustituye por la de Axon. Es el plan de la fase de marca: solo logos, colores,
letra y textos con el nombre. La interfaz y el backend se quedan como los
escribe Dapta (ver [`UPSTREAM.md`](UPSTREAM.md)).

Inventario hecho el 26 oct 26 sobre `upstream/main` (`c7663e2`).

## Decisiones

| Qué | Decisión | Estado |
|---|---|---|
| Nombre | **AxonCalendar**. Producto aparte de AxonForm | Decidido, 26 oct 26 |
| Logo | Como el de AxonSynapse: el nombre en Alan Sans 800 con un punto del color de acento detrás, y un icono propio para el favicon | Hecho, 26 oct 26: `components/brand/axon-logo.tsx` y favicon (icono sobre baldosa `#1a1a1c`) |
| Letra | **Alan Sans**, la misma que AxonSynapse y el resto de Axon | Decidido, 26 oct 26 |
| Colores | **Naranja AxonCalendar** (rectifica el azul, 26 oct 26). Claro: relleno `#F75C03` con texto `#1a1a1c` encima (blanco no llega: 3,2:1); texto o línea en naranja sobre fondo claro, `#c64a02`. Oscuro: el mismo `#F75C03` de relleno con texto `#1a1a1c`; texto en naranja sobre fondo oscuro, `#fc7a30`. Sustituye al verde de Dapta | Decidido, 26 oct 26 |
| Sello «Hecho con…» | Se muestra y lleva a la web de Axon Growth (`NEXT_PUBLIC_SIGNUP_URL`), en las páginas de reserva y en los emails | Decidido, 26 oct 26; se activa en el despliegue |
| Color por defecto de las páginas de reserva | Naranja `#f75c03` (`DEFAULT_ACCENT`) para quien no tiene color guardado | Hecho, 26 oct 26 |
| Color de las cuentas nuevas | Naranja `#de5303` (`NEW_HOST_ACCENT`) sobre fondo claro: `#f75c03` se queda en 2,9:1 y Dapta pide 3:1 | Hecho, 26 oct 26 |
| Texto y etiquetas del sello | «Conoce Axon Growth» y «AxonCalendar es una herramienta de Axon Growth». UTM `utm_source=axon-calendar`, `utm_campaign=made-with-axon` | Hecho, 26 oct 26 |
| Enlace a la plataforma | «Axon Growth», lleva a `https://www.axon-growth.com/` (`NEXT_PUBLIC_PLATFORM_URL`). Sustituye a «Dapta Agents» en la barra y en el selector, con el símbolo de Axon Growth (`apps/web/public/axon-growth-mark.png`) | Hecho, 26 oct 26; falta fijar la URL en el despliegue |
| Selector de productos y botón de inicio de sesión | Neutros: «Productos» e «Iniciar sesión» | Hecho, 26 oct 26 |
| Frases de la suscripción de Dapta AI | Sin suscripción: «Incluido en tu plan»; el ajuste del sello se llama «Marca de AxonCalendar» | Hecho, 26 oct 26 |

## Lo que Dapta ya dejó preparado para un fork

Dapta separa su marca del producto: su arte solo se pinta cuando la variable
`NEXT_PUBLIC_PRODUCT_NAME` vale `Dapta Calendars` o `dCalendars`
(`apps/web/lib/product-name.ts`). En un fork sale una marca neutra: el nombre
en texto y un cuadradito con la inicial. Por eso una parte del cambio no toca
código, solo configuración.

## Inventario

### 1. Configuración (variables de entorno, sin tocar código)

| Variable | Qué cambia | Valor para AxonCalendar |
|---|---|---|
| `NEXT_PUBLIC_PRODUCT_NAME` | Nombre en la barra lateral, el selector de apps, el título y la descripción de la web (`app/layout.tsx`) y el nombre del conector para agentes de IA | `AxonCalendar` |
| `NEXT_PUBLIC_SIGNUP_URL` | A dónde lleva el sello «Hecho con…» de las páginas de reserva y de los emails | `https://www.axon-growth.com/` |
| `NEXT_PUBLIC_HIDE_BADGE` | Oculta el sello | Sin fijar: el sello se muestra |
| `NEXT_PUBLIC_PLATFORM_URL` | Enlace «Axon Growth» de la barra lateral y del selector de apps | `https://www.axon-growth.com/` |
| `NEXT_PUBLIC_FORMS_URL` | Enlace a Forms del selector de apps | La URL de AxonForm |
| `PREMIUM_FEATURES` | `open` deja todo abierto y oculta lo que depende de la suscripción de Dapta AI | `open` mientras no haya cobro propio |
| `MAIL_FROM_NAME` y `MAIL_FROM_EMAIL` | Nombre y dirección de los emails | `AxonCalendar` y el dominio que se elija |

Las `NEXT_PUBLIC_*` son de compilación: se fijan al construir la imagen de la
web.

### 2. Colores (`packages/shared/src/tokens.css`)

El acento de Dapta es **Signal Green** (`#3ddc84`), con tinta negra encima.
Se sustituye en el bloque oscuro y en el claro:

- `--signal`, `--signal-foreground`, `--signal-edge`, `--signal-ink`
- `--ring` (el anillo de foco del teclado)

Ojo al contraste: Dapta pone siempre texto negro sobre el verde. Con un acento
más oscuro (un azul, por ejemplo) el texto encima tiene que ser blanco, así que
`--signal-foreground` cambia también. `packages/shared/src/tokens.spec.ts`
comprueba los tokens: si falla por el cambio de color, se ajusta y se anota en
el registro de `UPSTREAM.md`.

`packages/shared/src/branding.ts` guarda el color con el que se pinta la página
de reserva de quien no eligió ninguno. Cambiarlo cambia todas esas páginas: se
decide junto con el acento.

### 3. Letra

| Dónde | Ahora | Cambio |
|---|---|---|
| `apps/web/app/layout.tsx` (`next/font`) y `apps/web/app/globals.css` (`--font-sans`) | Figtree | Alan Sans |

Alan Sans está en Google Fonts (licencia OFL), así que se carga igual que hoy
Figtree, con `next/font`, sin servidores de terceros en el navegador.
`apps/web/app/layout.spec.tsx` simula Figtree: se ajusta con el cambio.

### 4. Logos e iconos

| Fichero | Qué es | Cambio |
|---|---|---|
| `apps/web/components/brand/brand.tsx` | Decide qué marca se pinta; en un fork, el cuadradito con la inicial | Pintar nuestro logo en vez del cuadradito. Nuestro logo, en un fichero nuevo (`components/brand/axon-logo.tsx`) |
| `apps/web/app/icon.svg`, `apple-icon.png`, `favicon.ico` | Favicon e iconos | Nuestro icono |
| `apps/web/components/brand/calendars-logo.tsx`, `apps/web/public/dapta-mark.png` | Arte de Dapta | No se borra (solo sale en su build); no se usa |
| `apps/web/app/[accountCode]/[handle]/opengraph-image.tsx` | Imagen al compartir una página de reserva | Revisar que no lleve marca de Dapta en un fork |
| `apps/web/components/made-with-badge.tsx` | Sello de las páginas de reserva | Texto del catálogo (punto 5) y enlace por configuración (punto 1) |

### 5. Textos con el nombre (catálogo)

Hay unas 35 apariciones de «Dapta» en `packages/shared/src/i18n/index.ts`
(inglés y español):

- **Producto:** «Made with Dapta Calendars», «Powered by Dapta Calendars»,
  «Dapta Calendars es gratis para todos», «Así Dapta Calendars revisa
  conflictos reales…».
- **Plataforma Dapta:** «Productos Dapta», «Dapta Agents», «Continuar con
  Dapta» (botón del login).
- **Suscripción de Dapta AI:** el ajuste «Marca de Dapta» (quitar el sello) y
  los enlaces personalizados, «incluidos con tu suscripción de Dapta AI». Con
  `PREMIUM_FEATURES=open` no se cobra nada; el texto hay que cambiarlo igual.

Cambiarlas una a una es la mayor fuente de conflictos: Dapta toca el catálogo en
casi cada versión. La propuesta es una capa de sustitución:

- un fichero nuestro (`packages/shared/src/i18n/axon-brand.ts`) con la tabla
  de sustituciones (`Dapta Calendars` → `AxonCalendar`, «Productos Dapta» → …, y
  las frases de la suscripción enteras), que recorre el catálogo una vez y
  devuelve la copia cambiada;
- y una sola línea en `getMessages` para que devuelva el catálogo pasado por
  esa capa.

Así, cada texto nuevo que añada Dapta con su marca sale ya con la nuestra, y el
catálogo no se toca.

### 6. Emails

`packages/notifications/src/email-layout.ts`: el pie de los emails de reserva
dice «Hecho con Dapta Calendars» (inglés y español). Cambio directo en la zona
de marca.

### 7. Lo que se queda tal cual

No son marca visible o romperían la compatibilidad con Dapta:

- Nombres internos: el paquete `@slate/*`, `IS_DAPTA_BRAND`,
  `dapta-branding.ts`, `dapta-sync.effects.ts` y las variables `DAPTA_SYNC_*`
  e `IAM_*` (son la puerta para mandar las altas a nuestro CRM).
- Los mensajes de `embed.js`: son el contrato con las webs donde se incrusta la
  página de reserva.
- Comentarios del código y el arte de Dapta.

## Estado (26 oct 26)

Hecho: nombre (por `.env` en local), letra, color de acento, logo con punto,
favicon e icono de iOS. Textos con la marca de Dapta, mediante la capa
`packages/shared/src/i18n/axon-brand.ts` (lo que quede con «Dapta» sale como
«Axon Growth»). Pie y color de acento de los emails. Color por defecto de las páginas de
reserva. Verdes de Dapta escritos
a mano: el brillo de la barra lateral y las animaciones de la página para
desarrolladores. Ficheros tocados, en el registro de `UPSTREAM.md`.

Pendiente:

- Variables del despliegue del punto 1 (`NEXT_PUBLIC_PRODUCT_NAME`,
  `NEXT_PUBLIC_PLATFORM_URL`, `NEXT_PUBLIC_SIGNUP_URL`…). Son de compilación.

## Orden de trabajo propuesto

1. Configuración (punto 1): da el nombre en la interfaz sin tocar código.
2. Colores y letra (puntos 2 y 3).
3. Logo e iconos (punto 4), cuando estén diseñados.
4. Capa de textos (punto 5) y emails (punto 6).
5. Revisar en el navegador modo claro y oscuro, página de reserva y panel, y
   anotar en el registro de `UPSTREAM.md` cada fichero de Dapta tocado.
