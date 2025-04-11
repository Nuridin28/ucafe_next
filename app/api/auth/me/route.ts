import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
