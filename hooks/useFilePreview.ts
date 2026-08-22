import { useEffect, useRef, useState } from "react"

/**
 * Crea y libera automáticamente un object URL para mostrar una vista
 * previa del archivo elegido en un <input type="file">, antes de que
 * termine de subirse. Se usa en los formularios de subida del panel
 * (fotos, tapa de diario, imágenes del sitio).
 */
export function useFilePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    previewUrlRef.current = previewUrl
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  function selectFile(file: File | null | undefined) {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    selectFile(e.target.files?.[0])
  }

  function clear() {
    selectFile(null)
  }

  return { previewUrl, selectFile, onFileInputChange, clear }
}
