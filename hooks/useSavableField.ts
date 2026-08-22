import { useState } from "react"
import type { SaveStatus } from "@/components/panel/SaveButton"

function isEqual<T>(a: T, b: T) {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object") return false
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Maneja el ciclo edición -> guardado de un campo o de un grupo de campos
 * (título, categoría, etc.) que se editan en el panel de administración.
 *
 * `original` es el valor que viene del servidor (una fila de Supabase).
 * Cuando la Server Action guarda con éxito y revalida la página, el nuevo
 * `original` vuelve a coincidir con `value` y el campo deja de estar
 * "sucio" automáticamente, sin lógica extra en cada componente.
 */
export function useSavableField<T>(original: T) {
  const [value, setValue] = useState(original)
  const [status, setStatus] = useState<SaveStatus>("idle")

  const dirty = !isEqual(value, original)

  async function save(persist: (value: T) => Promise<unknown>) {
    setStatus("saving")
    try {
      await persist(value)
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 1800)
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  return { value, setValue, dirty, status, save }
}
