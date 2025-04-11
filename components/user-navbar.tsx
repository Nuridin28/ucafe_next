"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useTheme } from "next-themes"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, ShoppingCart, User, ClipboardList, LogOut, Menu, Sun, Moon, Globe } from "lucide-react"

export function UserNavbar() {
  const [open, setOpen] = useState(false)
  const { logout, user } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const { setTheme, theme } = useTheme()
  const { items } = useCart()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  const navLinks = [
    { href: "/user", label: t("nav.home"), icon: <Home className="h-5 w-5 mr-2" /> },
    { href: "/user/orders", label: t("nav.orders"), icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { href: "/user/profile", label: t("nav.profile"), icon: <User className="h-5 w-5 mr-2" /> },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/user" className="flex items-center space-x-2">
            <span className="font-bold text-xl">UCAFE</span>
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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/user/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
            </Link>
          </Button>

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
                <Link
                  href="/user"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  <Home className="h-5 w-5 mr-2" />
                  {t("nav.home")}
                </Link>
                <Link
                  href="/user/orders"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  <ClipboardList className="h-5 w-5 mr-2" />
                  {t("nav.orders")}
                </Link>
                <Link
                  href="/user/profile"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" />
                  {t("nav.profile")}
                </Link>
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
