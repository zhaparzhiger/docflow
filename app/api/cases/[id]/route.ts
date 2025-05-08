import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Case from "@/models/Case"
import Document from "@/models/Document"
import User from "@/models/User"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const caseData = await Case.findById(params.id).populate("userId documents")

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    return NextResponse.json(caseData)
  } catch (error) {
    console.error("Error fetching case:", error)
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const data = await req.json()
    const { userId, ...updateData } = data

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedCase = await Case.findByIdAndUpdate(
      params.id,
      {
        ...updateData,
        updatedAt: new Date(),
        $push: {
          "history.events": {
            type: "updated",
            description: "Дело обновлено",
            timestamp: new Date(),
            user: userId,
          },
        },
      },
      { new: true }
    )

    if (!updatedCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCase)
  } catch (error) {
    console.error("Error updating case:", error)
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const deletedCase = await Case.findByIdAndDelete(params.id)

    if (!deletedCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    await Document.deleteMany({ caseId: params.id })

    // Remove case from user's cases array
    await User.updateMany(
      { cases: params.id },
      { $pull: { cases: params.id } }
    )

    return NextResponse.json({ message: "Case deleted successfully" })
  } catch (error) {
    console.error("Error deleting case:", error)
    return NextResponse.json({ error: "Failed to delete case" }, { status: 500 })
  }
}