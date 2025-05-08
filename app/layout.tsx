import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DocFlow - Автоматизация обработки документов",
  description: "Система автоматизации обработки документов для Департамента образования",
    generator: 'v0.dev'
}



export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
