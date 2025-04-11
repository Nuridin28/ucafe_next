import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { isAdmin } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const orders = await Order.find()
      .populate({
        path: "userId",
        model: "User",
        select: "name email",
      })
      .populate({
        path: "items.foodId",
        model: "Food",
        select: "name price imageUrl",
      })
      .sort({ createdAt: -1 })

    // Преобразовать данные в формат, ожидаемый фронтендом
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      user: {
        id: order.userId._id,
        name: order.userId.name,
        email: order.userId.email,
      },
      items: order.items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
        food: {
          id: item.foodId._id,
          name: item.foodId.name,
          price: item.foodId.price,
          imageUrl: item.foodId.imageUrl,
        },
      })),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
