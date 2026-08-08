import type { Metadata } from "next"
import { Inter, Fraunces } from "next/font/google"
import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase.from("site_content").select("*")
  const content = getSiteContent(data)

  return {
    title: `${content.site_name} — Fotografía`,
    description: content.hero_tagline || `Portfolio de ${content.site_name}`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}