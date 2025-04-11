"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Utensils, ClipboardList, User, LogOut, Menu, Sun, Moon, Globe } from "lucide-react"

export function AdminNavbar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  const navLinks = [
    { href: "/admin", label: t("admin.nav.dashboard"), icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { href: "/admin/menu", label: t("admin.nav.menu"), icon: <Utensils className="h-5 w-5 mr-2" /> },
    { href: "/admin/orders", label: t("admin.nav.orders"), icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { href: "/admin/profile", label: t("admin.nav.profile"), icon: <User className="h-5 w-5 mr-2" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold text-xl">UCAFE</span>
            <span className="text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded">
              {t("admin.nav.adminPanel")}
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English {language === "en" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ru")}>Русский {language === "ru" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("kz")}>Қазақша {language === "kz" && "✓"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  {t("nav.logout")}
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
