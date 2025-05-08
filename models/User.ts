import bcrypt from "bcryptjs";
import { Users } from "lucide-react";
import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "secretary" | "manager" | "analyst";
  avatar?: string;
  cases: mongoose.Types.ObjectId[];
  documents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "secretary", "manager", "analyst"],
    default: "secretary",
  },
  avatar: { type: String },
  cases: [{ type: Schema.Types.ObjectId, ref: "Case" }],
  documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);