import mongoose, { Schema, type Document } from "mongoose";

export interface ICase extends Document {
  title: string;
  description: string;
  status: "pending" | "review" | "approved" | "rejected";
  risk: "high" | "medium" | "low";
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: mongoose.Types.ObjectId;
  documents: mongoose.Types.ObjectId[];
  analysis: {
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    risks?: {
      safety: number;
      documentation: number;
      supervision: number;
    };
    missingDocuments?: string[];
    recommendations?: string[];
  };
  organizer?: {
    name: string;
    director?: string;
    contacts?: {
      phone?: string;
      email?: string;
    };
  };
  details?: {
    location?: string;
    participants?: number;
    transport?: string;
    accommodation?: string;
    dates?: {
      start?: Date;
      end?: Date;
    };
  };
  history?: {
    events: {
      type: string;
      description: string;
      timestamp: Date;
      user?: mongoose.Types.ObjectId;
    }[];
  };
}

const EventSchema = new Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
}, { _id: false });

const CaseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "review", "approved", "rejected"],
    default: "pending",
  },
  risk: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  deadline: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  analysis: {
    swot: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String],
    },
    risks: {
      safety: Number,
      documentation: Number,
      supervision: Number,
    },
    missingDocuments: [String],
    recommendations: [String],
  },
  organizer: {
    name: String,
    director: String,
    contacts: {
      phone: String,
      email: String,
    },
  },
  details: {
    location: String,
    participants: Number,
    transport: String,
    accommodation: String,
    dates: {
      start: { type: Date, required: false },
      end: { type: Date, required: false },
    },
  },
  history: {
    events: { type: [EventSchema], default: [] },
  },
});

// Pre-save hook to enforce history.events
CaseSchema.pre('save', function (next) {
  console.log("Pre-save: history.events:", this.history?.events, "type:", typeof this.history?.events);
  if (!this.history) {
    this.history = { events: [] };
  }
  if (typeof this.history.events === 'string') {
    console.error("Pre-save: history.events is string:", this.history.events);
    try {
      const parsed = JSON.parse(this.history.events);
      if (!Array.isArray(parsed)) {
        console.error("Pre-save: Parsed history.events is not an array:", parsed);
        next(new Error("history.events must be an array"));
        return;
      }
      this.history.events = parsed;
    } catch (error) {
      console.error("Pre-save: Error parsing history.events:", error);
      next(new Error("Invalid history.events format"));
      return;
    }
  }
  if (!Array.isArray(this.history.events)) {
    console.error("Pre-save: history.events is not an array:", this.history.events);
    this.history.events = [];
  }
  next();
});

// Force re-register model
delete mongoose.models.Case;
export default mongoose.model<ICase>("Case", CaseSchema);