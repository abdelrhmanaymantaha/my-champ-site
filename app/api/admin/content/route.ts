import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, getSessionCookie } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import { fetchProjectsFromApi } from "@/lib/projects-api";
import type { Project } from "@/lib/content";

function unwrapNextImageUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return raw;

  try {
    const parsed = new URL(raw, "http://localhost");
    if (parsed.pathname !== "/_next/image") {
      return raw;
    }

    const wrappedUrl = parsed.searchParams.get("url");
    if (!wrappedUrl) {
      return raw;
    }

    try {
      return decodeURIComponent(wrappedUrl).trim() || raw;
    } catch {
      return wrappedUrl.trim() || raw;
    }
  } catch {
    return raw;
  }
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookie())?.value;
  return !!token && verifySessionToken(token);
}

/** Group API projects by project_type into branding / motion; map to our Project shape with id */
function groupProjectsByType(apiProjects: { id: number; title: string; slug: string; description?: string; gif: string; images: string[]; project_type: string }[]): { branding: Project[]; motion: Project[] } {
  const branding: Project[] = [];
  const motion: Project[] = [];
  for (const p of apiProjects) {
    const project: Project = {
      id: p.id,
      title: p.title,
      slug: p.slug,
      gif: p.gif,
      description: p.description ?? "",
      images: p.images ?? [],
    };
    if (p.project_type === "motion") motion.push(project);
    else branding.push(project);
  }
  return { branding, motion };
}

export async function GET() {
  const content = getContent();
  try {
    const apiProjects = await fetchProjectsFromApi();
    content.projects = groupProjectsByType(apiProjects);
  } catch {
    // keep existing content.projects from JSON or default
  }
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const content = getContent();
    if (body.hero) content.hero = { ...content.hero, ...body.hero };
    if (body.about) {
      const normalizedAbout = { ...body.about } as Record<string, unknown>;
      if (typeof normalizedAbout.image === "string") {
        normalizedAbout.image = unwrapNextImageUrl(normalizedAbout.image);
      }
      content.about = { ...content.about, ...normalizedAbout };
    }
    // Projects are managed via the external API (POST/PATCH/DELETE /api/projects), not saved here
    if (body.play) content.play = { ...content.play, ...body.play };
    if (body.navbar) content.navbar = { ...content.navbar, ...body.navbar };
    if (body.sections) content.sections = { ...content.sections, ...body.sections };
    if (body.socialMedia) content.socialMedia = { ...content.socialMedia, ...body.socialMedia };
    saveContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
