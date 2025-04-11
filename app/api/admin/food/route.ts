import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Food from "@/models/Food"
import { isAdmin } from "@/lib/jwt"
import { uploadImage } from "@/lib/upload"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const image = formData.get("image") as File | null

    if (!name || !description || isNaN(price) || !category || isNaN(quantity)) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    let imageUrl = null
    if (image) {
      imageUrl = await uploadImage(image)
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      quantity,
      imageUrl,
    })

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
    console.error("Create food error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
