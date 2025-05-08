"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    // Проверка аутентификации при загрузке
    const checkAuth = async () => {
      try {
        const token = Cookies.get("token")
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Если токен недействителен, удаляем его
          Cookies.remove("token")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Функция входа в систему
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Сохраняем токен в cookie
        Cookies.set("token", data.token, { expires: 7 }) // 7 дней
        return { success: true }
      } else {
        return { success: false, message: data.message || "Не удалось войти в систему" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Произошла ошибка при авторизации" }
    }
  }

  // Функция регистрации
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Сохраняем токен в cookie
        Cookies.set("token", data.token, { expires: 7 }) // 7 дней
        return { success: true }
      } else {
        return { success: false, message: data.message || "Не удалось зарегистрироваться" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Произошла ошибка при регистрации" }
    }
  }

  // Функция выхода из системы
  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
