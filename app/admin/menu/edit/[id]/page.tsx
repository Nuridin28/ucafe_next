"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getFoodById, updateFood } from "@/lib/api"
import { validateRequired } from "@/lib/utils"

export default function EditFoodPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    price?: string
    category?: string
    quantity?: string
  }>({})
  const router = useRouter()
  const { t } = useTranslation()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const food = await getFoodById(id)
        setName(food.name)
        setDescription(food.description)
        setPrice(food.price.toString())
        setCategory(food.category)
        setQuantity(food.quantity.toString())
        setCurrentImage(food.imageUrl)
      } catch (error) {
        toast({
          title: t("admin.menu.error"),
          description: t("admin.menu.errorFetchingItem"),
          variant: "destructive",
        })
        router.push("/admin/menu")
      } finally {
        setLoading(false)
      }
    }

    fetchFood()
  }, [id, router, t, toast])

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      description?: string
      price?: string
      category?: string
      quantity?: string
    } = {}

    if (!validateRequired(name)) {
      newErrors.name = t("validation.required")
    }

    if (!validateRequired(description)) {
      newErrors.description = t("validation.required")
    }

    if (!validateRequired(price)) {
      newErrors.price = t("validation.required")
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = t("validation.invalidPrice")
    }

    if (!validateRequired(category)) {
      newErrors.category = t("validation.required")
    }

    if (!validateRequired(quantity)) {
      newErrors.quantity = t("validation.required")
    } else if (isNaN(Number(quantity)) || Number(quantity) < 0 || !Number.isInteger(Number(quantity))) {
      newErrors.quantity = t("validation.invalidQuantity")
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
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("quantity", quantity)
      if (image) {
        formData.append("image", image)
      }

      await updateFood(id, formData)

      toast({
        title: t("admin.menu.success"),
        description: t("admin.menu.itemUpdated"),
      })

      router.push("/admin/menu")
    } catch (error) {
      toast({
        title: t("admin.menu.error"),
        description: t("admin.menu.errorUpdatingItem"),
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
      <h1 className="text-3xl font-bold mb-6">{t("admin.menu.editItem")}</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("admin.menu.itemDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.menu.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("admin.menu.description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t("admin.menu.price")}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t("admin.menu.quantity")}</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t("admin.menu.category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder={t("admin.menu.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Dishes</SelectItem>
                  <SelectItem value="side">Side Dishes</SelectItem>
                  <SelectItem value="dessert">Desserts</SelectItem>
                  <SelectItem value="drink">Drinks</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">{t("admin.menu.image")}</Label>
              {currentImage && (
                <div className="mb-2">
                  <img
                    src={currentImage || "/placeholder.svg"}
                    alt={name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0])
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/menu")}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? t("common.saving") : t("common.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
