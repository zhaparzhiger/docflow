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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Ошибка!",
        text: "Пароли не совпадают",
        icon: "error",
        confirmButtonColor: "#10b981",
      })
      return
    }

    setLoading(true)

    try {
      const result = await register(name, email, password)

      if (result.success) {
        Swal.fire({
          title: "Успех!",
          text: "Вы успешно зарегистрировались",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push("/dashboard")
        })
      } else {
        Swal.fire({
          title: "Ошибка!",
          text: result.message || "Не удалось зарегистрироваться",
          icon: "error",
          confirmButtonColor: "#10b981",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      Swal.fire({
        title: "Ошибка!",
        text: "Произошла ошибка при регистрации",
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
            <CardTitle className="text-2xl">Регистрация</CardTitle>
            <CardDescription>Создайте аккаунт в системе DocFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Имя
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                />
              </div>
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
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Подтверждение пароля
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                    Регистрация...
                  </>
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
              <div className="text-center text-sm">
                Уже есть аккаунт?{" "}
                <Link href="/auth/login" className="text-emerald-600 hover:underline">
                  Войти
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
