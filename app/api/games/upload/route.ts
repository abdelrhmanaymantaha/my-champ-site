import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const base = getBaseUrl();
    const formData = await request.formData();
    const res = await fetch(`${base}/api/games/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Games upload API error:", error);
    return NextResponse.json({ error: "Failed to upload gif" }, { status: 500 });
  }
}