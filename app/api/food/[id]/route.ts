import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Food from "@/models/Food"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const food = await Food.findById(params.id)

    if (!food) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: food._id,
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      quantity: food.quantity,
      imageUrl: food.imageUrl,
    })
  } catch (error) {
    console.error("Get food error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
