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
    <div className="mb-12 sm:mb-16 md:mb-20">
      <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-6 md:pt-8">
        {projects.map((project, i) => (
          <Link
            key={i}
            href={`/project/${project.slug}`}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div
              className="h-48 sm:h-56 md:h-64 w-full border rounded-lg overflow-hidden mt-4 sm:mt-6 md:mt-10 shadow-lg transition group-hover:opacity-90 group-hover:shadow-xl"
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
            <h4 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-center group-hover:opacity-80 transition px-2">
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
    <div className="pt-16 sm:pt-24 md:pt-32">
      <ProjectGrid projects={projects.branding} title="Branding" />
      <ProjectGrid projects={projects.motion} title="Motion" />
    </div>
  );
}
