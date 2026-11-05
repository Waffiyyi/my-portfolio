import type { Project } from "@/data/projects";
import { ProjectArt } from "./artwork";
import { MotionLink } from "./site-shell";
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article
      className="project-card"
      data-track-item
      data-category={project.category}
    >
      <MotionLink
        href={`/work/${project.slug}`}
        className="project-link"
        data-cursor-label="View"
      >
        <div className="project-card-top">
          <span className="mono">
            {String(index + 1).padStart(2, "0")} / {project.category}
          </span>
          <span className="mono">{project.year}</span>
        </div>
        <div className="project-card-art">
          <ProjectArt project={project} />
          <span className="project-open" aria-hidden="true">
            Explore project ↗
          </span>
        </div>
        <div className="project-card-title">
          <h3>{project.title}</h3>
          <span aria-hidden="true">↗</span>
        </div>
        <p>{project.tagline}</p>
        <span className="project-status">{project.status}</span>
      </MotionLink>
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="project-live-link text-link"
          aria-label={`Visit live site — ${project.title} (opens in a new tab)`}
        >
          Visit live site <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}
