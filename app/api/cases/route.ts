import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    console.log("Token from cookie:", token);

    if (!token) {
      return NextResponse.json({ error: "Токен авторизации не предоставлен" }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Недействительный или истекший токен" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const risk = searchParams.get("risk");
    const search = searchParams.get("search");

    const query: any = {
      userId: decoded.id, // Filter by authenticated user's ID
    };

    if (status && status !== "all") {
      query.status = status;
    }

    if (risk && risk !== "all") {
      query.risk = risk;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const cases = await Case.find(query).sort({ createdAt: -1 });

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Log raw request body
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse JSON
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    console.log("Parsed case data:", data);

    // Validate history.events if provided
    if (data.history?.events) {
      if (typeof data.history.events === "string") {
        console.error("Invalid history.events: received string instead of array");
        return NextResponse.json(
          { error: "history.events must be an array of objects, not a string" },
          { status: 400 }
        );
      }
      if (!Array.isArray(data.history.events)) {
        console.error("Invalid history.events: not an array");
        return NextResponse.json(
          { error: "history.events must be an array" },
          { status: 400 }
        );
      }
    }

    // Create a new case with server-controlled history
    const historyEvents = [
      {
        type: "created",
        description: "Дело создано",
        timestamp: new Date(),
      },
    ];

    const userData = await fetch("http://localhost:3000/api/auth/me", 
      {
        headers: {
          'Authorization': `Bearer ${req.cookies.get("token")?.value}`
        }
      }
    )

    const token = req.cookies.get("token")?.value

    const userId = await userData.json()
    console.log("UserID", userId.id)

    const newCase = new Case({
      title: data.title || "Новое дело",
      description: data.description || "Описание будет сгенерировано автоматически",
      deadline: data.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
      risk: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
      documents: [],
      analysis: {
        swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
        risks: { safety: 0, documentation: 0, supervision: 0 },
        missingDocuments: [],
        recommendations: [],
      },
      organizer: { name: "", contacts: {} },
      details: {},
      history: {
        events: historyEvents,
      },
      userId: userId.id
    });

    // Debug before saving
    console.log("Case before save:", {
      historyEvents: newCase.history?.events,
      historyEventsType: typeof newCase.history?.events,
      isArray: Array.isArray(newCase.history?.events),
      historyEventsContent: JSON.stringify(newCase.history?.events, null, 2),
    });

    await newCase.save();
    console.log("Saved case:", JSON.stringify(newCase, null, 2));

    return NextResponse.json(newCase);
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}