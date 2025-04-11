import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Food from "@/models/Food"
import { isAdmin } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    // Получить общее количество заказов
    const totalOrders = await Order.countDocuments()

    // Получить ожидающие заказы
    const pendingOrders = await Order.countDocuments({ status: "pending" })

    // Получить завершенные заказы
    const completedOrders = await Order.countDocuments({ status: "completed" })

    // Получить общую выручку
    const orders = await Order.find({ status: "completed" })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Получить общее количество позиций меню
    const totalMenuItems = await Food.countDocuments()

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalMenuItems,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
