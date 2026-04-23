import { readFile, writeFile } from "fs/promises";
import path from "path";

const PROJECTS_FILE = path.join(process.cwd(), "data", "projects.json");

export interface Project {
  id: string;
  name: string;
  description: string;
  gif: string;
  images: string[];
  [key: string]: any;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}
