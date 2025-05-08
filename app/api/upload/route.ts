import { type NextRequest, NextResponse } from "next/server";
import tesseract from "node-tesseract-ocr";
import pdfParse from "pdf-parse";
import { connectToDatabase } from "@/lib/mongodb";
import Case from "@/models/Case";
import Document from "@/models/Document";
import User from "@/models/User";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { analyzeDocuments, analyzeDocumentsSimple, generateDescription } from "@/lib/ai";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Extract token
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

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const caseId = formData.get("caseId") as string;

    if (!caseId || files.length === 0) {
      return NextResponse.json(
        { error: "Case ID and at least one file are required" },
        { status: 400 }
      );
    }

    // Verify case belongs to user
    const caseDoc = await Case.findOne({ _id: caseId, userId });
    if (!caseDoc) {
      return NextResponse.json({ error: "Case not found or access denied" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Define the uploads directory in the project root
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const extractedData: string[] = [];
    const documents: any[] = [];

    for (const file of files) {
      const fileName = file.name;
      const fileType = file.type.toLowerCase();
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (buffer.length === 0) {
        console.error(`Empty buffer for file: ${fileName}`);
        return NextResponse.json(
          { error: `Invalid file: ${fileName} is empty` },
          { status: 400 }
        );
      }

      // Sanitize file name to prevent path traversal
      const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = path.join(uploadDir, `${Date.now()}-${safeFileName}`);
      const dbPath = `uploads/${path.basename(filePath)}`;

      await writeFile(filePath, buffer);
      console.log(`Saved file: ${filePath}`);

      let content = "";
      try {
        if (fileType === "application/pdf") {
          console.log(`Processing PDF: ${fileName}, file path: ${filePath}`);
          const pdfData = await pdfParse(filePath, {
            disableFontFace: true,
            disableXfa: true,
          });
          content = pdfData.text || "";
          console.log(`Extracted PDF text length: ${content.length}`);
        } else if (
          fileType === "image/jpeg" ||
          fileType === "image/jpg" ||
          fileType === "image/png"
        ) {
          console.log(`Processing image: ${fileName}`);
          try {
            content = await tesseract.recognize(filePath, {
              lang: "rus+eng",
              oem: 3,
              psm: 6,
            });
            console.log(`Extracted image text length: ${content.length}`);
          } catch (ocrError) {
            console.warn(`OCR failed for ${fileName}:`, ocrError);
            content = "";
            console.log(`Falling back to empty content for ${fileName}`);
          }
        } else {
          console.error(`Unsupported file type: ${fileType}`);
          return NextResponse.json(
            { error: `Unsupported file type: ${fileName}` },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
        return NextResponse.json(
          { error: `Failed to process file: ${fileName}` },
          { status: 500 }
        );
      }

      extractedData.push(content);

      const document = new Document({
        name: fileName,
        type: fileType,
        size: file.size,
        path: dbPath,
        caseId,
        userId,
        content,
        status: "uploaded",
      });

      await document.save();
      documents.push(document);

      user.documents.push(document._id);
      await user.save();

      caseDoc.documents.push(document._id);
      caseDoc.history = caseDoc.history || { events: [] };
      caseDoc.history.events.push({
        type: "document_uploaded",
        description: `Документ ${fileName} загружен`,
        timestamp: new Date(),
        user: userId,
      });
    }

    let analysis;
    const combinedContent = extractedData.join("\n");
    try {
      analysis = await analyzeDocuments(combinedContent);
      if (!analysis) {
        console.warn("AI analysis returned null, using simple analysis");
        analysis = await analyzeDocumentsSimple();
      }
    } catch (aiError) {
      console.error("AI analysis failed:", aiError);
      console.warn("Falling back to simple analysis");
      analysis = await analyzeDocumentsSimple();
    }

    if (!analysis) {
      console.error("Simple analysis also failed, using default values");
      analysis = {
        title: "Новое дело",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        organizer: { name: "", contacts: {} },
        details: {
          location: "",
          participants: 0,
          transport: "",
          accommodation: "",
          dates: { start: null, end: null },
        },
        swot: {
          strengths: [],
          weaknesses: ["Анализ документов не выполнен"],
          opportunities: [],
          threats: [],
        },
        risks: { safety: 50, documentation: 50, supervision: 50 },
        missingDocuments: ["Невозможно определить"],
        recommendations: ["Провести ручной анализ документов"],
      };
    }

    console.log("AI analysis result:", JSON.stringify(analysis, null, 2));

    // Generate description based on AI-generated title
    let description;
    try {
      description = await generateDescription(analysis.title, extractedData);
    } catch (error) {
      console.error("Failed to generate description:", error);
      description = "Описание не удалось сгенерировать автоматически.";
    }

    // Update case with AI-generated data
    caseDoc.title = analysis.title || "Новое дело";
    caseDoc.description = description;
    caseDoc.deadline = new Date(analysis.deadline || Date.now() + 7 * 24 * 60 * 60 * 1000);

    const processedDetails = {
      ...analysis.details,
      dates: {
        start: analysis.details?.dates?.start
          ? new Date(analysis.details.dates.start)
          : null,
        end: analysis.details?.dates?.end
          ? new Date(analysis.details.dates.end)
          : null,
      },
    };

    if (
      processedDetails.dates.start &&
      isNaN(processedDetails.dates.start.getTime())
    ) {
      console.warn(
        `Invalid start date: ${analysis.details?.dates?.start}, setting to null`
      );
      processedDetails.dates.start = null;
    }
    if (
      processedDetails.dates.end &&
      isNaN(processedDetails.dates.end.getTime())
    ) {
      console.warn(
        `Invalid end date: ${analysis.details?.dates?.end}, setting to null`
      );
      processedDetails.dates.end = null;
    }

    caseDoc.analysis = {
      swot: analysis.swot || {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
      risks: analysis.risks || {
        safety: 0,
        documentation: 0,
        supervision: 0,
      },
      missingDocuments: analysis.missingDocuments || [],
      recommendations: analysis.recommendations || [],
    };

    caseDoc.organizer = analysis.organizer || { name: "", contacts: {} };
    caseDoc.details = processedDetails;
    caseDoc.updatedAt = new Date();

    caseDoc.history.events.push({
      type: "analysis_completed",
      description: "Анализ документов завершен",
      timestamp: new Date(),
      user: userId,
    });

    console.log("Case before save (upload):", {
      title: caseDoc.title,
      description: caseDoc.description,
      deadline: caseDoc.deadline,
      historyEvents: caseDoc.history?.events,
      details: JSON.stringify(caseDoc.details, null, 2),
    });

    await caseDoc.save();

    return NextResponse.json({
      case: caseDoc,
      documents,
      analysis: caseDoc.analysis,
      title: caseDoc.title,
      description: caseDoc.description,
      deadline: caseDoc.deadline.toISOString().split("T")[0],
    });
  } catch (error: any) {
    console.error("Error processing upload:", error);
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}