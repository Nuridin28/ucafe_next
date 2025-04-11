import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Food from "@/models/Food"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const foods = await Food.find().sort({ name: 1 })

    const formattedFoods = foods.map((food) => ({
      id: food._id,
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      quantity: food.quantity,
      imageUrl: food.imageUrl,
    }))

    return NextResponse.json(formattedFoods)
  } catch (error) {
    console.error("Get foods error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
