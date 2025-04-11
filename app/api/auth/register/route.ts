import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Проверить, существует ли пользователь
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Создать пользователя
    const user = await User.create({
      name,
      email,
      password,
      role: "user", // По умолчанию роль - пользователь
    })

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
