import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

export type AboutContent = {
  title: string;
  subtitle: string;
  mainText: string;
  description: string;
  quote: string;
  bottomTitle: string;
  bottomText: string;
};

export type Project = {
  id?: number;
  title: string;
  slug: string;
  gif: string;
  description?: string;
  images?: string[];
};

export type ProjectsContent = {
  branding: Project[];
  motion: Project[];
};

export type HeroContent = {
  title: string;
  tagline: string;
  bulletPoints: string[];
};

export type PlayContent = {
  text: string;
};

export type NavbarContent = {
  name: string;
  location: string;
};

export type SectionsContent = {
  about: string;
  projects: string;
  play: string;
};

export type Content = {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  play: PlayContent;
  navbar: NavbarContent;
  sections: SectionsContent;
};

const defaultContent: Content = {
  hero: {
    title: "Alevev",
    tagline: "the studio →",
    bulletPoints: [
      "Custom animated illustrations tailored to your idea or brand.",
      "Creative collages with dynamic motion.",
      "Typography animations that bring words to life.",
      "Seamless looping animations ideal for social media, ads, websites, or presentations.",
      "High-resolution GIFs and video exports optimized for all platforms.",
      "Whether you want something playful, artistic, or sleek and professional, I can design GIF animations that stand out, engage, and tell your story in motion.",
    ],
  },
  about: {
    title: "Please Call Me aleven",
    subtitle: "— Motion Designer —",
    mainText: "At Aleven, creativity moves with purpose.",
    description: "Specializing in seamless looping animations...",
    quote: "Driven by a passion for bold visuals...",
    bottomTitle: "it's art — in motion.",
    bottomText: "I love pushing the limits of visual storytelling.",
  },
  projects: {
    branding: [],
    motion: [],
  },
  play: {
    text: "A creative playground for experimental visuals, animations, and interactive ideas.",
  },
  navbar: {
    name: "Please call me Alevev",
    location: "Los Angeles, CA",
  },
  sections: {
    about: "About",
    projects: "Projects",
    play: "Play",
  },
};

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Normalize slug for comparison: decode URL, trim, then slugify so URL and API slugs match */
function normalizeSlugForMatch(s: string): string {
  try {
    const decoded = decodeURIComponent(s).trim();
    return decoded.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || decoded;
  } catch {
    return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || s;
  }
}

function migrateProject(p: unknown): Project {
  if (p && typeof p === "object" && "title" in p && "gif" in p) {
    const pr = p as Record<string, unknown>;
    return {
      title: String(pr.title),
      slug: "slug" in pr ? String(pr.slug) : slugify(String(pr.title)),
      gif: String(pr.gif),
      description: pr.description ? String(pr.description) : "",
      images: Array.isArray(pr.images) ? pr.images.map(String) : [],
    };
  }
  return { title: "", slug: "", gif: "", description: "", images: [] };
}

function migrateProjects(parsed: unknown): ProjectsContent {
  if (parsed && typeof parsed === "object" && "branding" in parsed && "motion" in parsed) {
    const p = parsed as { branding: unknown[]; motion: unknown[] };
    return {
      branding: (p.branding || []).map(migrateProject),
      motion: (p.motion || []).map(migrateProject),
    };
  }
  if (Array.isArray(parsed)) {
    return { branding: parsed.map(migrateProject), motion: [] };
  }
  return defaultContent.projects;
}

export async function getProjectBySlug(slug: string): Promise<{ project: Project; section: "branding" | "motion" } | null> {
  const { fetchProjectsFromApi, fetchProjectByIdFromApi } = await import("@/lib/projects-api");
  const apiProjects = await fetchProjectsFromApi();
  const normalizedSlug = normalizeSlugForMatch(slug);
  for (const p of apiProjects) {
    const apiSlug = (p.slug ?? "").trim();
    if (apiSlug === slug || apiSlug === normalizedSlug || normalizeSlugForMatch(apiSlug) === normalizedSlug) {
      const section = p.project_type === "motion" ? "motion" : "branding";
      // Fetch full project by ID so we get description (list endpoint may omit it)
      const full = p.id != null ? await fetchProjectByIdFromApi(p.id) : null;
      const source = full ?? p;
      const project: Project = {
        id: source.id,
        title: source.title,
        slug: source.slug,
        gif: source.gif,
        description: source.description ?? "",
        images: source.images ?? [],
      };
      return { project, section };
    }
  }
  return null;
}

export function getContent(): Content {
  if (!existsSync(CONTENT_FILE)) {
    return defaultContent;
  }
  try {
    const data = readFileSync(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return {
      hero: { ...defaultContent.hero, ...parsed.hero },
      about: { ...defaultContent.about, ...parsed.about },
      projects: migrateProjects(parsed.projects),
      play: { ...defaultContent.play, ...parsed.play },
      navbar: { ...defaultContent.navbar, ...parsed.navbar },
      sections: { ...defaultContent.sections, ...parsed.sections },
    };
  } catch {
    return defaultContent;
  }
}

/** Get full content with projects loaded from the external API (for server components). */
export async function getContentWithProjects(): Promise<Content> {
  const content = getContent();
  try {
    const { fetchProjectsFromApi } = await import("@/lib/projects-api");
    const apiProjects = await fetchProjectsFromApi();
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
    content.projects = { branding, motion };
  } catch {
    // keep projects from JSON or default
  }
  return content;
}

export function saveContent(content: Content): void {
  const dir = path.dirname(CONTENT_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}
