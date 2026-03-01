import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

export async function GET() {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/projects`);
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    // Rewrite image URLs to absolute for frontend
    const rewritten = (Array.isArray(data) ? data : []).map((p: { gif: string; images?: string[] }) => ({
      ...p,
      gif: p.gif?.startsWith("http") ? p.gif : `${base}${p.gif?.startsWith("/") ? "" : "/"}${p.gif ?? ""}`,
      images: (p.images ?? []).map((s: string) => (s.startsWith("http") ? s : `${base}${s.startsWith("/") ? "" : "/"}${s}`)),
    }));
    return NextResponse.json(rewritten);
  } catch (e) {
    console.error("Projects API GET error:", e);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let base: string;
  try {
    base = getBaseUrl();
  } catch (e) {
    console.error("Projects API config error:", e);
    return NextResponse.json(
      { error: "Projects API is not configured. Set PROJECTS_API_BASE_URL in .env.local and restart the dev server." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const res = await fetch(`${base}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: object = {};
    if (text) {
      try {
        data = JSON.parse(text) as object;
      } catch {
        data = { error: "Invalid JSON from projects API" };
      }
    }
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create project";
    console.error("Projects API POST error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
