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

export default function Projects({ projects }: { projects: ProjectsContent }) {
  return (
    <div className="projects-container">
      <ProjectGrid projects={projects.branding} title="" />
      <ProjectGrid projects={projects.motion} title="" />
    </div>
  );
}

function ProjectGrid({ projects, title }: { projects: Project[]; title: string }) {
  if (projects.length === 0) return null;

  return (
    <div className="project-category">
      {title && <h3 className="project-category__title">{title}</h3>}

      <div className="project-grid">
        {projects.map((project, i) => (
          <Link
            key={i}
            href={`/project/${project.slug}`}
            className={`project-card ${i === 0 && projects.length > 2 ? "project-card--featured" : ""}`}
          >
            <div className={`project-card__image ${i === 0 && projects.length > 2 ? "project-card__image--featured" : ""}`}>
              <img
                src={project.gif}
                alt={project.title}
                className="project-card__img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="project-card__info">
              <h4 className="project-card__name">{project.title}</h4>
              <span className="project-card__year">2025</span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .projects-container {
          padding: 0 16px;
        }
        @media (min-width: 640px) {
          .projects-container {
            padding: 0 32px;
          }
        }
        .project-category {
          margin-bottom: 32px;
        }
        .project-category:last-child {
          margin-bottom: 0;
        }
        .project-category__title {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin: 0 0 48px 0;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px 16px;
        }
        .project-card {
          display: block;
          position: relative;
          text-decoration: none;
          color: inherit;
        }
        .project-card--featured {
          grid-column: 1 / -1;
        }
        .project-card__image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: #111;
        }
        .project-card__image--featured {
          aspect-ratio: 2.2/1;
        }
        .project-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover .project-card__img {
          transform: scale(1.02);
        }
        .project-card__info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 8px 0;
        }
        .project-card__name {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          color: var(--color-text);
        }
        .project-card__year {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text);
          flex-shrink: 0;
          margin-left: 16px;
        }
        @media (max-width: 640px) {
          .project-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .project-card--featured {
            grid-column: span 1;
          }
          .project-card__image--featured {
            aspect-ratio: 4/3;
          }
        }
      `}</style>
    </div>
  );
}
