"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import Swal from "sweetalert2"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        Swal.fire({
          title: "Успех!",
          text: "Вы успешно вошли в систему",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push("/dashboard")
        })
      } else {
        Swal.fire({
          title: "Ошибка!",
          text: result.message || "Проверьте ваши данные и попробуйте снова",
          icon: "error",
          confirmButtonColor: "#10b981",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      Swal.fire({
        title: "Ошибка!",
        text: "Произошла ошибка при входе в систему",
        icon: "error",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-semibold">DocFlow</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container flex items-center justify-center py-10">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в систему</CardTitle>
            <CardDescription>Введите ваши данные для входа в DocFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Пароль
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-emerald-600 hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
              <div className="text-center text-sm">
                Нет аккаунта?{" "}
                <Link href="/auth/register" className="text-emerald-600 hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">© 2025 DocFlow. Все права защищены.</div>
      </footer>
    </div>
  )
}
