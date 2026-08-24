import type { Metadata } from "next"
import { Work_Sans, Fraunces, Space_Mono } from "next/font/google"
import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import "./globals.css"

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
})

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase.from("site_content").select("*")
  const content = getSiteContent(data)

  return {
    title: `${content.site_name} Fotografía`,
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
      className={`${workSans.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}