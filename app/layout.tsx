import type React from "react"
import type { Metadata } from "next"
import { Inter, Amiri } from "next/font/google"
import "./globals.css"

// Définir les polices une seule fois dans le layout racine
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" })

export const metadata: Metadata = {
  title: "Le Merle Assistance Médicale",
  description: "Services médicaux et assistance à domicile",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} font-sans`}>{children}</body>
    </html>
  )
}
