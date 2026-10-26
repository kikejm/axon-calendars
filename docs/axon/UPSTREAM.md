# Fork de Axon Growth: cómo convivir con Dapta

Este repo es un fork público de
[Dapta-Tech/dapta-calendars-slate](https://github.com/Dapta-Tech/dapta-calendars-slate) (licencia
MIT). Dapta sigue mejorando el producto casi a diario y queremos todas esas
mejoras. Nuestra parte se limita a la **marca**: logos, colores, fuentes y
textos con el nombre del producto. Todo lo demás se queda como lo escribe Dapta.

Lo leen las personas y cualquier agente de programación que trabaje en el repo.
`CLAUDE.md` lo importa en su primera línea, así que manda sobre lo que diga el
resto de `CLAUDE.md` cuando choquen.

Este documento es público: aquí no van clientes, precios, cuentas ni decisiones
internas.

Para arrancarlo en local en Windows: [`LOCAL.md`](LOCAL.md).
Inventario y plan de la marca propia: [`MARCA.md`](MARCA.md).

## Remotos

| Remoto | Apunta a | Para qué |
|---|---|---|
| `origin` | `kikejm/axon-calendars` | Nuestro fork. Aquí se sube |
| `upstream` | `Dapta-Tech/dapta-calendars-slate` | Solo para traer cambios. La subida está bloqueada |

Nuestra rama principal es `main` y sigue a `upstream/main`, que solo recibe lo
que Dapta ya publica como versión estable. `develop` de Dapta no se trae.
En este fork no hay `develop`: las ramas de trabajo salen de `main` y vuelven a
`main` por PR, aunque `CLAUDE.md` o `CONTRIBUTING.md` de Dapta digan otra cosa.

Si `upstream` no está configurado en un clon nuevo:

```bash
git remote add upstream https://github.com/Dapta-Tech/dapta-calendars-slate.git
git remote set-url --push upstream no-push-to-dapta
git config rerere.enabled true
```

## La regla: el backend no se toca

Un fichero que no tocamos nunca da conflicto al traer las mejoras de Dapta. Por
eso el repo se divide en tres zonas.

| Zona | Rutas | Qué se puede hacer |
|---|---|---|
| **Nuestra** | `docs/axon/` y cualquier fichero nuevo que creemos | Todo. Dapta no lo conoce, así que nunca choca |
| **Marca** | `packages/shared/src/tokens.css` · `packages/shared/src/branding.ts` · `packages/shared/src/dapta-branding.ts` · cadenas con el nombre del producto en `packages/shared/src/i18n/index.ts` · `apps/web/public/` (`dapta-mark.png`) · `apps/web/app/icon.svg`, `apple-icon.png`, `favicon.ico` · `apps/web/components/brand/` · `apps/web/components/made-with-badge.tsx` · metadatos de `apps/web/app/layout.tsx` · textos de marca en `packages/notifications/src/templates.ts` y `email-layout.ts` | Solo cambios de marca: logos, colores, fuentes, radios, nombre del producto, enlaces del sello. Nada de lógica |
| **De Dapta** | Todo lo demás, en especial `apps/api/`, `packages/db/`, `packages/engine/`, `packages/types/`, `packages/calendar/`, `packages/crm/`, `packages/config/` y la lógica de `packages/notifications/` | No se toca |

Lo que necesitemos que no sea marca entra por las puertas que Dapta ya dejó
abiertas, sin cambiar su código:

- **Login:** el API acepta el token de cualquier servicio de identidad
  (`AUTH_PROVIDER=workos` con `JWT_SECRET`, ver `SELF-HOSTING.md`). El servicio
  de identidad vive fuera de este repo.
- **Integraciones y envíos:** variables de entorno y destinos ya previstos
  (`SELF-HOSTING.md`, «Full environment reference»).
- **Funciones de pago:** `PREMIUM_FEATURES` y el servicio de entitlements.

Si algo de verdad obliga a tocar la zona de Dapta, se habla antes, se hace en el
menor número de líneas posible y se anota en el registro de abajo.

## Cómo cambiar la marca sin crear conflictos

1. **Primero los tokens.** Un color o una fuente se cambian en `tokens.css`, no
   en los componentes. Los componentes ya leen las variables.
2. **Ficheros nuevos antes que ficheros suyos.** Un logo nuevo se añade como
   fichero propio y se cambia solo la línea que lo usa.
3. **Cambios mínimos.** No reformatear, no reordenar imports, no renombrar ni
   mover ficheros de Dapta. Cada línea tocada es un posible conflicto.
4. **Sin lógica en la zona de marca.** Si un cambio de marca pide una condición
   o un dato nuevo, no es de marca: se habla antes.
5. **Sus tests.** Algunos comprueban textos o la marca de Dapta. Si fallan por
   un cambio de marca, se ajusta el test y se anota en el registro.

## Traer las mejoras de Dapta

Cada una o dos semanas, o cuando Dapta publique algo que queramos. En Windows,
desde git-bash o WSL: los scripts del repo usan sintaxis de shell POSIX.

```bash
git switch main && git pull
git fetch upstream
git log --oneline main..upstream/main      # qué trae
git switch -c sync/upstream-AAAA-MM-DD
git merge --no-ff --signoff upstream/main
```

Si hay conflictos, se resuelven con la tabla de abajo y se cierra el merge con
`git commit -s`. Después:

```bash
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm glyph-gate && pnpm spacing-gate
```

La rama se sube a `origin` y entra en `main` por PR, **con commit de merge**:
nunca squash ni rebase, para que Git siga sabiendo qué parte de la historia de
Dapta ya tenemos.

El botón **«Sync fork»** de GitHub solo vale mientras no hayamos tocado nada. Con
cambios de marca hechos, la sincronización se hace siempre así, en local.

## Resolver conflictos

| Dónde | Qué hacer |
|---|---|
| Zona de Dapta | Quedarse con lo de Dapta (`git checkout --theirs <fichero>`). Si había un cambio nuestro anotado en el registro, volver a aplicarlo encima |
| Zona de marca | Coger lo de Dapta y volver a poner nuestra marca encima. Si Dapta cambió el diseño, decidir: adaptarlo a nuestra marca, cogerlo tal cual o no usarlo. Anotarlo en el registro |
| Zona nuestra | No debería pasar. Si pasa, Dapta ha creado un fichero con el mismo nombre: renombrar el nuestro |
| Capturas de tests (`__snapshots__`) | Coger las de Dapta y regenerarlas (`pnpm exec vitest run <test> -u`); revisar que la diferencia sea solo nuestra marca |

`rerere` (activado arriba) recuerda cada resolución y la repite sola la próxima
vez que aparezca el mismo conflicto. Es una opción de cada clon: hay que
activarla en cada equipo.

## Commits

- Cada commit lleva `Signed-off-by` (`git commit -s`): el CI de Dapta lo exige
  (DCO).
- Títulos con Conventional Commits, como el resto del repo (`feat:`, `fix:`,
  `docs:`, `chore:`).
- Sin flechas ni triángulos como botones (`pnpm glyph-gate`) y con el
  espaciado del sistema de diseño (`pnpm spacing-gate`): el CI de Dapta los
  comprueba.
- Sin nombres de proveedores de calendario en el código: Dapta conecta Google
  u Outlook desde un servicio aparte (`CALENDAR_BACKEND_MODULE`), nunca aquí.
- Antes de subir, `pnpm publish-gate` busca claves y tokens que no deberían
  estar en un repo público.

## Registro de cambios sobre ficheros de Dapta

Cada fichero de Dapta que cambiamos, con el motivo. Se consulta al resolver
conflictos y se mantiene al día en el mismo commit que el cambio.

| Fichero | Zona | Qué cambiamos | Por qué | Fecha |
|---|---|---|---|---|
| `CLAUDE.md` | De Dapta | Primera línea: importa este documento | Que cualquier agente lea estas reglas antes que las de Dapta | 26 oct 26 |
| `packages/shared/src/tokens.css` | Marca | `--signal*`, `--focus` y `--ring` del verde de Dapta al naranja de AxonCalendar, en los tres bloques (oscuro, claro y claro por preferencia del sistema) | Color de acento (MARCA.md, punto 2) | 26 oct 26 |
| `apps/web/app/globals.css` | Marca | `--font-sans` y `--font-mono` apuntan a Alan Sans | Letra (MARCA.md, punto 3) | 26 oct 26 |
| `apps/web/app/layout.tsx` | Marca | Importa `lib/axon-font.ts` y añade su variable a `<html>`; Figtree se sigue cargando | Cargar Alan Sans con el mínimo cambio | 26 oct 26 |
| `apps/web/app/layout.spec.tsx` | De Dapta (tests) | El simulacro de `next/font/google` incluye `Alan_Sans` | Sin él, el test del layout no arranca | 26 oct 26 |
| `apps/web/components/brand/brand.tsx` | Marca | En un fork, el nombre con punto (`AxonWordmark`), el icono (`AxonIcon`) y el dibujo para baldosas (`AxonGlyph`) sustituyen a la inicial | Logo (MARCA.md, punto 4) | 26 oct 26 |
| `apps/web/components/brand/brand.spec.tsx`, `apps/web/components/admin-shell.spec.tsx` | De Dapta (tests) | Tres tests de `brand.spec` y uno de `admin-shell.spec` esperan ahora nuestro logo en vez de la inicial | Comprueban justo lo que cambiamos | 26 oct 26 |
| `apps/web/app/icon.svg`, `apple-icon.png`, `favicon.ico` | Marca | Favicon e iconos de AxonCalendar | Logo (MARCA.md, punto 4) | 26 oct 26 |
| `packages/shared/src/i18n/index.ts` | Marca | Importa `i18n/axon-brand.ts` y `getMessages` devuelve el catálogo pasado por `withAxonBrand`. El catálogo no se toca | Textos con nuestra marca sin conflictos en cada versión (MARCA.md, punto 5) | 26 oct 26 |
| `packages/notifications/src/email-layout.ts` | Marca | Pie «Hecho con AxonCalendar» y `signal` del email de `#0e7a3f` a `#c64a02` | Emails (MARCA.md, punto 6); el test de la paleta ya fallaba por el cambio de acento | 26 oct 26 |
| `apps/web/components/app-switcher.tsx` | De Dapta | Fila de la plataforma: «Axon Growth» y un icono de globo en vez de «Dapta Agents» y `dapta-mark.png` | El texto y el logo estaban escritos en el componente, fuera del catálogo | 26 oct 26 |
| `apps/web/app/globals.css` | Marca | El brillo de «Conecta tu agente» y de la píldora «Recomendado» pasa de `rgb(61 220 132)` a `rgb(247 92 3)` | Verde de Dapta escrito a mano | 26 oct 26 |
| `apps/web/app/admin/developers/walk-kit.tsx`, `walkthrough.tsx`, `app-frames.tsx` | De Dapta | `#3DDC84` pasa a `#F75C03` (rellenos y bordes) y a `#fc7a30` (texto) | Verde de Dapta escrito a mano en las animaciones | 26 oct 26 |
| `packages/notifications/src/email-layout.spec.ts`, `notifications.spec.ts`, `__snapshots__/email-snapshots.spec.ts.snap`, `apps/api/src/hide-branding.spec.ts`, `apps/web/app/[accountCode]/branding-off.spec.tsx`, `__snapshots__/public-markup/*`, `apps/web/app/admin/settings/general/branding-setting.spec.tsx`, `apps/web/components/admin-shell.spec.tsx`, `app-switcher.spec.tsx` | De Dapta (tests) | Esperan los textos y el color nuevos; capturas regeneradas (solo cambia el nombre o el color) | Comprueban justo lo que cambiamos | 26 oct 26 |
| `packages/shared/src/branding.ts` | Marca | `DEFAULT_ACCENT` del lima de Dapta `#cbe84f` al naranja `#f75c03` | Color de las páginas de reserva sin color guardado (MARCA.md) | 26 oct 26 |
| `packages/shared/src/branding.spec.ts`, `apps/web/app/[accountCode]/__snapshots__/public-markup/event-unstyled.html` | De Dapta (tests) | Dos tests fijaban el lima como color por defecto; el de los preajustes del estudio usa ahora el lima escrito, no `DEFAULT_ACCENT`. Captura regenerada (solo cambia el color) | Comprueban justo lo que cambiamos | 26 oct 26 |
