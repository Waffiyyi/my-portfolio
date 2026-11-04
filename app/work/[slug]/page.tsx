import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import { ProjectArt, FlowDiagram } from "@/components/portfolio/artwork";
import { CaseGallery } from "@/components/portfolio/case-gallery";
import { MotionLink } from "@/components/portfolio/site-shell";
import { Reveal } from "@/components/portfolio/motion";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return {
    title: p?.title || "Project not found",
    description: p?.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: p?.title,
      description: p?.tagline,
      url: `/work/${slug}`,
    },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main" tabIndex={-1} className="case-main">
      <header className="case-hero">
        <div className="page-hero-meta">
          <MotionLink href="/work" className="eyebrow">
            ← All work
          </MotionLink>
          <span className="mono">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <div className="case-hero-heading">
          <h1>
            {project.title}
            <span className="accent">.</span>
          </h1>
          <p>{project.tagline}</p>
        </div>
        <div className="case-hero-stage">
          <ProjectArt project={project} />
          <div className="case-hero-panel">
            <span className="eyebrow">Project record / {project.year}</span>
            <dl>
              <div>
                <dt>Discipline</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Contribution</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Stage</dt>
                <dd>{project.status}</dd>
              </div>
            </dl>
            <span className="eyebrow">Built with</span>
            <div className="tags">
              {project.stack.slice(0, 5).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <span className="case-panel-bottom mono">SURFACE ↔ SYSTEM</span>
            {project.demo && (
              <a
                className="button button-light case-live-link"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit live site — ${project.title} (opens in a new tab)`}
              >
                Visit live site <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </header>
      <section className="case-overview">
        <span className="eyebrow">01 / The idea</span>
        <Reveal>
          <h2>{project.description}</h2>
          <div className="external-links">
            {project.github && (
              <a
                className="text-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                View source ↗
              </a>
            )}
          </div>
        </Reveal>
      </section>
      <section className="case-front">
        <div className="case-section-heading">
          <span className="eyebrow">02 / The front</span>
          <h2>
            MADE FOR
            <br />
            <span className="accent">THE EXPERIENCE.</span>
          </h2>
          <p>{project.front}</p>
        </div>
        <CaseGallery project={project} />
      </section>
      <section className="case-back dark-scene">
        <div className="case-section-heading">
          <span className="eyebrow">03 / The back</span>
          <h2>
            THINKING
            <br />
            BENEATH THE SURFACE.
          </h2>
          <p>{project.back}</p>
        </div>
        <div className="case-engineering">
          <FlowDiagram steps={project.flow} />
          <div className="case-highlights">
            {project.highlights.map((h, i) => (
              <Reveal key={h.title}>
                <article>
                  <span className="mono">0{i + 1}</span>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="case-stack">
          <span className="eyebrow">Documented stack</span>
          <div>
            {project.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        {project.note && <p className="case-note">{project.note}</p>}
      </section>
      <section className="next-project">
        <div className="next-project-meta">
          <span className="eyebrow">04 / Keep exploring</span>
          <MotionLink href="/work" className="text-link">
            All projects ↗
          </MotionLink>
        </div>
        <MotionLink href={`/work/${next.slug}`} className="next-project-link">
          <div>
            <span className="eyebrow">Next project</span>
            <h2>
              {next.title}
              <span>↗</span>
            </h2>
            <p>{next.tagline}</p>
          </div>
          <ProjectArt project={next} />
        </MotionLink>
      </section>
    </main>
  );
}
