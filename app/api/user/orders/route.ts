import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { isAuthenticated } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAuthenticated(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const orders = await Order.find({ userId: user._id })
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
        id: user._id,
        name: user.name,
        email: user.email,
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
