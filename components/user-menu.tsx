"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, UserCircle, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import Swal from "sweetalert2"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    Swal.fire({
      title: "Выход из системы",
      text: "Вы уверены, что хотите выйти?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да, выйти",
      cancelButtonText: "Отмена",
      confirmButtonColor: "#10b981",
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
      }
    })
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
          <User className="h-5 w-5" />
          <span>Войти</span>
        </button>
      </Link>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium">{user.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Мой профиль</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Настройки</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/help")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Помощь</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
