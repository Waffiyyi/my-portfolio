"use client";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectArt, FlowDiagram } from "./artwork";
export function CaseGallery({ project }: { project: Project }) {
  const track = useRef<HTMLDivElement>(null);
  const destination = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  function go(i: number) {
    const next = Math.max(0, Math.min(2, i));
    destination.current = next;
    track.current?.scrollTo({
      left: next * track.current.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    setIndex(next);
  }
  return (
    <section
      className="case-gallery"
      aria-label={`${project.title} conceptual gallery`}
    >
      <div className="gallery-top">
        <span className="eyebrow">Project studies / original diagrams</span>
        <div className="track-controls">
          <span className="mono" aria-live="polite">
            0{index + 1} / 03
          </span>
          <button
            aria-label="Previous study"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            ←
          </button>
          <button
            aria-label="Next study"
            disabled={index === 2}
            onClick={() => go(index + 1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="gallery-track"
        tabIndex={0}
        aria-label="Use left and right arrow keys or swipe to explore studies"
        onPointerDown={() => {
          destination.current = null;
        }}
        onWheel={() => {
          destination.current = null;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            go(index + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onScroll={() => {
          const el = track.current;
          if (!el) return;
          // Intermediate smooth-scroll events must not overwrite a newer
          // button/key destination. A native gesture takes control immediately.
          if (destination.current !== null) {
            if (
              Math.abs(el.scrollLeft - destination.current * el.clientWidth) > 2
            )
              return;
            destination.current = null;
          }
          setIndex(
            Math.max(
              0,
              Math.min(2, Math.round(el.scrollLeft / el.clientWidth)),
            ),
          );
        }}
      >
        <figure>
          <ProjectArt project={project} />
          <figcaption>01 / {project.tagline} — Conceptual artwork</figcaption>
        </figure>
        <figure>
          <FlowDiagram steps={project.flow} />
          <figcaption>
            02 / The product journey — Conceptual workflow
          </figcaption>
        </figure>
        <figure>
          <div className="stack-study">
            <span className="eyebrow">
              Architecture / documented technologies
            </span>
            <h3>
              THE PIECES
              <br />
              THAT CONNECT.
            </h3>
            <div>
              {project.stack.map((tech, i) => (
                <span key={tech}>
                  <small className="mono">
                    {String(i + 1).padStart(2, "0")}
                  </small>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <figcaption>03 / The documented stack — Technology study</figcaption>
        </figure>
      </div>
    </section>
  );
}
