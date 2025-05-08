import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware runs before any route handlers
export function middleware(request: NextRequest) {
  // Add a custom header to indicate we're in a serverless environment
  const response = NextResponse.next()
  response.headers.set("x-environment", process.env.NODE_ENV || "production")
  return response
}

// Only run middleware on API routes
export const config = {
  matcher: "/api/:path*",
}
