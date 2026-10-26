# Arrancar Calendars en Windows

El `README.md` de Dapta explica el arranque con `pnpm dev`. En Windows hay tres
cosas que lo impiden; aquí está cómo sortearlas. Probado el 26 oct 26 con
Windows 11, Node 22.23.4 y pnpm 10.15.0.

Todos los comandos, desde **git-bash** (o WSL): los scripts del repo usan
sintaxis de shell POSIX y no funcionan en PowerShell ni en `cmd`.

## 1. Node 22, no Node 24

Con Node 24, `pnpm install` falla en `better-sqlite3` (la base de datos local
del modo rápido): no tiene versión precompilada para Node 24 en Windows e intenta
compilarla, lo que exige Visual Studio Build Tools. Con Node 22 se descarga ya
compilada. Es además la versión que fija Dapta en `.nvmrc`.

La forma cómoda es un gestor de versiones, para que cada proyecto use la suya:

```bash
winget install Schniz.fnm
fnm install 22
fnm use 22
node -v    # v22.x
```

Para que la terminal cargue fnm al abrirse, sigue la sección de git-bash de
https://github.com/Schniz/fnm#shell-setup.

## 2. pnpm a través de Corepack

El repo fija su versión de pnpm en `package.json` (`packageManager`). Corepack,
que viene con Node, la usa sin instalar pnpm global:

```bash
corepack enable pnpm
pnpm -v    # 10.15.0
```

Si `corepack enable` pide permisos de administrador, es que Node está instalado
en `Program Files`. Con fnm no pasa.

## 3. Instalar y preparar

```bash
pnpm install --frozen-lockfile
pnpm run build:packages
pnpm run db:setup          # crea .data/dev.db con los datos de demo
```

El aviso `Ignored build scripts: @nestjs/core` es normal: Dapta no lo deja
ejecutar a propósito.

## 4. Arrancar la web y la API por separado

`pnpm dev` levanta la web, pero la API se queda colgada sin escuchar: su modo de
recarga automática (`tsx watch`) no arranca bajo turbo en Windows. Se lanzan en
dos terminales.

Usamos los puertos **3111** (web) y **4111** (API), los que propone Dapta para
una segunda instancia, para poder tener Forms en 3000 y 4000 a la vez:

```bash
# Terminal 1: API en el puerto 4111
cd apps/api && API_PORT=4111 PUBLIC_APP_URL=http://localhost:3111 pnpm exec tsx src/main.ts
```

```bash
# Terminal 2: web en el puerto 3111
cd apps/web && NEXT_PUBLIC_API_URL=http://localhost:4111 API_URL=http://localhost:4111 PUBLIC_APP_URL=http://localhost:3111 pnpm exec next dev -p 3111
```

`PUBLIC_APP_URL` en la API es lo que la deja aceptar peticiones de la web en
3111. Si solo vas a usar Calendars, puedes dejar los puertos por defecto (3000 y
4000) quitando esas variables y el `-p 3111`.

La API así no se recarga sola: tras cambiar algo en `apps/api` o en
`packages/`, se para con Ctrl+C y se vuelve a lanzar.

Al arrancar, la web de Next.js reescribe sola algún fichero suyo (`apps/web/next-env.d.ts`, `apps/web/AGENTS.md`). No es un cambio nuestro: no se sube. Se deshace con `git checkout -- <fichero>`.

## 5. Comprobar

- API: http://localhost:4111/health devuelve `"status":"ok"` y `"db":"up"`.
- Página de reserva de demo: http://localhost:3111/acme/alex-rivera/intro-call
- Panel: http://localhost:3111/admin (entra solo como el usuario de demo).
- Volver a los datos de demo: `pnpm db:reset`.
