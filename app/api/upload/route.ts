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
    // Support both single "file" and multiple "files" field names
    const files = (formData.getAll("files").length > 0 
      ? formData.getAll("files") 
      : formData.getAll("file")) as File[];
    
    // Create a new FormData for the outgoing fetch to ensure field name consistency if the backend expects "files"
    const outgoingFormData = new FormData();
    files.forEach(f => outgoingFormData.append("files", f));

    // Upload to private API URL
    const res = await fetch(`${base}/api/upload`, {
      method: "POST",
      body: outgoingFormData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    const urls = (data.urls as string[]) ?? [];
    // Rewrite URLs to use public URL for displaying
    const rewritten = urls.map((u: string) => {
      if (u.startsWith("http")) {
        // Replace private URL with public URL if present
        return u.replace(base, publicBase);
      }
      return `${publicBase}${u.startsWith("/") ? "" : "/"}${u}`;
    });
    return NextResponse.json({ urls: rewritten });
  } catch (e) {
    console.error("Upload API error:", e);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}


