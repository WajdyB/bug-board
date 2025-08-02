import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bug Board - Submit Ideas & Report Bugs",
  description:
    "A community-driven platform for submitting bug reports and feature ideas. Vote on submissions and engage in discussions.",
  keywords: "bug tracker, feature requests, community feedback, ideas"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
        {children}
      </body>
    </html>
  )
}
