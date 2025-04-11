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
import { getCafeProfile, updateCafeProfile } from "@/lib/api"
import { validateRequired } from "@/lib/utils"

export default function CafeProfilePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    openingHours?: string
    location?: string
  }>({})
  const { user } = useAuth()
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCafeProfile()
        setName(profile.name)
        setDescription(profile.description)
        setOpeningHours(profile.openingHours)
        setLocation(profile.location)
      } catch (error) {
        toast({
          title: t("admin.profile.error"),
          description: t("admin.profile.errorFetchingProfile"),
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
      description?: string
      openingHours?: string
      location?: string
    } = {}

    if (!validateRequired(name)) {
      newErrors.name = t("validation.required")
    }

    if (!validateRequired(description)) {
      newErrors.description = t("validation.required")
    }

    if (!validateRequired(openingHours)) {
      newErrors.openingHours = t("validation.required")
    }

    if (!validateRequired(location)) {
      newErrors.location = t("validation.required")
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
      await updateCafeProfile({
        id: "", // This will be set by the backend
        name,
        description,
        openingHours,
        location,
      })

      toast({
        title: t("admin.profile.success"),
        description: t("admin.profile.profileUpdated"),
      })
    } catch (error) {
      toast({
        title: t("admin.profile.error"),
        description: t("admin.profile.errorUpdatingProfile"),
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("admin.profile.title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.profile.cafeInfo")}</CardTitle>
          <CardDescription>{t("admin.profile.updateCafeInfo")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.profile.cafeName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("admin.profile.description")}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">{t("admin.profile.openingHours")}</Label>
              <Input
                id="openingHours"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Mon-Fri: 8:00-18:00, Sat-Sun: 10:00-16:00"
                className={errors.openingHours ? "border-destructive" : ""}
              />
              {errors.openingHours && <p className="text-sm text-destructive">{errors.openingHours}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("admin.profile.location")}</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Building 3, Floor 1"
                className={errors.location ? "border-destructive" : ""}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updating}>
              {updating ? t("common.saving") : t("common.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
