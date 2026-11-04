"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { categories, projects } from "@/data/projects";
import { ProjectCard } from "./project-card";
gsap.registerPlugin(Flip);
export function WorkArchive() {
  const [filter, setFilter] = useState<string>("All");
  const grid = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Timeline | null>(null);
  const visible = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );
  useEffect(
    () => () => {
      tween.current?.kill();
    },
    [],
  );
  function change(value: string) {
    tween.current?.kill();
    const state = grid.current
      ? Flip.getState(grid.current.querySelectorAll(".project-card"))
      : null;
    flushSync(() => setFilter(value));
    if (state && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      tween.current = Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        absolute: false,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35 },
          ),
      });
  }
  return (
    <>
      <div className="archive-toolbar">
        <div className="filter-list" role="group" aria-label="Filter projects">
          {categories.map((cat) => (
            <button
              key={cat}
              aria-pressed={filter === cat}
              onClick={() => change(cat)}
            >
              {cat}
              <sup>
                {cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length}
              </sup>
            </button>
          ))}
        </div>
        <p className="mono" role="status">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>
      <div ref={grid} className="archive-grid">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />
        ))}
      </div>
      <div className="archive-note">
        <span className="eyebrow">A note on the work</span>
        <p>
          Completed projects, development contributions and prototypes are
          labelled individually. The illustrations are original conceptual
          artwork; they are not product screenshots.
        </p>
      </div>
    </>
  );
}
