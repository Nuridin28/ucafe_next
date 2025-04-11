import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import { isAdmin } from "@/lib/jwt"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 })
    }

    // Проверка статуса
    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    const updatedOrder = await Order.findByIdAndUpdate(params.id, { status }, { new: true, runValidators: true })

    return NextResponse.json({
      id: updatedOrder._id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
    })
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
