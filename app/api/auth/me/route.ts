import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  try {
    // Получение токена из заголовка Authorization
    const authHeader = req.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Токен авторизации не предоставлен" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Верификация токена
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Недействительный или истекший токен" }, { status: 401 })
    }

    await connectToDatabase()

    // Поиск пользователя по ID из токена
    const user = await User.findById(decoded.id)

    if (!user) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 })
    }

    // Возвращаем данные пользователя
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ message: "Произошла ошибка при получении данных пользователя" }, { status: 500 })
  }
}
