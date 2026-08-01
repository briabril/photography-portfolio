"use client";

import { useState, useTransition } from "react";
import { updateSiteContent } from "@/app/panel/dashboard/actions";
import type { SiteContent } from "@/lib/types";

// Etiquetas legibles para cada "key" técnica, para que el panel no
// muestre nombres de variable crudos.
const LABELS: Record<string, string> = {
  hero_title: "Título principal",
  hero_subtitle: "Subtítulo",
  about_text: "Biografía",
  contact_email: "Email de contacto",
};

export default function SiteContentEditor({
  content,
}: {
  content: SiteContent[];
}) {
  return (
    <div className="space-y-4">
      {content.map((item) => (
        <ContentField key={item.key} item={item} />
      ))}
    </div>
  );
}

function ContentField({ item }: { item: SiteContent }) {
  const [value, setValue] = useState(item.value);
  const [isPending, startTransition] = useTransition();
  const isLongText = item.key === "about_text";

  function save() {
    if (value !== item.value) {
      startTransition(() => updateSiteContent(item.key, value));
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-sm text-neutral-600">
        {LABELS[item.key] ?? item.key}
      </label>
      {isLongText ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          rows={4}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      )}
      {isPending && <span className="text-xs text-neutral-400">Guardando...</span>}
    </div>
  );
}