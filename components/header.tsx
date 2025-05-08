"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { MobileMenu } from "@/components/mobile-menu"
import { UserMenu } from "@/components/user-menu"
import Cookies from 'js-cookie'

interface HeaderProps {
  currentPath: string
}

export function Header({ currentPath }: HeaderProps) {
  const menuItems = [
    { path: "/", label: "Главная", hasJwt: true },
    { path: "/dashboard", label: "Панель управления", hasJwt: Cookies.get("token") ? true : false },
    { path: "/cases", label: "Дела", hasJwt: Cookies.get("token") ? true : false  },
    { path: "/analytics", label: "Аналитика", hasJwt: Cookies.get("token") ? true : false  },
    { path: "/about", label: "О системе", hasJwt: true },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-semibold">DocFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.filter(menuItem => menuItem.hasJwt).map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium ${
                currentPath === item.path ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <MobileMenu currentPath={currentPath} />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
