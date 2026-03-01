import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/projects/${id}`);
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    const p = data as { gif?: string; images?: string[] };
    const rewritten = {
      ...data,
      gif: p.gif?.startsWith("http") ? p.gif : `${base}${p.gif?.startsWith("/") ? "" : "/"}${p.gif ?? ""}`,
      images: (p.images ?? []).map((s: string) => (s.startsWith("http") ? s : `${base}${s.startsWith("/") ? "" : "/"}${s}`)),
    };
    return NextResponse.json(rewritten);
  } catch (e) {
    console.error("Projects API GET by id error:", e);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const base = getBaseUrl();
    const body = await request.json();
    const res = await fetch(`${base}/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Projects API PATCH error:", e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/projects/${id}`, { method: "DELETE" });
    const data = res.headers.get("content-type")?.includes("json") ? await res.json() : {};
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data.message ? data : { message: "Project deleted successfully" });
  } catch (e) {
    console.error("Projects API DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
