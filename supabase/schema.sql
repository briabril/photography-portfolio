-- ========================================
-- ESQUEMA DE BASE DE DATOS
-- ========================================

-- Tabla de fotos
create table photos (
    id uuid primary key default gen_random_uuid(),
    storage_path text not null,
    title text not null default '',
    description text not null default '',
    category text not null default 'general',
    sort_order integer not null default 0,
    published boolean not null default false,
    created_at timestamptz not null default now()
)

-- Tabla de contenido de texto del sitio (hero, bio, contacto, etc)
-- Un modelo clave/valor: simple y flexible, sin tener que migrar la tabla
-- cada vez que agreguen un campo de texto nuevo al sitio.

create table site_content (
    key text primary key,
    value text not null default ''
)

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Esto es lo que hace que sea seguro publicar el proyecto:
-- por defecto, nadie puede leer ni escribir nada. Después
-- abrimos permisos con "policies" bien específicas.
-- ============================================================

alter table photos enable row level security;
alter table site_content enable row level security 

-- cualquier visitante (rol "anon") puede LEER solo las fotos publicadas
create policy "Fotos publicadas son publicas"
    on photos for select
    to anon 
    using (published = true);

-- cualquier visitante puede leer el contenido de texto del sitio
create policy "Contenido del sitio es publico"
    on site_content for select
    to anon
    using (true)

-- Solo un usuario autenticado (logueado en /panel) puede ver
-- todas las fotos (publicadas o no), insertar, editar o borrar
create policy "Usuarios autenticados pueden leer todo"
    on photos for select
    to authenticated
    using (true);

create policy "Usuarios auntenticados pueden insertar fotos"
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

create policy "Usuarios autenticados pueden editar contenido"
    on site_content for update
    to authenticated
    using (true);

create policy "Usuarios autenticados pueden insertar contenido"
    on site_content for insert
    to authenticated
    with check (true);

-- ============================================================
-- STORAGE: bucket para las imágenes
-- Esto se puede crear desde el Dashboard (Storage > New bucket)
-- pero lo dej0 acá para que quede documentado.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- cualquiera puede ver las imagenes (bucket publico, son fotos de porfolio)
create policy "Imagenes son publicas"
    on storage.objects for select
    to public
    using (bucket_id = 'photos');

-- solo usuarios autenticados pueden subir/borrar imágenes
create policy "Usuarios autenticados pueden subir imagenes"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'photos');

create policy "Usuarios autenticados pueden borrar imagenes"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'photos')

-- ============================================================
-- Datos iniciales de ejemplo para site_content
-- ============================================================

insert into site_content (key, value) values 
    ('hero_title', 'Nombre del Fotógrafo'),
    ('hero_subtitle', "Fotografía editorial y de autor"),
    ('about_text', 'Escribí acpa la biografía.'),
    ('contact_email', 'contacto@ejemplo.com')
on conflict (key) do nothing;