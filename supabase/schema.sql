-- ========================================
-- ESQUEMA DE BASE DE DATOS
-- Pegar completo en Supabase > SQL Editor > Run
-- ========================================

-- Tabla de fotos (portfolio / "Trabajos")
create table photos (
    id uuid primary key default gen_random_uuid(),
    storage_path text not null,
    title text not null default '',
    description text not null default '',
    category text not null default 'general',
    sort_order integer not null default 0,
    published boolean not null default false,
    created_at timestamptz not null default now()
);

-- Tabla de entradas de diario / noticias ("Journal")
create table journal (
    id uuid primary key default gen_random_uuid(),
    title text not null default '',
    excerpt text not null default '',
    body text not null default '',
    category text not null default 'General',
    cover_path text not null default '',
    sort_order integer not null default 0,
    published boolean not null default false,
    created_at timestamptz not null default now()
);

-- Tabla de contenido de texto/imagen del sitio (hero, bio, contacto, etc)
create table site_content (
    key text primary key,
    value text not null default ''
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Esto es lo que hace que sea seguro publicar el proyecto:
-- por defecto, nadie puede leer ni escribir nada.
-- ============================================================

alter table photos enable row level security;
alter table journal enable row level security;
alter table site_content enable row level security;

-- cualquier visitante (rol "anon") puede LEER solo las fotos publicadas
create policy "Fotos publicadas son publicas"
    on photos for select
    to anon
    using (published = true);

-- cualquier visitante puede leer solo las entradas de journal publicadas
create policy "Journal publicado es publico"
    on journal for select
    to anon
    using (published = true);

-- cualquier visitante puede leer el contenido de texto del sitio
create policy "Contenido del sitio es publico"
    on site_content for select
    to anon
    using (true);

-- Solo un usuario autenticado (logueado en /panel) puede ver
-- todas las fotos (publicadas o no), insertar, editar o borrar
create policy "Usuarios autenticados pueden leer todas las fotos"
    on photos for select
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden insertar fotos"
    on photos for insert
    to authenticated
    with check (true);

create policy "Usuarios autenticados pueden editar fotos"
    on photos for update
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden borrar fotos"
    on photos for delete
    to authenticated
    using (true);

-- Mismo esquema de permisos para journal
create policy "Usuarios autenticados pueden leer todo el journal"
    on journal for select
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden insertar journal"
    on journal for insert
    to authenticated
    with check (true);

create policy "Usuarios autenticados pueden editar journal"
    on journal for update
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden borrar journal"
    on journal for delete
    to authenticated
    using (true);

-- Contenido del sitio: solo autenticados escriben
create policy "Usuarios autenticados pueden editar contenido"
    on site_content for update
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden insertar contenido"
    on site_content for insert
    to authenticated
    with check (true);

-- ============================================================
-- STORAGE: bucket único para todas las imágenes del sitio
-- (fotos de portfolio, tapas de journal, foto de hero/perfil).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- cualquiera puede ver las imágenes (bucket público, son fotos de portfolio)
create policy "Imagenes son publicas"
    on storage.objects for select
    to public
    using (bucket_id = 'photos');

-- solo usuarios autenticados pueden subir/borrar imágenes
create policy "Usuarios autenticados pueden subir imagenes"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'photos');

create policy "Usuarios autenticados pueden actualizar imagenes"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'photos');

create policy "Usuarios autenticados pueden borrar imagenes"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'photos');

-- ============================================================
-- Datos iniciales de ejemplo para site_content
-- Estos textos se editan después desde /panel/dashboard.============================================================

insert into site_content (key, value) values
    ('site_name', 'Tu Nombre'),
    ('hero_eyebrow', 'Fotógrafo · Tu Ciudad'),
    ('hero_title', 'Tu Nombre'),
    ('hero_tagline', 'Una frase corta que describa tu trabajo y tu mirada como fotógrafo.'),
    ('hero_image_path', ''),
    ('about_heading', 'Hago fotografías que se sienten menos como imágenes y más como recuerdos.'),
    ('about_text', 'Escribí acá tu biografía. Podés usar varios párrafos: cada salto de línea se respeta al mostrarlo en la web.'),
    ('about_image_path', ''),
    ('contact_email', 'contacto@ejemplo.com'),
    ('contact_heading', 'Hablemos de tu próximo proyecto.'),
    ('contact_text', 'Encargos, colaboraciones o simplemente saludar: leo todos los mensajes y respondo personalmente.')
on conflict (key) do nothing;