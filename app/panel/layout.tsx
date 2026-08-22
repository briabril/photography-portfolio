import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-panel-bg font-(family-name:--font-body) text-panel-foreground antialiased`}
    >
      {children}
    </div>
  )
}