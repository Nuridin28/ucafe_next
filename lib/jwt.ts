import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(req?: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token) as { id: string } | null;

    if (!decoded) {
      return null;
    }

    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function isAuthenticated(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return user;
}

export async function isAdmin(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  return user;
}
