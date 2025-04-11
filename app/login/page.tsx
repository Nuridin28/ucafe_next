"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { validateEmail, validateRequired } from "@/lib/utils"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useTranslation()
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string
      password?: string
    } = {}

    if (!validateRequired(email)) {
      newErrors.email = t("validation.required")
    } else if (!validateEmail(email)) {
      newErrors.email = t("validation.invalidEmail")
    }

    if (!validateRequired(password)) {
      newErrors.password = t("validation.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: t("login.success"),
        description: t("login.successMessage"),
      })
    } catch (error) {
      toast({
        title: t("login.error"),
        description: t("login.errorMessage"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">UCAFE</CardTitle>
          <CardDescription className="text-center">{t("login.enterCredentials")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("login.loggingIn") : t("login.login")}
            </Button>
            <div className="text-center text-sm">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {t("login.register")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
