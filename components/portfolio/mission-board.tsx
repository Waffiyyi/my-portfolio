"use client";
import { useState } from "react";
import { missions } from "@/data/site";
import { getProject } from "@/data/projects";
import { MotionLink } from "./site-shell";
export function MissionBoard() {
  const [selected, setSelected] = useState(0);
  const mission = missions[selected];
  return (
    <section className="mission-section" id="missions">
      <div className="section-intro">
        <span className="eyebrow">05 / What shall we build?</span>
        <h2>
          GIVE YOUR IDEA
          <br />
          <span className="accent">A DIRECTION.</span>
        </h2>
        <p>Start with the part you need. We can connect the rest.</p>
      </div>
      <div className="mission-board">
        <div
          className="mission-choices"
          role="tablist"
          aria-label="Project direction"
          aria-orientation="vertical"
        >
          {missions.map((m, i) => (
            <button
              key={m.id}
              id={`mission-tab-${m.id}`}
              role="tab"
              aria-selected={selected === i}
              aria-controls="mission-detail"
              tabIndex={selected === i ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === "ArrowDown") next = (i + 1) % missions.length;
                else if (e.key === "ArrowUp")
                  next = (i + missions.length - 1) % missions.length;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = missions.length - 1;
                else return;
                e.preventDefault();
                setSelected(next);
                document
                  .getElementById(`mission-tab-${missions[next].id}`)
                  ?.focus();
              }}
            >
              <span className="mono">0{i + 1}</span>
              <span>{m.title}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div
          className="mission-detail"
          id="mission-detail"
          role="tabpanel"
          aria-labelledby={`mission-tab-${mission.id}`}
        >
          <div key={mission.id} className="mission-detail-inner">
            <span className="eyebrow">0{selected + 1} / Your next project</span>
            <h3>{mission.short}</h3>
            <p>{mission.description}</p>
            <div className="tags">
              {mission.stack.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <span className="eyebrow">Related work</span>
            <div className="mission-related">
              {mission.related.map((slug) => (
                <MotionLink key={slug} href={`/work/${slug}`}>
                  {getProject(slug)?.title} ↗
                </MotionLink>
              ))}
            </div>
            <MotionLink
              href={`/contact?mission=${encodeURIComponent(mission.id)}`}
              className="button button-light"
            >
              Let’s talk about it <span>↗</span>
            </MotionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
