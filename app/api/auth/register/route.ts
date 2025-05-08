import { type NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { createToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Имя, email и пароль обязательны" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = new User({
      name,
      email,
      password: String(hashedPassword),
      role: "secretary",
    })

    await user.save()

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
    console.error("Error during registration:", error)
    return NextResponse.json({ message: "Произошла ошибка при регистрации" }, { status: 500 })
  }
}