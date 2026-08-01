import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: photos, error: photosError }, { data: content, error: contentError }] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase.from("site_content").select("*"),
  ]);

  const text = Object.fromEntries(
    (content ?? []).map((c) => [c.key, c.value])
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-16 space-y-3">
        <h1 className="text-3xl font-light tracking-tight">
          {text.hero_title}
        </h1>
        <p className="text-neutral-500">{text.hero_subtitle}</p>
      </header>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {(photos ?? []).map((photo) => (
          <figure key={photo.id} className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                supabase.storage
                  .from("photos")
                  .getPublicUrl(photo.storage_path).data.publicUrl
              }
              alt={photo.title}
              className="w-full object-cover"
            />
            {photo.title && (
              <figcaption className="text-sm text-neutral-500">
                {photo.title}
              </figcaption>
            )}
          </figure>
        ))}
      </section>

      {text.about_text && (
        <section className="mx-auto mt-24 max-w-2xl space-y-4 text-neutral-700">
          <h2 className="text-lg font-medium">Sobre el fotógrafo</h2>
          <p className="whitespace-pre-line">{text.about_text}</p>
        </section>
      )}
    </main>
  );
}