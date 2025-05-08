"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

interface MobileMenuProps {
  currentPath: string
}

export function MobileMenu({ currentPath }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { path: "/", label: "Главная" },
    { path: "/dashboard", label: "Панель управления" },
    { path: "/cases", label: "Дела" },
    { path: "/analytics", label: "Аналитика" },
    { path: "/about", label: "О системе" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">DocFlow</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Закрыть меню</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-2 py-1 rounded-md transition-colors ${
                  currentPath === item.path
                    ? "bg-emerald-100 text-emerald-900 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-sm font-medium text-emerald-700">ИП</span>
              </div>
              <span className="text-sm font-medium">Иван Петров</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
