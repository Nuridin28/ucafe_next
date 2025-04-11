"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile, getUserProfile } from "@/lib/api"
import { validateRequired } from "@/lib/utils"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
  }>({})
  const { user } = useAuth()
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile()
        setName(profile.name)
        setEmail(profile.email)
      } catch (error) {
        toast({
          title: t("profile.error"),
          description: t("profile.errorFetchingProfile"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, t, toast])

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
    } = {}

    if (!validateRequired(name)) {
      newErrors.name = t("validation.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setUpdating(true)

    try {
      await updateUserProfile({ name })
      toast({
        title: t("profile.success"),
        description: t("profile.profileUpdated"),
      })
    } catch (error) {
      toast({
        title: t("profile.error"),
        description: t("profile.errorUpdatingProfile"),
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.personalInfo")}</CardTitle>
          <CardDescription>{t("profile.updateYourInfo")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.email")}</Label>
              <Input id="email" value={email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">{t("profile.emailCannotBeChanged")}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updating}>
              {updating ? t("profile.saving") : t("profile.saveChanges")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
