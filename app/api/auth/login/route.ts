import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Найти пользователя по email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Сравнить пароль
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Создать JWT токен
    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Создание ответа с cookie
    const response = NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Установить cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
