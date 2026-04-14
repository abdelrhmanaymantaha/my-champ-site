import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

function getPublicUrl(): string {
  // Use public URL for displaying images, fallback to private URL if not set
  const publicUrl = process.env.PROJECTS_PUBLIC_URL || process.env.PROJECTS_API_BASE_URL;
  if (!publicUrl) throw new Error("PROJECTS_PUBLIC_URL or PROJECTS_API_BASE_URL is not set");
  return publicUrl.replace(/\/$/, "");
}

export async function GET() {
  try {
    const base = getBaseUrl();
    const publicBase = getPublicUrl();
    const res = await fetch(`${base}/api/projects`);
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    // Rewrite image URLs to use public URL for frontend display
    const rewritten = (Array.isArray(data) ? data : []).map((p: { gif: string; images?: string[] }) => ({
      ...p,
      gif: p.gif?.startsWith("http") ? p.gif.replace(base, publicBase) : `${publicBase}${p.gif?.startsWith("/") ? "" : "/"}${p.gif ?? ""}`,
      images: (p.images ?? []).map((s: string) => (s.startsWith("http") ? s.replace(base, publicBase) : `${publicBase}${s.startsWith("/") ? "" : "/"}${s}`)),
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create project";
    console.error("Projects API POST error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
