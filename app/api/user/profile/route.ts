import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { isAuthenticated } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAuthenticated(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const user = await isAuthenticated(request)

    if (!user || user instanceof NextResponse) {
      return user || NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, { name }, { new: true, runValidators: true }).select(
      "-password",
    )

    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
