"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { FoodCard } from "@/components/food-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { type FoodItem, getFoodRecommendations, getAllFood } from "@/lib/api"

export default function UserDashboard() {
  const [recommendations, setRecommendations] = useState<FoodItem[]>([])
  const [allFood, setAllFood] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recommendationsData, allFoodData] = await Promise.all([getFoodRecommendations(), getAllFood()])
        setRecommendations(recommendationsData)
        setAllFood(allFoodData)
      } catch (error) {
        toast({
          title: t("dashboard.error"),
          description: t("dashboard.errorFetchingData"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t, toast])

  if (loading) {
    return <div className="flex justify-center p-8">{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboard.welcome")}</h1>

      <Tabs defaultValue="recommendations">
        <TabsList className="mb-4">
          <TabsTrigger value="recommendations">{t("dashboard.recommendations")}</TabsTrigger>
          <TabsTrigger value="all">{t("dashboard.allFood")}</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("dashboard.recommendedForYou")}</h2>
          {recommendations.length === 0 ? (
            <p>{t("dashboard.noRecommendations")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <h2 className="text-xl font-semibold">{t("dashboard.allItems")}</h2>
          {allFood.length === 0 ? (
            <p>{t("dashboard.noFood")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFood.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
