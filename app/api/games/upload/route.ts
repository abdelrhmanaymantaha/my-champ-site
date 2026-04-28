import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

function getPublicUrl(): string {
  const publicUrl = process.env.PROJECTS_PUBLIC_URL || process.env.PROJECTS_API_BASE_URL;
  if (!publicUrl) throw new Error("PROJECTS_PUBLIC_URL or PROJECTS_API_BASE_URL is not set");
  return publicUrl.replace(/\/$/, "");
}

export async function POST(request: Request) {
  let base: string;
  let publicBase: string;
  try {
    base = getBaseUrl();
    publicBase = getPublicUrl();
  } catch {
    return NextResponse.json(
      { error: "Upload not configured. Set PROJECTS_API_BASE_URL and PROJECTS_PUBLIC_URL in .env.local." },
      { status: 503 }
    );
  }
  try {
    const formData = await request.formData();
    const res = await fetch(`${base}/api/games/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    const urls = (data.urls as string[]) ?? [];
    const rewritten = urls.map((u: string) => {
      if (u.startsWith("http")) {
        return u.replace(base, publicBase);
      }
      return `${publicBase}${u.startsWith("/") ? "" : "/"}${u}`;
    });
    return NextResponse.json({ urls: rewritten });
  } catch (error) {
    console.error("Games upload API error:", error);
    return NextResponse.json({ error: "Failed to upload gif" }, { status: 500 });
  }
}