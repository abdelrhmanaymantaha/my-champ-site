import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getSessionCookie(), "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
