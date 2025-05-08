import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Укажи секрет в .env

export function createToken(payload: { id: string; name: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string; role: string };
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}