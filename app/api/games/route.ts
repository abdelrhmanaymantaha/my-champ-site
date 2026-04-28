import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

export async function GET() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/games`);
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Games API GET error:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const base = getBaseUrl();
    const body = await request.json();
    const res = await fetch(`${base}/api/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: Record<string, unknown> = {};
    if (text) {
      try {
        data = JSON.parse(text) as Record<string, unknown>;
      } catch {
        data = { error: text };
      }
    }
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Games API POST error:", error);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}