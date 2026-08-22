# Photography Portfolio

Sitio de portfolio para fotógrafos, con un panel de administración privado
para editar todo el contenido sin tocar código: textos, imágenes, trabajos
publicados y entradas de diario.

Construido con Next.js (App Router) y Supabase como backend (base de datos,
autenticación y almacenamiento de archivos).

## Características

- **Sitio público de una sola página**: portada, sobre mí, galería de
  trabajos con filtro por categoría y visor a pantalla completa, servicios,
  diario/noticias y contacto.
- **Panel de administración** (`/panel`) protegido por login, para:
  - Editar los textos e imágenes del sitio (portada, biografía, contacto).
  - Subir, editar, publicar/despublicar y borrar fotos del portfolio.
  - Crear y administrar entradas de diario, cada una con su propia página.
- **Persistencia de sesión** vía middleware, y seguridad de datos manejada
  con Row Level Security de Postgres: cualquier visitante solo puede leer
  contenido publicado; solo un usuario autenticado puede escribir.
- Animaciones sutiles de scroll y transición con Framer Motion, imágenes
  optimizadas con `next/image` y diseño totalmente responsivo.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- [Framer Motion](https://www.framer.com/motion/) para animaciones
- [Lucide](https://lucide.dev) para iconos

## Estructura del proyecto

```
app/
  page.tsx                 Página pública principal
  diario/[id]/page.tsx     Página individual de una entrada de diario
  panel/
    login/page.tsx         Login del panel de administración
    dashboard/page.tsx     Dashboard del panel
    dashboard/actions.ts   Server Actions (subir, editar, borrar, publicar)
    layout.tsx             Layout del panel (tema oscuro, tipografías)
  layout.tsx                Layout raíz del sitio público
  globals.css               Estilos globales y tokens de color (Tailwind theme)
  icon.tsx                   Favicon generado

components/
  site/                      Componentes del sitio público (Hero, About,
                              Work, Journal, Services, Contact, Footer, etc.)
  panel/                     Componentes del panel de administración
                              (PhotoManager, JournalManager, SiteContentEditor,
                              PanelNav, controles de formulario compartidos)

hooks/
  useSavableField.ts         Maneja el ciclo edición -> guardado con feedback
                              visual (usado en todos los formularios del panel)
  useFilePreview.ts           Vista previa de archivos antes de subirlos

lib/
  types.ts                   Tipos que reflejan el esquema de Supabase
  site-content.ts             Definición de los campos editables del sitio
  storage.ts                  Helper para construir URLs públicas de archivos
  supabase/                   Clientes de Supabase (browser, servidor, middleware)

supabase/
  schema.sql                  Esquema completo: tablas, políticas de RLS
                              y bucket de almacenamiento

proxy.ts                      Middleware de Next.js: refresca la sesión y
                              protege las rutas del panel
```

## Puesta en marcha

### 1. Requisitos

- Node.js 20 o superior
- Una cuenta y un proyecto de [Supabase](https://supabase.com) (el plan
  gratuito alcanza de sobra)

### 2. Clonar e instalar dependencias

```bash
git clone https://github.com/briabril/photography-portfolio.git
cd photography-portfolio
npm install
```

### 3. Crear el proyecto de Supabase

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor** y pegá el contenido completo de
   `supabase/schema.sql`. Esto crea las tablas, las políticas de seguridad
   (RLS) y el bucket de almacenamiento `photos`, además de cargar textos de
   ejemplo.
3. Andá a **Authentication > Users** y creá manualmente el único usuario
   que va a poder entrar al panel (no hay registro público por diseño).

### 4. Configurar las variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores con los de tu
proyecto (**Project Settings > API** en Supabase):

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 5. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público y
[http://localhost:3000/panel/login](http://localhost:3000/panel/login) para
entrar al panel con el usuario creado en el paso 3.

## Scripts disponibles

| Comando         | Descripción                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción                            |
| `npm run start` | Sirve el build de producción                   |
| `npm run lint`  | Corre ESLint sobre todo el proyecto            |

## Despliegue

El proyecto está pensado para desplegarse en [Vercel](https://vercel.com):

1. Importá el repositorio en Vercel.
2. Configurá las mismas variables de entorno del paso 4 en la sección
   **Environment Variables** del proyecto.
3. Desplegá. Cada push a la rama principal genera un nuevo deploy.

El backend (base de datos, autenticación y almacenamiento) queda en
Supabase; no requiere infraestructura adicional.

## Seguridad de los datos

La seguridad no depende de ocultar ninguna clave: la `anon key` de Supabase
es pública por diseño. El control de acceso real está en las políticas de
Row Level Security definidas en `supabase/schema.sql`:

- Cualquier visitante puede **leer** solo el contenido marcado como
  publicado.
- Solo un usuario **autenticado** (el que se creó a mano en Supabase) puede
  leer contenido sin publicar, subir archivos, y crear, editar o borrar
  fotos y entradas de diario.

## Licencia

Proyecto de uso personal. 
