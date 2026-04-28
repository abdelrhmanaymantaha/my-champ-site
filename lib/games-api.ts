/**
 * Server-side client for the external Games API.
 * Base URL from env: PROJECTS_API_BASE_URL
 */

const getBaseUrl = (): string => {
  const url = process.env.PROJECTS_API_BASE_URL;
  if (!url) throw new Error("PROJECTS_API_BASE_URL is not set");
  return url.replace(/\/$/, "");
};

export type ApiGameGif = {
  id: number;
  gif_url: string;
};

export async function fetchGamesFromApi(): Promise<ApiGameGif[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/games`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return (await res.json()) as ApiGameGif[];
}