import { getProjectBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";
import styles from "./project.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Project not found" };
  return { title: `${result.project.title} | Champ Studio` };
}

const projectTypeColors: Record<string, string> = {
  direction: "#FF6B35",
  design: "#004E89",
  motion: "#F77F00",
  branding: "#06A77D",
};

const projectTypeLabels: Record<string, string> = {
  direction: "DIRECTION",
  design: "DESIGN",
  motion: "MOTION",
  branding: "BRANDING",
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { project } = result;
  const projectType = project.project_type || "branding";
  const typeColor = projectTypeColors[projectType];
  const typeLabel = projectTypeLabels[projectType];

  const additionalImages = project.images || [];

  return (
    <div className={styles.container}>
      <Link href="/#projects" className={styles.backLink}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M15 10H5M5 10L10 15M5 10L10 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to projects
      </Link>

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{project.title}</h1>
          <div
            className={styles.projectTypeBadge}
            style={{ borderColor: typeColor, color: typeColor }}
          >
            {typeLabel}
          </div>
        </div>
      </div>

      {project.description && (
        <p className={styles.description}>{project.description}</p>
      )}

      <div className={styles.gallerySection}>
        <ProjectGallery
          title={project.title}
          mainImage={project.gif}
          images={additionalImages}
        />
      </div>

      <Link href="/#projects" className={styles.backLink}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M15 10H5M5 10L10 15M5 10L10 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to projects
      </Link>
    </div>
  );
}
