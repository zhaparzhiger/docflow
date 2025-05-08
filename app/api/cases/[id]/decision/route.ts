import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Case from "@/models/Case"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Извлечение токена
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization header missing or invalid" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;

    const { decision, comment } = await req.json();

    if (!["approve", "reject", "request"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    // Проверка существования пользователя
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Проверка, что дело принадлежит пользователю
    const existingCase = await Case.findOne({ _id: params.id, userId });
    if (!existingCase) {
      return NextResponse.json({ error: "Case not found or access denied" }, { status: 404 });
    }

    let status;
    let eventType;
    let eventDescription;

    switch (decision) {
      case "approve":
        status = "approved";
        eventType = "approved";
        eventDescription = "Дело одобрено";
        break;
      case "reject":
        status = "rejected";
        eventType = "rejected";
        eventDescription = "Дело отклонено";
        break;
      case "request":
        status = "review";
        eventType = "requested_revision";
        eventDescription = "Запрошена доработка";
        break;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      params.id,
      {
        status,
        updatedAt: new Date(),
        $push: {
          "history.events": {
            type: eventType,
            description: `${eventDescription}${comment ? ": " + comment : ""}`,
            timestamp: new Date(),
            user: userId,
          },
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Error making decision:", error);
    return NextResponse.json({ error: "Failed to process decision" }, { status: 500 });
  }
}