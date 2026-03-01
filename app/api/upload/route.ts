import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

export async function POST(request: Request) {
  let base: string;
  try {
    base = getBaseUrl();
  } catch {
    return NextResponse.json(
      { error: "Upload not configured. Set PROJECTS_API_BASE_URL in .env.local." },
      { status: 503 }
    );
  }
  try {
    const formData = await request.formData();
    const res = await fetch(`${base}/api/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    const urls = (data.urls as string[]) ?? [];
    const rewritten = urls.map((u: string) => (u.startsWith("http") ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`));
    return NextResponse.json({ urls: rewritten });
  } catch (e) {
    console.error("Upload API error:", e);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
