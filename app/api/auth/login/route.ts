import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { createToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email и пароль обязательны" }, { status: 400 })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "Неверный email или пароль" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный email или пароль" }, { status: 401 })
    }

    const token = createToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    })

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ message: "Произошла ошибка при входе в систему" }, { status: 500 })
  }
}