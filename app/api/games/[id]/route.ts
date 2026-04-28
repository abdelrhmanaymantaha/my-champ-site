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
    const res = await fetch(`${base}/api/games/${id}`);
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Games API GET by id error:", error);
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const base = getBaseUrl();
    const body = await request.json();
    const res = await fetch(`${base}/api/games/${id}`, {
      method: "PATCH",
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
    console.error("Games API PATCH error:", error);
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/games/${id}`, { method: "DELETE" });
    const data = res.headers.get("content-type")?.includes("json") ? await res.json() : {};
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data.message ? data : { message: "Game deleted successfully" });
  } catch (error) {
    console.error("Games API DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}