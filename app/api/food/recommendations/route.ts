import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Food from "@/models/Food"
import Order from "@/models/Order"
import { getCurrentUser } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await getCurrentUser(request)

    // Если пользователь не авторизован, вернуть популярные блюда
    if (!user) {
      // Получить популярные блюда (по количеству заказов)
      const popularFoods = await Food.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "items.foodId",
            as: "orders",
          },
        },
        {
          $addFields: {
            orderCount: { $size: "$orders" },
          },
        },
        {
          $sort: { orderCount: -1 },
        },
        {
          $limit: 6,
        },
      ])

      const formattedFoods = popularFoods.map((food) => ({
        id: food._id,
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        quantity: food.quantity,
        imageUrl: food.imageUrl,
      }))

      return NextResponse.json(formattedFoods)
    }

    // Получить историю заказов пользователя
    const userOrders = await Order.find({ userId: user._id }).populate({
      path: "items.foodId",
      model: "Food",
    })

    // Если у пользователя нет заказов, вернуть популярные блюда
    if (userOrders.length === 0) {
      const popularFoods = await Food.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "items.foodId",
            as: "orders",
          },
        },
        {
          $addFields: {
            orderCount: { $size: "$orders" },
          },
        },
        {
          $sort: { orderCount: -1 },
        },
        {
          $limit: 6,
        },
      ])

      const formattedFoods = popularFoods.map((food) => ({
        id: food._id,
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        quantity: food.quantity,
        imageUrl: food.imageUrl,
      }))

      return NextResponse.json(formattedFoods)
    }

    // Получить предпочитаемые категории пользователя
    const categoryCount: Record<string, number> = {}
    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.foodId.category
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })
    })

    // Отсортировать категории по количеству
    const preferredCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])

    // Получить ID блюд, которые пользователь уже заказывал
    const orderedFoodIds = userOrders.flatMap((order) => order.items.map((item) => item.foodId._id.toString()))

    // Получить рекомендации на основе предпочитаемых категорий
    const recommendations = await Food.find({
      category: { $in: preferredCategories },
      _id: { $nin: orderedFoodIds },
    }).limit(6)

    // Если недостаточно рекомендаций, добавить популярные блюда
    if (recommendations.length < 6) {
      const additionalFoods = await Food.find({
        _id: {
          $nin: [...recommendations.map((food) => food._id), ...orderedFoodIds],
        },
      })
        .sort({ createdAt: -1 })
        .limit(6 - recommendations.length)

      recommendations.push(...additionalFoods)
    }

    const formattedRecommendations = recommendations.map((food) => ({
      id: food._id,
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      quantity: food.quantity,
      imageUrl: food.imageUrl,
    }))

    return NextResponse.json(formattedRecommendations)
  } catch (error) {
    console.error("Get recommendations error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
