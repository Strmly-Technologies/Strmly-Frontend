import type React from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { ThemeProvider } from "@/components/ThemeProvider"
import Providers from "@/components/Providers"
import { Toaster } from "@/components/ui/sonner"
import { Poppins } from 'next/font/google';
import AuthProvider from "@/providers/AuthProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Customize as needed
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "STRMLY - Social Video Platform",
  description: "Share your moments with the world",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
            <Providers>
            <ThemeProvider defaultTheme="dark">
              <Toaster
                position="top-center"
                richColors
              />
              <ClientLayout>{children}</ClientLayout>
            </ThemeProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
