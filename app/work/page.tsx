import type { Metadata } from "next";
import { WorkArchive } from "@/components/portfolio/work-archive";
import { projects } from "@/data/projects";
export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore full-stack platforms, APIs, AI experiments and frontend work by Waffiyyi Fashola.",
  alternates: { canonical: "/work" },
};
export default function WorkPage() {
  return (
    <main id="main" tabIndex={-1} className="page-main">
      <header className="page-hero archive-hero">
        <div className="page-hero-meta">
          <span className="eyebrow">The work / A closer look</span>
          <span className="mono">2023 — 2026</span>
        </div>
        <h1>
          IDEAS INTO
          <br />
          <span className="accent">EXPERIENCES.</span>
          <sup>({String(projects.length).padStart(2, "0")})</sup>
        </h1>
        <div className="page-hero-bottom">
          <span className="large-asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            From the things people see
            <br />
            to the systems they depend on.
          </p>
          <span className="eyebrow">Full-stack / Frontend / Backend / AI</span>
        </div>
      </header>
      <section className="archive-section" aria-label="Project archive">
        <WorkArchive />
      </section>
    </main>
  );
}
