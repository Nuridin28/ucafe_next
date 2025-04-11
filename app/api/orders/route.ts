import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Food from "@/models/Food"
import { isAuthenticated } from "@/lib/jwt"
import { generateOrderNumber } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAuthenticated(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Items are required" }, { status: 400 })
    }

    // Проверить элементы и рассчитать общую сумму
    let total = 0
    const orderItems = []

    for (const item of items) {
      const { foodId, quantity } = item

      if (!foodId || !quantity) {
        return NextResponse.json({ message: "Food ID and quantity are required for each item" }, { status: 400 })
      }

      const food = await Food.findById(foodId)

      if (!food) {
        return NextResponse.json({ message: `Food with ID ${foodId} not found` }, { status: 404 })
      }

      if (food.quantity < quantity) {
        return NextResponse.json({ message: `Not enough ${food.name} in stock` }, { status: 400 })
      }

      total += food.price * quantity
      orderItems.push({
        foodId,
        quantity,
        price: food.price,
      })

      // Обновить количество блюда
      await Food.findByIdAndUpdate(foodId, { quantity: food.quantity - quantity })
    }

    // Сгенерировать уникальный номер заказа
    const orderNumber = generateOrderNumber()

    // Создать заказ
    const order = await Order.create({
      orderNumber,
      total,
      status: "pending",
      userId: user._id,
      items: orderItems,
    })

    return NextResponse.json({
      orderId: order._id,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
