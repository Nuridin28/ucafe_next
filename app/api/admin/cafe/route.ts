import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cafe from "@/models/Cafe"
import { isAdmin } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const cafe = await Cafe.findOne()

    if (!cafe) {
      return NextResponse.json({ message: "Cafe not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: cafe._id,
      name: cafe.name,
      description: cafe.description,
      openingHours: cafe.openingHours,
      location: cafe.location,
    })
  } catch (error) {
    console.error("Get cafe error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAdmin(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const { name, description, openingHours, location } = await request.json()

    if (!name || !description || !openingHours || !location) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    let cafe = await Cafe.findOne()

    if (cafe) {
      // Обновить существующее кафе
      cafe = await Cafe.findByIdAndUpdate(
        cafe._id,
        { name, description, openingHours, location },
        { new: true, runValidators: true },
      )
    } else {
      // Создать новое кафе
      cafe = await Cafe.create({
        name,
        description,
        openingHours,
        location,
      })
    }

    return NextResponse.json({
      id: cafe._id,
      name: cafe.name,
      description: cafe.description,
      openingHours: cafe.openingHours,
      location: cafe.location,
    })
  } catch (error) {
    console.error("Update cafe error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
