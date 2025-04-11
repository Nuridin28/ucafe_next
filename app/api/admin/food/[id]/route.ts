import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Food from "@/models/Food"
import { isAdmin, isAuthenticated } from "@/lib/jwt"
import { uploadImage } from "@/lib/upload"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await isAuthenticated(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const food = await Food.findById(params.id)

    if (!food) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 })
    }

    let imageUrl = food.imageUrl
    if (image) {
      imageUrl = await uploadImage(image)
    }

    const updatedFood = await Food.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price,
        category,
        quantity,
        imageUrl,
      },
      { new: true, runValidators: true },
    )

    return NextResponse.json({
      id: updatedFood._id,
      name: updatedFood.name,
      description: updatedFood.description,
      price: updatedFood.price,
      category: updatedFood.category,
      quantity: updatedFood.quantity,
      imageUrl: updatedFood.imageUrl,
    })
  } catch (error) {
    console.error("Update food error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const food = await Food.findById(params.id)

    if (!food) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 })
    }

    await Food.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Food deleted successfully" })
  } catch (error) {
    console.error("Delete food error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
