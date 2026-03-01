import "./Projects.css";
import Link from "next/link";

type Project = {
  title: string;
  slug: string;
  gif: string;
};

type ProjectsContent = {
  branding: Project[];
  motion: Project[];
};

function ProjectGrid({ projects, title }: { projects: Project[]; title: string }) {
  return (
    <div className="mb-20">
      <h3 className="text-3xl font-bold mb-8">{title}</h3>
      <div className="grid md:grid-cols-3 gap-8 pt-8">
        {projects.map((project, i) => (
          <Link
            key={i}
            href={`/project/${project.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div
              className="h-64 w-full border rounded-lg overflow-hidden mt-10 shadow-lg transition group-hover:opacity-90"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <img
                src={project.gif}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-center group-hover:opacity-80 transition">
              {project.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: ProjectsContent }) {
  return (
    <div className="pt-32">
      <ProjectGrid projects={projects.branding} title="Branding" />
      <ProjectGrid projects={projects.motion} title="Motion" />
    </div>
  );
}
