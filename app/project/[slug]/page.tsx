import { getProjectBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Project not found" };
  return { title: `${result.project.title} | Champ Studio` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { project } = result;

  const additionalImages = project.images || [];

  return (
    <div className="min-h-screen px-10 py-24 max-w-4xl mx-auto">
      <Link
        href="/#projects"
        className="inline-block text-sm opacity-70 hover:opacity-100 mb-12"
      >
        ← Back to projects
      </Link>

      <h1 className="text-4xl md:text-6xl font-bold mb-2">{project.title}</h1>
      {project.slug && (
        <p className="text-sm opacity-70 mb-8 uppercase tracking-wide">
          {project.slug.replace(/-/g, ", ")}
        </p>
      )}

      {project.description && (
        <p className="text-lg opacity-90 mb-16 leading-relaxed whitespace-pre-line">
          {project.description}
        </p>
      )}

      <ProjectGallery
        title={project.title}
        mainImage={project.gif}
        images={additionalImages}
      />

      <Link
        href="/#projects"
        className="inline-block mt-16 text-sm opacity-70 hover:opacity-100"
      >
        ← Back to projects
      </Link>
    </div>
  );
}
