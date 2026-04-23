/**
 * Server-side client for the external Projects API (FastAPI + PostgreSQL).
 * Base URL from env: PROJECTS_API_BASE_URL
 */

const getBaseUrl = (): string => {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
};

export type ApiProject = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  gif: string;
  images: string[];
  project_type: string;
};

/** Rewrite relative URLs (e.g. /api/images/x.png) to absolute using the API base URL */
function toAbsoluteUrls(baseUrl: string, project: ApiProject): ApiProject {
  const abs = (s: string) => (s.startsWith("http") ? s : `${baseUrl}${s.startsWith("/") ? "" : "/"}${s}`);
  return {
    ...project,
    gif: abs(project.gif),
    images: (project.images || []).map(abs),
  };
}

export async function fetchProjectsFromApi(): Promise<ApiProject[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/projects`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = (await res.json()) as ApiProject[];
  return data.map((p) => toAbsoluteUrls(base, p));
}

export async function fetchProjectByIdFromApi(id: number): Promise<ApiProject | null> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/projects/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const project = (await res.json()) as ApiProject;
  return toAbsoluteUrls(base, project);
}

export function getBaseUrlOrEmpty(): string {
  return process.env.PROJECTS_API_BASE_URL?.replace(/\/$/, "") ?? "";
}
