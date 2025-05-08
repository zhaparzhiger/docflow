import mongoose, { Schema, type Document } from "mongoose";

export interface IDocument extends Document {
  name: string;
  type: string;
  size: number;
  path: string;
  caseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content?: string;
  status: "uploaded" | "missing";
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  status: {
    type: String,
    enum: ["uploaded", "missing"],
    default: "uploaded",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);